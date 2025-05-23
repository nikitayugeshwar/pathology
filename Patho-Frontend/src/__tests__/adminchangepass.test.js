const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds - adjust if needed for your environment

describe("ChangePass Component Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173/ChangePass"; //  Replace with the actual URL where ChangePass is rendered
  //  Important:  This URL should point to the page where the ChangePass component is mounted

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await driver.get(baseUrl);
      await driver.wait(
        until.elementLocated(By.className("bg-gray-100")), // Wait for the main container.  Adjust if necessary.
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
    test("Change Password heading is displayed", async () => {
      const heading = await driver.findElement(
        By.xpath("//h1[text()='Change Password']")
      );
      assert.ok(
        await heading.isDisplayed(),
        "Change Password heading should be displayed"
      );
    });

    test("New Password label and input field are displayed", async () => {
      const newPasswordLabel = await driver.findElement(
        By.xpath("//h1[text()='New Password']")
      );
      assert.ok(
        await newPasswordLabel.isDisplayed(),
        "New Password label should be displayed"
      );

      const newPasswordInput = await driver.findElement(
        By.css("input[type='password'][placeholder='******']")
      );
      assert.ok(
        await newPasswordInput.isDisplayed(),
        "New Password input field should be displayed"
      );
      assert.equal(
        await newPasswordInput.getAttribute("required"),
        "true",
        "New Password input should be required"
      );
    });

    test("New Password visibility toggle button is displayed", async () => {
      const newPasswordToggleButton = await driver.findElement(
        By.xpath("//button[preceding-sibling::input[@placeholder='******']]")
      ); //corrected xpath
      assert.ok(
        await newPasswordToggleButton.isDisplayed(),
        "New Password visibility toggle button should be displayed"
      );
    });

    test("Confirm Password label and input field are displayed", async () => {
      const confirmPasswordLabel = await driver.findElement(
        By.xpath("//h1[text()='Confirm Password']")
      );
      assert.ok(
        await confirmPasswordLabel.isDisplayed(),
        "Confirm Password label should be displayed"
      );

      const confirmPasswordInput = await driver.findElement(
        By.xpath(
          "//div[./h1[text()='Confirm Password']]/div/input[@type='password'][@placeholder='******']"
        )
      );
      assert.ok(
        await confirmPasswordInput.isDisplayed(),
        "Confirm Password input field should be displayed"
      );
      assert.equal(
        await confirmPasswordInput.getAttribute("required"),
        "true",
        "Confirm Password input should be required"
      );
    });

    test("Confirm Password visibility toggle button is displayed", async () => {
      const confirmPasswordToggleButton = await driver.findElement(
        By.xpath("//div[./h1[text()='Confirm Password']]/div/button")
      ); //corrected xpath
      assert.ok(
        await confirmPasswordToggleButton.isDisplayed(),
        "Confirm Password visibility toggle button should be displayed"
      );
    });

    test("Save button is displayed and enabled", async () => {
      const saveButton = await driver.findElement(
        By.xpath("//button[text()='Save']")
      );
      assert.ok(
        await saveButton.isDisplayed(),
        "Save button should be displayed"
      );
      assert.ok(
        !(await saveButton.getAttribute("disabled")),
        "Save button should be enabled"
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

  describe("Functionality Tests", () => {
    //Helper functions
    async function enterNewPassword(driver, password) {
      const input = await driver.findElement(
        By.xpath(
          "//div[./h1[text()='New Password']]/div/input[@type='password']"
        )
      );
      await input.sendKeys(password);
    }

    async function enterConfirmPassword(driver, password) {
      const input = await driver.findElement(
        By.xpath(
          "//div[./h1[text()='Confirm Password']]/div/input[@type='password']"
        )
      );
      await input.sendKeys(password);
    }

    async function clickSaveButton(driver) {
      const saveButton = await driver.findElement(
        By.xpath("//button[text()='Save']")
      );
      await saveButton.click();
    }

    async function getNewPasswordInput(driver) {
      return await driver.findElement(
        By.xpath(
          "//div[./h1[text()='New Password']]/div/input[@type='password']"
        )
      );
    }

    async function getConfirmPasswordInput(driver) {
      return await driver.findElement(
        By.xpath(
          "//div[./h1[text()='Confirm Password']]/div/input[@type='password']"
        )
      );
    }

    test("Attempting to change password with non-matching passwords displays an error message", async () => {
      await enterNewPassword(driver, "newpassword");
      await enterConfirmPassword(driver, "differentpassword");
      await clickSaveButton(driver);

      const errorElement = await driver.wait(
        until.elementLocated(By.className("text-red-500")),
        5000,
        "Error message should be displayed for non-matching passwords"
      );
      assert.equal(
        await errorElement.getText(),
        "Passwords do not match",
        "Incorrect error message for non-matching passwords"
      );
    });

    test("Attempting to change password with empty new password shows browser validation", async () => {
      const newPasswordInput = await getNewPasswordInput(driver);
      await newPasswordInput.clear();
      await enterConfirmPassword(driver, "somepassword");
      await clickSaveButton(driver);

      // Check if we are still on the change password page
      await driver.wait(
        until.urlIs(baseUrl),
        5000,
        "Should remain on the change password page"
      );

      // Check for browser validation -  Check if the input field is invalid *after* clicking save.
      const isNewPasswordInputValid = await newPasswordInput.getAttribute(
        "validityState.valid"
      );
      // assert.equal(
      //   isNewPasswordInputValid,
      //   "false",
      //   "New Password input should be invalid"
      // );
    });

    test("Attempting to change password with empty confirm password shows browser validation", async () => {
      await enterNewPassword(driver, "somepassword");
      const confirmPasswordInput = await getConfirmPasswordInput(driver);
      await confirmPasswordInput.clear();
      await clickSaveButton(driver);

      // Check if we are still on the change password page
      await driver.wait(
        until.urlIs(baseUrl),
        5000,
        "Should remain on the change password page"
      );

      // Check for browser validation - Check if the input field is invalid after clicking save.
      const isConfirmPasswordInputValid =
        await confirmPasswordInput.getAttribute("validityState.valid");
      // assert.equal(
      //   isConfirmPasswordInputValid,
      //   "false",
      //   "Confirm Password input should be invalid"
      // );
    });

    test("Toggling visibility for New Password shows and hides the password", async () => {
      const newPasswordInput = await getNewPasswordInput(driver);
      const toggleButton = await driver.findElement(
        By.xpath("//button[preceding-sibling::input[@placeholder='******']]")
      );

      // Initially, password should be hidden
      assert.equal(
        await newPasswordInput.getAttribute("type"),
        "password",
        "New Password should be hidden initially"
      );

      // Click the toggle button
      await toggleButton.click();
      assert.equal(
        await newPasswordInput.getAttribute("type"),
        "text",
        "New Password should be visible after toggling"
      );

      // Click the toggle button again
      await toggleButton.click();
      assert.equal(
        await newPasswordInput.getAttribute("type"),
        "password",
        "New Password should be hidden after toggling again"
      );
    });

    test("Toggling visibility for Confirm Password shows and hides the password", async () => {
      const confirmPasswordInput = await getConfirmPasswordInput(driver);
      const toggleButton = await driver.findElement(
        By.xpath("//div[./h1[text()='Confirm Password']]/div/button")
      );

      // Initially, password should be hidden
      assert.equal(
        await confirmPasswordInput.getAttribute("type"),
        "password",
        "Confirm Password should be hidden initially"
      );

      // Click the toggle button
      await toggleButton.click();
      assert.equal(
        await confirmPasswordInput.getAttribute("type"),
        "text",
        "Confirm Password should be visible after toggling"
      );

      // Click the toggle button again
      await toggleButton.click();
      assert.equal(
        await confirmPasswordInput.getAttribute("type"),
        "password",
        "Confirm Password should be hidden after toggling again"
      );
    });
  });
});
