import { test, expect } from "@playwright/test";
import xlsx from "xlsx";

test.setTimeout(30 * 60 * 1000); // 30 minutes

// Load Excel File
const workbook = xlsx.readFile("./tests/DATA/RESTD AllState.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

test("Excel data based automation", async ({ page }) => {

  // ✅ LOGIN ONCE
  await page.goto("https://www.landydev.com/#/auth/login");
  await page.waitForLoadState("networkidle");

  await page.getByRole("textbox", { name: "Email" }).fill(
    "velmurugan@stepladdersolutions.com"
  );

  await page.getByRole("textbox", { name: "Password" }).fill("Test@123");

  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForLoadState("networkidle");

  console.log("✅ Login Successful");

  // ✅ LOOP THROUGH EXCEL ROWS
  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    console.log(`\n🚀 Starting Row ${i + 1} | State: ${row.State}`);

    try {
      // ===============================
      // NEW APPLICATION
      // ===============================
      await page.goto("https://www.landydev.com/#/pages/riskPolicySearch");
      await page.waitForLoadState("networkidle");

      await page.getByRole("button", { name: "   New Application" }).click();

      // State & LOB
      await page.getByLabel("State").selectOption(row.State);
      await page.locator("#state").nth(1).selectOption(row.Lob);

      // Producer
      const producer = page.getByRole("textbox", { name: "Pick a producer" });
      await producer.click();
      await producer.type("hhl");

      await page.waitForTimeout(2000);
      await page.getByText("HHL01-A, Herbert H. Landy").click();

      // Firm Name
      await page.getByRole("textbox", { name: "Search Firm Name" }).click();
      await page
        .getByRole("textbox", { name: "Search Firm Name" })
        .fill(row.FirmName);

      // Location
      const locationAL = page
        .getByRole("textbox", { name: "Sizing example input" })
        .first();

      await locationAL.click();
      await locationAL.fill(row.Location);

      await page.waitForTimeout(2000);
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      // Effective Date
      const today = new Date().toISOString().split("T")[0];
      await page.locator('input[name="effDate1"]').fill(today);

      // Retro Date
      await page
        .getByLabel("Retroactive Date ---Choose an")
        .selectOption(row.PriorCheck);

      await page.getByRole("button", { name: "save & Close" }).click();

      // ===============================
      // APPLICATION DETAILS
      // ===============================
      await page.getByText("Application Details").click();

      // ✅ FIXED STRICT MODE PLACEHOLDER ISSUE
      await page.locator("#ftCpa").waitFor({ state: "visible" });
      await page.locator("#ftCpa").fill(
        String(row.AppDetlFullTimeProfessionals)
      );

      // Type of Firm
      await page
        .locator('select[name="typeOfFirmReId"]')
        .selectOption(row.AppDetlTypeOfFirm);

      await page.getByRole("button", { name: "save & Close" }).click();
      await page.waitForTimeout(2000);

      // ===============================
      // AREAS OF PRACTICE
      // ===============================
      await page.getByText("Areas of Practice").click();

      await page
        .locator("(//ngx-rev-trans//table)[1]//tr[1]/td[3]")
        .click();

      await page
        .locator("(//ngx-rev-trans//table)[1]//tr[1]/td[3]")
        .type(String(row.ArsPracSalesLeasingLastYr));

      await page
        .locator("(//ngx-rev-trans//table)[1]/tbody/tr[1]/td[4]//input")
        .click();

      await page
        .locator("(//ngx-rev-trans//table)[1]/tbody/tr[1]/td[4]//input")
        .type(String(row.TotalTransactions));

      await page.getByRole("button", { name: "save & Close" }).click();
      await page.waitForTimeout(2000);

      // ===============================
      // QUOTE SELECTION
      // ===============================
      await page
        .locator("nb-accordion-item-header")
        .filter({ hasText: "Quote Selection" })
        .click();

      await page.locator("span", { hasText: "Pick a Limit" }).first().click();
      await page.getByText(row.QutSelContLimit).click();

      await page.locator("span", { hasText: "Pick a Deductible" }).first().click();
      await page.getByText(row.QutSelContDeductible, { exact: true }).click();

      await page.getByText("Pick a Limit Type").click();
      await page.getByText(row.QutSelContLimitType).click();

      await page.getByText("Pick a Deductible Type").click();
      await page.getByText(row.QutSelContDeductibleType).click();

      await page.getByRole("button", { name: "save & Close" }).click();

      // ===============================
      // RATE & ACCOUNTING
      // ===============================
      await page.getByRole("button", { name: " Rate" }).click();
      await page.waitForLoadState("networkidle");

      await page.locator("//tbody/tr[1]/td[2]/button[3]").click();

      await page.locator("div input#minDate").fill(today);
      await page.locator("button#save").click();

      await page.locator("button#sendMail > span").click();
      await page.waitForTimeout(3000);

      await page.locator('//*[@id="moveToAccounting"]').click();
      await page.locator('//*[@id="accounting"]').click();

      // ===============================
      // PAYMENT
      // ===============================
      await page.getByRole("link", { name: "Payment", exact: true }).click();
      await page.waitForLoadState("networkidle");

      const balanceText = await page
        .locator("//ngx-payment-tab//tr[2]/td[9]")
        .innerText();

      const balanceValue = balanceText.replace("$", "").replace(/,/g, "").trim();

      const paymentInput = page.locator("#paymentReceived3");

      await paymentInput.click();
      await paymentInput.press("Control+A");
      await paymentInput.press("Backspace");

      await paymentInput.type(balanceValue);

      await page.locator("#checkNumber").fill(String(row.Option));
      await page.locator("#autofill").click();

      await page.getByRole("button", { name: "Save  & Issue" }).click();
      await page.getByRole("button", { name: "Okay" }).click();

      // ===============================
      // SCREENSHOT SUCCESS
      // ===============================
      await page.screenshot({ path: `row-${i + 1}-success.png` });

      console.log(`✅ Row ${i + 1} Completed Successfully`);

    } catch (error) {
      console.error(`❌ FAILED ROW ${i + 1} | State: ${row.State}`, error);

      if (page && !page.isClosed()) {
        await page.screenshot({ path: `row-${i + 1}-error.png` });
      }

      continue;
    }
  }

  console.log("\n🎉 All Excel Rows Completed");
});
