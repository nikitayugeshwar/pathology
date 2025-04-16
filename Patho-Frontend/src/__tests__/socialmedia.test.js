const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Social Media Integration Page Automation", () => {
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
    await driver.get(`${baseUrl}/Dashboard/SocialmediaIntegration`);
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
    test("Social Media Integration heading is displayed", async () => {
      const heading = await driver.wait(
        until.elementLocated(
          By.xpath("//h1[text()='Social Media Integration']")
        ),
        5000
      );
      assert.ok(
        await heading.isDisplayed(),
        "Social Media Integration heading should be displayed"
      );
    });

    test("Email link/card is displayed with image, icon, and text", async () => {
      const emailLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[@href='/Dashboard/Email']//div[contains(@class, 'shadow-2xl')]"
          )
        ),
        5000
      );
      assert.ok(
        await emailLink.isDisplayed(),
        "Email link/card should be displayed"
      );

      const userImage = await emailLink.findElement(
        By.css("img[src*='user.png']")
      );
      assert.ok(
        await userImage.isDisplayed(),
        "User image should be displayed in Email card"
      );

      const emailIcon = await emailLink.findElement(
        By.css("[data-testid='MdOutlineMail']")
      );
      assert.ok(
        await emailIcon.isDisplayed(),
        "Email icon should be displayed in Email card"
      );

      const emailText = await emailLink.findElement(
        By.xpath(".//h1[text()='Email']")
      );
      assert.ok(
        await emailText.isDisplayed(),
        "Email text should be displayed in Email card"
      );
    });

    test("Twilio link/card is displayed with image, icon, and text", async () => {
      const twilioLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[@href='/Dashboard/Twilio']//div[contains(@class, 'shadow-2xl')]"
          )
        ),
        5000
      );
      assert.ok(
        await twilioLink.isDisplayed(),
        "Twilio link/card should be displayed"
      );

      const courseImage = await twilioLink.findElement(
        By.css("img[src*='course.png']")
      );
      assert.ok(
        await courseImage.isDisplayed(),
        "Course image should be displayed in Twilio card"
      );

      const twilioIcon = await twilioLink.findElement(
        By.css("[data-testid='SiTwilio']")
      );
      assert.ok(
        await twilioIcon.isDisplayed(),
        "Twilio icon should be displayed in Twilio card"
      );

      const twilioText = await twilioLink.findElement(
        By.xpath(".//h1[text()='Twilio']")
      );
      assert.ok(
        await twilioText.isDisplayed(),
        "Twilio text should be displayed in Twilio card"
      );
    });

    test("Whatsapp link/card is displayed with image, icon, and text", async () => {
      const whatsappLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[@href='/Dashboard/ReportTempMan']//div[contains(@class, 'shadow-2xl')]"
          )
        ),
        5000
      );
      assert.ok(
        await whatsappLink.isDisplayed(),
        "Whatsapp link/card should be displayed"
      );

      const courseImage = await whatsappLink.findElement(
        By.css("img[src*='course.png']")
      );
      assert.ok(
        await courseImage.isDisplayed(),
        "Course image should be displayed in Whatsapp card"
      );

      const whatsappIcon = await whatsappLink.findElement(
        By.css("[data-testid='ImWhatsapp']")
      );
      assert.ok(
        await whatsappIcon.isDisplayed(),
        "Whatsapp icon should be displayed in Whatsapp card"
      );

      const whatsappText = await whatsappLink.findElement(
        By.xpath(".//h1[text()='Whatsapp']")
      );
      assert.ok(
        await whatsappText.isDisplayed(),
        "Whatsapp text should be displayed in Whatsapp card"
      );
    });

    test("Logging out... message is not displayed after successful authentication", async () => {
      const loggingOutMessage = await driver.findElements(
        By.css("[data-testid='Logging out...']")
      );
      assert.equal(
        loggingOutMessage.length,
        0,
        "Logging out... message should not be displayed"
      );
    });
  });

  describe("Functionality Tests", () => {
    test("Clicking 'Email' card navigates to the Email page", async () => {
      const emailLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/Email']")
      );
      await emailLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Email`),
        10000,
        "Navigation to Email page failed"
      );
      await driver.navigate().back(); // Go back to Social Media Integration page
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/SocialmediaIntegration`),
        5000
      );
    });

    test("Clicking 'Twilio' card navigates to the Twilio page", async () => {
      const twilioLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/Twilio']")
      );
      await twilioLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/Twilio`),
        10000,
        "Navigation to Twilio page failed"
      );
      await driver.navigate().back(); // Go back to Social Media Integration page
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/SocialmediaIntegration`),
        5000
      );
    });

    test("Clicking 'Whatsapp' card navigates to the Report Template Management page", async () => {
      const whatsappLink = await driver.findElement(
        By.xpath("//a[@href='/Dashboard/ReportTempMan']")
      );
      await whatsappLink.click();
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/ReportTempMan`),
        10000,
        "Navigation to Report Template Management page failed"
      );
      await driver.navigate().back(); // Go back to Social Media Integration page
      await driver.wait(
        until.urlIs(`${baseUrl}/Dashboard/SocialmediaIntegration`),
        5000
      );
    });
  });
});
