# 影音收集庫｜GitHub 安裝包

本專案是響應式影音收藏前端，使用 Google Apps Script Web App 讀寫 Google 試算表。

## 上傳到 GitHub

1. 在 GitHub 建立一個新的空白 repository。
2. 將本資料夾內的所有檔案與資料夾上傳，保留 `public/` 與 `apps-script/` 結構。
3. 不要把 Google 試算表 ID、Script Property 值或私人憑證寫入前端檔案。

## 本機啟動

需要 Node.js 18 以上：

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## Google Sheets 設定

1. 建立 `Media` 與 `Lists` 工作表。
2. 將 `apps-script/Code.gs` 貼到 Apps Script。
3. 在 Apps Script「專案設定 → 指令碼屬性」新增：

```text
SPREADSHEET_ID = 你的 Google 試算表 ID
```

4. 確認程式包含 `doGet(e)` 與 `doPost(e)`。
5. 以 Web App 方式部署，取得 `/exec` URL。
6. 在網站「資料來源」選擇「Google Sheet API」，貼上 `/exec` URL，測試連線並儲存。

完整欄位與 API 說明請閱讀 `GOOGLE_SHEETS_INTEGRATION.md`，產品規格請閱讀 `SPEC.md`。

## GitHub Pages 注意事項

此專案的 `server.mjs` 用於本機 Preview；若使用 GitHub Pages，請發布 `public/` 內容，並確認網站能以 SPA fallback 服務 `/settings` 路由。Google Apps Script Web App 的存取權與 CORS 必須依部署帳戶設定。

## 目前版本

`81a8e4d`（移除右上角示範使用者頭像的版本）
