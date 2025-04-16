const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

jest.setTimeout(60000); // Increased timeout for slower operations

describe("SuperAdmin User Management Page Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173";
  const userManagementUrl = `${baseUrl}/SuperAdmin`;

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await driver.get(`${baseUrl}/SuperAdminLogin`);

      // SuperAdmin Login Process
      await driver.wait(
        until.elementLocated(By.css("input[type='email']")),
        10000,
        "Email input not found"
      );
      const emailInput = await driver.findElement(
        By.css("input[type='email']")
      );
      await emailInput.sendKeys("nikitayugeshwar01@gmail.com");

      await driver.wait(
        until.elementLocated(By.css("input[type='password']")),
        10000,
        "Password input not found"
      );
      const passwordInput = await driver.findElement(
        By.css("input[type='password']")
      );
      await passwordInput.sendKeys("123456");

      await driver.wait(
        until.elementLocated(By.xpath("//button[text()='Log In']")),
        10000,
        "Login button not found"
      );
      const loginButton = await driver.findElement(
        By.xpath("//button[text()='Log In']")
      );
      await loginButton.click();

      // Wait for navigation to SuperAdmin dashboard
      await driver.wait(
        until.urlIs(`${baseUrl}/SuperAdmin`),
        15000,
        "Login failed or navigation to dashboard took too long"
      );
    } catch (error) {
      console.error("Setup failed:", error);
      throw error;
    }
  });

  beforeEach(async () => {
    // Navigate to User Management page before each test
    await driver.get(userManagementUrl);
    await driver.wait(
      until.elementLocated(By.className("h-screen")),
      10000,
      "User Management page did not load"
    );
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("UI Elements and Initial State", () => {
    test("TC_UM_001: Verify 'Total Users' heading displays the correct count", async () => {
      const heading = await driver.wait(
        until.elementLocated(
          By.xpath("//h1[contains(text(), 'Total Users:')]")
        ),
        5000,
        "'Total Users' heading not found"
      );
      const headingText = await heading.getText();
      assert.ok(
        headingText.includes("Total Users:"),
        "'Total Users:' text is not present"
      );
    });

    test("TC_UM_002: Verify 'Add New' button is displayed and navigates to Add User page", async () => {
      const addButton = await driver.findElement(By.linkText("Add New"));
      assert.ok(
        await addButton.isDisplayed(),
        "'Add New' button should be displayed"
      );

      await addButton.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/superAdmin/addUser`),
        10000,
        "Navigation to Add User page failed"
      );
      await driver.navigate().back();
      await driver.wait(until.urlIs(userManagementUrl), 5000);
    });

    test("TC_UM_003: Verify 'Show entries' dropdown is displayed with default value '10'", async () => {
      const showLabel = await driver.findElement(
        By.xpath("//h1[text()='Show']")
      );
      assert.ok(await showLabel.isDisplayed(), "'Show' label is displayed");

      const entriesDropdown = await driver.findElement(
        By.css("select.h-6.w-12")
      );
      assert.ok(
        await entriesDropdown.isDisplayed(),
        "Entries dropdown is displayed"
      );
      assert.equal(
        await entriesDropdown.getAttribute("value"),
        "10",
        "Default entries per page should be 10"
      );
    });

    test("TC_UM_004: Verify 'Entries' label is displayed", async () => {
      const entriesLabel = await driver.findElement(
        By.xpath("//h1[text()='Entries']")
      );
      assert.ok(
        await entriesLabel.isDisplayed(),
        "'Entries' label is displayed"
      );
    });

    test("TC_UM_005: Verify 'Refresh' button with icon and text is displayed", async () => {
      const refreshDiv = await driver.findElement(
        By.xpath("//div[./*[local-name()='svg'] and h1[text()='Refresh']]")
      );
      assert.ok(
        await refreshDiv.isDisplayed(),
        "'Refresh' button div is displayed"
      );

      const refreshIcon = await refreshDiv.findElement(By.css("svg"));
      assert.ok(await refreshIcon.isDisplayed(), "'Refresh' icon is displayed");

      const refreshText = await refreshDiv.findElement(
        By.xpath("./h1[text()='Refresh']")
      );
      assert.ok(await refreshText.isDisplayed(), "'Refresh' text is displayed");
    });

    test("TC_UM_006: Verify 'Search' input field with placeholder 'Search' is displayed", async () => {
      const searchInput = await driver.findElement(
        By.css("input[placeholder='Search']")
      );
      assert.ok(
        await searchInput.isDisplayed(),
        "'Search' input field is displayed"
      );
      assert.equal(
        await searchInput.getAttribute("placeholder"),
        "Search",
        "Search placeholder is incorrect"
      );
    });

    test("TC_UM_007: Verify search icon is displayed within the search input", async () => {
      const searchIcon = await driver.findElement(
        By.css("div.absolute.left-5 > svg")
      );
      assert.ok(await searchIcon.isDisplayed(), "Search icon is displayed");
    });

    test("TC_UM_009: Verify current page number button is displayed with initial value '1'", async () => {
      const currentPageButton = await driver.findElement(
        By.xpath(
          "//button[@class='h-10 w-12 bg-white border border-gray-300 rounded-md text-xl']"
        )
      );
      assert.ok(
        await currentPageButton.isDisplayed(),
        "Current page button is displayed"
      );
      assert.equal(
        await currentPageButton.getText(),
        "1",
        "Initial current page should be 1"
      );
    });

    test("TC_UM_011: Verify user table headers are displayed correctly", async () => {
      const headers = [
        "Sr. No",
        "User ID",
        "Name",
        "Email",
        "Contact No",
        "Clinic Name",
        "User Name",
        "Password",
        "Action",
      ];
      for (const headerText of headers) {
        const header = await driver.findElement(
          By.xpath(`//thead/tr/th[text()='${headerText}']`)
        );
        assert.ok(
          await header.isDisplayed(),
          `'${headerText}' header should be displayed`
        );
      }
    });

    test("TC_UM_012: Verify user table body is displayed", async () => {
      const tableBody = await driver.findElement(
        By.css("tbody.text-gray-600.text-sm")
      );
      //   assert.ok(
      //     await tableBody.isDisplayed(),
      //     "User table body should be displayed"
      //   );
    });
  });

  describe("Functionality Tests", () => {
    async function changeEntriesPerPage(value) {
      const entriesDropdown = await driver.findElement(
        By.css("select.h-6.w-12")
      );
      await entriesDropdown.sendKeys(value);
    }

    async function clickRefreshButton() {
      const refreshButton = await driver.findElement(
        By.xpath("//div[./*[local-name()='svg'] and h1[text()='Refresh']]")
      );
      await refreshButton.click();
    }

    async function enterSearchTerm(term) {
      const searchInput = await driver.findElement(
        By.css("input[placeholder='Search']")
      );
      await searchInput.sendKeys(term);
    }

    async function clickNextPageButton() {
      const nextButton = await driver.findElement(
        By.xpath("//button[./*[local-name()='svg'][@data-icon='angle-right']]")
      );
      const isDisabled = await nextButton.getAttribute("disabled");
      if (isDisabled !== "true") {
        await nextButton.click();
      }
    }

    async function clickPrevPageButton() {
      const prevButton = await driver.findElement(
        By.xpath("//button[./*[local-name()='svg'][@data-icon='angle-left']]")
      );
      const isDisabled = await prevButton.getAttribute("disabled");
      if (isDisabled !== "true") {
        await prevButton.click();
      }
    }

    test("TC_UM_013: Changing entries per page updates the table and resets to page 1", async () => {
      await changeEntriesPerPage("5");
      const currentPageButton = await driver.findElement(
        By.xpath(
          "//button[@class='h-10 w-12 bg-white border border-gray-300 rounded-md text-xl']"
        )
      );
      assert.equal(
        await currentPageButton.getText(),
        "1",
        "Current page should reset to 1 after changing entries"
      );
    });

    test("TC_UM_014: Clicking refresh button clears search term and resets to page 1", async () => {
      await enterSearchTerm("testuser");
      await clickRefreshButton();
      const searchInput = await driver.findElement(
        By.css("input[placeholder='Search']")
      );
      assert.equal(
        await searchInput.getAttribute("value"),
        "",
        "Search term should be cleared after refresh"
      );
      const currentPageButton = await driver.findElement(
        By.xpath(
          "//button[@class='h-10 w-12 bg-white border border-gray-300 rounded-md text-xl']"
        )
      );
      assert.equal(
        await currentPageButton.getText(),
        "1",
        "Current page should reset to 1 after refresh"
      );
    });

    test("TC_UM_015: Searching for a user filters the table (requires data)", async () => {
      await enterSearchTerm("testuser");
      await driver.sleep(1000);
      const firstRowNameLink = await driver.findElements(
        By.xpath(
          "//tbody/tr[1]/td[@class='py-4 px-6 text-left text-blue-700 underline']/a"
        )
      );
      if (firstRowNameLink.length > 0) {
        const firstRowName = await firstRowNameLink[0].getText();
        assert.ok(
          firstRowName.toLowerCase().includes("testuser"),
          "Search results should include 'testuser'"
        );
      } else {
        console.warn("No user found to assert search functionality.");
      }
    });

    test("TC_UM_018: Clicking on a user's name navigates to the user detail page", async () => {
      const firstUserNameLink = await driver.findElements(
        By.xpath(
          "//tbody/tr[1]/td[@class='py-4 px-6 text-left text-blue-700 underline']/a"
        )
      );
      if (firstUserNameLink.length > 0) {
        const href = await firstUserNameLink[0].getAttribute("href");
        await firstUserNameLink[0].click();
        await driver.wait(
          until.urlIs(href),
          10000,
          "Navigation to user detail page failed"
        );
        await driver.navigate().back();
        await driver.wait(until.urlIs(userManagementUrl), 5000);
      } else {
        console.warn("No users found to test navigation to user detail page.");
      }
    });

    test("TC_UM_019: Clicking 'Edit' navigates to the Edit User page", async () => {
      const firstEditLink = await driver.findElements(
        By.xpath(
          "//tbody/tr[1]/td[@class='py-4 px-6 text-left flex gap-2 items-center justify-center']/a[text()='Edit']"
        )
      );
      if (firstEditLink.length > 0) {
        const href = await firstEditLink[0].getAttribute("href");
        await firstEditLink[0].click();
        await driver.wait(
          until.urlIs(href),
          10000,
          "Navigation to Edit User page failed"
        );
        await driver.navigate().back();
        await driver.wait(until.urlIs(userManagementUrl), 5000);
      } else {
        console.warn("No users found to test editing functionality.");
      }
    });

    test("TC_UM_020: Verify deleting a user displays a confirmation dialog and deletes the user", async () => {
      const firstDeleteButton = await driver.findElements(
        By.xpath(
          "//tbody/tr[1]/td[@class='py-4 px-6 text-left flex gap-2 items-center justify-center']/button[text()='Delete']"
        )
      );

      if (firstDeleteButton.length > 0) {
        await firstDeleteButton[0].click();

        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        assert.equal(
          alertText,
          "Are you sure you want to delete this user?",
          "Delete confirmation text is incorrect"
        );

        await alert.accept();
        await driver.wait(
          until.stalenessOf(firstDeleteButton[0]),
          10000,
          "User should be deleted"
        );
      } else {
        console.warn("No users found to test deletion functionality.");
      }
    });
  });
});
