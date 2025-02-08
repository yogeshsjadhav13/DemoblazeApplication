const { test } = require('@playwright/test');
const { POManager } = require('../../../main/utilities/POManager');
const { UtilityFunctions } = require('../../../main/utilities/UtilityFunctions');
const { expect } = require('@playwright/test');
const { devices } = require('playwright');
const path = require('path');
const TestCaseName = 'TC001_Demoblaze_MobileTest';


test('TC001_Demoblaze_MobileTest', async function ({ browser }) {

  //Setting up first browser page
  var iphone15 = devices['iPhone 15 Pro Max'];
  var context = await browser.newContext({...iphone15,});
  const page = await context.newPage();
  
  //Test Object setup - Create Objects of pages to work with
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  const homePage = poManager.getHomePage();
  const cartPage = poManager.getCartPage();

  //Test data setup - Read test case Data
  const utilityFunctionLocal = new UtilityFunctions(TestCaseName);
  const LocalTestData = await utilityFunctionLocal.ReadDataFromExcel();

  //Step 1 - Login to the Demoblaze application
  await loginPage.UserLogin(utilityFunctionLocal);

  //Step 2 - Verify home page display on mobile browser and UI
  await expect(page).toHaveScreenshot({name: 'MobileHomePage.png', fullPage: true});

  //Step 3 - Delete the products in the cart if there are any from previous run
  await cartPage.ProductDeleteFromCart();

  //Step 4 - Add products to the cart as per the data sheet
  await homePage.ProductAddToCart(LocalTestData);

  //Step 5 - Verify the products in the cart with prices
  await cartPage.ProductCartVerification(LocalTestData);

  //Step 6 - Verify cart page display on mobile browser and UI
  await expect(page).toHaveScreenshot({name:'MobileCartPage.png', fullPage: true, maxDiffPixelRatio: 0.02});

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
