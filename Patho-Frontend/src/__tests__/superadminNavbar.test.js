const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

jest.setTimeout(60000); // Increased timeout, especially for animations and async operations

describe("SuperAdmin Layout Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173"; // Replace with your application's base URL
  const superAdminUrl = `${baseUrl}/SuperAdmin`;
  const loginUrl = `${baseUrl}/SuperAdminLogin`;
  const dashboardUrl = `${baseUrl}/superAdmin/dashboard`; // Add explicit dashboard URL

  // Login function
  async function login(driver, email, password) {
    await driver.get(loginUrl);
    await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      10000,
      "Email input not found"
    );
    const emailInput = await driver.findElement(By.css("input[type='email']"));
    await emailInput.sendKeys(email);
    const passwordInput = await driver.findElement(
      By.css("input[type='password']")
    );
    await passwordInput.sendKeys(password);
    const loginButton = await driver.findElement(
      By.xpath("//button[text()='Log In']")
    );
    await loginButton.click();
    await driver.wait(until.urlIs(superAdminUrl), 15000); // Wait for successful login
  }

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    // Perform login before all tests
    await login(driver, "nikitayugeshwar01@gmail.com", "123456"); // Use your test credentials here
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("SuperAdminLayout Component", () => {
    test("TC_SAL_001: Verify layout renders without errors when logged in", async () => {
      await driver.get(superAdminUrl);
      await driver.wait(until.elementLocated(By.className("flex")), 10000); // Wait for the main layout container
    });

    test("TC_SAL_002: Verify Sidenavbar is present", async () => {
      await driver.get(superAdminUrl);
      await driver.wait(
        until.elementLocated(By.className("lg:w-[257px]")),
        10000
      );
      const sidenav = await driver.findElement(By.className("lg:w-[257px]"));
      assert.ok(await sidenav.isDisplayed(), "Sidenavbar is not present");
    });

    test("TC_SAL_003: Verify UpperNavbar is present", async () => {
      await driver.get(superAdminUrl);
      await driver.wait(
        until.elementLocated(By.className("w-full relative h-20")),
        10000
      );
      const upperNavbar = await driver.findElement(
        By.className("w-full relative h-20")
      );
      assert.ok(await upperNavbar.isDisplayed(), "UpperNavbar is not present");
    });

    test("TC_SAL_004: Verify Outlet is present", async () => {
      await driver.get(superAdminUrl);
      await driver.wait(until.elementLocated(By.className("p-5")), 10000); // Wait for the Outlet container
      const outletContainer = await driver.findElement(By.className("p-5"));
      assert.ok(await outletContainer.isDisplayed(), "Outlet is not present");
    });

    // Mocking the axios call to simulate a successful authentication
    test("TC_SAL_005: Verify that the page doesn't redirect when user is authenticated", async () => {
      await driver.get(superAdminUrl);
      await driver.wait(
        until.urlIs(superAdminUrl),
        10000,
        "Should stay on superAdmin page"
      );
    });
  });

  describe("Sidenavbar Component", () => {
    test("TC_SNB_001: Verify component renders without errors", async () => {
      await driver.get(superAdminUrl);
      await driver.wait(
        until.elementLocated(By.className("lg:w-[257px]")),
        10000
      );
    });

    test("TC_SNB_002: Verify logo is displayed", async () => {
      await driver.get(superAdminUrl);
      const logoElement = await driver.findElement(By.css("img[alt='Logo']"));
      assert.ok(await logoElement.isDisplayed(), "Logo is not displayed");
    });

    test("TC_SNB_003: Verify 'User Management' link is displayed", async () => {
      await driver.get(superAdminUrl);
      const userManagementLink = await driver.findElement(
        By.xpath("//h1[text()='User Management']")
      );
      assert.ok(
        await userManagementLink.isDisplayed(),
        "'User Management' link is not displayed"
      );
    });

    test("TC_SNB_004: Verify dashboard icon is displayed", async () => {
      await driver.get(superAdminUrl);
      const dashboardIcon = await driver.findElement(
        By.css("img[alt='Dashboard']")
      );
      assert.ok(
        await dashboardIcon.isDisplayed(),
        "Dashboard icon is not displayed"
      );
    });

    test("TC_SNB_006: Verify 'User Management' link is selected after click", async () => {
      await driver.get(superAdminUrl);
      const userManagementLink = await driver.findElement(
        By.xpath("//h1[text()='User Management']")
      );
      const parentButton = await userManagementLink.findElement(By.xpath("..")); // Get the parent button

      await parentButton.click();
      const selectedButton = await driver.findElement(
        By.xpath("//button[contains(@class, 'bg-blue-900')]")
      );
      assert.ok(
        await selectedButton.isDisplayed(),
        "'User Management' link is not selected after click"
      );
    });
  });

  describe("UpperNavbar Component", () => {
    test("TC_UNB_001: Verify component renders without errors", async () => {
      await driver.get(superAdminUrl);
      await driver.wait(
        until.elementLocated(By.className("w-full relative h-20")),
        10000
      );
    });

    test("TC_UNB_002: Verify welcome message is displayed", async () => {
      await driver.get(superAdminUrl);
      await driver.wait(
        until.elementLocated(By.xpath("//h1[contains(text(),'Welcome')]")),
        10000
      );
      const welcomeMessage = await driver.findElement(
        By.xpath("//h1[contains(text(),'Welcome')]")
      );
      assert.ok(
        await welcomeMessage.isDisplayed(),
        "Welcome message is not displayed"
      );
    });

    test("TC_UNB_003: Verify notification icon is displayed", async () => {
      await driver.get(superAdminUrl);
      const notificationIcon = await driver.findElement(
        By.css("img[alt='Notification']")
      );
      assert.ok(
        await notificationIcon.isDisplayed(),
        "Notification icon is not displayed"
      );
    });

    test("TC_UNB_004: Verify user profile section is displayed", async () => {
      await driver.get(superAdminUrl);
      const profileSection = await driver.findElement(
        By.xpath(
          "//div[contains(@class, 'flex gap-5 items-center justify-center cursor-pointer')]"
        )
      );
      assert.ok(
        await profileSection.isDisplayed(),
        "User profile section is not displayed"
      );
    });

    test("TC_UNB_005: Verify that the username is displayed", async () => {
      await driver.get(superAdminUrl);
      const userNameElement = await driver.findElement(
        By.xpath("//h1[contains(@class, 'text-xl font-medium')]")
      );
      const userNameText = await userNameElement.getText();
      assert.notEqual(userNameText, "", "Username is not displayed");
    });
  });

  describe("Logout Component", () => {
    test("TC_LO_001: Verify logout functionality", async () => {
      await driver.get(superAdminUrl);

      // Open the logout dropdown
      const profileSection = await driver.findElement(
        By.xpath(
          "//div[contains(@class, 'flex gap-5 items-center justify-center cursor-pointer')]"
        )
      );
      await profileSection.click();
      await driver.wait(
        until.elementLocated(By.xpath("//button[text()='Logout']")),
        5000
      );

      // Find and click the logout button
      const logoutButton = await driver.findElement(
        By.xpath("//button[text()='Logout']")
      );
      await logoutButton.click();

      // Wait for navigation to the login page (or home page, depending on your app)
      await driver.wait(until.urlIs(`${baseUrl}/`), 10000); // Adjust the URL as needed
    });
  });
});
