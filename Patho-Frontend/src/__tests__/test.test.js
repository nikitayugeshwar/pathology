const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Test Page Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173"; // Adjust if your base URL is different

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
      await driver.get(`${baseUrl}/Dashboard/Test`); // Navigate to the Test page
      await driver.wait(
        until.elementLocated(By.css("div.h-screen.w-full")), // Wait for the main container
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
    test("Page title is correct", async () => {
      const title = await driver.getTitle();
      assert.equal(
        title,
        "Vite + React",
        "Page title should be 'Vite + React'"
      ); // Replace with your actual title
    });

    test("Test count header is displayed", async () => {
      const testCountHeader = await driver.wait(
        until.elementLocated(By.css("h1.text-black.text-lg.font-medium")),
        5000
      );
      assert.ok(
        await testCountHeader.isDisplayed(),
        "Test count header should be displayed"
      );
    });

    test("Show entries dropdown is displayed with default value 10", async () => {
      const entriesDropdown = await driver.wait(
        until.elementLocated(By.css("select.h-6.w-12")),
        5000
      );
      assert.ok(
        await entriesDropdown.isDisplayed(),
        "Show entries dropdown should be displayed"
      );
      assert.equal(
        await entriesDropdown.getAttribute("value"),
        "10",
        "Default entries per page should be 10"
      );
    });

    test("Refresh button is displayed", async () => {
      const refreshButton = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(@class, 'cursor-pointer') and .//h1[text()='Refresh']]"
          )
        ),
        5000
      );
      assert.ok(
        await refreshButton.isDisplayed(),
        "Refresh button should be displayed"
      );
    });

    test("Search input field is displayed with placeholder", async () => {
      const searchInput = await driver.wait(
        until.elementLocated(By.css("input[placeholder='Search']")),
        5000
      );
      assert.ok(
        await searchInput.isDisplayed(),
        "Search input should be displayed"
      );
      assert.equal(
        await searchInput.getAttribute("placeholder"),
        "Search",
        "Search input placeholder should be 'Search'"
      );
    });

    test("Search icon is displayed", async () => {
      const searchIcon = await driver.wait(
        until.elementLocated(By.css("div.absolute.left-5 > svg")),
        5000
      );
      assert.ok(
        await searchIcon.isDisplayed(),
        "Search icon should be displayed"
      );
    });

    // test("Previous page button is displayed and initially disabled", async () => {
    //   const prevPageButton = await driver.wait(
    //     until.elementLocated(
    //       By.xpath("//button[.//svg[@data-icon='angle-left']]")
    //     ),
    //     5000
    //   );
    //   assert.ok(
    //     await prevPageButton.isDisplayed(),
    //     "Previous page button should be displayed"
    //   );
    //   assert.equal(
    //     await prevPageButton.getAttribute("disabled"),
    //     "true",
    //     "Previous page button should be initially disabled"
    //   );
    // });

    test("Current page number button is displayed with default value 1", async () => {
      const currentPageButton = await driver.wait(
        until.elementLocated(By.css("button.h-10.w-12.bg-white.border")),
        5000
      );
      assert.ok(
        await currentPageButton.isDisplayed(),
        "Current page number button should be displayed"
      );
      assert.equal(
        await currentPageButton.getText(),
        "1",
        "Default current page should be 1"
      );
    });

    // test("Next page button is displayed and initially enabled (if more than one page)", async () => {
    //   const nextPageButton = await driver.wait(
    //     until.elementLocated(
    //       By.xpath("//button[.//svg[@data-icon='angle-right']]")
    //     ),
    //     5000
    //   );
    //   assert.ok(
    //     await nextPageButton.isDisplayed(),
    //     "Next page button should be displayed"
    //   );
    //   // We can't reliably assert the initial enabled state without knowing the total number of entries.
    //   // A more robust test would involve loading data and then checking.
    // });

    test("Table headers are displayed correctly", async () => {
      const headers = await driver.findElements(By.css("thead th"));
      const expectedHeaders = [
        "Sr. No",
        "Patient No",
        "Name",
        "Test Name",
        "Contact No",
        "Gender",
        "Age",
        "Sample Collector",
      ];
      const actualHeaders = await Promise.all(headers.map((h) => h.getText()));
      assert.deepStrictEqual(
        actualHeaders,
        expectedHeaders,
        "Table headers should be displayed correctly"
      );
    });
  });

  describe("Functionality Tests", () => {
    test("Changing entries per page updates the table and current page", async () => {
      const entriesDropdown = await driver.wait(
        until.elementLocated(By.css("select.h-6.w-12")),
        5000
      );
      await entriesDropdown.sendKeys("5"); // Select "5" entries
      await driver.wait(
        async () => {
          const currentPageButton = await driver.findElement(
            By.css("button.h-10.w-12.bg-white.border")
          );
          return (await currentPageButton.getText()) === "1"; // Ensure page resets to 1
        },
        5000,
        "Current page should reset to 1 after changing entries"
      );

      const tableRows = await driver.findElements(By.css("tbody tr"));
      assert.ok(tableRows.length <= 5, "Table should display at most 5 rows");
    });

    test("Clicking refresh resets search term, filter, and current page", async () => {
      const searchInput = await driver.findElement(
        By.css("input[placeholder='Search']")
      );
      await searchInput.sendKeys("test");
      const refreshButton = await driver.findElement(
        By.xpath(
          "//div[contains(@class, 'cursor-pointer') and .//h1[text()='Refresh']]"
        )
      );
      await refreshButton.click();

      assert.equal(
        await searchInput.getAttribute("value"),
        "",
        "Search term should be reset"
      );
      const currentPageButton = await driver.findElement(
        By.css("button.h-10.w-12.bg-white.border")
      );
      assert.equal(
        await currentPageButton.getText(),
        "1",
        "Current page should be reset to 1"
      );
      // We can't directly test the 'filter' state from the UI in this component.
      // If there's a visible filter UI element, we would test that.
    });

    test("Searching updates the displayed table rows", async () => {
      const searchInput = await driver.findElement(
        By.css("input[placeholder='Search']")
      );
      await searchInput.sendKeys("Rohit"); // Assuming there's a patient with "Rohit" in their name
      await driver.sleep(500); // Allow time for the table to update

      const tableRows = await driver.findElements(By.css("tbody tr"));
      const rowData = await Promise.all(
        tableRows.map(async (row) => {
          const cells = await row.findElements(By.css("td"));
          return Promise.all(cells.map((cell) => cell.getText()));
        })
      );

      const containsSearchTerm = rowData.every((row) =>
        row.some((cell) => cell.toLowerCase().includes("rohit"))
      );
      assert.ok(
        containsSearchTerm,
        "Table rows should contain the search term"
      );

      await searchInput.clear(); // Clean up for subsequent tests
    });

    // test("Navigating to the next page displays different entries", async () => {
    //   const initialRows = await driver.findElements(By.css("tbody tr"));
    //   const nextPageButton = await driver.findElement(
    //     By.xpath("//button[.//svg[@data-icon='angle-right']]")
    //   );

    //   // Only proceed if the next page button is enabled (more than one page of data)
    //   if (await nextPageButton.isEnabled()) {
    //     await nextPageButton.click();
    //     await driver.wait(
    //       async () => {
    //         const currentPageButton = await driver.findElement(
    //           By.css("button.h-10.w-12.bg-white.border")
    //         );
    //         return (await currentPageButton.getText()) === "2";
    //       },
    //       5000,
    //       "Current page should be 2 after clicking next"
    //     );

    //     const newRows = await driver.findElements(By.css("tbody tr"));
    //     assert.notDeepStrictEqual(
    //       initialRows,
    //       newRows,
    //       "Navigating to the next page should display different entries"
    //     );

    //     // Navigate back to the first page for subsequent tests
    //     const prevPageButton = await driver.findElement(
    //       By.xpath("//button[.//svg[@data-icon='angle-left']]")
    //     );
    //     await prevPageButton.click();
    //   } else {
    //     console.warn(
    //       "Skipping next page navigation test as there might not be enough data for multiple pages."
    //     );
    //   }
    // });

    // test("Navigating to the previous page works", async () => {
    //   const nextPageButton = await driver.findElement(
    //     By.xpath("//button[.//svg[@data-icon='angle-right']]")
    //   );
    //   const prevPageButton = await driver.findElement(
    //     By.xpath("//button[.//svg[@data-icon='angle-left']]")
    //   );
    //   const currentPageButton = await driver.findElement(
    //     By.css("button.h-10.w-12.bg-white.border")
    //   );

    //   // Navigate to the next page first (if enabled)
    //   if (await nextPageButton.isEnabled()) {
    //     await nextPageButton.click();
    //     await driver.wait(() => currentPageButton.getText() === "2", 5000);

    //     const rowsOnPage2 = await driver.findElements(By.css("tbody tr"));
    //     await prevPageButton.click();
    //     await driver.wait(() => currentPageButton.getText() === "1", 5000);
    //     const rowsOnPage1 = await driver.findElements(By.css("tbody tr"));

    //     assert.notDeepStrictEqual(
    //       rowsOnPage1,
    //       rowsOnPage2,
    //       "Navigating back should display different entries"
    //     );
    //   } else {
    //     console.warn(
    //       "Skipping previous page navigation test as navigating to the next page might not be possible."
    //     );
    //   }
    // });

    test("Clicking on a patient name navigates to the PatientTestDetails page", async () => {
      const patientLink = await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child td:nth-child(3) a")), // Assuming the first row has a clickable name
        5000
      );
      const patientId = (await patientLink.getAttribute("href"))
        .split("/")
        .pop(); // Extract patient ID from the link
      await patientLink.click();
      await driver.wait(
        until.urlContains(`/Dashboard/PatientTestDetails/${patientId}`),
        10000,
        "Navigation to PatientTestDetails failed"
      );
      await driver.navigate().back(); // Navigate back to the Test page
      await driver.wait(
        until.urlContains(`/Dashboard/Test`),
        5000,
        "Navigation back to Test page failed"
      );
    });

    test("Clicking on the test count navigates to the TestDetails page", async () => {
      const testCountLink = await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child td:nth-child(4) a")), // Assuming the first row has a clickable test count
        5000
      );
      const patientId = (await testCountLink.getAttribute("href"))
        .split("/")
        .pop(); // Extract patient ID from the link
      await testCountLink.click();
      await driver.wait(
        until.urlContains(`/Dashboard/TestDetails/${patientId}`),
        10000,
        "Navigation to TestDetails failed"
      );
      await driver.navigate().back(); // Navigate back to the Test page
      await driver.wait(
        until.urlContains(`/Dashboard/Test`),
        5000,
        "Navigation back to Test page failed"
      );
    });
  });
});
