# Change: Add Equipment Parameter Specification Form

## Why
使用者需要一個簡單的 Web UI 介面來輸入機台參數規格數值，此介面將嵌入到 Line Bot、Messenger Bot 等平台中，以 Picture-in-Picture (PiP) 視窗形式呈現，方便使用者快速新增機台參數規格。

## What Changes
- 新增 PiP 視窗入口頁面，提供點擊連結開啟 PiP 視窗功能
- 新增機台參數規格輸入表單，包含：
  - 機台名稱 (Tool Name)
  - 參數名稱 (Parameter Name)
  - 下規格界線 (LSL)
  - 下管制界線 (LCL)
  - 中心線 (CL)
  - 上管制界線 (UCL)
  - 上規格界線 (USL)
- 前端驗證數值關係：LSL < LCL < CL < UCL < USL
- 表單提交後呼叫後端 API 儲存資料
- 顯示提交成功/失敗訊息

## Impact
- Affected specs: parameter-form (新增)
- Affected code: 
  - 新增入口頁面元件
  - 新增表單元件
  - 新增 API 整合邏輯
