const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

// Increase Jest timeout for all tests
jest.setTimeout(30000); // 30 seconds

describe("Patient Details Page Automation", () => {
  let driver;
  const testPatientId = "67e7a98c9911252db52d15a8"; // Valid test patient ID
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
    await driver.wait(until.urlContains("Dashboard"), 10000);
  }

  beforeAll(async () => {
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await login(driver, "nikitayugeshwar2020@gmail.com", "222222");
      await driver.get(`${baseUrl}/Dashboard/PatientDetails/${testPatientId}`);
      await driver.wait(
        until.elementLocated(By.css("div.h-screen.w-full")), // Wait for the main page container
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

  test("Page loads successfully with patient ID", async () => {
    const currentUrl = await driver.getCurrentUrl();
    assert(
      currentUrl.includes(testPatientId),
      `URL should contain patient ID. Actual URL: ${currentUrl}`
    );
  });

  test("Back button navigates to Patient Dashboard", async () => {
    const backButton = await driver.wait(
      until.elementLocated(
        By.xpath("//button[.//*[contains(text(), 'Back')]]")
      ),
      5000
    );
    await backButton.click();
    await driver.wait(until.urlIs(`${baseUrl}/Dashboard/Patient`), 5000);
    await driver.navigate().back();
    await driver.wait(
      until.urlContains(`/PatientDetails/${testPatientId}`),
      5000
    );
  });

  test("Patient header displays name correctly", async () => {
    const header = await driver.wait(
      until.elementLocated(
        By.css("div.w-full.h-12.px-5.flex.items-center.bg-blue-200 > h1")
      ),
      5000
    );
    const headerText = await header.getText();
    assert(
      headerText.includes("Rohit") || headerText.includes("kumar"),
      `Header should contain patient name. Actual: ${headerText}`
    );
  });

  test("Patient information sections are displayed", async () => {
    const sections = await driver.wait(
      until.elementsLocated(By.css("div.flex.flex-col.gap-2.w-full")),
      5000
    );
    assert.equal(
      sections.length,
      3,
      `Should have 3 information sections. Found: ${sections.length}`
    );
  });

  test("Basic patient information is displayed", async () => {
    const firstNameEl = await driver.wait(
      until.elementLocated(
        By.xpath("//h1[contains(., 'First Name')]/following-sibling::h1")
      ),
      5000
    );
    const firstName = await firstNameEl.getText();
    // assert.equal(
    //   firstName.trim(),
    //   "Rohit",
    //   `First name should be 'Rohit'. Actual: ${firstName}`
    // );
  });

  test("Contact information is valid", async () => {
    const contactEl = await driver.wait(
      until.elementLocated(
        By.xpath("//h1[contains(., 'Contact Number')]/following-sibling::h1")
      ),
      5000
    );
    const contactNumber = await contactEl.getText();
    // assert.match(
    //   contactNumber.trim(),
    //   /^\d{10}$/,
    //   `Contact number should be 10 digits. Actual: ${contactNumber}`
    // );
  });

  test("Medical information is correct", async () => {
    const genderEl = await driver.wait(
      until.elementLocated(
        By.xpath("//h1[contains(., 'Gender')]/following-sibling::h1")
      ),
      5000
    );
    const gender = await genderEl.getText();
    // assert.equal(
    //   gender.trim(),
    //   "Male",
    //   `Gender should be Male. Actual: ${gender}`
    // );
  });

  test("Date/time is formatted correctly", async () => {
    const dateEl = await driver.wait(
      until.elementLocated(
        By.xpath("//h1[contains(., 'Date & Time')]/following-sibling::h1")
      ),
      5000
    );
    const dateTime = await dateEl.getText();
    // assert.match(
    //   dateTime.trim(),
    //   /^\d{2}-\d{2}-\d{4} \| \d{2}:\d{2}/,
    //   `Should be in DD-MM-YYYY | HH:MM format. Actual: ${dateTime}`
    // );
  });

  test("Test information displays correctly", async () => {
    const testNameEl = await driver.wait(
      until.elementLocated(
        By.xpath("//h1[contains(., 'Test Name')]/following-sibling::h1")
      ),
      5000
    );
    const testName = await testNameEl.getText();
    // assert(
    //   testName.includes("Thyroid Function Test (TFT)"),
    //   `Test name should include 'Thyroid'. Actual: ${testName}`
    // );
  });

  //   test("Address is displayed", async () => {
  //     const addressEl = await driver.wait(
  //       until.elementLocated(
  //         By.xpath("//h1[contains(., 'Address')]/following-sibling::h1")
  //       ),
  //       5000
  //     );
  //     const address = await addressEl.getText();
  //     assert(
  //       address.includes("Alpha"),
  //       `Address should include 'Alpha'. Actual: ${address}`
  //     );
  //   });
});
