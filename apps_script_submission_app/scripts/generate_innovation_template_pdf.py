from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


BASE_DIR = Path(__file__).resolve().parents[1]
OUTPUT_PDF = BASE_DIR / "output" / "pdf" / "innovation_submission_template.pdf"


def build_styles():
    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    styles = getSampleStyleSheet()

    styles.add(
        ParagraphStyle(
            name="TitleCJK",
            parent=styles["Title"],
            fontName="STSong-Light",
            fontSize=18,
            leading=24,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#16324f"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="HeadingCJK",
            parent=styles["Heading2"],
            fontName="STSong-Light",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#16324f"),
            spaceBefore=4,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyCJK",
            parent=styles["BodyText"],
            fontName="STSong-Light",
            fontSize=10.5,
            leading=16,
            textColor=colors.HexColor("#222222"),
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="HintCJK",
            parent=styles["BodyText"],
            fontName="STSong-Light",
            fontSize=9.5,
            leading=14,
            textColor=colors.HexColor("#5b6573"),
            spaceAfter=6,
        )
    )
    return styles


def build_pdf():
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )

    story = []
    story.append(Paragraph("第一屆聖五中學生創意設計挑戰賽作品介紹範本", styles["TitleCJK"]))
    story.append(Paragraph("此版本與提交網站及 AI 評改欄位一致。", styles["HintCJK"]))

    basic_table = Table(
        [
            ["班級", ""],
            ["組員", "學號1 姓名1；學號2 姓名2；學號3 姓名3"],
            ["作品名稱", ""],
        ],
        colWidths=[28 * mm, 145 * mm],
    )
    basic_table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (-1, -1), "STSong-Light"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("LEADING", (0, 0), (-1, -1), 14),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#eef4ff")),
                ("GRID", (0, 0), (-1, -1), 0.6, colors.HexColor("#b9c7db")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(basic_table)
    story.append(Spacer(1, 6 * mm))

    sections = [
        ("1. 問題說明", "請在 200 字內說明你們想解決的真實問題。", "建議交代問題在哪裡、影響誰，以及為何重要。"),
        ("2. 設計理念", "請在 500 字內說明作品的核心想法、設計方向與價值。", "可說明你們為何想到這個方案，以及與現有做法的差異。"),
        ("3. 解決方案細節", "請在 1000 字內說明作品如何運作、如何使用，以及是否可行。", "可包括流程、功能、材料、技術、成本或推行步驟。"),
        ("4. 人工智能使用情況", "請如實說明本次設計有否使用 AI，以及使用的平台與用途。", "如未有使用，可直接寫「本作品未有使用 AI 工具」。"),
        ("5. 科學海報", "另交 1 份 JPG 海報，總結作品名稱、問題、設計理念、解決方案與價值。", "海報用作視覺總結，不代替文字欄位。"),
    ]

    for title, desc, hint in sections:
        story.append(Paragraph(title, styles["HeadingCJK"]))
        story.append(Paragraph(desc, styles["BodyCJK"]))
        story.append(Paragraph(hint, styles["HintCJK"]))
        line_table = Table([[""]], colWidths=[173 * mm], rowHeights=[13 * mm])
        line_table.setStyle(
            TableStyle(
                [
                    ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#b9c7db")),
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ]
            )
        )
        story.append(line_table)
        story.append(Spacer(1, 4 * mm))

    doc.build(story)


if __name__ == "__main__":
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    build_pdf()
