# Codex 本機接手清單

## 目的

這份文件給之後在本機運行的 Codex 使用，集中處理目前尚未完成的兩部分：

- AI 評分自動回寫
- 實際上線測試

## 已完成基礎

- 提交網站欄位與驗證已按最新參考資料修正
- Sheet 欄位結構已統一
- PDF 內容已改為作品介紹格式
- Skill、rubric、prompt 已更新
- 學生說明網站與流程文件已補齊

## 本機 Codex 下一步要做

1. 讀取實際部署用的 Google Apps Script 專案版本。
2. 新增 AI 評分欄位，例如：
   - `score_problem_importance`
   - `score_creativity_originality`
   - `score_feasibility_execution`
   - `score_expression_visual`
   - `score_ai_usage`
   - `score_total`
   - `summary_comment`
   - `strengths`
   - `improvements`
   - `confidence`
   - `review_needed`
   - `risk_flags`
3. 建立從 Google Sheet 讀取未評分提交的流程。
4. 把提交文字與海報連結整理成 AI 輸入。
5. 呼叫模型評分並取得 JSON。
6. 把結果回寫到 Google Sheet。
7. 用一組測試資料完成端對端測試。

## 本機需要確認

- Google Apps Script 已可部署與執行
- Google Drive / Google Sheet 權限正常
- 可以存取海報檔案連結
- 已決定使用哪個模型或哪個執行方式去評分

## 補充

- 如需重產出 docx/pdf 範本，需先安裝 `python-docx` 與 `reportlab`
- 如果要正式上線，建議至少做 1 次老師視角測試與 1 次學生視角測試
