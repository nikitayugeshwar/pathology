const { Builder, By, until, WebDriver } = require("selenium-webdriver");
const assert = require("assert");

jest.setTimeout(60000); // Increased timeout for slower operations

describe("SuperAdmin User Detail Page Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173";
  const userDetailUrl = `${baseUrl}/superAdmin/userDetail/672f4c678fb689016c3d7042`; // Hardcoded user ID

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    try {
      await driver.get(`${baseUrl}/SuperAdminLogin`);

      // SuperAdmin Login Process (This is now done in beforeAll)
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
      console.error("Login failed:", error);
      throw error; // Re-throw to fail the test suite
    }
  });

  beforeEach(async () => {
    try {
      // Navigate to User Detail page before each test
      await driver.get(userDetailUrl);
      await driver.wait(
        until.elementLocated(By.className("h-screen")),
        10000,
        "User Detail page did not load"
      );
    } catch (error) {
      console.error("Navigation to User Detail failed:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("UI Element Verification", () => {
    test("TC_UD_001: Verify Page Load and Title", async () => {
      const userNameHeader = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[@class='w-full h-12 px-5 flex items-center bg-blue-200']/h1"
          )
        ),
        5000,
        "User name header not found"
      );
      const userName = await userNameHeader.getText();
      assert.ok(
        userName.includes("Nikita Yugeshwar"),
        "User name is not displayed correctly"
      );

      const currentUrl = await driver.getCurrentUrl();
      assert.equal(currentUrl, userDetailUrl, "URL is incorrect");
    });

    test("TC_UD_004: Verify User Status Display", async () => {
      const activeLabel = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//h1[contains(text(),'User Active') or contains(text(),'User Inactive')]"
          )
        ),
        5000,
        "User status label not found"
      );
      const activeText = await activeLabel.getText();
      const checkbox = await driver.findElement(
        By.css("input[type='checkbox']")
      );
      const isChecked = await checkbox.getAttribute("checked");

      //get initial active status.
      let initialActiveStatus = false;
      if (activeText.includes("Active")) {
        initialActiveStatus = true;
      }

      const expectedColor = initialActiveStatus
        ? "rgba(56, 189, 248, 1)"
        : "rgba(220, 38, 38, 1)"; // Tailwind colors
      const switchDiv = await driver.findElement(By.xpath("//label/div"));
      const actualColor = await switchDiv.getCssValue("background-color");

      assert.ok(
        activeText.includes("User"),
        "User status text is not displayed"
      );
      assert.equal(
        isChecked,
        initialActiveStatus.toString(),
        "Checkbox does not match user status"
      );
      //   assert.ok(
      //     actualColor.includes(expectedColor),
      //     `Color is incorrect. Expected ${expectedColor}, got ${actualColor}`
      //   );
    });
  });
});
