#!/usr/bin/env python3
"""Generate Zero Pack's Custom Compostable Packaging Guide from governed JSON."""

from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/content/guides/custom-compostable-packaging-guide.json"
OUTPUT = ROOT / "public/2026-Zero-Pack-Custom-Compostable-Packaging-Guide.pdf"
LOGO_WHITE = ROOT / "src/content/images/logo/zero-pack-logo-white-transparent.png"
LOGO_GREEN = ROOT / "src/content/images/logo/zero-pack-logo-deep_compost_green-transparent.png"

COMPOST = colors.HexColor("#214E34")
LEAF = colors.HexColor("#83B925")
CHARCOAL = colors.HexColor("#111827")
STONE = colors.HexColor("#F6F4EF")
AIR = colors.HexColor("#00A8F3")
MIST = colors.HexColor("#ECF6ED")
WHITE = colors.white
MID = colors.HexColor("#52606D")
LINE = colors.HexColor("#DCE3E8")

PAGE_W, PAGE_H = A4
MARGIN_X = 19 * mm
MARGIN_TOP = 21 * mm
MARGIN_BOTTOM = 18 * mm

pdfmetrics.registerFont(TTFont("ZPSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("ZPSansBold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))


def esc(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("'", "&#39;")
    )


def draw_cover(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFillColor(CHARCOAL)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(COMPOST)
    canvas.circle(PAGE_W + 25 * mm, PAGE_H - 37 * mm, 72 * mm, fill=1, stroke=0)
    canvas.setFillColor(AIR)
    canvas.circle(-10 * mm, 18 * mm, 42 * mm, fill=1, stroke=0)
    canvas.restoreState()


def draw_page(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFillColor(STONE)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(MARGIN_X, 14 * mm, PAGE_W - MARGIN_X, 14 * mm)
    canvas.setFont("ZPSans", 7.5)
    canvas.setFillColor(MID)
    canvas.drawString(MARGIN_X, 9 * mm, "ZERO PACK  /  CUSTOM COMPOSTABLE PACKAGING GUIDE")
    canvas.drawRightString(PAGE_W - MARGIN_X, 9 * mm, str(doc.page))
    canvas.restoreState()


def make_styles():
    base = getSampleStyleSheet()
    return {
        "cover_label": ParagraphStyle(
            "cover_label", parent=base["Normal"], fontName="ZPSansBold", fontSize=9,
            leading=12, textColor=AIR, spaceAfter=8, uppercase=True,
        ),
        "cover_title": ParagraphStyle(
            "cover_title", parent=base["Title"], fontName="ZPSansBold", fontSize=33,
            leading=38, textColor=WHITE, spaceAfter=14,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub", parent=base["Normal"], fontName="ZPSans", fontSize=14,
            leading=21, textColor=colors.HexColor("#D9E1E8"), spaceAfter=16,
        ),
        "eyebrow": ParagraphStyle(
            "eyebrow", parent=base["Normal"], fontName="ZPSansBold", fontSize=8.5,
            leading=11, textColor=AIR, spaceAfter=6,
        ),
        "h1": ParagraphStyle(
            "h1", parent=base["Heading1"], fontName="ZPSansBold", fontSize=23,
            leading=28, textColor=CHARCOAL, spaceAfter=11,
        ),
        "h2": ParagraphStyle(
            "h2", parent=base["Heading2"], fontName="ZPSansBold", fontSize=15,
            leading=19, textColor=COMPOST, spaceBefore=4, spaceAfter=7,
        ),
        "body": ParagraphStyle(
            "body", parent=base["BodyText"], fontName="ZPSans", fontSize=9.4,
            leading=14.2, textColor=CHARCOAL, spaceAfter=7,
        ),
        "small": ParagraphStyle(
            "small", parent=base["BodyText"], fontName="ZPSans", fontSize=8,
            leading=11.5, textColor=MID, spaceAfter=5,
        ),
        "bullet": ParagraphStyle(
            "bullet", parent=base["BodyText"], fontName="ZPSans", fontSize=8.7,
            leading=12.5, textColor=CHARCOAL, leftIndent=10, firstLineIndent=-9,
            bulletIndent=0, spaceAfter=4.5,
        ),
        "callout": ParagraphStyle(
            "callout", parent=base["BodyText"], fontName="ZPSansBold", fontSize=10.2,
            leading=15, textColor=COMPOST,
        ),
        "toc": ParagraphStyle(
            "toc", parent=base["BodyText"], fontName="ZPSansBold", fontSize=10,
            leading=14, textColor=CHARCOAL,
        ),
        "table_head": ParagraphStyle(
            "table_head", parent=base["BodyText"], fontName="ZPSansBold", fontSize=7.8,
            leading=10, textColor=WHITE,
        ),
        "table": ParagraphStyle(
            "table", parent=base["BodyText"], fontName="ZPSans", fontSize=7.5,
            leading=10, textColor=CHARCOAL,
        ),
        "center": ParagraphStyle(
            "center", parent=base["BodyText"], fontName="ZPSans", fontSize=9,
            leading=13, textColor=MID, alignment=TA_CENTER,
        ),
    }


def callout(text: str, styles):
    table = Table([[Paragraph(esc(text), styles["callout"])]], colWidths=[PAGE_W - 2 * MARGIN_X])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), MIST),
        ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#BFD9C4")),
        ("LINEBEFORE", (0, 0), (0, -1), 4, LEAF),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return table


def bullet_list(items, styles, mark="•"):
    return [Paragraph(f"{mark}  {esc(item)}", styles["bullet"]) for item in items]


def section_page(section, styles):
    items = [
        Paragraph("PACKAGING PLANNING", styles["eyebrow"]),
        Paragraph(esc(section["heading"]), styles["h1"]),
    ]
    if section.get("answerBox"):
        items.extend([callout(section["answerBox"], styles), Spacer(1, 7 * mm)])
    for paragraph in section["paragraphs"]:
        items.append(Paragraph(esc(paragraph), styles["body"]))
    items.extend([Spacer(1, 2 * mm), Paragraph("What to check", styles["h2"])])
    items.extend(bullet_list(section["bullets"], styles))
    return items


def build() -> None:
    guide = json.loads(SOURCE.read_text(encoding="utf-8"))
    styles = make_styles()

    doc = BaseDocTemplate(
        str(OUTPUT), pagesize=A4, leftMargin=MARGIN_X, rightMargin=MARGIN_X,
        topMargin=MARGIN_TOP, bottomMargin=MARGIN_BOTTOM,
        title=guide["title"], author="Zero Pack", subject=guide["tagline"],
    )
    frame = Frame(
        MARGIN_X, MARGIN_BOTTOM, PAGE_W - 2 * MARGIN_X,
        PAGE_H - MARGIN_TOP - MARGIN_BOTTOM, id="content", showBoundary=0,
    )
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=frame, onPage=draw_cover, autoNextPageTemplate="body"),
        PageTemplate(id="body", frames=frame, onPage=draw_page),
    ])

    story = []
    story.extend([
        Spacer(1, 6 * mm),
        Image(str(LOGO_WHITE), width=29 * mm, height=29 * mm),
        Spacer(1, 19 * mm),
        Paragraph("ZERO PACK GUIDE", styles["cover_label"]),
        Paragraph("Custom Compostable<br/>Packaging", styles["cover_title"]),
        Paragraph(esc(guide["subtitle"]), styles["cover_sub"]),
        Spacer(1, 34 * mm),
        Paragraph("A practical guide for real packaging decisions", ParagraphStyle(
            "cover_bottom", parent=styles["body"], fontName="ZPSansBold", fontSize=11,
            leading=15, textColor=WHITE,
        )),
        Paragraph("2026 EDITION", ParagraphStyle(
            "cover_year", parent=styles["small"], fontName="ZPSansBold", fontSize=8,
            leading=11, textColor=AIR, spaceBefore=5,
        )),
        PageBreak(),
    ])

    story.extend([
        Paragraph("HOW TO USE THIS GUIDE", styles["eyebrow"]),
        Paragraph("Start with the packaging job, not a preselected solution", styles["h1"]),
        Paragraph(esc(guide["tagline"]), styles["body"]),
        Spacer(1, 3 * mm),
        callout(guide["answerBox"], styles),
        Spacer(1, 8 * mm),
        Paragraph("Inside", styles["h2"]),
    ])
    toc_rows = []
    for i, section in enumerate(guide["sections"], start=1):
        heading = section["heading"].split(". ", 1)[-1]
        toc_rows.append([
            Paragraph(f"{i:02d}", styles["toc"]),
            Paragraph(esc(heading), styles["toc"]),
            Paragraph(str(i + 2), styles["small"]),
        ])
    toc_table = Table(toc_rows, colWidths=[13 * mm, 130 * mm, 12 * mm])
    toc_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("TEXTCOLOR", (0, 0), (0, -1), AIR),
        ("ALIGN", (-1, 0), (-1, -1), "RIGHT"),
    ]))
    story.extend([toc_table, PageBreak()])

    for section in guide["sections"]:
        story.extend(section_page(section, styles))
        story.append(PageBreak())

    story.extend([
        Paragraph("WORKSHEET", styles["eyebrow"]),
        Paragraph("Turn what you know into a useful first conversation", styles["h1"]),
        Paragraph(
            "Complete what you can. Leave open decisions open - they are useful questions for the project conversation.",
            styles["body"],
        ),
        Spacer(1, 3 * mm),
    ])
    questions = guide["sections"][-1]["bullets"]
    worksheet_rows = []
    for index, question in enumerate(questions, start=1):
        worksheet_rows.append([
            Paragraph(f"{index:02d}", styles["toc"]),
            Paragraph(esc(question), styles["body"]),
            Paragraph("__________________________________<br/>__________________________________", styles["small"]),
        ])
    worksheet = Table(worksheet_rows, colWidths=[13 * mm, 69 * mm, 74 * mm], repeatRows=0)
    worksheet.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("BACKGROUND", (0, 0), (0, -1), MIST),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([worksheet, PageBreak()])

    source_rows = [
        ["Standards Australia", "AS 5810:2010 - Biodegradable plastics suitable for home composting", "store.standards.org.au/product/as-5810-2010"],
        ["Australasian Bioplastics Association", "Home- and industrial-compostable certification information", "bioplastics.org.au/certification/"],
        ["Australian Competition and Consumer Commission", "A guide to making environmental claims for business", "accc.gov.au/about-us/publications/a-guide-to-making-environmental-claims-for-business"],
    ]
    source_data = [[
        Paragraph("Source", styles["table_head"]),
        Paragraph("Used for", styles["table_head"]),
        Paragraph("Official page", styles["table_head"]),
    ]]
    source_data.extend([
        [Paragraph(esc(row[0]), styles["table"]), Paragraph(esc(row[1]), styles["table"]), Paragraph(esc(row[2]), styles["table"])]
        for row in source_rows
    ])
    source_table = Table(source_data, colWidths=[43 * mm, 58 * mm, 55 * mm], repeatRows=1)
    source_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), COMPOST),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([
        Paragraph("EVIDENCE AND NEXT STEPS", styles["eyebrow"]),
        Paragraph("Claims stay connected to the packaging", styles["h1"]),
        Paragraph(
            "This guide is practical planning information, not a substitute for confirming the final packaging specification, certification evidence, production requirements or local disposal pathway.",
            styles["body"],
        ),
        Paragraph(
            "Certification evidence can be provided on request after the relevant packaging and specification have been confirmed. Local collection and processor rules should be checked before publishing disposal instructions.",
            styles["body"],
        ),
        Spacer(1, 5 * mm),
        Paragraph("Primary official sources", styles["h2"]),
        source_table,
        Spacer(1, 8 * mm),
        Paragraph("Ready to discuss your packaging?", styles["h2"]),
        Paragraph(
            "Bring Zero Pack the packaging problem, or a finished brief. Share the product, likely quantities, destination, artwork status and timing you know so far.",
            styles["body"],
        ),
        callout("Explore custom packaging or request a custom quote at zeropack.co", styles),
        Spacer(1, 12 * mm),
        Image(str(LOGO_GREEN), width=22 * mm, height=22 * mm),
        Paragraph("Custom compostable packaging that makes sense for your product, brand and operation.", styles["center"]),
    ])

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
