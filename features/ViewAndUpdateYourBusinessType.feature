Feature: View And Update Your BusinessType Page Test scenarios

  @test1
  Scenario: Verify  PhoneNumber gets updated post changes on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I update phone number
    Then Verfiy updated phone details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessPhoneNumbers" on the page ViewAndUpdateYourBusinessType

  @test2
  Scenario: Verify  Email gets updated post change on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I update Email
    Then Verfiy Updated email details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessEmailAddress" on the page ViewAndUpdateYourBusinessType

  @test3 @demo
  Scenario: Verify  postal address gets updated post change on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I update Business Address
    Then Verfiy Updated Business Address details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessAddress" on the page ViewAndUpdateYourBusinessType

  @test4
  Scenario: Verify  Business Name gets updated post change on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials
    When I click the "BusinessName" link on the BusinessDetails page
    And I update Business Name
    Then Verfiy Updated Business Name details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessName" on the page ViewAndUpdateYourBusinessType

  @test5
  Scenario Outline: Verify  Application is landing on the appropriate signout page after clicking signout link from any page
    Given I am on SignIn page and enter the credentials
    When I click signOut link on the "<SignOutPage>" page
    Then Application should Navigate to mp06 Signed Out page.

    Examples:
      | SignOutPage                     |
      | ViewAndUpdateYourBusinessType   |
      | WhatIsYourBusinessName          |
      | EnterYourBusinessAddress        |
      | WhatAreYourBusinessPhoneMembers |
      | WhatIsYourBusinessEmailAddress  |
      | ChangeYourBusinessType          |

  @test6 @demo
  Scenario: Signout from opening in multitab
    Given I sign In on the first tab
    When I open another tab with the same session
    And I signOut on the first tab
    And I switch to the second tab
    And I click on the link on the second tab
    Then I should be redirected to the signIn page from the second tab

  @test7 @demo
  Scenario Outline: Verify all relevant details shown whilist cliking the BusinessLegalStatus and BusinessType Link
    Given I am on SignIn page and enter the credentials
    When I click the "<ExpectedLink>" link on the BusinessDetails page
    Then Verfiy all relevant details on the "<ExpectedPage>" page are been displayed correctly

    Examples:
      | ExpectedLink        | ExpectedPage           |
      | BusinessType        | ChangeYourBusinessType |
      | BusinessLegalStatus | ChangeYourLegalStatus  |
