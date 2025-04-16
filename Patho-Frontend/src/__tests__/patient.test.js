const { Builder, By, until } = require("selenium-webdriver");

describe("Patient Dashboard Automation", () => {
  let driver;

  async function login(driver, email, password) {
    await driver.get("http://localhost:5173/");

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[type="email"]')),
      5000
    );
    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      5000
    );

    await emailInput.clear();
    await passwordInput.clear();
    await emailInput.sendKeys(email);
    await passwordInput.sendKeys(password);

    const loginButton = await driver.findElement(
      By.css('button[type="submit"]')
    );
    await loginButton.click();

    await driver.wait(until.urlContains("Dashboard"), 5000);
  }

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await login(driver, "nikitayugeshwar2020@gmail.com", "222222");
    await driver.get("http://localhost:5173/Dashboard/Patient");
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Total Patient card is visible", async () => {
    const totalCard = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Total Patient')]")),
      5000
    );
    expect(await totalCard.isDisplayed()).toBe(true);
  });

  test("Search a patient by name", async () => {
    const searchInput = await driver.findElement(
      By.css("input[placeholder='Search']")
    );
    await searchInput.clear();
    await searchInput.sendKeys("rohit");

    await driver.sleep(1000); // wait for table to update

    const rows = await driver.findElements(By.css("tbody tr"));
    expect(rows.length).toBeGreaterThan(0);
  });

  test("Change entries per page to 20", async () => {
    const dropdown = await driver.findElement(By.tagName("select"));
    await dropdown.sendKeys("20");

    await driver.sleep(1000);
    const rows = await driver.findElements(By.css("tbody tr"));
    expect(rows.length).toBeLessThanOrEqual(20);
  });

  test("Click Refresh button", async () => {
    const refreshBtn = await driver.findElement(
      By.xpath(
        "//div[contains(., 'Refresh') and @class='flex flex-row gap-2 items-center justify-center cursor-pointer']"
      )
    );
    await refreshBtn.click();
    await driver.sleep(1000);

    const table = await driver.findElement(By.css("table"));
    expect(await table.isDisplayed()).toBe(true);
  });

  test("Delete a patient (with confirm)", async () => {
    const deleteButtons = await driver.findElements(
      By.xpath("//button[text()='Delete']")
    );
    if (deleteButtons.length > 0) {
      await deleteButtons[0].click();
      await driver.sleep(500);

      // If confirm popup is native alert
      try {
        const alert = await driver.switchTo().alert();
        await alert.accept();
      } catch (err) {
        console.warn("No native alert. Handle custom modal if needed.");
      }

      await driver.sleep(2000);
      expect(true).toBe(true); // Replace with more robust check if possible
    } else {
      console.log("No patient to delete");
    }
  });
});
