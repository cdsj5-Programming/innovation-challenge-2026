# Apps Script 提交系統

## 一、用途

這個系統用於「第一屆聖五中學生創意設計挑戰賽」學生提交作品資料。

提交格式已按最新參考文件修正為：

- 線上填寫作品介紹文字內容
- 上傳 1 份科學海報 JPG

## 二、檔案

| 檔案 | 用途 |
|---|---|
| `Code.gs` | 後端邏輯：驗證、建資料夾、生成 PDF、寫入 Sheet |
| `Index.html` | 學生提交頁面 |
| `appsscript.json` | Apps Script 權限設定 |

## 三、已接入設定

- Drive 資料夾：`1arv_EIIfHfE2JXSFmdn-QyHxmOtSmrUX`
- Spreadsheet：`1J4GKtAyeJct4GMfDZUQbwXournHjAlx7fq4l78rLhMY`
- 工作表：`工作表1`
- 學生名單工作表：`學生名單`

## 四、目前功能

- 班級以下拉選單讀取 `學生名單`
- 組員以下拉選單讀取所選班級名單
- 系統強制檢查全組成員均為同班同學
- 系統強制檢查不可重複選同一位學生
- 學生提交後自動生成提交 PDF
- 每組自動建立一個 Google Drive 資料夾
- 提交後 90 分鐘內可重交，系統保留最新版本
- 必填欄位已改為：
  - 題目名稱
  - 問題說明
  - 設計理念
  - 解決方案細節
  - 人工智能使用情況
- 必交附件已改為：
  - 1 份 JPG 科學海報

## 五、使用方式

1. 在 Google Apps Script 建立新專案。
2. 將 `Code.gs`、`Index.html`、`appsscript.json` 貼入。
3. 執行 `setupSheet()` 初始化 `工作表1` 欄位。
4. 部署為 Web App。
5. 將 Web App 連結提供給學生使用。

## 六、學生名單格式

`學生名單` 工作表需至少有以下三欄：

| A 欄 | B 欄 | C 欄 |
|---|---|---|
| 班級 | 學號 | 姓名 |

系統會從第 2 列開始讀取名單。

## 七、工作表欄位

- `first_submitted_at`
- `last_submitted_at`
- `submission_count`
- `group_key`
- `class_name`
- `member_count`
- `student_id_1` 至 `student_id_3`
- `student_name_1` 至 `student_name_3`
- `project_title`
- `problem_statement`
- `design_concept`
- `solution_details`
- `ai_usage`
- `science_poster_url`
- `science_poster_name`
- `generated_pdf_url`
- `group_folder_url`

## 八、可調整項目

如你想改，可直接在 `Code.gs` 的 `SETTINGS` 修改：

- `POSTER_MAX_FILE_SIZE_MB`
- `RESUBMISSION_WINDOW_MINUTES`
- `TEXT_LIMITS`
- `EVENT_TITLE`
- `EVENT_SCHEDULE_LABEL`
