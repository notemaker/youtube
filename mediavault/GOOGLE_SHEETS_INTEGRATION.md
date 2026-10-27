# Google Sheets 實際串接指南

本專案的資料流是：

```text
前端網頁 → Apps Script Web App URL → Code.gs → Google 試算表
```

前端不直接接觸 Google Sheet ID。試算表 ID 只放在 Apps Script 的 Script Properties；前端只保存部署後的 Web App `/exec` URL。

## 本次已建立的實際資源

- Google 試算表：`影音收集庫資料庫`
- Spreadsheet ID：`1NwniMqgniziLo9qYJlMSHQr0QHBnxbn8F8e8eZN_06s`
- Apps Script 專案：`影音收集庫 API`
- Web App URL（`notemaker@gmail.com` 部署）：
  `https://script.google.com/macros/s/AKfycbzHWVotfHXdB6tk1kqLLU8jZgwL-YEMs6XqDyBzJfjAJjOaWA48EdnPULI2zc0pI6JS/exec`

目前已建立 `Media` 與 `Lists` 工作表、欄位標題及基本選項，並在 Apps Script 指令碼屬性設定 `SPREADSHEET_ID`。由於 Web App 設定為「只有我自己」，未登入相同 Google Workspace 帳戶的瀏覽器會收到權限錯誤；這是預期的安全行為。

## 一、建立 Google 試算表

建立一份新的 Google 試算表，新增兩個工作表，名稱必須完全相同：`Media`、`Lists`。

### `Media` 第一列欄位

請把下列欄位貼到 `Media` 的第一列，順序建議保持一致：

```text
id | title | mediaType | sourceUrl | thumbnailUrl | category | tags | status | rating | notes | createdAt | updatedAt
```

`Media` 的欄位用途如下：

| 欄位 | 說明 |
| --- | --- |
| `id` | 唯一識別碼，由 Apps Script 產生 |
| `title` | 影音標題，必填 |
| `mediaType` | `影片`、`Podcast`、`音樂`、`直播` 或 `文章／其他` |
| `sourceUrl` | 原始連結，必須是 `http://` 或 `https://` |
| `thumbnailUrl` | 可選的縮圖 URL |
| `category` | 分類名稱 |
| `tags` | 以逗號分隔，例如 `設計,靈感` |
| `status` | `待觀看`、`觀看中`、`已完成` 或 `封存` |
| `rating` | 0–5，可使用 0.5 間隔 |
| `notes` | 個人備註 |
| `createdAt` | ISO 時間字串 |
| `updatedAt` | ISO 時間字串 |

### `Lists` 第一列欄位

```text
kind | value | color | sortOrder | active
```

範例資料：

```text
category | 設計靈感 | orange | 1 | TRUE
category | 工作方法 | sage | 2 | TRUE
tag      | 觀察     | sage | 1 | TRUE
tag      | 創意     | orange | 2 | TRUE
```

`active` 建議使用 Google 試算表的核取方塊或真正的布林值 `TRUE`／`FALSE`，不要只輸入一般文字。

## 二、建立 Apps Script 專案

在 Google 試算表中選擇「擴充功能 → Apps Script」，建立綁定此試算表的 Apps Script 專案。

將專案內的 [apps-script/Code.gs](./apps-script/Code.gs) 全部貼到 Apps Script 編輯器的 `Code.gs`。

若要使用專案內的 manifest：

1. 在 Apps Script 左側「專案設定」中開啟顯示 `appsscript.json` manifest 檔案。
2. 將專案內的 [apps-script/appsscript.json](./apps-script/appsscript.json) 內容貼入。
3. 儲存專案。

如果 Apps Script 編輯器已經有自己的 `timeZone` 或其他設定，保留既有必要設定，只需確認 `runtimeVersion` 為 `V8`。

## 三、設定 `SPREADSHEET_ID`

從試算表網址取得 ID：

```text
https://docs.google.com/spreadsheets/d/這一段就是_SPREADSHEET_ID/edit
```

在 Apps Script：

1. 開啟「專案設定」。
2. 找到「指令碼屬性」或 Script Properties。
3. 新增：

```text
Property: SPREADSHEET_ID
Value: 你的 Google 試算表 ID
```

不要把這個 ID 寫進前端 `public/app.js`，也不要貼到公開網站程式碼中。Apps Script 會透過這個屬性執行：

```javascript
SpreadsheetApp.openById(SPREADSHEET_ID)
```

第一次執行或部署時，Google 會要求授權 Apps Script 讀寫該試算表。請確認授權的 Google 帳號對該試算表具有編輯權限。

## 四、部署為 Web App

在 Apps Script 右上角選擇「部署 → 新增部署」：

- 類型：Web app
- 執行身分：我（部署此 Web App 的帳號）
- 存取權：依資料敏感度選擇
- 部署後複製以 `/exec` 結尾的 URL

測試時可使用允許匿名存取的設定，但這代表知道 URL 的人可能可以讀寫你的收藏資料。不要用匿名部署保存敏感、私人或商業資料。較安全的正式方案是加入登入／授權，或在前端與 Apps Script 之間增加同源後端代理。

請使用正式的 `/exec` URL，不要使用 `/dev` URL。`/dev` 通常只適合部署者測試，而且權限與穩定性不同。

## 五、先用瀏覽器或 curl 測試 API

假設部署網址是：

```text
https://script.google.com/macros/s/你的部署 ID/exec
```

### 讀取 API metadata

```bash
curl -L 'https://script.google.com/macros/s/你的部署ID/exec?action=meta'
```

正常會得到類似：

```json
{
  "ok": true,
  "data": {
    "categories": [],
    "tags": [],
    "statuses": ["待觀看", "觀看中", "已完成", "封存"],
    "mediaTypes": ["影片", "Podcast", "音樂", "直播", "文章／其他"],
    "version": "0.2"
  },
  "error": null,
  "meta": { "version": "0.2", "httpStatus": 200 }
}
```

### 讀取收藏清單

```bash
curl -L 'https://script.google.com/macros/s/你的部署ID/exec?action=list'
```

也可以帶查詢條件：

```bash
curl -L 'https://script.google.com/macros/s/你的部署ID/exec?action=list&q=設計&status=待觀看&sort=updated'
```

### 測試新增

```bash
curl -L -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "create",
    "item": {
      "title": "測試收藏",
      "mediaType": "影片",
      "sourceUrl": "https://example.com/test",
      "thumbnailUrl": "",
      "category": "設計靈感",
      "tags": "測試,第一筆",
      "status": "待觀看",
      "rating": 4.5,
      "notes": "確認 Apps Script 寫入正常。"
    }
  }' \
  'https://script.google.com/macros/s/你的部署ID/exec'
```

若新增成功，`Media` 工作表會自動補上 `id`、`createdAt`、`updatedAt`。

## 六、在前端切換到 Google Sheet API

1. 開啟網頁的「資料來源」頁面：`/settings`。
2. 選擇「Google Sheet API」。
3. 貼上 Apps Script `/exec` URL。
4. 按「測試連線」。
5. 出現連線成功後，按「儲存設定」。
6. 回到「收藏總覽」，前端會從 Apps Script 讀取資料。

URL 會保存在目前瀏覽器的 `localStorage`，不會寫入 Google Sheet。前端的新增、編輯與刪除會使用 Apps Script 的 `POST` API。

## 七、目前 API 對應

| 前端操作 | 請求 |
| --- | --- |
| 載入清單 | `GET ?action=list` |
| 載入設定選項 | `GET ?action=meta` |
| 新增 | `POST { action: "create", item: {...} }` |
| 編輯 | `POST { action: "update", id: "...", item: {...} }` |
| 刪除 | `POST { action: "delete", id: "..." }` |

所有回應都使用：

```json
{
  "ok": true,
  "data": {},
  "error": null,
  "meta": {
    "requestId": "...",
    "version": "0.2",
    "httpStatus": 200
  }
}
```

## 八、常見問題排查

### `CONFIG_MISSING`

Apps Script 找不到 `SPREADSHEET_ID`。請確認 Script Properties 的名稱完全是大寫 `SPREADSHEET_ID`，且值只放試算表 ID，不要貼整個網址。

### `SHEET_MISSING`

找不到 `Media` 工作表。請確認工作表名稱大小寫與空格完全一致。

### 回傳 HTML 而不是 JSON

通常是 URL 貼錯、使用了 `/dev`、部署版本未更新，或 Apps Script 將請求導向登入頁。請重新部署新版本並確認使用 `/exec` URL。

請在前端「資料來源」頁使用上方 `notemaker@gmail.com` 部署的 `/exec` URL；不要使用其他 Google Workspace 網域下的舊 URL。

### 測試連線失敗或瀏覽器顯示 CORS

目前前端是靜態網站，會直接從瀏覽器呼叫 Apps Script。Google Apps Script 的重導與跨來源限制需用實際部署環境驗證；本機 curl 成功不代表瀏覽器跨來源 POST 一定成功。

如果瀏覽器被 CORS 或 preflight 擋住，建議兩個方向：

1. 增加同源後端 proxy，由前端呼叫自己的 `/api`，再由 server 呼叫 Apps Script。
2. 將前端改成由 Apps Script HtmlService 同源提供，避免前端與 API 分屬不同來源。

目前前端的 POST 已改用 `text/plain;charset=UTF-8` 搭配 JSON 字串內容，讓瀏覽器使用 CORS simple request，避開 `application/json` 造成的 OPTIONS preflight；Apps Script `doPost(e)` 仍從 `e.postData.contents` 解析相同 JSON 契約。

不要為了繞過 CORS 把試算表公開，或把 Google 帳號憑證放進前端。

### 新增失敗但讀取成功

通常是 `Content-Type: application/json`、部署權限、Apps Script 版本未更新，或必要欄位不符合驗證。先用上面的 `curl` POST 測試，再查看 Apps Script「執行作業」紀錄。

## 九、建議的上線順序

先用一份不含敏感資料的測試試算表，以匿名或測試權限完成 `meta`、`list`、`create`、`update`、`delete` 五項驗證；再決定是否加入登入或同源 proxy。完成瀏覽器跨來源驗證前，不建議把正式私人收藏資料接到公開匿名 Web App。
