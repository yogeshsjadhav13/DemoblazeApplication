Feature: Mobile tests for Demoblaze application

  @MobileTests
  Scenario: Perform E2E cart checkout functionality with login to Mobile web application
    Given a login to Demoblaze application for "TC001_Demoblaze_MobileTest"
    When cart cleanup is completed
    When products are added in the cart
    Then verify product are shown in the cart with correct prices and Total
    When user performs purchase order
    Then the order should get placed with order ID