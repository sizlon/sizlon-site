---
title: "When the table disappears, RAG states a wrong number with confidence — HWP and PDF table extraction measured on 214 Korean tender documents"
description: "214 Korean public-tender attachments: generic HWP extraction either drops 85% of table cells (hwp5txt) or keeps the characters but only 4% of row structure. The PDF twin of the same document keeps 87% of cells at best. The measurement also found and fixed two defects in our own chain."
date: "2026-09-06"
service: data
eyebrow: "Note"
---

Ask a RAG system "what is the technical-evaluation score weight in this tender?" and it sometimes answers with the wrong number. Retrieval did not miss the document. It found the document — but the table inside it had been flattened into prose, so the label "technical evaluation" and the number "90" ended up on different lines. The model picks whichever number is nearest. Nothing is logged.

Korean public-sector documents put what matters in tables: score weights, required-document lists, price breakdowns, work schedules. So what happens to tables at the extraction step decides the retrieval quality of everything downstream. That is easy to assert and rarely measured, so I measured it.

## What was measured

- Documents: 216 attachments from 62 KONEPS (Korean national procurement) notices, sampled at random from service-contract competitive bids after May 2026, plus 35 local files (Fair Trade Commission standard contracts and RFPs). Scored: 214 documents — 108 HWP, 59 HWPX, 47 PDF.
- Ground truth came from a path independent of the extractors. For HWPX, table cells read straight from the XML inside the zip; for HWP, `<table>` elements from a third-party structural parser's (pyhwp) HTML conversion. A PDF was scored only when the same notice attached an HWP original with the same name, and that original's tables served as the PDF's truth — so the PDF number answers "how much do you lose by receiving the same document as PDF?"
- Three metrics, all judged automatically: **cell retention** (did the cell's characters survive), **row integrity** (are a row's cells on the same output line), and **label–number pairing** (is a Korean label such as an evaluation item on the same line as its number). The third one is the metric behind the symptom above.
- Extractors compared: for HWP, pyhwp's `hwp5txt` and the naive approach common on GitHub (open the body stream with olefile and scrape paragraph records); for HWPX, XML tag stripping; for PDF, pdftotext (plain and `-layout`), PyMuPDF, and pdfplumber (text and table detection). And the extraction chain that Miriboa runs.

## There are two kinds of failure

| Format | Extractor | Cell retention | Row integrity | Label–number pairing |
|---|---|---|---|---|
| HWP (108) | hwp5txt | 0.152 | 0.017 | 0.057 |
| HWP (108) | naive extraction | 0.988 | 0.038 | 0.104 |
| HWP (108) | Miriboa chain | 1.000 | 1.000 | 1.000 |
| HWPX (59) | XML tag stripping | 0.994 | 0.038 | 0.070 |
| HWPX (59) | Miriboa chain | 1.000 | 0.991 | 0.997 |

**The first failure is losing characters.** `hwp5txt` replaces every table with a single `<표>` (table) token. 85% of cells vanish. This one is visible: the output is short and the score table is simply absent.

**The second failure is losing structure.** Naive extraction and tag stripping keep 99% of the characters. The text volume looks normal, so nobody suspects anything. But row integrity is 4% and label–number pairing is 7–10%. "Technical evaluation" and "90" are both in the document, on different lines. Retrieval brings the document back, and the model picks a nearby number. This is why the second failure is more dangerous than the first.

The third row shows what happens when a table is carried as a table. Read the format properly and cells, rows and pairs all survive from the HWP original. There is no special technique in it — one row per line, cells separated by a delimiter. The problem is that the generic paths that do not do this are the defaults.

## Receiving the same document as PDF

Notices often attach the same document as both HWP and PDF. For 47 such pairs, the original against its PDF (per-document mean):

| | Cell retention | Row integrity | Label–number pairing |
|---|---|---|---|
| HWP / HWPX original | 1.000 | 0.998 | 0.995 |
| PDF, best tool per document | 0.872 | – | – |
| PDF, Miriboa chain | 0.819 | 0.657 | 0.558 |
| PDF, pdfplumber table detection | 0.725 | 0.672 | 0.572 |
| PDF, pdftotext -layout | 0.729 | 0.552 | 0.605 |

From the PDF, even choosing the best tool for each document leaves 13% of cells missing, row structure tops out at 67%, and label–number pairing at 61%. Which format you read matters more than which tool you use. When a notice attaches both, read the HWP.

## The measurement found two defects in our own chain

Miriboa's first numbers were 0.952 cell retention on HWP and 0.498 on PDF — not 1.000 and 0.742. Tracing the gap showed both to be our own bugs.

First, the chain trusted file extensions. Of the 216 attachments, five were named `.hwpx` but were HWP binaries inside, and three were named `.hwp` but were XML. Our chain saw `.hwpx`, tried to open a zip, and failed on all five. It now decides the format from the first bytes.

Second, it lost 80% of cells on six PDFs. My first reading was that pdfplumber reads worse than poppler. The actual cause: PDFs exported by Hangul 2024 encode the space between words as a NUL character, and pdfplumber passes it through untouched. Poppler maps NUL to a space, which is why it looked fine. The fix was not a tool swap but one line that turns NUL into a space. Swapping the tool without finding the cause would have lost something else on other documents.

After the fix, the same 214 documents were scored again. HWP went to 1.000 on all three metrics; PDF cell retention from 0.498 to 0.742. The documents that moved were exactly the eleven the defects pointed at; everything else was unchanged to the third decimal. Without the measurement the defects would have stayed unknown, and because the golden set was frozen, it also shows the fix touched nothing else.

## The fix, in five lines

1. Read the original format. When both HWP and PDF exist, HWP.
2. Decide the format by the first bytes, not the extension. Eight files lied.
3. Serialise tables one row per line. The label and its number have to share a line for a model to pair them.
4. Distrust the text layer. A normal character count can still hide NULs.
5. Freeze a golden set and re-measure. "Fixed" only means something with before-and-after numbers.

## Limits

- Relevance is automatic. One-character cells and merged cells are missed, and a string that happens to appear in the body counts as a hit. Every extractor was judged by the same rule, so the differences are trustworthy; read the absolute numbers down.
- The PDF truth is the original's tables, so where the PDF rendering rearranged a table, even a good tool loses points. That is why the "best tool per document" row exists.
- On HWP, Miriboa's chain and the truth parser share a library (pyhwp). The HWP 1.000 means "carried the structure without losing it," not "reads better than pyhwp." HWPX has an independent truth parser and no such caveat.
- The corpus is limited to service-contract competitive bids after May 2026. Construction and goods attachments may have different table density.

## Summary

For Korean public documents, retrieval quality is decided at extraction, before the tokenizer. Losing characters is visible; losing structure is not, because the text volume stays normal and nothing is logged. Read the original format, decide the format by bytes, carry tables row by row, and re-measure on the same golden set. On this corpus that order took label–number pairing from 10% to 100%.

The [data feed](/services/data/) service on the Korean site attaches this extraction chain to sources you specify and delivers cleaned data monthly — English is fine, email works. The first note in this series, on [tokenization](/en/notes/korean-tokenizer/), covers the step after extraction.

## Files

Scripts, scoring results and the document list are published as used. The 216 KONEPS attachments (108 MB) are public data but are not uploaded; instead `manifest.json` lists which file of which notice (notice number, file name, size, hash), and `fetch_g2b.py` re-downloads the same notices' attachments (requires a KONEPS bid-notice API key).

- [truth.py](/notes/korean-tables/truth.py) — ground-truth table parser (HWPX from XML, HWP via pyhwp HTML); format by magic bytes
- [extractors.py](/notes/korean-tables/extractors.py) — the eight extractors compared
- [score.py](/notes/korean-tables/score.py) — cell retention · row integrity · label–number pairing
- [report.py](/notes/korean-tables/report.py) · [paired_stats.py](/notes/korean-tables/paired_stats.py) · [compare_before_after.py](/notes/korean-tables/compare_before_after.py) — aggregation · 47-pair comparison · before/after
- [fetch_g2b.py](/notes/korean-tables/fetch_g2b.py) · [merge_corpora.py](/notes/korean-tables/merge_corpora.py) · [prepare_corpus.py](/notes/korean-tables/prepare_corpus.py) — collection · merge · scoring list
- [results.json](/notes/korean-tables/results.json) · [results_after.json](/notes/korean-tables/results_after.json) — 214 documents scored before and after the fix
- [docs.txt](/notes/korean-tables/docs.txt) · [pairs.json](/notes/korean-tables/pairs.json) · [manifest.json](/notes/korean-tables/manifest.json) — scoring list · PDF pairs · per-notice attachment list
- [requirements.txt](/notes/korean-tables/requirements.txt) — pymupdf · pyhwp · pdfplumber · olefile
