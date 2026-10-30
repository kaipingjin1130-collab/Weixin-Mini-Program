# Company hazard notice template

`hazard-notice.docx` is distilled from the user-provided `06-20260922-2号绿地隐患告知单(1).docx`.

The company logo, header version identifier, styles, theme, fonts, page geometry, merged cells and table borders are preserved. The notice-number panel has the gray background requested in the user's screenshot. The main heading remains `第三方巡查隐患告知单`; the photo appendix is `附件1 隐患清单`. Download filenames continue to use the entered notice number.

All example project names, inspection dates, people, findings and incident photographs have been removed. Custom XML and document properties containing reference metadata are excluded. Only the reusable logo remains. `notice_docx.py` fills the slots and clones the appendix row; it requires no additional production dependencies.

Word visual verification: representative eight-issue/nine-photo report (4 pages), all-optional-fields-blank report (2 pages), long-description/nine-photo report (6 pages). Every page was rendered through Microsoft Word's read-only PDF export and inspected. The bundled LibreOffice renderer was attempted but is unavailable on this host. Logo/header/style package bytes and table geometry are also regression tested.

Long content expands and continues to later pages. The appendix repeats column headings. Empty fields stay blank; no-hazard wording is included only when explicitly selected. The template version number in the header is retained as provided, independently of the report's notice number.
