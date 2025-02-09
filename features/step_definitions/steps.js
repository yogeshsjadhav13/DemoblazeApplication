const { Given, When, Then } = require('@cucumber/cucumber')
const { test, expect } = require('@playwright/test');
const { UtilityFunctions } = require('../../main/utilities/UtilityFunctions');
var { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(100 * 1000);


Given('a login to Demoblaze application for {string}', async function (TestCaseName) {
    //Test data setup - Read test case Data
    this.utilityFunctionLocal = new UtilityFunctions(TestCaseName);
    this.LocalTestData = await this.utilityFunctionLocal.ReadDataFromExcel();

    //Login to the Demoblaze application
    await this.loginPage.UserLogin(this.utilityFunctionLocal);
});



When('cart cleanup is completed', async function () {
    //Delete the products in the cart if there are any from previous run
    await this.cartPage.ProductDeleteFromCart();
});



When('products are added in the cart', async function () {
    //Add products to the cart as per the data sheet
    await this.homePage.ProductAddToCart(this.LocalTestData);
});



Then('verify product are shown in the cart with correct prices and Total', async function () {
    //Verify the products in the cart with prices
    await this.cartPage.ProductCartVerification(this.LocalTestData);
});



When('user performs purchase order', async function () {
    //Checkout the cart and complete the order
    await this.cartPage.CartCheckout(this.utilityFunctionLocal, this.LocalTestData);
});



Then('the order should get placed with order ID', async function () {
    //Write the total price to the data sheet
    await this.utilityFunctionLocal.WriteDataToExcel("TotalPrice", this.LocalTestData.get("TotalPrice"));
});



Given('User is not logged into Demoblaze application for {string}', async function (TestCaseName) {
    //Test data setup - Read test case Data
    this.utilityFunctionLocal = new UtilityFunctions(TestCaseName);
    this.LocalTestData = await this.utilityFunctionLocal.ReadDataFromExcel();

    //Step 1 - Navigate to the Demoblaze application and without login proceed with car functionality
    await this.page.goto('https://www.demoblaze.com/index.html');
});



Given('a user authenticates to Demoblaze application for {string}', async function (TestCaseName) {
    //Step 1 - Test data setup - Read test case Data
    this.utilityFunctionLocal = new UtilityFunctions(TestCaseName);
    this.LocalTestData = await this.utilityFunctionLocal.ReadDataFromExcel();

    //Step 2 - Autheniticate to demoblaze application
    this.AuthToken = await this.loginPage.apiUserLogin(this.utilityFunctionLocal);
});



When('deletecart api is completed', async function () {
    //Step 3 - Delete the products in the cart if there are any from previous run
    await this.cartPage.apiDeleteCart(this.utilityFunctionLocal);
});



When('all products entries are fetched and created a map of title and id', async function () {
    //Step 4 - Fetch all product entries from the application and create a map of title and id
    this.titleIdMap = await this.homePage.apiFetchProductsEntries(this.utilityFunctionLocal);
});



When('Products are added using addtocart api', async function () {
    //Step 5 - Add products to the cart as per the data sheet
    this.cartItems = await this.homePage.apiProductAddToCart(this.utilityFunctionLocal, this.LocalTestData, this.AuthToken, this.titleIdMap);
});



Then('verify product are added in the cart', async function () {
    //Step 6 - Verify the products in the cart
    await this.cartPage.apiViewCart(this.utilityFunctionLocal, this.AuthToken, this.cartItems);
});



Then('deletecart api is executed', async function () {
    //Step 7 - Run delete API to delete the products from the cart
    await this.cartPage.apiDeleteCart(this.utilityFunctionLocal);
});
