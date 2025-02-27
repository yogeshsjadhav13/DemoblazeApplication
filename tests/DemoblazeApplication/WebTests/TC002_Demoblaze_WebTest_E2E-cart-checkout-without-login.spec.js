const { test, request} = require('@playwright/test');
const { POManager } = require('../../../main/utilities/POManager');
const { UtilityFunctions } = require('../../../main/utilities/UtilityFunctions');
const TestCaseName = 'TC002_Demoblaze_WebTest';


test('TC002_Demoblaze_WebTest_Perform-E2E-cart-checkout-functionality-without-login', async function ({ browser }) {

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

  //Step 1 - Navigate to the Demoblaze application and without login proceed with car functionality
  await page.goto('https://www.demoblaze.com/index.html');

  //Step 2 - Delete the products in the cart if there are any from previous run
  await cartPage.ProductDeleteFromCart();

  //Step 3 - Add products to the cart as per the data sheet
  await homePage.ProductAddToCart(LocalTestData);

  //Step 4 - Verify the products in the cart with prices
  await cartPage.ProductCartVerification(LocalTestData);

  //Step 5 - Checkout the cart and complete the order
  await cartPage.CartCheckout(utilityFunctionLocal, LocalTestData);

  //Step 6 - Write the total price to the data sheet
  utilityFunctionLocal.WriteDataToExcel("TotalPrice", LocalTestData.get("TotalPrice"));
  
  //Close all browserss
  await context.close();

});


test.afterEach(async ({ page }, testInfo) => {
  const utilityFunctionLocal = new UtilityFunctions(TestCaseName);
  utilityFunctionLocal.WriteDataToExcel("Status", testInfo.status);
  console.log(`Finished ${testInfo.title} with status --- ${testInfo.status}`);
});
