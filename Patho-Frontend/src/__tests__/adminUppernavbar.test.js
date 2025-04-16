const { Builder, By, until, Key } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds - adjust if needed for your environment

describe("UpperNavbar Component Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173"; //  Replace with the actual URL of your application

  // Login function (same as provided)
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
      // Login before all tests
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
    test("Welcome message is displayed with user name after login", async () => {
      const welcomeMessage = await driver.findElement(
        By.xpath("//h1[contains(text(),'Welcome')]")
      );
      assert.ok(
        await welcomeMessage.isDisplayed(),
        "Welcome message should be displayed"
      );
      // You could also check for the user's name, but it depends on your test data
    });

    test("User profile image is displayed", async () => {
      const profileImage = await driver.findElement(
        By.css("img[alt='Profile']")
      );
      assert.ok(
        await profileImage.isDisplayed(),
        "Profile image should be displayed"
      );
    });

    test("Logout dropdown is not open initially", async () => {
      const logoutDropdown = await driver.findElements(
        By.xpath("//div[text()='Logout']")
      );
      assert.equal(
        logoutDropdown.length,
        0,
        "Logout dropdown should not be open initially"
      );
    });
  });
});
