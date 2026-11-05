"""Read PDF layout with an in-memory page-tree compatibility fallback.

The source PDF is never rewritten. Native page count is checked independently
because pdfminer can silently return zero pages for some valid scanner PDFs.
"""
from contextlib import contextmanager
from io import BytesIO


@contextmanager
def open_pdf_layout(path):
    import pdfplumber
    from pypdf import PdfReader, PdfWriter

    reader = PdfReader(str(path))
    expected = len(reader.pages)
    layout = None
    memory = None
    try:
        try:
            layout = pdfplumber.open(path)
            usable = len(layout.pages) == expected
        except Exception:
            usable = False
        if not usable:
            if layout is not None:
                layout.close()
            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)
            memory = BytesIO()
            writer.write(memory)
            memory.seek(0)
            layout = pdfplumber.open(memory)
            if len(layout.pages) != expected:
                raise ValueError('PDF page count remains inconsistent after in-memory page-tree rebuild')
        layout.history_page_tree_rebuilt = not usable
        layout.history_original_page_count = expected
        yield layout
    finally:
        if layout is not None:
            layout.close()
        if memory is not None:
            memory.close()
