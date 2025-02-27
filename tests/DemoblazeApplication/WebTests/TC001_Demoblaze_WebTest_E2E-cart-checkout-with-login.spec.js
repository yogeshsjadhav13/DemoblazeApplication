const { test, request, expect} = require('@playwright/test');
const { POManager } = require('../../../main/utilities/POManager');
const { UtilityFunctions } = require('../../../main/utilities/UtilityFunctions');
const TestCaseName = 'TC001_Demoblaze_WebTest';


test('TC001_Demoblaze_WebTest_Perform-end-to-end-cart-checkout-functionality-with-login', async function ({ browser }) {

  //Setting up first browser page
  const context = await browser.newContext();
  const page = await context.newPage();
  const apiContext = await request.newContext({ignoreHTTPSErrors: true,});

  //Test Object setup - Create Objects of pages to work with
  const poManager = new POManager(page, apiContext);
  const loginPage = poManager.getLoginPage();
  const homePage = poManager.getHomePage();
  const cartPage = poManager.getCartPage();

  //Test data setup - Read test case Data
  const utilityFunctionLocal = new UtilityFunctions(TestCaseName);
  const LocalTestData = await utilityFunctionLocal.ReadDataFromExcel();

  //Step 1 - Login to the Demoblaze application
  await loginPage.UserLogin(utilityFunctionLocal);

  //Step 2 - Verify home page display on web browser and UI
  await expect(page).toHaveScreenshot({name:'WebHomePage.png', fullPage: true});

  //Step 3 - Delete the products in the cart if there are any from previous run
  await cartPage.ProductDeleteFromCart();

  //Step 4 - Add products to the cart as per the data sheet
  await homePage.ProductAddToCart(LocalTestData);

  //Step 5 - Verify the products in the cart with prices
  await cartPage.ProductCartVerification(LocalTestData);

  //Step 6 - Verify cart page display on web browser and UI
  await expect(page).toHaveScreenshot({name:'WebCartPage.png', fullPage: true, maxDiffPixelRatio: 0.02});

  //Step 7 - Checkout the cart and complete the order
  await cartPage.CartCheckout(utilityFunctionLocal, LocalTestData);

  //Step 8 - Write the total price to the data sheet
  utilityFunctionLocal.WriteDataToExcel("TotalPrice", LocalTestData.get("TotalPrice"));

  //Close all browserss
  await context.close();

});


test.afterEach(async ({ page }, testInfo) => {
  const utilityFunctionLocal = new UtilityFunctions(TestCaseName);
  utilityFunctionLocal.WriteDataToExcel("Status", testInfo.status);
  console.log(`Finished ${testInfo.title} with status --- ${testInfo.status}`);
});
