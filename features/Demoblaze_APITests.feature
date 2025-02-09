Feature: API tests for Demoblaze application

  @APITests
  Scenario: Perform product cart validations using APIs
    Given a user authenticates to Demoblaze application for "TC001_Demoblaze_APITest"
    When deletecart api is completed
    When all products entries are fetched and created a map of title and id
    When Products are added using addtocart api
    Then verify product are added in the cart
    Then deletecart api is executed