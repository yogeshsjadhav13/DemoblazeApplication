const { test, request} = require('@playwright/test');
const { POManager } = require('../../../main/utilities/POManager');
const { UtilityFunctions } = require('../../../main/utilities/UtilityFunctions');
const TestCaseName = 'TC001_Demoblaze_APITest';



test('TC001_Demoblaze_APITest', async function ({ browser }) {

  //Setting up first browser page
  const context = await browser.newContext();
  const page = await context.newPage();
  const apiContext = await request.newContext({ignoreHTTPSErrors: true,});

  //Test Object setup - Create Objects of pages to work with
  const poManager = new POManager(page, apiContext);
  const loginPage = poManager.getLoginPage();
  const homePage = poManager.getHomePage();
  const cartPage = poManager.getCartPage();

  //Step 1 - Test data setup - Read test case Data
  const utilityFunctionLocal = new UtilityFunctions(TestCaseName);
  const LocalTestData = await utilityFunctionLocal.ReadDataFromExcel();

  //Step 2 - Autheniticate to demoblaze application
  const AuthToken = await loginPage.apiUserLogin(utilityFunctionLocal);

  //Step 3 - Delete the products in the cart if there are any from previous run
  await cartPage.apiDeleteCart(utilityFunctionLocal);

  //Step 4 - Fetch all product entries from the application and create a map of title and id
  const titleIdMap = await homePage.apiFetchProductsEntries(utilityFunctionLocal);

  //Step 5 - Add products to the cart as per the data sheet
  const cartItems = await homePage.apiProductAddToCart(utilityFunctionLocal, LocalTestData, AuthToken, titleIdMap);

  //Step 6 - Verify the products in the cart
  await cartPage.apiViewCart(utilityFunctionLocal, AuthToken, cartItems);

  //Step 7 - Run delete API to delete the products from the cart
  await cartPage.apiDeleteCart(utilityFunctionLocal);

  //Close all browsers
  await context.close();


});

test.afterEach(async ({ page }, testInfo) => {
  const utilityFunctionLocal = new UtilityFunctions(TestCaseName);
  utilityFunctionLocal.WriteDataToExcel("Status", testInfo.status);
  console.log(`Finished ${testInfo.title} with status --- ${testInfo.status}`);
});
