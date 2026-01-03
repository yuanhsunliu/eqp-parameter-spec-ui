# parameter-form Specification

## Purpose
TBD - created by archiving change add-parameter-spec-form. Update Purpose after archive.
## Requirements
### Requirement: PiP Window Entry
使用者 SHALL 能夠透過點擊連結開啟 Picture-in-Picture (PiP) 視窗來使用參數規格輸入表單。

#### Scenario: Open PiP window
- **WHEN** 使用者點擊「開啟表單」連結
- **THEN** 系統開啟一個 PiP 視窗 (約 300x500 px)
- **AND** 視窗中顯示參數規格輸入表單

### Requirement: Parameter Specification Form
系統 SHALL 提供表單讓使用者輸入機台參數規格，包含以下欄位：
- 機台名稱 (Tool Name) - 必填文字欄位，1-100 字元
- 參數名稱 (Parameter Name) - 必填文字欄位，1-100 字元
- 下規格界線 (LSL) - 必填數值欄位
- 下管制界線 (LCL) - 必填數值欄位
- 中心線 (CL) - 必填數值欄位
- 上管制界線 (UCL) - 必填數值欄位
- 上規格界線 (USL) - 必填數值欄位

#### Scenario: Display empty form
- **WHEN** 使用者開啟表單頁面
- **THEN** 系統顯示空白的參數規格輸入表單
- **AND** 所有欄位為空白狀態

#### Scenario: Input validation - required fields
- **WHEN** 使用者未填寫任何必填欄位就點擊送出
- **THEN** 系統顯示驗證錯誤訊息
- **AND** 表單不會送出

#### Scenario: Input validation - numeric fields
- **WHEN** 使用者在數值欄位輸入非數字內容
- **THEN** 系統顯示驗證錯誤訊息

#### Scenario: Input validation - value relationship
- **WHEN** 使用者輸入的數值不符合 LSL < LCL < CL < UCL < USL 規則
- **THEN** 系統顯示驗證錯誤訊息「數值關係錯誤：必須符合 LSL < LCL < CL < UCL < USL」
- **AND** 表單不會送出

#### Scenario: Input validation - value relationship success
- **WHEN** 使用者輸入的數值符合 LSL < LCL < CL < UCL < USL 規則
- **THEN** 系統允許表單送出

### Requirement: Form Submission
系統 SHALL 將表單資料送至後端 API 儲存。

#### Scenario: Submit form successfully
- **WHEN** 使用者填寫完整且有效的表單資料
- **AND** 點擊送出按鈕
- **THEN** 系統呼叫後端 API 儲存資料
- **AND** 顯示成功訊息
- **AND** 表單維持原狀（不清空欄位）

#### Scenario: Submit form failure - general error
- **WHEN** 使用者填寫完整且有效的表單資料
- **AND** 點擊送出按鈕
- **AND** 後端 API 回應錯誤
- **THEN** 系統顯示失敗訊息

#### Scenario: Submit form failure - duplicate entry
- **WHEN** 使用者填寫完整且有效的表單資料
- **AND** 點擊送出按鈕
- **AND** 後端 API 回應 409 Conflict（資料已存在）
- **THEN** 系統顯示友善提示訊息「此機台參數規格已存在，請確認機台名稱與參數名稱」

### Requirement: Desktop Browser Support
系統 SHALL 支援桌面版瀏覽器（Chrome, Firefox, Safari, Edge）。

#### Scenario: Desktop browser compatibility
- **WHEN** 使用者使用桌面版瀏覽器開啟系統
- **THEN** 系統能正常運作並顯示完整功能

### Requirement: Modern UI Design
系統 SHALL 採用現代設計風格，配色清新、健康，並使用 shadcn/ui 元件庫。

#### Scenario: UI appearance
- **WHEN** 使用者開啟系統
- **THEN** 系統顯示符合現代設計風格的介面
- **AND** 使用 shadcn/ui 元件

