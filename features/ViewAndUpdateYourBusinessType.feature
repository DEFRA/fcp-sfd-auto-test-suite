Feature: View And Update Your BusinessType Page Test scenarios

  @test1 @sfd175
  Scenario: Verify  PhoneNumber gets updated post changes on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I update phone number
    Then Verfiy updated phone details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessPhoneNumbers" on the page ViewAndUpdateYourBusinessType

  @test2 @sfd175
  Scenario: Verify  Email gets updated post change on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I update Email
    Then Verfiy Updated email details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessEmailAddress" on the page ViewAndUpdateYourBusinessType

 