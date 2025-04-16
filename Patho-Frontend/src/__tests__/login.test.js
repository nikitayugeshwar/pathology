const { Builder, By, until } = require("selenium-webdriver");

describe("Login Page Automation", () => {
  let driver;

  // Utility to fill login form with clear()
  async function fillLoginForm(driver, email, password) {
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
  }

  beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:5173/"); // Update this URL if needed
  });

  afterAll(async () => {
    await driver.quit();
  });

  test("Page loads correctly", async () => {
    const pageTitle = await driver.getTitle();
    expect(pageTitle).toBe("Vite + React");
  });

  test("Login with invalid email", async () => {
    await fillLoginForm(driver, "invalid@example.com", "222222");

    const loginButton = await driver.wait(
      until.elementLocated(By.css('button[type="submit"]')),
      5000
    );
    await loginButton.click();

    const errorMessage = await driver.wait(
      until.elementLocated(By.css(".text-red-500")),
      5000
    );
    // expect(await errorMessage.getText()).toBe("Invalid email or password");
  });

  test("Login with invalid password", async () => {
    await fillLoginForm(
      driver,
      "nikitayugeshwar2020@gmail.com",
      "wrongpassword"
    );

    const loginButton = await driver.wait(
      until.elementLocated(By.css('button[type="submit"]')),
      5000
    );
    await loginButton.click();

    const errorMessage = await driver.wait(
      until.elementLocated(By.css(".text-red-500")),
      5000
    );
    expect(await errorMessage.getText()).toBe("Invalid email or password");
  });

  test("Empty email and password fields", async () => {
    const loginButton = await driver.wait(
      until.elementLocated(By.css('button[type="submit"]')),
      5000
    );
    await loginButton.click();

    const errorMessage = await driver.wait(
      until.elementLocated(By.css(".text-red-500")),
      5000
    );
    expect(await errorMessage.getText()).toBe("Invalid email or password");
  });

  test("Toggle password visibility", async () => {
    const passwordInput = await driver.wait(
      until.elementLocated(By.css('input[type="password"]')),
      5000
    );
    const toggleButton = await driver.wait(
      until.elementLocated(By.css("button[type='button']")),
      5000
    );

    await toggleButton.click();
    const passwordType = await passwordInput.getAttribute("type");
    expect(passwordType).toBe("text");
  });

  test("Remember Me checkbox functionality", async () => {
    const rememberMeCheckbox = await driver.wait(
      until.elementLocated(By.css('input[type="checkbox"]')),
      5000
    );
    await rememberMeCheckbox.click();
    expect(await rememberMeCheckbox.isSelected()).toBe(true);
  });
});
