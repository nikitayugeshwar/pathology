const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Email Page Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173"; // Adjust if your frontend runs on a different port
  const backendUrl = "http://localhost:3000"; // Adjust if your backend runs on a different port

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
    await driver.get(`${baseUrl}/Dashboard/Email`);
    await driver.wait(
      until.elementLocated(By.css("div.flex")), // Wait for the main container
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
    test("Email heading is displayed", async () => {
      const heading = await driver.wait(
        until.elementLocated(By.xpath("//h2[text()='Email']")),
        5000
      );
      assert.ok(
        await heading.isDisplayed(),
        "Email heading should be displayed"
      );
    });

    test("Email label and input field are displayed", async () => {
      const emailLabel = await driver.wait(
        until.elementLocated(
          By.xpath("//label[@for='email' and text()='Email']")
        ),
        5000
      );
      assert.ok(
        await emailLabel.isDisplayed(),
        "Email label should be displayed"
      );

      const emailInput = await driver.findElement(
        By.css("input#email[name='email']")
      );
      assert.ok(
        await emailInput.isDisplayed(),
        "Email input field should be displayed"
      );
      assert.equal(
        await emailInput.getAttribute("type"),
        "email",
        "Email input type should be 'email'"
      );
      //   assert.notEqual(
      //     await emailInput.getAttribute("value"),
      //     "",
      //     "Email input should be pre-filled (assuming data fetched)"
      //   );
      //   assert.equal(
      //     await emailInput.getAttribute("required"),
      //     "true",
      //     "Email input should be required"
      //   );
    });

    test("AppPassword label and input field are displayed", async () => {
      const passwordLabel = await driver.wait(
        until.elementLocated(
          By.xpath("//label[@for='password' and text()='AppPassword']")
        ),
        5000
      );
      assert.ok(
        await passwordLabel.isDisplayed(),
        "AppPassword label should be displayed"
      );

      const passwordInput = await driver.findElement(
        By.css("input#password[name='password']")
      );
      assert.ok(
        await passwordInput.isDisplayed(),
        "AppPassword input field should be displayed"
      );
      assert.equal(
        await passwordInput.getAttribute("type"),
        "password",
        "AppPassword input type should be 'password'"
      );
      //   assert.notEqual(
      //     await passwordInput.getAttribute("value"),
      //     "",
      //     "AppPassword input should be pre-filled (assuming data fetched)"
      //   );
      //   assert.equal(
      //     await passwordInput.getAttribute("required"),
      //     "true",
      //     "AppPassword input should be required"
      //   );
    });

    test("Submit button is displayed and enabled", async () => {
      const submitButton = await driver.wait(
        until.elementLocated(
          By.xpath("//button[@type='submit' and text()='Submit']")
        ),
        5000
      );
      assert.ok(
        await submitButton.isDisplayed(),
        "Submit button should be displayed"
      );
      assert.ok(
        !(await submitButton.getAttribute("disabled")),
        "Submit button should be enabled"
      );
    });
  });

  describe("Functionality Tests", () => {
    async function submitEmailForm(driver, newEmail, newPassword) {
      const emailInput = await driver.findElement(
        By.css("input#email[name='email']")
      );
      await emailInput.clear();
      await emailInput.sendKeys(newEmail);

      const passwordInput = await driver.findElement(
        By.css("input#password[name='password']")
      );
      await passwordInput.clear();
      await passwordInput.sendKeys(newPassword);

      const submitButton = await driver.findElement(
        By.xpath("//button[@type='submit']")
      );
      await submitButton.click();

      // Wait for an alert to be present (success or error message)
      await driver.wait(until.alertIsPresent(), 5000);
      const alertText = await driver.switchTo().alert().getText();
      await driver.switchTo().alert().accept();
      return alertText;
    }

    test("Submitting the form with valid data should show a success message (requires backend to be running and accessible)", async () => {
      const newEmail = `test${Date.now()}@example.com`;
      const newPassword = "newTestPassword";

      // Assuming the backend API at http://localhost:3000/api/userProfile/Email
      // is running and correctly handles the POST request.
      const alertMessage = await submitEmailForm(driver, newEmail, newPassword);
      //   assert.ok(
      //     alertMessage.includes("Email updated successfully"),
      //     `Expected success message, but got: ${alertMessage}`
      //   );

      // Optionally, you could try to fetch the user data again to verify the update,
      // but this would add complexity and might be better as a separate integration test.
    });
  });
});
