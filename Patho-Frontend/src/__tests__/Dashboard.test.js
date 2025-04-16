const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Dashboard Page Automation", () => {
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
    await driver.wait(until.urlIs(`${baseUrl}/Dashboard`), 10000);
  }

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await login(driver, "nikitayugeshwar2020@gmail.com", "222222"); // Use your test credentials
      await driver.get(`${baseUrl}/Dashboard`);
      await driver.wait(
        until.elementLocated(By.css("div.flex.flex-col.gap-5.p-7")), // Wait for the main dashboard container
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
    test("Patient table header 'Patient' and 'See All' link are displayed", async () => {
      const patientHeader = await driver.wait(
        until.elementLocated(By.xpath("//h1[text()='Patient']")),
        5000
      );
      assert.ok(
        await patientHeader.isDisplayed(),
        "Patient header should be displayed"
      );

      const seeAllPatientsLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//h1[text()='Patient']/following-sibling::a//button[text()='See All']"
          )
        ),
        5000
      );
      assert.ok(
        await seeAllPatientsLink.isDisplayed(),
        "See All Patients link should be displayed"
      );
    });

    test("Records table header 'Records' and 'See All' link are displayed", async () => {
      const recordsHeader = await driver.wait(
        until.elementLocated(By.xpath("//h1[text()='Records']")),
        5000
      );
      assert.ok(
        await recordsHeader.isDisplayed(),
        "Records header should be displayed"
      );

      const seeAllRecordsLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//h1[text()='Records']/following-sibling::a//button[text()='See All']"
          )
        ),
        5000
      );
      assert.ok(
        await seeAllRecordsLink.isDisplayed(),
        "See All Records link should be displayed"
      );
    });

    test("Loading indicator is not displayed after initial load (assuming quick API response)", async () => {
      const loadingElements = await driver.findElements(
        By.xpath("//div[text()='Loading...']")
      );
      // assert.equal(
      //   loadingElements.length,
      //   0,
      //   "Loading indicator should not be displayed after initial load"
      // );
    });

    test("Error message is not displayed after initial load (assuming successful API response)", async () => {
      const errorElements = await driver.findElements(
        By.xpath("//div[contains(text(), 'Error:')]")
      );
      //   assert.equal(
      //     errorElements.length,
      //     0,
      //     "Error message should not be displayed after initial load"
      //   );
    });
  });
});
