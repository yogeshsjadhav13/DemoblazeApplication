const { LoginPage } = require('../pageObjects/LoginPage');
const { HomePage } = require('../pageObjects/HomePage');
const { CartPage } = require('../pageObjects/CartPage');

class POManager {
    constructor(page, apiContext) {
        this.page = page;
        this.apiContext = apiContext;
        this.loginPage = new LoginPage(this.page, this.apiContext);
        this.homePage = new HomePage(this.page, this.apiContext);
        this.cartPage = new CartPage(this.page, this.apiContext);
    }
    getLoginPage() {
        return this.loginPage;
    }
    getHomePage() {
        return this.homePage;
    }
    getCartPage() {
        return this.cartPage;
    }
}
module.exports = { POManager };