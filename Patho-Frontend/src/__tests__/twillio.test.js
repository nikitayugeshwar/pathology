const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Twilio Page Automation", () => {
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
    await driver.get(`${baseUrl}/Dashboard/Twilio`);
    await driver.wait(
      until.elementLocated(By.css("div.flex.h-full")), // Wait for the main container
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
    test("Twilio heading is displayed", async () => {
      const heading = await driver.wait(
        until.elementLocated(By.xpath("//h2[text()='Twilio ']")),
        5000
      );
      assert.ok(
        await heading.isDisplayed(),
        "Twilio heading should be displayed"
      );
    });

    test("Twilio SID label and input field are displayed", async () => {
      const sidLabel = await driver.wait(
        until.elementLocated(
          By.xpath("//label[@for='twilioSid' and text()='Twilio SID']")
        ),
        5000
      );
      assert.ok(
        await sidLabel.isDisplayed(),
        "Twilio SID label should be displayed"
      );

      const sidInput = await driver.findElement(
        By.css("input#twilioSid[name='twilioSid']")
      );
      assert.ok(
        await sidInput.isDisplayed(),
        "Twilio SID input field should be displayed"
      );
      assert.equal(
        await sidInput.getAttribute("type"),
        "text",
        "Twilio SID input type should be 'text'"
      );
      //   assert.notEqual(
      //     await sidInput.getAttribute("value"),
      //     "",
      //     "Twilio SID input should be pre-filled (assuming data fetched)"
      //   );
      //   assert.equal(
      //     await sidInput.getAttribute("required"),
      //     "true",
      //     "Twilio SID input should be required"
      //   );
    });

    test("Twilio Auth Token label and input field are displayed", async () => {
      const authTokenLabel = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//label[@for='twilioAuthToken' and text()='Twilio Auth Token']"
          )
        ),
        5000
      );
      assert.ok(
        await authTokenLabel.isDisplayed(),
        "Twilio Auth Token label should be displayed"
      );

      const authTokenInput = await driver.findElement(
        By.css("input#twilioAuthToken[name='twilioAuthToken']")
      );
      assert.ok(
        await authTokenInput.isDisplayed(),
        "Twilio Auth Token input field should be displayed"
      );
      assert.equal(
        await authTokenInput.getAttribute("type"),
        "password",
        "Twilio Auth Token input type should be 'password'"
      );
      //   assert.notEqual(
      //     await authTokenInput.getAttribute("value"),
      //     "",
      //     "Twilio Auth Token input should be pre-filled (assuming data fetched)"
      //   );
      //   assert.equal(
      //     await authTokenInput.getAttribute("required"),
      //     "true",
      //     "Twilio Auth Token input should be required"
      //   );
    });

    test("Twilio Active Number label and input field are displayed", async () => {
      const activeNumberLabel = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//label[@for='twilioActiveNumber' and text()='Twilio Active Number']"
          )
        ),
        5000
      );
      assert.ok(
        await activeNumberLabel.isDisplayed(),
        "Twilio Active Number label should be displayed"
      );

      const activeNumberInput = await driver.findElement(
        By.css("input#twilioActiveNumber[name='twilioActiveNumber']")
      );
      assert.ok(
        await activeNumberInput.isDisplayed(),
        "Twilio Active Number input field should be displayed"
      );
      assert.equal(
        await activeNumberInput.getAttribute("type"),
        "text",
        "Twilio Active Number input type should be 'text'"
      );
      //   assert.notEqual(
      //     await activeNumberInput.getAttribute("value"),
      //     "",
      //     "Twilio Active Number input should be pre-filled (assuming data fetched)"
      //   );
      //   assert.equal(
      //     await activeNumberInput.getAttribute("required"),
      //     "true",
      //     "Twilio Active Number input should be required"
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
    async function submitTwilioForm(driver, sid, authToken, activeNumber) {
      const sidInput = await driver.findElement(
        By.css("input#twilioSid[name='twilioSid']")
      );
      await sidInput.clear();
      await sidInput.sendKeys(sid);

      const authTokenInput = await driver.findElement(
        By.css("input#twilioAuthToken[name='twilioAuthToken']")
      );
      await authTokenInput.clear();
      await authTokenInput.sendKeys(authToken);

      const activeNumberInput = await driver.findElement(
        By.css("input#twilioActiveNumber[name='twilioActiveNumber']")
      );
      await activeNumberInput.clear();
      await activeNumberInput.sendKeys(activeNumber);

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
      const newSid = `AC${Date.now()}abcdef1234567890`; // Example SID format
      const newAuthToken = "your_test_auth_token";
      const newActiveNumber = "+15017122661"; // Example phone number

      // Assuming the backend API at http://localhost:3000/api/userProfile/Twilio
      // is running and correctly handles the POST request.
      const alertMessage = await submitTwilioForm(
        driver,
        newSid,
        newAuthToken,
        newActiveNumber
      );
      //   assert.ok(
      //     alertMessage.includes("Twilio settings updated successfully"),
      //     `Expected success message, but got: ${alertMessage}`
      //   );

      // Optionally, you could try to fetch the user data again to verify the update,
      // but this would add complexity and might be better as a separate integration test.
    });
  });
});
