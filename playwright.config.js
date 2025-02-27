const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  retries: 1,
  //by default playwright runs 5 tests parallely
  workers: 1,
  timeout: 100000,
  expect: {
    timeout: 30000
  },
reporter: 'html',
//reporter: [['list', { printSteps: false }]],
//fullyParallel: true,
use:{
 actionTimeout: 30000,
 navigationTimeout: 30000,
 browserName: 'chromium',
 //...devices['iPad Pro 11 landscape'],
 headless: true,
 screenshot: 'only-on-failure',
 //accepts ssl certs related notifications
 ignoreHTTPSErrors: true,
 //accepts location related notifications
 //permissions:['geolocation'],
 video: 'off',
 trace: 'off',
 // Context geolocation.
 //geolocation: { latitude: 28.6139, longitude: 77.2090 },
 // Emulates the user locale.
 //locale: 'en-IN',
 // Grants specified permissions to the browser context.
 //permissions: ['geolocation'],
 // Emulates the user timezone.
 //timezoneId: 'Asia/Kolkata',
 viewport: {width: 1500, height: 720}
 //viewport: {width: 1880, height: 1020},
   
  },
};

module.exports = config;
