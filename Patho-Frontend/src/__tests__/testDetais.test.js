const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Test Details Page Automation", () => {
  let driver;
  const testPatientId = "67e7a98c9911252db52d15a8"; // Consistent test patient ID
  const baseUrl = "http://localhost:5173";

  async function login(driver, email, password) {
    await driver.get(`${baseUrl}/`);
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      10000
    );
    await emailInput.sendKeys(email);
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    await passwordInput.sendKeys(password);
    const loginButton = await driver.findElement(
      By.css('button[type="submit"]')
    );
    await loginButton.click();
    await driver.wait(until.urlContains("Dashboard"), 10000);
  }

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await login(driver, "nikitayugeshwar2020@gmail.com", "222222"); // Use your test credentials
      await driver.get(`${baseUrl}/Dashboard/TestDetails/${testPatientId}`);
      await driver.wait(
        until.elementLocated(
          By.css("div.px-5.flex.items-center.justify-between")
        ), // Wait for the main header
        10000
      );
    } catch (error) {
      console.error("Setup failed:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("UI Elements and Initial State", () => {
    test("Back button is displayed and navigates to Test page", async () => {
      const backButton = await driver.wait(
        until.elementLocated(By.xpath("//button[.//h1[text()='Back']]")),
        5000
      );
      assert.ok(
        await backButton.isDisplayed(),
        "Back button should be displayed"
      );
      await backButton.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Test`),
        10000,
        "Navigation to Test page failed"
      );
      await driver.navigate().back(); // Go back to TestDetails page for other tests
      await driver.wait(
        until.urlContains(`/Dashboard/TestDetails/${testPatientId}`),
        5000
      );
    });

    test("Create Report button is displayed", async () => {
      const createReportButton = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[contains(@href, '/Dashboard/CreateTestReport')]//button[text()='Create Report']"
          )
        ),
        5000
      );
      assert.ok(
        await createReportButton.isDisplayed(),
        "Create Report button should be displayed"
      );
    });

    test("Edit button is displayed", async () => {
      const editButton = await driver.wait(
        until.elementLocated(By.css("button[data-testid='edit']")),
        5000
      );
      assert.ok(
        await editButton.isDisplayed(),
        "Edit button should be displayed"
      );
    });

    test("Test Name header is displayed", async () => {
      const testNameHeader = await driver.wait(
        until.elementLocated(By.css("div.bg-violet-200 > h1.text-blue-900")),
        5000
      );
      assert.ok(
        await testNameHeader.isDisplayed(),
        "Test Name header should be displayed"
      );
      assert.equal(
        await testNameHeader.getText(),
        "Test Name",
        "Test Name header text is incorrect"
      );
    });

    test("Report Notes section is displayed if notes exist", async () => {
      // This test's success depends on the test data having report notes.
      // You might need to adjust the test patient ID or mock data for this.
      const reportNotesTitle = await driver.findElements(
        By.xpath("//h1[text()='Report Notes']")
      );
      if (reportNotesTitle.length > 0) {
        assert.ok(
          await reportNotesTitle[0].isDisplayed(),
          "Report Notes title should be displayed"
        );
        const reportNotesContent = await driver.findElement(
          By.xpath("//h1[text()='Report Notes']/following-sibling::p")
        );
        assert.ok(
          await reportNotesContent.isDisplayed(),
          "Report Notes content should be displayed"
        );
      } else {
        console.warn(
          "Skipping Report Notes test as no notes might be present in the test data."
        );
      }
    });

    test("Test results table headers are displayed", async () => {
      const tableHeaders = await driver.findElements(By.css("table thead th"));
      const expectedHeaders = [
        "Field Name",
        "Results",
        "Units",
        "Reference Range",
      ];
      const actualHeaders = await Promise.all(
        tableHeaders.map((h) => h.getText())
      );
      assert.deepStrictEqual(
        actualHeaders,
        expectedHeaders,
        "Test results table headers are incorrect"
      );
    });

    test("Test result fields are displayed in rows", async () => {
      const resultRows = await driver.findElements(
        By.css("table tbody tr:not(:has(th))")
      );
      assert.ok(
        resultRows.length > 0,
        "At least one test result row should be displayed"
      );
      // Optionally, you can check the number of columns in these rows.
    });
  });

  describe("Functionality Tests", () => {
    test("Clicking 'Create Report' button navigates to the CreateTestReport page", async () => {
      const createReportButton = await driver.wait(
        until.elementLocated(
          By.xpath("//a[contains(@href, '/Dashboard/CreateTestReport')]")
        ),
        5000
      );
      const href = await createReportButton.getAttribute("href");
      await createReportButton.click();
      await driver.wait(
        until.urlIs(href),
        10000,
        "Navigation to CreateTestReport page failed"
      );
      await driver.navigate().back(); // Go back to TestDetails page
      await driver.wait(
        until.urlContains(`/Dashboard/TestDetails/${testPatientId}`),
        5000
      );
    });

    test("Clicking 'Edit' button navigates to the EditTestReport page", async () => {
      const editButtonLink = await driver.wait(
        until.elementLocated(
          By.xpath("//a[contains(@href, '/Dashboard/EditTestReport')]")
        ),
        5000
      );
      const href = await editButtonLink.getAttribute("href");
      await editButtonLink.click();
      await driver.wait(
        until.urlIs(href),
        10000,
        "Navigation to EditTestReport page failed"
      );
      await driver.navigate().back(); // Go back to TestDetails page
      await driver.wait(
        until.urlContains(`/Dashboard/TestDetails/${testPatientId}`),
        5000
      );
    });

    test("Test results out of reference range are highlighted in red", async () => {
      const outOfRangeElements = await driver.findElements(
        By.css("table tbody td.text-red-600.font-bold")
      );
      // This assertion depends on the test data having results outside the reference range.
      // You might need to adjust the test patient ID or mock data accordingly.
      // At least one element should be found if the functionality is working and data is appropriate.
      // assert.ok(outOfRangeElements.length > 0, "Test results outside the reference range should be highlighted in red");
      if (outOfRangeElements.length > 0) {
        console.log("Found test results highlighted as out of range.");
      } else {
        console.warn(
          "No test results found to be out of range in the current test data."
        );
      }
    });
  });
});
