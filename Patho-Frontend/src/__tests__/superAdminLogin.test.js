const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("SuperAdminLogin Page Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173/SuperAdminLogin";

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await driver.get(baseUrl);
      await driver.wait(
        until.elementLocated(By.css("form.flex.w-full")), // Wait for the main form
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
    test("Login image is displayed", async () => {
      const loginImage = await driver.findElement(
        By.css("img[src*='login.png']")
      );
      assert.ok(
        await loginImage.isDisplayed(),
        "Login image should be displayed"
      );
    });

    test("Welcome Back heading is displayed", async () => {
      const welcomeHeading = await driver.findElement(
        By.xpath("//h1[text()='Welcome Back']")
      );
      assert.ok(
        await welcomeHeading.isDisplayed(),
        "Welcome Back heading should be displayed"
      );
    });

    test("SuperAdmin Log In Screen heading is displayed", async () => {
      const loginScreenHeading = await driver.findElement(
        By.xpath("//h1[text()='SuperAdmin Log In Screen']")
      );
      assert.ok(
        await loginScreenHeading.isDisplayed(),
        "SuperAdmin Log In Screen heading should be displayed"
      );
    });

    test("Email label and input field are displayed", async () => {
      const emailLabel = await driver.findElement(
        By.xpath("//h1[text()='Email']")
      );
      assert.ok(
        await emailLabel.isDisplayed(),
        "Email label should be displayed"
      );

      const emailInput = await driver.findElement(
        By.css("input[type='email']")
      );
      assert.ok(
        await emailInput.isDisplayed(),
        "Email input field should be displayed"
      );
      assert.equal(
        await emailInput.getAttribute("placeholder"),
        "Type here..",
        "Email placeholder is incorrect"
      );
      assert.equal(
        await emailInput.getAttribute("required"),
        "true",
        "Email input should be required"
      );
    });

    test("Password label and input field are displayed", async () => {
      const passwordLabel = await driver.findElement(
        By.xpath("//h1[text()='Password']")
      );
      assert.ok(
        await passwordLabel.isDisplayed(),
        "Password label should be displayed"
      );

      const passwordInput = await driver.findElement(
        By.css("input[type='password']")
      );
      assert.ok(
        await passwordInput.isDisplayed(),
        "Password input field should be displayed"
      );
      assert.equal(
        await passwordInput.getAttribute("placeholder"),
        "Type here..",
        "Password placeholder is incorrect"
      );
      assert.equal(
        await passwordInput.getAttribute("required"),
        "true",
        "Password input should be required"
      );
    });

    // test("Password visibility toggle button is displayed", async () => {
    //   const toggleButton = await driver.findElement(
    //     By.css("button[type='button'][onClick]")
    //   );
    //   assert.ok(
    //     await toggleButton.isDisplayed(),
    //     "Password visibility toggle button should be displayed"
    //   );
    // });

    test("Remember Me checkbox and label are displayed", async () => {
      const rememberCheckbox = await driver.findElement(
        By.css("input[type='checkbox']")
      );
      assert.ok(
        await rememberCheckbox.isDisplayed(),
        "Remember Me checkbox should be displayed"
      );

      const rememberLabel = await driver.findElement(
        By.xpath("//h1[text()='Remember Me']")
      );
      assert.ok(
        await rememberLabel.isDisplayed(),
        "Remember Me label should be displayed"
      );
    });

    test("Forget Password link is displayed and navigates to the correct page", async () => {
      const forgetPasswordLink = await driver.findElement(
        By.linkText("Forget Password?")
      );
      assert.ok(
        await forgetPasswordLink.isDisplayed(),
        "Forget Password link should be displayed"
      );

      await forgetPasswordLink.click();
      await driver.wait(
        until.urlIs(
          `${baseUrl.replace("/SuperAdminLogin", "")}/SuperAdminForgotPass`
        ),
        10000,
        "Navigation to Forget Password page failed"
      );
      await driver.navigate().back(); // Go back to the login page
      await driver.wait(until.urlIs(baseUrl), 5000);
    });

    test("Log In button is displayed and enabled", async () => {
      const loginButton = await driver.findElement(
        By.xpath("//button[text()='Log In']")
      );
      assert.ok(
        await loginButton.isDisplayed(),
        "Log In button should be displayed"
      );
      assert.ok(
        !(await loginButton.getAttribute("disabled")),
        "Log In button should be enabled"
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

  describe("Functionality Tests", () => {
    async function login(driver, email, password) {
      const emailInput = await driver.findElement(
        By.css("input[type='email']")
      );
      await emailInput.sendKeys(email);

      const passwordInput = await driver.findElement(
        By.css("input[type='password']")
      );
      await passwordInput.sendKeys(password);

      const loginButton = await driver.findElement(
        By.xpath("//button[text()='Log In']")
      );
      await loginButton.click();
    }

    test("Successful login navigates to the SuperAdmin dashboard (requires backend to be running and accessible)", async () => {
      await login(driver, "nikitayugeshwar01@gmail.com", "123456");
      await driver.wait(
        until.urlIs(`${baseUrl.replace("/SuperAdminLogin", "")}/SuperAdmin`),
        10000,
        "Navigation to SuperAdmin dashboard failed"
      );
      // Optionally, you can add assertions to check elements on the dashboard page
      await driver.navigate().back(); // Go back to the login page for subsequent tests
      await driver.wait(until.urlIs(baseUrl), 5000);
    });

    test("Login with incorrect credentials displays an error message", async () => {
      await login(driver, "invalid@example.com", "wrongpassword");
      const errorElement = await driver.wait(
        until.elementLocated(By.className("text-red-500")),
        5000,
        "Error message should be displayed for incorrect credentials"
      );
      assert.equal(
        await errorElement.getText(),
        "Invalid email or password",
        "Incorrect error message"
      );
    });

    // test("Toggling password visibility shows and hides the password", async () => {
    //   const passwordInput = await driver.findElement(
    //     By.css("input[type='password']")
    //   );
    //   const toggleButton = await driver.findElement(
    //     By.css("button[type='button'][onClick]")
    //   );

    //   // Initially, password should be hidden
    //   assert.equal(
    //     await passwordInput.getAttribute("type"),
    //     "password",
    //     "Password should be hidden initially"
    //   );

    //   // Click the toggle button
    //   await toggleButton.click();
    //   assert.equal(
    //     await passwordInput.getAttribute("type"),
    //     "text",
    //     "Password should be visible after toggling"
    //   );

    //   // Click the toggle button again
    //   await toggleButton.click();
    //   assert.equal(
    //     await passwordInput.getAttribute("type"),
    //     "password",
    //     "Password should be hidden after toggling again"
    //   );
    // });

    test("Attempting to login with empty fields does not navigate and might show browser validation (depending on implementation)", async () => {
      const emailInput = await driver.findElement(
        By.css("input[type='email']")
      );
      await emailInput.clear();
      const passwordInput = await driver.findElement(
        By.css("input[type='password']")
      );
      await passwordInput.clear();
      const loginButton = await driver.findElement(
        By.xpath("//button[text()='Log In']")
      );
      await loginButton.click();

      // Check that the URL did not change (or stayed on the login page)
      await driver.wait(
        until.urlIs(baseUrl),
        5000,
        "Should remain on the login page with empty fields"
      );
    });
  });
});
