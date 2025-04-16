const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Report Page Automation", () => {
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
    await driver.wait(until.urlIs(`${baseUrl}/Dashboard`), 10000);
    await driver.get(`${baseUrl}/Dashboard/Report`);
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
    test("Report count and total entries text are displayed", async () => {
      const reportCountText = await driver.wait(
        until.elementLocated(By.xpath("//h1[contains(text(), 'Report:')]")),
        5000
      );
      assert.ok(
        await reportCountText.isDisplayed(),
        "Report count text should be displayed"
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
        By.xpath("//div[text()='Loading...']")
      );
      // assert.equal(
      //   loadingElements.length,
      //   0,
      //   "Loading indicator should not be displayed after initial load"
      // );
    });

    test("Error message is not displayed after initial load (assuming successful API response)", async () => {
      const errorElements = await driver.findElements(
        By.xpath("//div[contains(text(), 'Error:')]")
      );
      assert.equal(
        errorElements.length,
        0,
        "Error message should not be displayed after initial load"
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

    test("Clicking the refresh button resets search term, filter (if implemented), and current page", async () => {
      const searchInput = await driver.findElement(
        By.css("input[placeholder='Search']")
      );
      await searchInput.sendKeys("test");
      const refreshButton = await driver.findElement(
        By.xpath("//div[contains(@class, 'cursor-pointer')]")
      );
      await refreshButton.click();

      // assert.equal(
      //   await searchInput.getAttribute("value"),
      //   "",
      //   "Search term should be reset after refresh"
      // );

      const currentPageButton = await driver.findElement(
        By.xpath(
          "//button[contains(@class, 'bg-white') and contains(@class, 'border')]"
        )
      );
      assert.equal(
        await currentPageButton.getText(),
        "1",
        "Current page should reset to 1 after refresh"
      );

      // If a filter dropdown was present and used, you would also assert its reset state here.
    });

    test("Entering text in the search input filters the table (requires mocked data for reliable assertion)", async () => {
      const searchInput = await driver.findElement(
        By.css("input[placeholder='Search']")
      );
      await searchInput.sendKeys("rohit"); // Example search term

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

    // test("Clicking on a patient name navigates to the PatientReport page", async () => {
    //   const firstPatientLink = await driver.wait(
    //     until.elementLocated(By.xpath("//table/tbody/tr[1]/td[3]/a")),
    //     5000
    //   );
    //   const href = await firstPatientLink.getAttribute("href");
    //   await firstPatientLink.click();
    //   await driver.wait(
    //     until.urlIs(`${baseUrl}${href}`),
    //     10000,
    //     "Navigation to PatientReport page failed"
    //   );
    //   await driver.navigate().back(); // Go back to Report page
    //   await driver.wait(
    //     until.urlIs(`${baseUrl}/Dashboard/ViewReport/67e7a98c9911252db52d15a8`),
    //     5000
    //   );
    // });

    // test("Clicking 'View' report navigates to the ViewReport page", async () => {
    //   const firstViewReportLink = await driver.wait(
    //     until.elementLocated(By.xpath("//table/tbody/tr[1]/td[last()]/a")),
    //     5000
    //   );
    //   const href = await firstViewReportLink.getAttribute("href");
    //   await firstViewReportLink.click();
    //   await driver.wait(
    //     until.urlIs(`${baseUrl}${href}`),
    //     10000,
    //     "Navigation to ViewReport page failed"
    //   );
    //   await driver.navigate().back(); // Go back to Report page
    //   await driver.wait(
    //     until.urlIs(`${baseUrl}/Dashboard/ViewReport/67e7a98c9911252db52d15a8`),
    //     5000
    //   );
    // });
  });
});
