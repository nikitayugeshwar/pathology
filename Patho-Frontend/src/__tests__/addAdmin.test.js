const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

jest.setTimeout(60000); // Increased timeout

describe("AddUser and AddForm Components Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173"; // Replace with your app's URL
  const superAdminUrl = `${baseUrl}/SuperAdmin`;
  const addUserUrl = `${baseUrl}/superAdmin/addUser`;

  // Login function (same as provided)
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
    // Login before all tests
    await login(driver, "nikitayugeshwar01@gmail.com", "123456"); // Use your test credentials
  });

  beforeEach(async () => {
    await driver.get(addUserUrl); // Navigate to the Add User page before each test
    await driver.wait(
      until.elementLocated(By.tagName("form")),
      10000,
      "Add User form did not load"
    );
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  describe("AddForm Component UI", () => {
    test("TC_ADF_002: Verify all input fields are present and labeled correctly", async () => {
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

    test("TC_ADF_003: Verify 'Save' button is displayed", async () => {
      const saveButton = await driver.findElement(
        By.xpath("//button[text()='Save']")
      );
      assert.ok(
        await saveButton.isDisplayed(),
        "'Save' button is not displayed"
      );
    });
  });
});
