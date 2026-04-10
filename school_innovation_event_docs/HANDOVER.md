# 交接說明文件

**第一屆聖五中學生創意設計挑戰賽**
整理日期：2026-04-10
整理人：Wing LAO（柳融迪）

---

## 一、已完成項目

| 項目 | 狀態 | 備注 |
|---|---|---|
| 學生說明網站 | ✅ 完成 | `student_guidance_site/index.html`，靜態 HTML，可直接 GitHub Pages 發布 |
| 線上提交系統前端 | ✅ 完成 | `apps_script_submission_app/Index.html`，已部署於 Apps Script |
| 線上提交系統後端 | ✅ 完成 | `apps_script_submission_app/Code.gs`，已部署並取得執行網址 |
| 提交欄位對齊 | ✅ 完成 | 五欄位（問題/理念/細節/AI使用/JPG海報）已與 Sheet 欄位對齊 |
| 學生名單讀取 | ✅ 完成 | 從 Google Sheet「學生名單」工作表讀取，動態載入班級與學生 |
| 文字與海報驗證 | ✅ 完成 | 字數上限、JPG 格式、10 MB 限制均已驗證 |
| 重複提交處理 | ✅ 完成 | 90 分鐘內可更新，超時鎖定 |
| PDF 自動生成 | ✅ 完成 | 每組提交後自動生成 PDF 存入 Google Drive |
| Google Sheet 寫入 | ✅ 完成 | 每次提交自動 upsert 到試算表 |
| GitHub 專案結構 | ✅ 完成 | README、.gitignore 已整理 |
| 文案優化 | ✅ 完成 | 學生說明網站與提交網站均已優化文案與版面 |

---

## 二、未完成項目（待 Codex 接手）

### 2.1 AI 評分自動初審

**目標：** 讀取 Google Sheet 資料，對每組作品執行 AI 評分，並將分數回寫到試算表。

**輸入欄位：**
- `problem_statement`
- `design_concept`
- `solution_details`
- `ai_usage`
- `science_poster_url`（可選，需 Drive API 讀取圖片）

**輸出（需回寫的欄位，尚未加入 SHEET_HEADERS）：**
- `ai_score_problem`（問題清晰度分數）
- `ai_score_innovation`（創意與原創性分數）
- `ai_score_feasibility`（可行性分數）
- `ai_score_communication`（表達清晰度分數）
- `ai_score_ai_usage`（AI 使用合理性分數）
- `ai_total_score`（100 分制總分）
- `ai_summary`（總評）
- `ai_strengths`（優點）
- `ai_suggestions`（改進建議）
- `ai_flag`（風險標記：low / medium / high）
- `ai_needs_human_review`（是否需人工覆核：TRUE / FALSE）
- `ai_reviewed_at`（AI 評分時間戳）

**技術方向（建議）：**
- 使用 Google Apps Script 或 Python（本機 Codex）
- 呼叫 Anthropic API（claude-sonnet-4-6 或 claude-haiku-4-5）
- Skill 檔案：`macau-innovation-screening/` 資料夾內有初版 Skill 設計

**注意事項：**
- 評分標準以官方 100 分制為準（20 分 × 5 項）
- 加入回寫欄位前，先更新 `SHEET_HEADERS` 陣列，並重新執行 `setupSheet()` 初始化欄位
- 勿改動現有 21 個欄位的順序

### 2.2 上線壓力測試

**場景：** 全班 30 人同時提交，預計同時 10–15 組並發

**需測試：**
- Apps Script 執行配額（每次執行上限 6 分鐘）
- Drive API 上傳速度
- 海報 10 MB 檔案的上傳超時問題
- Sheet upsert 衝突處理

**建議做法：** 在正式比賽前 1–2 天用測試班級先跑一次完整流程

### 2.3 海報圖片 AI 分析（可選進階功能）

- 目前 AI 評分只讀文字欄位
- 若要分析科學海報圖片，需加入 Vision API 呼叫
- 需處理 Drive 圖片的公開讀取授權或用 Service Account

---

## 三、關鍵設定值

| 設定 | 值 |
|---|---|
| Google Spreadsheet ID | `1J4GKtAyeJct4GMfDZUQbwXournHjAlx7fq4l78rLhMY` |
| 提交結果工作表 | `工作表1` |
| 學生名單工作表 | `學生名單` |
| Google Drive 根目錄 ID | `1arv_EIIfHfE2JXSFmdn-QyHxmOtSmrUX` |
| 提交網址 | `https://script.google.com/macros/s/AKfycbzjQu0LWyLXZwvs9EXaeIU8CxB0x2G6RHVkqYFkib0Oe4A0_oxm5qgnODTVATg71QEN/exec` |
| 比賽時間 | 2026-04-18 10:00–11:30 |
| 修改時限 | 90 分鐘 |
| 海報大小上限 | 10 MB |

---

## 四、部署流程（如需重新部署）

1. 在 [Google Apps Script](https://script.google.com) 開啟對應專案
2. 把 `Code.gs` 和 `Index.html` 的最新版本貼入編輯器
3. 點選「部署 → 管理部署」，選擇更新現有部署（Web App）
4. 執行身份選「我」，存取權選「任何人」
5. 複製新的執行網址，更新學生說明網站的連結

---

## 五、檔案位置速查

| 檔案 | 用途 |
|---|---|
| `student_guidance_site/index.html` | 學生說明網站，可 GitHub Pages 發布 |
| `apps_script_submission_app/Code.gs` | 提交系統後端 |
| `apps_script_submission_app/Index.html` | 提交系統前端 |
| `school_innovation_event_docs/complete_workflow.md` | 完整工作流程 |
| `school_innovation_event_docs/submission_guidelines.md` | 提交規範 |
| `school_innovation_event_docs/grading_system_plan.md` | 評分系統規劃 |
| `macau-innovation-screening/` | AI 評分 Skill 初版設計 |
