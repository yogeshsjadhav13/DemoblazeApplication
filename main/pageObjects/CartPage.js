const { expect, request } = require('@playwright/test');

class CartPage {

    constructor(page) {
        this.page = page;
        this.homePageCartLink = page.locator("//a[text()='Cart']");
        this.homePageLink = page.locator("//a[contains(text(),'Home')]");
        this.productPriceText = page.locator("//table//tbody/tr/td[3]");
        this.productAddToCartLink = page.locator("//a[text()='Add to cart']");
        this.deleteButtons = this.page.locator("//a[text()='Delete']");
        this.cartProductsText = this.page.locator("//h2[text()='Products']");
        this.cartTotalText = this.page.locator("//h2[text()='Total']");
        this.cartTotalPrice = this.page.locator("//h3[@id='totalp']");
        this.placeOrderButton = this.page.locator("//button[text()='Place Order']");
        this.checkoutTotalPrice = this.page.locator("//label[@id='totalm']");
        this.checkoutPurchaseButton = this.page.locator("//button[text()='Purchase']");
        this.checkoutNameInputbox = this.page.locator("//input[@id='name']");
        this.checkoutCountryInputbox = this.page.locator("//input[@id='country']");
        this.checkoutCityInputbox = this.page.locator("//input[@id='city']");
        this.checkoutCreditCardInputbox = this.page.locator("//input[@id='card']");
        this.checkoutMonthInputbox = this.page.locator("//input[@id='month']");
        this.checkoutYearInputbox = this.page.locator("//input[@id='year']");
        this.checkoutConfirmationMessage = this.page.locator("//div[contains(@class,'alert')]//h2");
        this.checkoutPurchaseDetails = this.page.locator("//p[contains(@class,'lead')]");
        this.checkoutOkButton = this.page.locator("//button[text()='OK']");
    }


    async ProductCartVerification(TestData) {
        var productList = (TestData.get("Products")).split(";");
        var totalCarPrice = 0;
        await this.homePageCartLink.click();
        await this.cartProductsText.click();
        await this.cartTotalText.click();
        for (let i = 0; i < productList.length; i++) {
            await this.page.locator("//table//tbody/tr/td[2][text()='" + productList[i] + "']").first().click();
            totalCarPrice = totalCarPrice + parseInt(await this.page.locator("//table//tbody/tr/td[2][text()='" + productList[i] + "']/following-sibling::td[1]").first().textContent());
        }
        await this.page.locator("//h3[@id='totalp'][text()='" + totalCarPrice + "']").click();
        await expect(this.cartTotalPrice).toContainText((TestData.get("TotalPrice")).toString());
        console.log("Total price of the cart is: " + totalCarPrice + " which is same as expected price: " + TestData.get("TotalPrice"));
    }



    async ProductDeleteFromCart() {
        await this.homePageCartLink.click();
        await this.homePageCartLink.click();
        await this.cartProductsText.click();
        await this.page.waitForTimeout(2000);
        console.log("Total items to be deleted: " + await this.deleteButtons.count());
        while (await this.deleteButtons.count() > 0) {
            await this.deleteButtons.first().click();
            await this.page.waitForTimeout(2000);
        }
        await this.homePageLink.click();
    }


    async CartCheckout(utilityFunction, TestData) {
        await this.homePageCartLink.click();
        await this.placeOrderButton.click();
        await expect(this.checkoutTotalPrice).toContainText((TestData.get("TotalPrice")).toString());
        this.page.once('dialog', dialog => {
            expect(dialog.message()).toBe('Please fill out Name and Creditcard.');
            dialog.dismiss().catch(() => { });
        });
        await this.checkoutPurchaseButton.click();
        await this.checkoutNameInputbox.fill('TestName');
        await this.checkoutCountryInputbox.fill('Sweden');
        await this.checkoutCityInputbox.fill('Stockholm');
        await this.checkoutCreditCardInputbox.fill('1111 2222 3333 4444');
        await this.checkoutMonthInputbox.fill('12');
        await this.checkoutYearInputbox.fill('2028');
        await this.checkoutPurchaseButton.click();
        expect(await this.checkoutConfirmationMessage.textContent()).toBe('Thank you for your purchase!');
        expect(await this.checkoutPurchaseDetails).toBeVisible();
        const textContent = await this.checkoutPurchaseDetails.textContent();
        const idMatch = textContent.match(/Id: (\d+)/);
        const amountMatch = textContent.match(/Amount: (\d+) USD/);
        const cardNumberMatch = textContent.match(/Card Number: ([\d\s]+)/);
        const nameMatch = textContent.match(/Name: (\w+)/);
        expect(parseInt(amountMatch[1])).toBe(TestData.get("TotalPrice"));
        expect(cardNumberMatch[1]).toBe('1111 2222 3333 4444');
        expect((nameMatch[1].split("Date"))[0]).toBe('TestName');
        await utilityFunction.WriteDataToExcel("OrderID", parseInt(idMatch[1]));
        const idRegex = /Id: \d+/;
        const dateRegex = /Date: \d{1,2}\/\d{1,2}\/\d{4}/;
        expect(textContent).toMatch(idRegex);
        expect(textContent).toMatch(dateRegex);
        await this.checkoutOkButton.click();
    }

    async apiDeleteCart(utilityFunction) {
        const secretsData = await utilityFunction.fetchEnvironmentCreds();
        const apiRequest = await request.newContext();
        var response = await apiRequest.post(secretsData.get("baseURL") + "/deletecart", {
            headers: { 'Content-Type': 'application/json' },
            data: { "cookie": secretsData.get("apiusername") }
        });
        expect(response.status()).toBe(200);
        const respBody = await response.text();
        expect(respBody).toContain('Item deleted.');
    }


    async apiViewCart(utilityFunction, AuthToken, cartItems) {
        const secretsData = await utilityFunction.fetchEnvironmentCreds();
        const apiRequest = await request.newContext();
        var response = await apiRequest.post(secretsData.get("baseURL") + "/viewcart", {
            headers: { 'Content-Type': 'application/json' },
            data: { "cookie": AuthToken, "flag": true }
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.Items).toHaveLength(cartItems.length);
        for (const item of cartItems) {
            expect(responseBody.Items).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(item)
                ])
            );
        }
    }
}
module.exports = { CartPage };