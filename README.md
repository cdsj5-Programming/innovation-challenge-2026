# 第一屆聖五中學生創意設計挑戰賽

**澳門聖若瑟教區中學第五校 × 資訊科技科**
活動日期：2026 年 4 月 18 日 10:00 – 11:30

---

## 專案結構

```
├── student_guidance_site/        學生說明網站（靜態 HTML）
│   └── index.html                → 放在 GitHub Pages 發布
│
├── apps_script_submission_app/   線上提交系統（Google Apps Script）
│   ├── Code.gs                   後端邏輯（部署於 Google Apps Script）
│   ├── Index.html                前端提交表單
│   ├── appsscript.json           Apps Script 設定
│   └── README.md                 部署說明
│
├── school_innovation_event_docs/ 活動文件
│   ├── complete_workflow.md      完整工作流程說明
│   ├── submission_guidelines.md  提交規範
│   ├── grading_system_plan.md    評分系統規劃
│   ├── codex_local_next_steps.md 本機 Codex 後續任務（AI 評分）
│   └── ...
│
└── 參考資料/                      章程與模板（Word 文檔）
    ├── 中學生創意設計挑戰賽.docx
    ├── 作品介紹文檔.docx
    └── 作品介紹文檔(範本).docx
```

---

## 學生說明網站（GitHub Pages）

靜態 HTML，無需後端，直接由 GitHub Pages 發布。

**發布設定：**
- Source：`student_guidance_site/` 資料夾，或根目錄
- 網址格式：`https://<username>.github.io/<repo>/student_guidance_site/`

---

## 線上提交系統（Google Apps Script）

提交網站部署於 Google Apps Script，**不在 GitHub Pages 上**。

**線上提交網址：**
```
https://script.google.com/macros/s/AKfycbzjQu0LWyLXZwvs9EXaeIU8CxB0x2G6RHVkqYFkib0Oe4A0_oxm5qgnODTVATg71QEN/exec
```

**Google Spreadsheet：**
ID `1J4GKtAyeJct4GMfDZUQbwXournHjAlx7fq4l78rLhMY`，需含工作表「工作表1」和「學生名單」。

**Google Drive 根目錄：**
ID `1arv_EIIfHfE2JXSFmdn-QyHxmOtSmrUX`

---

## 提交規格（勿改回舊版）

| 欄位 | 字數上限 |
|---|---|
| 問題說明 | 200 字 |
| 設計理念 | 500 字 |
| 解決方案細節 | 1000 字 |
| 人工智能使用情況 | 500 字 |
| 科學海報 | JPG × 1，≤ 10 MB |

每組 2–3 人，同班組隊，提交後 90 分鐘內可更新。

---

## 未完成項目（留給 Codex 接手）

詳見 `school_innovation_event_docs/codex_local_next_steps.md`

1. AI 評分 Skill 接入 Google Sheet 資料
2. 自動回寫分數至試算表
3. 上線壓力測試

---

## 開發備注

- Code.gs 及 Index.html 只應在 Google Apps Script 編輯器內修改後重新部署
- 評分系統以官方 100 分制為準，詳見 `grading_system_plan.md`
- 勿改動 SHEET_HEADERS 欄位順序，否則 AI 評分讀欄會出錯
