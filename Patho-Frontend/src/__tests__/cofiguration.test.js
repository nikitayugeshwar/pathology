const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Configuration Page Automation", () => {
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
    await driver.get(`${baseUrl}/Dashboard/Configuration`);
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
    test("Configuration heading is displayed", async () => {
      const heading = await driver.wait(
        until.elementLocated(By.xpath("//h1[text()='Configuration']")),
        5000
      );
      assert.ok(
        await heading.isDisplayed(),
        "Configuration heading should be displayed"
      );
    });

    test("Tests link/card is displayed with image and text", async () => {
      const testsLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[@href='/Dashboard/Tests']//div[contains(@class, 'shadow-2xl')]"
          )
        ),
        5000
      );
      assert.ok(
        await testsLink.isDisplayed(),
        "Tests link/card should be displayed"
      );

      const userImage = await testsLink.findElement(
        By.css("img[src*='user.png']")
      );
      assert.ok(
        await userImage.isDisplayed(),
        "User image should be displayed in Tests card"
      );

      const testsText = await testsLink.findElement(
        By.xpath(".//h1[text()='Tests']")
      );
      assert.ok(
        await testsText.isDisplayed(),
        "Tests text should be displayed in Tests card"
      );
    });

    test("Report Template Management link/card is displayed with image and text", async () => {
      const reportTemplateLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[@href='/Dashboard/ReportTempMan']//div[contains(@class, 'shadow-2xl')]"
          )
        ),
        5000
      );
      assert.ok(
        await reportTemplateLink.isDisplayed(),
        "Report Template Management link/card should be displayed"
      );

      const courseImage = await reportTemplateLink.findElement(
        By.css("img[src*='course.png']")
      );
      assert.ok(
        await courseImage.isDisplayed(),
        "Course image should be displayed in Report Template Management card"
      );

      const reportTemplateText = await reportTemplateLink.findElement(
        By.xpath(".//h1[text()='Report Template Mangement']")
      );
      assert.ok(
        await reportTemplateText.isDisplayed(),
        "Report Template Management text should be displayed"
      );
    });

    test("Social Media Integration link/card is displayed with image and text", async () => {
      const socialMediaLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[@href='/Dashboard/SocialmediaIntegration']//div[contains(@class, 'shadow-2xl')]"
          )
        ),
        5000
      );
      assert.ok(
        await socialMediaLink.isDisplayed(),
        "Social Media Integration link/card should be displayed"
      );

      const courseImage = await socialMediaLink.findElement(
        By.css("img[src*='course.png']")
      );
      assert.ok(
        await courseImage.isDisplayed(),
        "Course image should be displayed in Social Media Integration card"
      );

      const socialMediaText = await socialMediaLink.findElement(
        By.xpath(".//h1[text()='Social Media Integration']")
      );
      assert.ok(
        await socialMediaText.isDisplayed(),
        "Social Media Integration text should be displayed"
      );
    });

    test("Logging out... message is not displayed after successful authentication", async () => {
      const loggingOutMessage = await driver.findElements(
        By.xpath("//div[text()='Logging out...']")
      );
      assert.equal(
        loggingOutMessage.length,
        0,
        "Logging out... message should not be displayed"
      );
    });
  });

  describe("Functionality Tests", () => {
    test("Clicking 'Tests' card navigates to the Tests page", async () => {
      const testsLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/Tests']")
      );
      await testsLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Tests`),
        10000,
        "Navigation to Tests page failed"
      );
      await driver.navigate().back(); // Go back to Configuration page
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Configuration`),
        5000
      );
    });

    test("Clicking 'Report Template Mangement' card navigates to the Report Template Management page", async () => {
      const reportTemplateLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/ReportTempMan']")
      );
      await reportTemplateLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/ReportTempMan`),
        10000,
        "Navigation to Report Template Management page failed"
      );
      await driver.navigate().back(); // Go back to Configuration page
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Configuration`),
        5000
      );
    });

    test("Clicking 'Social Media Integration' card navigates to the Social Media Integration page", async () => {
      const socialMediaLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/SocialmediaIntegration']")
      );
      await socialMediaLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/SocialmediaIntegration`),
        10000,
        "Navigation to Social Media Integration page failed"
      );
      await driver.navigate().back(); // Go back to Configuration page
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Configuration`),
        5000
      );
    });
  });
});
