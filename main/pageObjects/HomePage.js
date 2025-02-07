const { expect, request } = require('@playwright/test');

class HomePage {

    constructor(page) {
        this.page = page;
        this.categoriesMonitorsLink = page.locator("//a[text()='Monitors']");
        this.categoriesLaptopsLink = page.locator("//a[text()='Laptops']");
        this.categoriesPhonesLink = page.locator("//a[text()='Phones']");
        this.homePageCartLink = page.locator("//a[text()='Cart']");
        this.homePageLink = page.locator("//a[contains(text(),'Home')]");
        this.productPriceText = page.locator("//div[contains(@class,'product-content')]//h3");
        this.productAddToCartLink = page.locator("//a[text()='Add to cart']");
    }



    async ProductAddToCart(TestData) {
        var totalPrice = 0;
        var productList = (TestData.get("Products")).split(";");
        await this.categoriesPhonesLink.click();
        await this.categoriesLaptopsLink.click();
        await this.categoriesMonitorsLink.click();
        await this.page.waitForTimeout(2000);
        for (let i = 0; i < productList.length; i++) {
            if (productList[i] === "Apple monitor 24" || productList[i] === "ASUS Full HD") {
                await this.categoriesMonitorsLink.click();
            } else if (productList[i] === "Sony vaio i5" || productList[i] === "Sony vaio i7" || productList[i] === "MacBook air"
                || productList[i] === "Dell i7 8gb" || productList[i] === "2017 Dell 15.6 Inch" || productList[i] === "MacBook Pro") {
                await this.categoriesLaptopsLink.click();
            } else {
                await this.categoriesPhonesLink.click();
            }
            await this.page.getByRole('link', { name: productList[i] }).first().click();
            totalPrice = totalPrice + parseInt((((await this.productPriceText.textContent()).split(" *includes tax"))[0].split("$"))[1]);
            this.page.once('dialog', dialog => {
                console.log(productList[i] + `: ${dialog.message()}`);
                expect(dialog.message()).toContain('Product added');
                dialog.dismiss().catch(() => { });
            });
            await this.productAddToCartLink.click();
            await this.page.waitForTimeout(2000);
            await this.homePageCartLink.click();
            await this.homePageLink.click();
            console.log("Total price: " + totalPrice);
            TestData.set("TotalPrice", totalPrice);
        }
    }


    async apiFetchProductsEntries(utilityFunction) {
        const secretsData = await utilityFunction.fetchEnvironmentCreds();
        const apiRequest = await request.newContext();
        const res = await apiRequest.get(secretsData.get("baseURL") + "/entries", {
            headers: { 'Content-Type': 'application/json' }
        });
        expect(res.status()).toBe(200);
        var response = await res.json();
        const titleIdMap = new Map();
        for (const item of response.Items) {
            titleIdMap.set(item.title.trim(), item.id);
        }
        console.log(titleIdMap);
        return titleIdMap;
    }


    async apiProductAddToCart(utilityFunction, TestData, AuthToken, titleIdMap) {
        var cartItems = [];
        const secretsData = await utilityFunction.fetchEnvironmentCreds();
        const apiRequest = await request.newContext();
        var uniqueid;
        var productList = (TestData.get("Products")).split(";");
        for (let i = 0; i < productList.length; i++) {
            uniqueid = await utilityFunction.generateRandomString();
            var response = await apiRequest.post(secretsData.get("baseURL") + "/addtocart", {
                data: { "id": uniqueid, "cookie": AuthToken, "prod_id": titleIdMap.get(productList[i]), "flag": true }
            });
            expect(response.status()).toBe(200);
            cartItems[i] = { cookie: secretsData.get("apiusername") , id: uniqueid, prod_id: titleIdMap.get(productList[i]) };
        }
        console.log(cartItems);
        return cartItems;
    }
}
module.exports = { HomePage };