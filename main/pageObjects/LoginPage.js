const { expect } = require('@playwright/test');

class LoginPage {

    constructor(page, apiContext) {
        this.page = page;
        this.apiContext = apiContext;
        this.homePageLoginLink = page.locator("//a[text()='Log in']");
        this.usernameTextbox = page.locator("//input[@id='loginusername']");
        this.passwordTextbox = page.locator("//input[@id='loginpassword']");
        this.loginButton = page.locator("//button[text()='Log in']");
    }



    async UserLogin(utilityFunction) {
        const secretsData = await utilityFunction.fetchEnvironmentCreds();
        await this.page.goto(secretsData.get("environmentURL"));
        await this.homePageLoginLink.click();
        await this.usernameTextbox.fill(secretsData.get("username"));
        await this.passwordTextbox.fill(secretsData.get("password"));
        await this.loginButton.click();
        await this.page.getByRole('link', { name: 'Welcome '+secretsData.get("username") }).click();
    }


    async apiUserLogin(utilityFunction){
        const secretsData = await utilityFunction.fetchEnvironmentCreds();
          var response = await this.apiContext.post(secretsData.get("baseURL") + "/login",
            {
              headers: { "content-type": "application/json" },
              data: { "username": secretsData.get("apiusername"), "password": secretsData.get("apipassword") }
            });
          expect(response.status()).toBe(200);
          var data = await response.json();
          var AuthToken = data.split("Auth_token: ")[1];
          return AuthToken;
    }

    
}
module.exports = { LoginPage };