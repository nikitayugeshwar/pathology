const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Sidenavbar Component Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173"; // Adjust if needed

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
      // Login before all tests in this suite
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
    test("Dashboard link is displayed with correct image and text after login", async () => {
      const dashboardLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard']")
      );
      assert.ok(
        await dashboardLink.isDisplayed(),
        "Dashboard link should be displayed"
      );

      const dashboardImage = await dashboardLink.findElement(
        By.css("img[alt='Dashboard']")
      );
      assert.ok(
        await dashboardImage.isDisplayed(),
        "Dashboard image should be displayed"
      );

      const dashboardText = await dashboardLink.findElement(
        By.xpath(".//h1[text()='Dashboard']")
      );
      assert.ok(
        await dashboardText.isDisplayed(),
        "Dashboard text should be displayed"
      );
    });

    test("Test link is displayed with correct image and text after login", async () => {
      const testLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/Test']")
      );
      assert.ok(await testLink.isDisplayed(), "Test link should be displayed");

      const testImage = await testLink.findElement(By.css("img[alt='Exam']"));
      assert.ok(
        await testImage.isDisplayed(),
        "Test image should be displayed"
      );

      const testText = await testLink.findElement(
        By.xpath(".//h1[text()='Test']")
      );
      assert.ok(await testText.isDisplayed(), "Test text should be displayed");
    });

    test("Report link is displayed with correct image and text after login", async () => {
      const reportLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/Report']")
      );
      assert.ok(
        await reportLink.isDisplayed(),
        "Report link should be displayed"
      );

      const reportImage = await reportLink.findElement(
        By.css("img[alt='Result']")
      );
      assert.ok(
        await reportImage.isDisplayed(),
        "Report image should be displayed"
      );

      const reportText = await reportLink.findElement(
        By.xpath(".//h1[text()='Report']")
      );
      assert.ok(
        await reportText.isDisplayed(),
        "Report text should be displayed"
      );
    });

    test("Configuration link is displayed with correct image and text after login", async () => {
      const configurationLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/configuration']")
      );
      assert.ok(
        await configurationLink.isDisplayed(),
        "Configuration link should be displayed"
      );

      const configurationImage = await configurationLink.findElement(
        By.css("img[alt='Configuration']")
      );
      assert.ok(
        await configurationImage.isDisplayed(),
        "Configuration image should be displayed"
      );

      const configurationText = await configurationLink.findElement(
        By.xpath(".//h1[text()='Configuration']")
      );
      assert.ok(
        await configurationText.isDisplayed(),
        "Configuration text should be displayed"
      );
    });
  });

  describe("Functionality Tests", () => {
    test("Clicking on Dashboard link navigates to Dashboard page", async () => {
      const dashboardLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard']")
      );
      await dashboardLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard`),
        5000,
        "Navigation to Dashboard page failed"
      );
    });

    test("Clicking on Patient link navigates to Patient page", async () => {
      const patientLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/Patient']")
      );
      await patientLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Patient`),
        5000,
        "Navigation to Patient page failed"
      );
    });

    test("Clicking on Test link navigates to Test page", async () => {
      const testLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/Test']")
      );
      await testLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Test`),
        5000,
        "Navigation to Test page failed"
      );
    });

    test("Clicking on Report link navigates to Report page", async () => {
      const reportLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/Report']")
      );
      await reportLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Report`),
        5000,
        "Navigation to Report page failed"
      );
    });

    test("Clicking on Configuration link navigates to Configuration page", async () => {
      const configurationLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/configuration']")
      );
      await configurationLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/configuration`),
        5000,
        "Navigation to Configuration page failed"
      );
    });
  });
});
