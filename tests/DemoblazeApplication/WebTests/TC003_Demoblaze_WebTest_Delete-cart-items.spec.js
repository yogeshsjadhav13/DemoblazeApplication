const { test, request} = require('@playwright/test');
const { POManager } = require('../../../main/utilities/POManager');
const { UtilityFunctions } = require('../../../main/utilities/UtilityFunctions');
const TestCaseName = 'TC003_Demoblaze_WebTest';


test('TC003_Demoblaze_WebTest_Perform-delete-cart-functionality', async function ({ browser }) {

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
  await loginPage.UserLogin(utilityFunctionLocal);

  //Step 2 - Add products to the cart as per the data sheet
  await homePage.ProductAddToCart(LocalTestData);

  //Step 3 - Delete the products in the cart if there are any from previous run
  await cartPage.ProductDeleteFromCart();

  //Close all browserss
  await context.close();

});


test.afterEach(async ({ page }, testInfo) => {
  const utilityFunctionLocal = new UtilityFunctions(TestCaseName);
  utilityFunctionLocal.WriteDataToExcel("Status", testInfo.status);
  console.log(`Finished ${testInfo.title} with status --- ${testInfo.status}`);
});
