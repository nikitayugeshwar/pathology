const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("SuperAdminForgotPass Page Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173/SuperAdminForgotPass";

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await driver.get(baseUrl);
      await driver.wait(
        until.elementLocated(By.css("div.h-screen")), // Wait for the main container
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

  describe("Initial UI Elements and State", () => {
    test("Forgot Password heading is displayed", async () => {
      const heading = await driver.findElement(
        By.xpath("//h1[text()='Forgot Password']")
      );
      assert.ok(
        await heading.isDisplayed(),
        "Forgot Password heading should be displayed"
      );
    });

    test("Email or Mobile Number label and input field are displayed", async () => {
      const label = await driver.findElement(
        By.xpath("//h1[text()='Email or Mobile Number']")
      );
      assert.ok(
        await label.isDisplayed(),
        "Email or Mobile Number label should be displayed"
      );

      const input = await driver.findElement(
        By.css(
          "input[type='text'][placeholder='Enter your email or mobile number']"
        )
      );
      assert.ok(
        await input.isDisplayed(),
        "Email or Mobile Number input field should be displayed"
      );
      assert.equal(
        await input.getAttribute("required"),
        "true",
        "Input field should be required"
      );
    });

    test("Send OTP button is displayed and enabled", async () => {
      const button = await driver.findElement(
        By.xpath("//button[text()='Send OTP']")
      );
      assert.ok(
        await button.isDisplayed(),
        "Send OTP button should be displayed"
      );
      assert.ok(
        !(await button.getAttribute("disabled")),
        "Send OTP button should be enabled"
      );
    });

    test("Error message is not displayed initially", async () => {
      const errorElement = await driver.findElements(
        By.className("text-red-500")
      );
      assert.equal(
        errorElement.length,
        0,
        "Error message should not be visible initially"
      );
    });
  });
});
