const { LoginPage } = require('../pageObjects/LoginPage');
const { HomePage } = require('../pageObjects/HomePage');
const { CartPage } = require('../pageObjects/CartPage');

class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.homePage = new HomePage(this.page);
        this.cartPage = new CartPage(this.page);
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