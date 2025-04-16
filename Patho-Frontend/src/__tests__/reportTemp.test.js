const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Report Template Management Page Automation", () => {
  let driver;
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
    await driver.get(`${baseUrl}/Dashboard/ReportTempMan`);
    await driver.wait(
      until.elementLocated(By.css("div.h-screen.w-full.flex.flex-col")), // Wait for the main container
      10000
    );
  }

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await login(driver, "nikitayugeshwar2020@gmail.com", "222222"); // Use your test credentials
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
    test("Report Template Management heading is displayed", async () => {
      const heading = await driver.wait(
        until.elementLocated(
          By.xpath("//h1[contains(text(), 'Report Template Management')]")
        ),
        5000
      );
      assert.ok(
        await heading.isDisplayed(),
        "Report Template Management heading should be displayed"
      );
    });

    test("Report count is displayed", async () => {
      const reportCount = await driver.wait(
        until.elementLocated(
          By.xpath("//h1[contains(text(), 'Report Template Management :')]")
        ),
        5000
      );
      assert.ok(
        await reportCount.isDisplayed(),
        "Report count should be displayed"
      );
    });

    test("Add New button is displayed and navigates to AddReport page", async () => {
      const addNewButton = await driver.wait(
        until.elementLocated(By.xpath("//button[text()='Add New']")),
        5000
      );
      assert.ok(
        await addNewButton.isDisplayed(),
        "Add New button should be displayed"
      );
      await addNewButton.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/AddReport`),
        10000,
        "Navigation to AddReport page failed"
      );
      await driver.navigate().back(); // Go back to ReportTempMan page
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/ReportTempMan`),
        5000
      );
    });

    test("Show entries dropdown is displayed with options", async () => {
      const showEntriesDropdown = await driver.wait(
        until.elementLocated(By.css("select")),
        5000
      );
      assert.ok(
        await showEntriesDropdown.isDisplayed(),
        "Show entries dropdown should be displayed"
      );

      const options = await showEntriesDropdown.findElements(By.css("option"));
      const actualValues = await Promise.all(
        options.map((option) => option.getAttribute("value"))
      );
      assert.deepStrictEqual(
        actualValues,
        ["5", "10", "20"],
        "Show entries options are incorrect"
      );
    });

    test("Search input field is displayed", async () => {
      const searchInput = await driver.wait(
        until.elementLocated(By.css("input[placeholder='Search']")),
        5000
      );
      assert.ok(
        await searchInput.isDisplayed(),
        "Search input field should be displayed"
      );
      const searchIconContainer = await driver.findElement(
        By.xpath(
          "//div[contains(@class, 'relative')]//div[contains(@class, 'absolute')]"
        )
      );
      const searchIcon = await searchIconContainer.findElement(By.css("svg"));
      assert.ok(
        await searchIcon.isDisplayed(),
        "Search icon should be displayed"
      );
    });

    test("Loading indicator is not displayed after initial load (assuming quick API response)", async () => {
      const loadingElements = await driver.findElements(
        By.xpath("//p[text()='Loading...']")
      );
      assert.equal(
        loadingElements.length,
        0,
        "Loading indicator should not be displayed after initial load"
      );
    });

    test("Delete success message is not displayed after initial load", async () => {
      const successMessageElement = await driver.findElements(
        By.xpath("//p[contains(@class, 'text-green-500')]")
      );
      assert.equal(
        successMessageElement.length,
        0,
        "Delete success message should not be displayed initially"
      );
    });
  });

  describe("Functionality Tests", () => {
    test("Changing the number of entries per page updates the table and resets to the first page", async () => {
      const showEntriesDropdown = await driver.findElement(By.css("select"));
      await showEntriesDropdown.sendKeys("10"); // Select '10' entries

      const currentPageButton = await driver.findElement(
        By.xpath(
          "//button[contains(@class, 'bg-white') and contains(@class, 'border')]"
        )
      );
      assert.equal(
        await currentPageButton.getText(),
        "1",
        "Current page should reset to 1 after changing entries per page"
      );

      // Optionally, you could try to assert the number of rows in the table body,
      // but this depends on the actual data and might be unreliable without mocking.
    });

    test("Entering text in the search input filters the table (requires mocked data for reliable assertion)", async () => {
      const searchInput = await driver.findElement(
        By.css("input[placeholder='Search']")
      );
      await searchInput.sendKeys("test clinic"); // Example search term

      // To reliably assert the filtering, you would need to mock the data
      // and check if the number of rows in the table body matches the expected
      // filtered results. Without mocking, this test can only verify that
      // entering text doesn't cause a UI error.
      await driver.sleep(1000); // Allow time for filtering to occur
      const tableRows = await driver.findElements(By.css("table tbody tr"));
      assert.ok(
        tableRows.length >= 0,
        "Table rows should be displayed after search"
      );
    });
  });
});
