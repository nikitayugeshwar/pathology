const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

jest.setTimeout(30000);

describe("ForgotPass Component Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173/ForgotPass"; //  Replace with your actual URL

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await driver.get(baseUrl);
      await driver.wait(
        until.elementLocated(By.className("h-screen")), // Wait for the main container
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
    test("Forgot Password heading is displayed initially", async () => {
      const heading = await driver.findElement(
        By.xpath("//h1[text()='Forgot Password']")
      );
      assert.ok(
        await heading.isDisplayed(),
        "Forgot Password heading should be displayed"
      );
    });

    test("Email or Mobile Number input field is displayed initially", async () => {
      const input = await driver.findElement(
        By.css("input[placeholder='Enter your email or mobile number']")
      );
      assert.ok(
        await input.isDisplayed(),
        "Email or Mobile Number input field should be displayed"
      );
      assert.equal(
        await input.getAttribute("required"),
        "true",
        "Email or Mobile Number input should be required"
      );
    });

    test("Send OTP button is displayed initially", async () => {
      const sendOtpButton = await driver.findElement(
        By.xpath("//button[text()='Send OTP']")
      );
      assert.ok(
        await sendOtpButton.isDisplayed(),
        "Send OTP button should be displayed"
      );
    });

    test("OTP input field is not displayed initially", async () => {
      const otpInputElements = await driver.findElements(
        By.css("input[placeholder='Enter the OTP']")
      );
      assert.equal(
        otpInputElements.length,
        0,
        "OTP input field should not be displayed initially"
      );
    });

    test("Verify OTP button is not displayed initially", async () => {
      const verifyOtpButtonElements = await driver.findElements(
        By.xpath("//button[text()='Verify OTP']")
      );
      assert.equal(
        verifyOtpButtonElements.length,
        0,
        "Verify OTP button should not be displayed initially"
      );
    });

    test("Error message is not displayed initially", async () => {
      const errorElements = await driver.findElements(
        By.className("text-red-500")
      );
      assert.equal(
        errorElements.length,
        0,
        "Error message should not be visible initially"
      );
    });
  });
});
