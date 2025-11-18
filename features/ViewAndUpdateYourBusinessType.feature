Feature: View And Update Your BusinessType Page Test scenarios

  @test1
  Scenario: Verify  PhoneNumber gets updated post changes on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I update phone number
    Then Verfiy updated phone details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessPhoneNumbers" on the page ViewAndUpdateYourBusinessType

  @test2
  Scenario: Verify  Email gets updated post change on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I update Email
    Then Verfiy Updated email details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessEmailAddress" on the page ViewAndUpdateYourBusinessType

  @test3 @demo
  Scenario: Verify  postal address gets updated post change on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I update Business Address
    Then Verfiy Updated Business Address details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessAddress" on the page ViewAndUpdateYourBusinessType

  @test4
  Scenario: Verify  Business Name gets updated post change on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessName" link on the BusinessDetails page
    And I update Business Name
    Then Verfiy Updated Business Name details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessName" on the page ViewAndUpdateYourBusinessType

  @test5
  Scenario Outline: Verify  Application is landing on the appropriate signout page after clicking signout link from any page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
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

  @test6 @demo1
  Scenario: Signout from opening in multitab
    Given I sign In on the first tab
    When I open another tab with the same session
    And I signOut on the first tab
    And I switch to the second tab
    And I click on the link on the second tab
    Then I should be redirected to the signIn page from the second tab

  @test7 @demo
  Scenario Outline: Verify all relevant details shown whilist cliking the BusinessLegalStatus and BusinessType Link
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "<ExpectedLink>" link on the BusinessDetails page
    Then Verfiy all relevant details on the "<ExpectedPage>" page are been displayed correctly

    Examples:
      | ExpectedLink        | ExpectedPage           |
      | BusinessType        | ChangeYourBusinessType |
      | BusinessLegalStatus | ChangeYourLegalStatus  |

  @test9 @demo
  Scenario: Verify  PhoneNumber gets updated post changes on ViewAndUpdateYourBusinessType page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I update phone number
    Then Verfiy updated phone details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessPhoneNumbers" on the page ViewAndUpdateYourBusinessType

  @test8
  Scenario: Verify  Business Name gets updated again by by clicking change link on WhatIsYourBusinessName page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessName" link on the BusinessDetails page
  #  And I update Business Name
    And I update Business Name and click the Change link in CheckYourBusinessNameIsCorrectBeforeSubmitting Page
    And Change the Business Name again in WhatIsYourBusinessName? Page
    Then Verfiy Updated Business Name details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessName" on the page ViewAndUpdateYourBusinessType

  @test9 @demo
  Scenario: Verify  postal address gets updated again by clicking change link on EnterYourBusinessAddress page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessAddress" link on the BusinessDetails page
   # And I update Business Address
    And I update Business Address and click the Change link in CheckYourBusinessAddressIsCorrectBeforeSubmitting Page
    And Change the Business Address again in EnterYourBusinessAddress Page
    Then Verfiy Updated Business Address details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessAddress" on the page ViewAndUpdateYourBusinessType

  @test10 @demo
  Scenario: Verify  PhoneNumber address gets updated again by clicking change link on CheckYourBusinessPhoneNumbersAreCorrectBeforeSubmitting page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I update Business PhoneNumber and click the Change link in CheckYourBusinessPhoneNumbersAreCorrectBeforeSubmitting Page
    And Change the Business PhoneNumber again in WhatAreYourBusinessPhoneNumbers? Page
    Then Verfiy Updated Business PhoneNumber details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessPhonenumbers" on the page ViewAndUpdateYourBusinessType

  @test11 @demo
  Scenario: Verify  BusinessEmailAddress address gets updated again by clicking change link on CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I update Business EmailAddress and click the Change link in CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting Page
    And Change the Business EmailAddress again in CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting Page
    Then Verfiy Updated Business EmailAddress details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessEmailAddress" on the page ViewAndUpdateYourBusinessType

  @test12a @demo
  Scenario Outline: Verify relevant Error message displaying for various validation criterias on BusinessAddress page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the BusinessAddress page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField       | TestData | ErrorMessage                                            |
      | AddressLine1    |      101 | Address line 1 must be 100 characters or less           |
      | AddressLine2    |      101 | Address line 2 must be 100 characters or less           |
      | BusinessCounty  |      101 | County must be 100 characters or less                   |
      | BusinessCountry |       61 | Country must be 60 characters or less                   |
      | BusinessTown    |      101 | Town or city must be 100 characters or less             |
      | AddressLine1    |        0 | Enter address line 1, typically the building and street |
      | BusinessCountry |        0 | Enter a country                                         |
      | BusinessTown    |        0 | Enter town or city                                      |

  @test12a
  Scenario Outline: Verify relevant Error message displaying for various validation criterias on WhatIsYourBusinessName page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessName" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField    | TestData | ErrorMessage                                 | ValidationPage         |
      | BusinessName |      301 | Business name must be 300 characters or less | WhatIsYourBusinessName |
      | BusinessName |        0 | Enter business name                          | WhatIsYourBusinessName |

  @test12aa
  Scenario Outline: Verify relevant Error message displaying for various validation criterias on WhatAreYourBusinessPhoneNumbers? page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField              | TestData | ErrorMessage                                             | ValidationPage                  |
      | BusinessPhone          |      101 | Business telephone number must be 100 characters or less | WhatAreYourBusinessPhoneNumbers |
      | BusinessPhone          |        1 | Business telephone number must be 10 characters or more  | WhatAreYourBusinessPhoneNumbers |
      | BusinessAndMobilePhone |          | Enter at least one phone number                          | WhatAreYourBusinessPhoneNumbers |

  @test12aab
  Scenario Outline: Verify relevant Error message displaying for various validation criterias on WhatIsYourBusinessEmailAddress? page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField            | TestData | ErrorMessage                                          | ValidationPage                 |
      | BusinessEmailAddress |      255 | Business email address must be 254 characters or less | WhatIsYourBusinessEmailAddress |
      | BusinessEmailAddress |          | Enter business email address                          | WhatIsYourBusinessEmailAddress |

  @test13
  Scenario Outline: Verify  Application is navigating to SignInToFarmingFrontDoor page post clicking SignIn link in LandAndFarmService page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click signOut link on the "<SignOutPage>" page
    And I click a link signIn link in LandAndFarmService page
    Then Application should Navigate to SignInToFarmingFrontDoor page.

    Examples:
      | SignOutPage                     |
      | ViewAndUpdateYourBusinessType   |
      | WhatIsYourBusinessName          |
      | EnterYourBusinessAddress        |
      | WhatAreYourBusinessPhoneMembers |
      | WhatIsYourBusinessEmailAddress  |
      | ChangeYourBusinessType          |

  @test14
  Scenario Outline: Verify  Application is displaying relevant message in ViewAndUpdateYourBusinessType page whilist selecting Yes or No in AreYouSureYouWantToRemoveYourVATRegistrationNumber page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I add the VAT Number
    And I click "<Link>" link
    And I click "<VATregistrationButton>" button in the AreYouSureYouWantToRemoveYourVATRegistrationNumber page
    Then Verify Success Updated message is displayed for "<VATregistrationButton>" on the page ViewAndUpdateYourBusinessType

    Examples:
      | VATregistrationButton | Link   |
      | Yes                   | Remove |
      | No                    | Remove |

  @test15
  Scenario Outline: Verify  Application successfully display updated the VATnumber in ViewAndUpdateYourBusinessType whilist changing the VATnumber in WhatIsYourVATRegistrationNumber page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I add the VAT Number
    And I click "<Link>" link
    And I Update the VAT number in WhatIsYourVATRegistrationNumber page and submit
    Then ViewAndUpdateYourBusinessType page should display updated VAT number
    And Verify Success Updated message is displayed for "VATnumber" on the page ViewAndUpdateYourBusinessType

    Examples:
      | Link   |
      | Change |

  @test16
  Scenario Outline: Verify relevant Error message displaying for various validation criterias on  WhatIsYourVATRegistrationNumber page
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I add the VAT Number
    And I click "<Link>" link
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | Link   | TextField | TestData | ErrorMessage                                    | ValidationPage                  |
      | Change | VATnumber |        8 | Enter a VAT registration number, like 123456789 | WhatIsYourVATRegistrationNumber |
      | Change | VATnumber |          | Enter a VAT registration number                 | WhatIsYourVATRegistrationNumber |
      | Change | VATnumber |       10 | Enter a VAT registration number, like 123456789 | WhatIsYourVATRegistrationNumber |

  @test17 @demo
  Scenario: Verify  Personal PhoneNumber gets updated post changes on ViewAndUpdateYourPersonalDetails page
    Given I am on SignIn page and enter the credentials for "PersonalDetails"
    When I click the "PersonalPhoneNumbers" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal phone number
    Then Verfiy updated phone details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly
    And Verify Success Updated message is displayed for "PersonalPhoneNumbers" on the page ViewAndUpdateYourPersonalDetails page

  @test18 @tt
  Scenario: Verify  Personal Name gets updated post change on ViewAndUpdateYourPersonalDetails page
    Given I am on SignIn page and enter the credentials for "PersonalDetails"
    When I click the "FullName" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal Name
    Then Verfiy Updated Personal Full Name details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly
    And Verify Success Updated message is displayed for "FullName" on the page ViewAndUpdateYourPersonalDetails page

  @test19 @tt
  Scenario: Verify  Personal Name gets updated again by clicking change link on CheckYourNameIsCorrectBeforeSubmitting page
    Given I am on SignIn page and enter the credentials for "PersonalDetails"
    When I click the "FullName" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal Name and click the Change link in CheckYourNameIsCorrectBeforeSubmitting page
    And Change the Personal Name again in WhatIsYourFullName? Page
    Then Verfiy Updated Personal Full Name details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly
    And Verify Success Updated message is displayed for "FullName" on the page ViewAndUpdateYourPersonalDetails page