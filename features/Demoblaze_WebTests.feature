Feature: Web tests for Demoblaze application

  @WebTests
  Scenario: Perform E2E cart checkout functionality with login to application
    Given a login to Demoblaze application for "TC001_Demoblaze_WebTest"
    When cart cleanup is completed
    When products are added in the cart
    Then verify product are shown in the cart with correct prices and Total
    When user performs purchase order
    Then the order should get placed with order ID

  @WebTests
  Scenario: Perform E2E cart checkout functionality without login to application
    Given User is not logged into Demoblaze application for "TC002_Demoblaze_WebTest"
    When cart cleanup is completed
    When products are added in the cart
    Then verify product are shown in the cart with correct prices and Total
    When user performs purchase order
    Then the order should get placed with order ID

  @WebTests
  Scenario: Perform delete cart items functionality
    Given a login to Demoblaze application for "TC003_Demoblaze_WebTest"
    When products are added in the cart
    When cart cleanup is completed
