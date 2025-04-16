const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("ViewReport Component Automation", () => {
  let driver;
  const baseUrl = "http://localhost:5173"; // Adjust as needed
  const mockPatientId = "67e7a98c9911252db52d15a8"; // Use a consistent mock ID

  async function login(driver, email, password) {
    // ... (Your existing login function)
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
      await login(driver, "nikitayugeshwar2020@gmail.com", "222222"); // Use your test credentials
      await driver.get(`${baseUrl}/Dashboard/ViewReport/${mockPatientId}`);
      await driver.wait(
        until.elementLocated(By.css("div.h-auto.w-full")), // Wait for the main container
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
    test("Share button is displayed and enabled", async () => {
      const shareButton = await driver.wait(
        until.elementLocated(By.xpath("//button[text()='Share']")),
        5000
      );
      assert.ok(
        await shareButton.isDisplayed(),
        "Share button should be displayed"
      );
      assert.ok(
        !(await shareButton.getAttribute("disabled")),
        "Share button should be enabled initially"
      );
    });

    test("Print button is displayed and enabled", async () => {
      const printButton = await driver.wait(
        until.elementLocated(By.xpath("//button[text()='Print']")),
        5000
      );
      assert.ok(
        await printButton.isDisplayed(),
        "Print button should be displayed"
      );
      assert.ok(
        !(await printButton.getAttribute("disabled")),
        "Print button should be enabled"
      );
    });

    test("Shareable link section is not displayed initially", async () => {
      const shareLinkDiv = await driver.findElements(
        By.xpath("//div[p[text()='Shareable Link:']]")
      );
      assert.equal(
        shareLinkDiv.length,
        0,
        "Shareable link section should not be visible initially"
      );
    });

    // You might need to mock the API response for the Report component
    // to ensure it renders correctly before checking for its elements.
    test("Report component is rendered (basic check - more detailed checks in Report component tests)", async () => {
      const reportComponent = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//div[contains(@class, 'pb-10')]//div[contains(@class, '')]"
          )
        ), // Adjust selector based on Report's root element
        5000
      );
      assert.ok(
        await reportComponent.isDisplayed(),
        "Report component should be rendered"
      );
    });
  });

  describe("Functionality Tests", () => {
    test("Clicking 'Share' button displays the shareable link (requires mocking API for link retrieval)", async () => {
      const shareButton = await driver.findElement(
        By.xpath("//button[text()='Share']")
      );
      await shareButton.click();

      const shareLinkDiv = await driver.wait(
        until.elementLocated(By.xpath("//div[p[text()='Shareable Link:']]")),
        5000,
        "Shareable link section should be displayed after clicking Share"
      );
      assert.ok(
        await shareLinkDiv.isDisplayed(),
        "Shareable link section is visible"
      );

      const shareLinkElement = await shareLinkDiv.findElement(
        By.css("a.text-blue-500")
      );
      assert.ok(
        await shareLinkElement.isDisplayed(),
        "Shareable link is displayed"
      );
      // You would ideally mock the API to assert the link content
    });

    test("Clicking 'Print' button triggers the print dialog (cannot be fully automated but can check click)", async () => {
      const printButton = await driver.findElement(
        By.xpath("//button[text()='Print']")
      );
      await printButton.click();
    });
  });
});
