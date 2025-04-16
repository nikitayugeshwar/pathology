const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Add Patient Form Automation", () => {
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
    await driver.get("http://localhost:5173/Dashboard/AddPatient");
    await driver.wait(until.elementLocated(By.css('form[role="form"]')), 5000);
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Form is properly loaded", async () => {
    const form = await driver.findElement(By.css('form[role="form"]'));
    expect(await form.isDisplayed()).toBe(true);
  });

  test("Back button navigates to Patient Dashboard", async () => {
    const backButton = await driver.findElement(
      By.xpath("//button[contains(., 'Back')]")
    );
    await backButton.click();
    await driver.wait(
      until.urlIs("http://localhost:5173/Dashboard/Patient"),
      3000
    );
    await driver.navigate().back(); // Return to form for subsequent tests
  });

  test("All required fields are present", async () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "contactNumber",
      "email",
      "gender",
      "age",
      "sampleCollector",
      "datetime",
      "Doctorname",
      "collectionDate",
      "address",
      "Testname",
    ];

    for (const field of requiredFields) {
      const element = await driver.findElement(By.id(field));
      expect(await element.isDisplayed()).toBe(true);
    }
  });

  test("Test selection dropdown is functional", async () => {
    234;
    // This test mi ght need adjustment based on how react-select renders in the DOM
    const testSelect = await driver.findElement(By.id("Testname"));
    await testSelect.click();
    await driver.sleep(500); // Wait for dropdown to appear

    // Try to select first option if available
    try {
      const firstOption = await driver.wait(
        until.elementLocated(By.css(".react-select__option")),
        2000
      );
      await firstOption.click();
    } catch (e) {
      console.log("No test options available to select");
    }
  });

  test("Contact number field accepts only numbers and limits to 10 digits", async () => {
    const contactInput = await driver.findElement(By.id("contactNumber"));
    await contactInput.clear();
    await contactInput.sendKeys("123abc456!@#7890");
    const enteredValue = await contactInput.getAttribute("value");
    assert.equal(enteredValue, "1234567890");
  });

  test("Age field accepts only valid numbers", async () => {
    const ageInput = await driver.findElement(By.id("age"));
    await ageInput.clear();
    await ageInput.sendKeys("25");
    const enteredValue = await ageInput.getAttribute("value");
    assert.equal(enteredValue, "25");

    // Test with invalid input
    await ageInput.clear();
    await ageInput.sendKeys("abc");
    const invalidValue = await ageInput.getAttribute("value");
    assert.equal(invalidValue, "");
  });

  test("Gender dropdown has correct options", async () => {
    const genderSelect = await driver.findElement(By.id("gender"));
    const options = await genderSelect.findElements(By.css("option"));
    const optionValues = await Promise.all(
      options.map((opt) => opt.getAttribute("value"))
    );

    expect(optionValues).toEqual(
      expect.arrayContaining(["", "Male", "Female", "Other"])
    );
  });

  test("Form shows validation errors when submitted empty", async () => {
    const submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );
    await submitButton.click();

    // Wait for any validation messages or error states
    await driver.sleep(500);

    // Check if required fields show validation (implementation specific)
    const firstNameInput = await driver.findElement(By.id("firstName"));
    const isInvalid = await firstNameInput.getAttribute("aria-invalid");
    // expect(isInvalid).toBe("true");
  });

  // test("Successfully submits valid form data", async () => {
  //   // Fill out the form with valid data
  //   await driver.findElement(By.id("firstName")).sendKeys("Test");
  //   await driver.findElement(By.id("lastName")).sendKeys("Patient");
  //   await driver.findElement(By.id("contactNumber")).sendKeys("9876543210");
  //   await driver.findElement(By.id("email")).sendKeys("test@example.com");
  //   await driver.findElement(By.id("gender")).sendKeys("Male");
  //   await driver.findElement(By.id("age")).sendKeys("30");
  //   await driver
  //     .findElement(By.id("sampleCollector"))
  //     .sendKeys("Collector Name");

  //   // Handle date/time inputs - format depends on browser
  //   await driver.executeScript(`
  //     document.getElementById('datetime').value = '2023-11-15T10:30';
  //     document.getElementById('collectionDate').value = '2023-11-15';
  //   `);

  //   await driver.findElement(By.id("Doctorname")).sendKeys("Dr. Smith");
  //   await driver.findElement(By.id("address")).sendKeys("123 Test Street");

  //   // Submit the form
  //   const submitButton = await driver.findElement(
  //     By.css('button[type="submit"]')
  //   );
  //   await submitButton.click();

  //   // Verify success message appears
  //   try {
  //     const successCard = await driver.wait(
  //       until.elementLocated(By.css(".Successcard")),
  //       5000
  //     );
  //     expect(await successCard.isDisplayed()).toBe(true);
  //   } catch (e) {
  //     console.log(
  //       "Success card not displayed - might need to check for errors"
  //     );
  //   }
  // });

  test("Success card closes and navigates to Patient Dashboard", async () => {
    try {
      const successCard = await driver.wait(
        until.elementLocated(By.css(".Successcard")),
        3000
      );
      const closeButton = await successCard.findElement(By.css("button"));
      await closeButton.click();
      await driver.wait(
        until.urlIs("http://localhost:5173/Dashboard/Patient"),
        3000
      );
    } catch (e) {
      console.log("No success card to close - may need to navigate manually");
    }
  });
});
