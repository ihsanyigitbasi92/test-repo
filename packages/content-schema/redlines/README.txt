Red-line seed lists for scripts/redline.ts (08 §2.2.5). One entry per line:
  term | sev | opts | note      (columns separated by " | " with spaces; regex alternation uses a bare "|")
  re: <regex> | sev | opts | note
term:  literal; spaces match any whitespace; trailing "~" = stem (any letters may follow, e.g. Turkish suffixes).
sev:   block (fails `redline`) or warn (reported only).
opts:  comma list — cs (case-sensitive), gate=<tag> (allowed when the event carries that tag).
Folders: tr/ applies to `tr` strings, en/ to `en` strings, all/ and private/ to both
(private/*.tr.txt / *.en.txt to one locale). Matching is whole-word (Unicode letters), case-folded per locale.
Ambiguous everyday words from the 08 list (seçim, bakan, garanti, getir, dolap, şok, zoom, slack, visa…) are left out
on purpose; they need the context rules of the full content-lint.
