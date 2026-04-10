# 第一屆聖五中學生創意設計挑戰賽 AI 評改規劃

## 一、定位

- AI 用於初審與整理
- 分數可作資訊科技科其中一項參考
- 最終決審由校內資訊科技及科學老師聯合評分

## 二、AI 讀取材料

| 項目 | 角色 |
|---|---|
| 問題說明 | 了解問題是否真實而清楚 |
| 設計理念 | 判斷創意方向與原創性 |
| 解決方案細節 | 評估可行性與執行細節 |
| 人工智能使用情況 | 判斷 AI 使用是否合理 |
| 科學海報 JPG | 補足視覺傳達與作品重點 |
| 系統生成 PDF | 作為提交備份與老師查閱版本 |

## 三、官方評分標準

| 項目 | 分數 | 判斷重點 |
|---|---:|---|
| 問題識別與重要性 | 20 | 是否描述清楚、是否具關聯性與迫切性 |
| 創意與原創性 | 25 | 概念是否新穎、是否有突破或原創成分 |
| 可行性與實施細節 | 25 | 執行方式、資源需求、成本與風險是否交代 |
| 表現與視覺傳達 | 20 | 文字與圖像是否清楚、有吸引力 |
| 人工智能的使用 | 10 | AI 使用是否合理、恰當、具輔助價值 |

## 四、資料流程

學生提交  
→ Google Apps Script Web App  
→ Google Drive 建立組別資料夾  
→ Google Sheet 記錄欄位與檔案連結  
→ AI 評改 Skill 讀取文字與海報  
→ 回寫分數、評語、風險標記  
→ 老師覆核異常個案

## 五、建議儲存欄位

- `first_submitted_at`
- `last_submitted_at`
- `submission_count`
- `group_key`
- `class_name`
- `member_count`
- `student_id_1`
- `student_id_2`
- `student_id_3`
- `student_name_1`
- `student_name_2`
- `student_name_3`
- `project_title`
- `problem_statement`
- `design_concept`
- `solution_details`
- `ai_usage`
- `science_poster_url`
- `generated_pdf_url`
- `group_folder_url`

## 六、AI 輸出 JSON 建議

```json
{
  "submission_id": "20260418_F2A_001_002",
  "scores": {
    "problem_importance": 16,
    "creativity_originality": 21,
    "feasibility_execution": 20,
    "expression_visual": 17,
    "ai_usage": 8
  },
  "total_score": 82,
  "summary_comment": "問題清楚，方案具創意，海報表達完整，但實施細節仍可更具體。",
  "strengths": [
    "能從真實生活情境切入",
    "方案有明確創新方向",
    "海報與文字內容一致"
  ],
  "improvements": [
    "需補充成本或執行步驟",
    "AI 使用部分可更具體說明"
  ],
  "risk_flags": ["none"],
  "confidence": 0.88,
  "review_needed": false
}
```

## 七、人工覆核條件

- `review_needed = true`
- `confidence < 0.7`
- 海報打不開或非 JPG
- 文字內容過短或明顯缺漏
- 疑似抄襲、重複提交或 AI 使用描述異常
