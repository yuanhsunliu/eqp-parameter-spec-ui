import { test, expect } from "@playwright/test";

const API_BASE_URL = "http://127.0.0.1:5001";

test.describe("Feature: PiP Window Entry", () => {
  test.describe("Scenario: Open PiP window", () => {
    test("WHEN 使用者點擊「開啟表單」連結 THEN 系統開啟一個 PiP 視窗並顯示參數規格輸入表單", async ({
      page,
    }) => {
      await page.goto("/");

      await page.getByTestId("open-pip-button").click();

      await expect(page.getByTestId("pip-panel")).toBeVisible();
      await expect(page.getByTestId("tool_name")).toBeVisible();
      await expect(page.getByTestId("submit-button")).toBeVisible();
    });
  });
});

test.describe("Feature: Parameter Specification Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/form");
  });

  test.describe("Scenario: Display empty form", () => {
    test("WHEN 使用者開啟表單頁面 THEN 系統顯示空白的參數規格輸入表單", async ({
      page,
    }) => {
      await expect(page.getByTestId("tool_name")).toBeVisible();
      await expect(page.getByTestId("tool_name")).toHaveValue("");
      await expect(page.getByTestId("parameter_name")).toHaveValue("");
      await expect(page.getByTestId("lsl")).toHaveValue("");
      await expect(page.getByTestId("lcl")).toHaveValue("");
      await expect(page.getByTestId("cl")).toHaveValue("");
      await expect(page.getByTestId("ucl")).toHaveValue("");
      await expect(page.getByTestId("usl")).toHaveValue("");
    });
  });

  test.describe("Scenario: Input validation - required fields", () => {
    test("WHEN 使用者未填寫任何必填欄位就點擊送出 THEN 系統顯示驗證錯誤訊息", async ({
      page,
    }) => {
      await page.getByTestId("submit-button").click();

      await expect(page.getByText("機台名稱為必填欄位")).toBeVisible();
      await expect(page.getByText("參數名稱為必填欄位")).toBeVisible();
    });
  });

  test.describe("Scenario: Input validation - value relationship", () => {
    test("WHEN 使用者輸入的數值不符合 LSL < LCL < CL < UCL < USL 規則 THEN 系統顯示驗證錯誤訊息", async ({
      page,
    }) => {
      await page.getByTestId("tool_name").fill("TEST_TOOL");
      await page.getByTestId("parameter_name").fill("test_param");
      await page.getByTestId("lsl").fill("100");
      await page.getByTestId("lcl").fill("50");
      await page.getByTestId("cl").fill("75");
      await page.getByTestId("ucl").fill("80");
      await page.getByTestId("usl").fill("90");

      await page.getByTestId("submit-button").click();

      await expect(page.getByTestId("relationship-error")).toContainText(
        "數值關係錯誤：必須符合 LSL < LCL < CL < UCL < USL"
      );
    });

    test("WHEN 使用者輸入的數值符合 LSL < LCL < CL < UCL < USL 規則 THEN 系統允許表單送出", async ({
      page,
    }) => {
      await page.getByTestId("tool_name").fill("TEST_TOOL");
      await page.getByTestId("parameter_name").fill("test_param");
      await page.getByTestId("lsl").fill("50");
      await page.getByTestId("lcl").fill("60");
      await page.getByTestId("cl").fill("100");
      await page.getByTestId("ucl").fill("140");
      await page.getByTestId("usl").fill("150");

      await page.getByTestId("submit-button").click();

      await expect(page.getByTestId("relationship-error")).not.toBeVisible();
    });
  });
});

test.describe("Feature: Form Submission", () => {
  const uniqueToolName = `TOOL_${Date.now()}`;
  const uniqueParamName = `param_${Date.now()}`;

  test.beforeEach(async ({ page }) => {
    await page.goto("/form");
  });

  test.describe("Scenario: Submit form successfully", () => {
    test("WHEN 使用者填寫完整且有效的表單資料並點擊送出 THEN 系統呼叫後端 API 儲存資料並顯示成功訊息", async ({
      page,
    }) => {
      await page.getByTestId("tool_name").fill(uniqueToolName);
      await page.getByTestId("parameter_name").fill(uniqueParamName);
      await page.getByTestId("lsl").fill("50");
      await page.getByTestId("lcl").fill("60");
      await page.getByTestId("cl").fill("100");
      await page.getByTestId("ucl").fill("140");
      await page.getByTestId("usl").fill("150");

      await page.getByTestId("submit-button").click();

      await expect(page.getByText("參數規格新增成功")).toBeVisible({
        timeout: 10000,
      });

      // Verify form keeps the data (not cleared)
      await expect(page.getByTestId("tool_name")).toHaveValue(uniqueToolName);
    });
  });

  test.describe("Scenario: Submit form failure - duplicate entry", () => {
    test("WHEN 後端 API 回應 409 Conflict THEN 系統顯示友善提示訊息", async ({
      page,
    }) => {
      // Submit the same data again to trigger duplicate error
      await page.getByTestId("tool_name").fill(uniqueToolName);
      await page.getByTestId("parameter_name").fill(uniqueParamName);
      await page.getByTestId("lsl").fill("50");
      await page.getByTestId("lcl").fill("60");
      await page.getByTestId("cl").fill("100");
      await page.getByTestId("ucl").fill("140");
      await page.getByTestId("usl").fill("150");

      await page.getByTestId("submit-button").click();

      await expect(
        page.getByText("此機台參數規格已存在，請確認機台名稱與參數名稱")
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Scenario: Verify data in API", () => {
    test("提交的資料應該能從 API 查詢到", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/parameter-specs`);
      expect(response.ok()).toBeTruthy();

      const specs = await response.json();
      const found = specs.find(
        (s: { tool_name: string; parameter_name: string }) =>
          s.tool_name === uniqueToolName && s.parameter_name === uniqueParamName
      );
      expect(found).toBeTruthy();
      expect(found.lsl).toBe(50);
      expect(found.lcl).toBe(60);
      expect(found.cl).toBe(100);
      expect(found.ucl).toBe(140);
      expect(found.usl).toBe(150);
    });
  });
});

test.describe("Feature: Desktop Browser Support", () => {
  test.describe("Scenario: Desktop browser compatibility", () => {
    test("WHEN 使用者使用桌面版瀏覽器開啟系統 THEN 系統能正常運作並顯示完整功能", async ({
      page,
    }) => {
      await page.goto("/");
      await expect(page.getByText("機台參數規格管理系統")).toBeVisible();
      await expect(page.getByTestId("open-pip-button")).toBeVisible();
    });
  });
});

test.describe("Feature: Modern UI Design", () => {
  test.describe("Scenario: UI appearance", () => {
    test("WHEN 使用者開啟系統 THEN 系統顯示符合現代設計風格的介面", async ({
      page,
    }) => {
      await page.goto("/form");
      
      // Check shadcn/ui card component is rendered
      await expect(page.locator('[data-slot="card"]')).toBeVisible();
      
      // Check form inputs are styled
      await expect(page.getByTestId("tool_name")).toBeVisible();
      await expect(page.getByTestId("submit-button")).toBeVisible();
    });
  });
});
