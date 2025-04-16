const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

jest.setTimeout(60000);

describe("EditUser and EditForm Components Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173";
  const superAdminUrl = `${baseUrl}/SuperAdmin`;
  const editUserUrl = `${baseUrl}/superAdmin/editUser`; // Base URL, will append ID in tests

  // Login function
  async function login(driver, email, password) {
    await driver.get(`${baseUrl}/SuperAdminLogin`);
    await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      10000,
      "Email input not found"
    );
    const emailInput = await driver.findElement(By.css("input[type='email']"));
    await emailInput.sendKeys(email);
    const passwordInput = await driver.findElement(
      By.css("input[type='password']")
    );
    await passwordInput.sendKeys(password);
    const loginButton = await driver.findElement(
      By.xpath("//button[text()='Log In']")
    );
    await loginButton.click();
    await driver.wait(until.urlIs(superAdminUrl), 15000);
  }

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await login(driver, "nikitayugeshwar01@gmail.com", "123456");
  });

  beforeEach(async () => {
    // No need to navigate here, we will do it in each test with the specific ID
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("EditForm Component UI", () => {
    test("TC_EDF_002: Verify all input fields are present and labeled correctly", async () => {
      await driver.get(`${editUserUrl}/someValidId`);
      await driver.wait(until.elementLocated(By.tagName("form")), 10000);
      const expectedFields = [
        "User Id*",
        "First Name*",
        "Last Name*",
        "Contact Number*",
        "Email*",
        "Clinic Name*",
        "User Name*",
        "Password*",
        "Date & Time*",
        "Address*",
      ];

      for (const fieldLabel of expectedFields) {
        const labelElement = await driver.findElement(
          By.xpath(`//label[text()='${fieldLabel}']`)
        );
        assert.ok(
          await labelElement.isDisplayed(),
          `Label '${fieldLabel}' is not displayed`
        );
      }

      const addressTextarea = await driver.findElement(By.name("address"));
      assert.ok(
        await addressTextarea.isDisplayed(),
        "Address textarea is not displayed"
      );
    });

    test("TC_EDF_003: Verify 'Update' button is displayed", async () => {
      await driver.get(`${editUserUrl}/someValidId`);
      await driver.wait(until.elementLocated(By.tagName("form")), 10000);
      const updateButton = await driver.findElement(
        By.xpath("//button[text()='Update']")
      );
      assert.ok(
        await updateButton.isDisplayed(),
        "'Update' button is not displayed"
      );
    });

    test("TC_EDF_004: Verify User Id field is read-only and disabled", async () => {
      await driver.get(`${editUserUrl}/someValidId`);
      await driver.wait(until.elementLocated(By.tagName("form")), 10000);
      const userIdInput = await driver.findElement(By.name("userId"));
      const isReadOnly = await userIdInput.getAttribute("readonly");
      const isDisabled = await userIdInput.getAttribute("disabled");

      assert.equal(isReadOnly, "true", "User Id field is not read-only");
      assert.equal(isDisabled, "true", "User Id field is not disabled");
    });
  });
});
