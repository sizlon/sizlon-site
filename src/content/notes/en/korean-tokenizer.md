---
title: "If retrieval misses, RAG can't answer — in Korean, start with the tokenizer"
description: "Measured on 183,240 Korean public-tender titles: with Nori's defaults, 16.8% of frequent words segment differently by context and 맨홀 (manhole) becomes 홀 (hole). A corpus-derived dictionary plus separate index/search analyzers took P@10 from 0.906 to 0.986."
date: "2026-09-06"
service: search
eyebrow: "Note"
---

Most "our RAG gives wrong answers" reports are not a generation problem. The document that held the answer never made it into the retrieved set. And in Korean, the reason a document fails to surface usually starts at the tokenizer. Tokenization is the first step that turns both documents and queries into tokens; if the two sides disagree there, nothing you stack on top — BM25 or vectors — will bring the document back.

That is easy to assert and rarely measured, so I measured it.

## What was measured

- Documents: 183,240 Korean public-tender notice titles from KONEPS (the national procurement system), de-duplicated by notice number from bid-opening data. 111k service contracts, 71k construction. Median title length is 27 characters.
- Engine: a single-node Elasticsearch 9.5.2 with the Nori Korean analyzer. Queries use the `match` default (OR, BM25) — the configuration most teams ship first.
- Comparison: Nori with default settings versus Nori with a user dictionary extracted from this corpus.

The dictionary was not built by looking at queries or answers. I ran every title through the default analyzer, took every word that occurs 30 or more times, and kept the ones that either split into two or more pieces or lost characters. That produced 2,147 entries automatically; 19 more got hand-written segmentation.

## Finding 1 — the same word segments differently depending on context

Of 2,273 words occurring 30+ times, 382 (16.8%) segment in two or more different ways depending on their neighbours. Across those words' 86,021 occurrences, 7,322 (8.5%) are in a minority segmentation. When the query analyses to the majority form, those 8.5% of documents silently drop out. No error, no log line.

| Word | Occurrences | Segmentations (count) |
|---|---|---|
| 소액수의 (small-sum negotiated) | 2,460 | 소액+수 (1,988) · 액수 (352) · 소액+수의 (120) |
| 연간단가 (annual unit price) | 1,329 | 연간+단가 (1,012) · 연간+다+이 (317) |
| 수의견적 (negotiated quote) | 893 | 수+견적 (581) · 수+의견 (312) |
| 지방하천 (local river) | 517 | 지방+천 (279) · 지방+하천 (238) |
| 소상공인 (small business owner) | 130 | 상공+이 (61) · 소+상공+이 (52) · 소+상+공인 (17) |
| 전자견적 (electronic quote) | 173 | 자견 (101) · 전+자견 (70) · 전자+견적 (2) |

Nori picks the most probable segmentation path over the whole sentence, so changing the words around a term changes how the term itself is cut. The effect is worst for words missing from its dictionary.

## Finding 2 — characters simply disappear

Pieces tagged as prefix, suffix or particle are dropped from the token stream. When that tag is wrong, part of the word vanishes.

| Input | Default tokens | Effect |
|---|---|---|
| 맨홀 (manhole) | 홀 | "맨" discarded as a prefix — you are now searching for "hole" |
| 재공고 (re-announcement) | 공고 | "재" dropped; 3,295 re-announcements rank like any announcement |
| 단가계약 (unit-price contract) | 다+이+계약 | 단가 becomes 다+이 |
| 전자견적 (electronic quote) | 자견 | |
| 하수관로 (sewer pipeline) | 하수+관 | "로" dropped |
| 과업지시서 (statement of work) | 과업+지시 | "서" dropped |
| 정보화전략계획 (ISP) | 정보+전략+계획 | "화" dropped |

## The counter-example — wrong but consistent still works

단가계약 segments into 다+이+계약, yet with default settings all ten top results were correct. Documents and queries are wrong in the same way, so they still meet. A wrong segmentation by itself does not kill retrieval. Two conditions do:

1. The word segments differently by context (Finding 1). Document analysed as A, query as B — they never meet.
2. What survives the drop collides with a common token (Finding 2). When 재공고 becomes 공고, the right answers are buried among thousands of wrong ones.

## The fix, in three lines

1. Extract the dictionary from the corpus. Do not brainstorm terms; analyse the real documents and harvest, statistically, the words that split or lose characters. Here that yielded 2,147 entries with no human input.
2. Hand-segment the words that lose characters. Terms like 맨홀 or 재선충병 that only occur inside longer words slip past the statistics. 19 entries needed a person. Eighty percent automatic, twenty percent by hand — that is the measured ratio.
3. Separate the index and search analyzers. Index with both the whole word and its parts (decompound `mixed`); search with dictionary tokens only (`none`). If the query 상수도관 expands to 상수도관+상수도+관, every document containing 관 (pipe) muddies the top of the list.

Changing the decompound mode alone did nothing. Without a dictionary there is no whole word to decompound.

## Results

50 queries: 15 built from Finding 2 words, 20 from Finding 1 words, and 15 controls that the default configuration already handled well. Relevance was judged automatically by substring, not by a person: a title is relevant if every word of the query appears in it.

| Configuration | P@10 | R@50 | MRR |
|---|---|---|---|
| Nori defaults | 0.906 | 0.852 | 0.977 |
| Dictionary + index `mixed` / search `none` | 0.986 | 0.979 | 1.000 |

The controls moved too, from 0.947 to 1.000. Queries like 폐기물처리용역 (waste-disposal services), 포장공사 (paving) and 청소용역 (cleaning) — the ones everyone assumed were fine — were returning only 64–86% relevant results in the top 50. This is the kind of failure that never shows up in a search log.

Largest movers:

| Query | Relevant docs | P@10 | R@50 |
|---|---|---|---|
| 맨홀 정비 (manhole repair) | 107 | 0.5 → 1.0 | 0.34 → 1.00 |
| 전자견적 | 194 | 0.3 → 1.0 | 0.14 → 1.00 |
| 재공고 | 3,295 | 0.6 → 1.0 | 0.60 → 1.00 |
| 소액수의 | 2,700 | 0.7 → 1.0 | 0.58 → 1.00 |
| 폐기물처리용역 (control) | 6,919 | 0.5 → 1.0 | 0.64 → 1.00 |

With defaults, "맨홀 정비" becomes the query 홀+정비 and things like "manhole pump station remote monitoring network repair" float to the top while actual manhole repair contracts sink. With the dictionary, the top five are "defective manhole repair", "sewer manhole repair", "Manan-gu manhole repair". For 재공고, three of the default top five were ordinary announcements; after the dictionary, all five are re-announcements.

Not every query improved. 보안관제 (security monitoring) fell from R@50 1.00 to 0.86, and 소규모 수도시설 (small water facilities) ended at 0.66 because the composition of the top 50 shifted among 245 relevant titles. A dictionary is not a cure-all — which is why freezing a golden set and re-measuring comes before the dictionary, not after.

## Limits

- Titles only. A corpus that indexes bodies and attachments has more tokens per document, and the effect may dilute.
- Relevance is automatic. It misses paraphrases a human would accept and counts accidental substring hits as relevant. Both configurations were judged by the same rule, so the difference is trustworthy; the absolute numbers should be read down.
- The golden set is centred on the words the diagnostics flagged. A random 100-query set would move less. The 15 controls are the floor.
- No synonyms (RFP ↔ 제안요청서 and the like). That is the next experiment.

## Summary

The first place Korean search goes wrong is the tokenizer, and that failure leaves no trace in logs. The order of repair: collect failing queries and freeze a golden set, extract a dictionary from the corpus, have a person fix the lossy entries, separate the index and search analyzers, then re-measure on the same golden set. On this corpus that order took P@10 from 0.906 to 0.986.

The [search-quality diagnostic](/services/search/) on the Korean site is this procedure applied to your corpus and your failing queries in two weeks — English is fine, email works.

## Files

Everything is published as used. A single Elasticsearch 9.5.2 node with analysis-nori reproduces the numbers. The corpus (183,240 titles) is derived from public KONEPS bid-opening data and is not uploaded; the code that builds it is in the header comment of `common.py`.

- [common.py](/notes/korean-tokenizer/common.py) — index settings (analyzers, dictionary, search analyzer), indexing, querying
- [eval.py](/notes/korean-tokenizer/eval.py) — both relevance rules and P@10 · R@50 · MRR
- [queries.json](/notes/korean-tokenizer/queries.json) — the 50 queries and their groups
- [user_rules2.json](/notes/korean-tokenizer/user_rules2.json) — the user dictionary, 2,155 rules (2,147 automatic + 19 manual; manual segmentation replaces an automatic entry for the same surface form)
- [dict_candidates.json](/notes/korean-tokenizer/dict_candidates.json) — dictionary candidates (word, frequency, default segmentation, characters lost)
- [seg_inconsistency.json](/notes/korean-tokenizer/seg_inconsistency.json) — per-word segmentation inconsistency statistics
- [results.json](/notes/korean-tokenizer/results.json) — metrics for 4 configurations × 50 queries × 2 relevance rules
- [es-nori.Dockerfile](/notes/korean-tokenizer/es-nori.Dockerfile) — the ES + nori image
