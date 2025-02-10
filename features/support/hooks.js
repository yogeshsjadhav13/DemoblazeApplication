const { After, Before } = require('@cucumber/cucumber');
const playwright = require('@playwright/test');
const { POManager } = require('../../main/utilities/POManager');
const { devices } = require('playwright');

Before({ tags: "@WebTests or @APITests" }, async function () {
    //Setting up first browser page
    this.browser = await playwright.chromium.launch({ headless: true });
    this.apiContext = await playwright.request.newContext({ignoreHTTPSErrors: true,});
    this.context = await this.browser.newContext({ignoreHTTPSErrors: true,});
    this.page = await this.context.newPage();

    //Test Object setup - Create Objects of pages to work with
    this.poManager = new POManager(this.page, this.apiContext);
    this.loginPage = this.poManager.getLoginPage();
    this.homePage = this.poManager.getHomePage();
    this.cartPage = this.poManager.getCartPage();
});


Before({ tags: "@MobileTests" }, async function () {
    //Setting up first browser page
    this.browser = await playwright.chromium.launch({ headless: true });
    this.iphone15 = devices['iPhone 15 Pro Max'];
    this.context = await this.browser.newContext({...this.iphone15,});
    this.page = await this.context.newPage();

    //Test Object setup - Create Objects of pages to work with
    this.poManager = new POManager(this.page);
    this.loginPage = this.poManager.getLoginPage();
    this.homePage = this.poManager.getHomePage();
    this.cartPage = this.poManager.getCartPage();
});


After(async function ({result, pickle}) {
    await this.context.close();
    await this.utilityFunctionLocal.WriteDataToExcel("Status", result.status);
    console.log(`Finished ${pickle.name} with status --- ${result.status}`);
});

