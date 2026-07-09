Feature: Update business details

  Background:
    Given I am on SignIn page and enter the credentials for "BusinessDetails"

  @test1 @sfd175
  Scenario: Verify phone number gets updated on ViewAndUpdateYourBusinessType page
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I update phone number
    Then Verfiy updated phone details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessPhoneNumbers" on the page ViewAndUpdateYourBusinessType

  @test2 @sfd175
  Scenario: Verify email gets updated on ViewAndUpdateYourBusinessType page
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I update Email
    Then Verfiy Updated email details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessEmailAddress" on the page ViewAndUpdateYourBusinessType

  @test3 @sfd174
  Scenario: Verify postal address gets updated on ViewAndUpdateYourBusinessType page
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I update Business Address
    Then Verfiy Updated Business Address details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessAddress" on the page ViewAndUpdateYourBusinessType

  @test4 @sfd174
  Scenario: Verify business name gets updated on ViewAndUpdateYourBusinessType page
    When I click the "BusinessName" link on the BusinessDetails page
    And I update Business Name
    Then Verfiy Updated Business Name details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessName" on the page ViewAndUpdateYourBusinessType

  @test9 @sfd285
  Scenario: Verify business name gets updated again by clicking change link on CheckYourBusinessNameIsCorrectBeforeSubmitting page
    When I click the "BusinessName" link on the BusinessDetails page
    And I update Business Name and click the Change link in CheckYourBusinessNameIsCorrectBeforeSubmitting Page
    And Change the Business Name again in WhatIsYourBusinessName? Page
    Then Verfiy Updated Business Name details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessName" on the page ViewAndUpdateYourBusinessType

  @test10 @sfd285
  Scenario: Verify postal address gets updated again by clicking change link on EnterYourBusinessAddress page
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I update Business Address and click the Change link in CheckYourBusinessAddressIsCorrectBeforeSubmitting Page
    And Change the Business Address again in EnterYourBusinessAddress Page
    Then Verfiy Updated Business Address details on the ChangeYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessAddress" on the page ViewAndUpdateYourBusinessType

  @test11 @sfd287
  Scenario: Verify phone number gets updated again by clicking change link on CheckYourBusinessPhoneNumbersAreCorrectBeforeSubmitting page
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I update Business PhoneNumber and click the Change link in CheckYourBusinessPhoneNumbersAreCorrectBeforeSubmitting Page
    And Change the Business PhoneNumber again in WhatAreYourBusinessPhoneNumbers? Page
    Then Verfiy Updated Business PhoneNumber details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessPhonenumbers" on the page ViewAndUpdateYourBusinessType

  @test12 @sfd287
  Scenario: Verify business email address gets updated again by clicking change link on CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting page
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I update Business EmailAddress and click the Change link in CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting Page
    And Change the Business EmailAddress again in CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting Page
    Then Verfiy Updated Business EmailAddress details on the ViewAndUpdateYourBusinessType page are been displayed correctly
    And Verify Success Updated message is displayed for "BusinessEmailAddress" on the page ViewAndUpdateYourBusinessType

  @test5 @sfd176
  Scenario Outline: Verify application lands on the appropriate sign out page after clicking sign out from any page
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

  @test17 @sfd324
  Scenario Outline: Verify application navigates to SignInToFarmingFrontDoor page after clicking sign in link on the signed out page
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

  @test18 @sfd325
  Scenario Outline: Verify application displays relevant message when selecting Yes or No on AreYouSureYouWantToRemoveYourVATRegistrationNumber page
    When I add the VAT Number
    And I click "<Link>" link
    And I click "<VATregistrationButton>" button in the AreYouSureYouWantToRemoveYourVATRegistrationNumber page
    Then Verify Success Updated message is displayed for "<VATregistrationButton>" on the page ViewAndUpdateYourBusinessType

    Examples:
      | VATregistrationButton | Link   |
      | Yes                   | Remove |
      | No                    | Remove |

  @test19 @sfd383
  Scenario Outline: Verify updated VAT number is displayed on ViewAndUpdateYourBusinessType page
    When I add the VAT Number
    And I click "<Link>" link
    And I Update the VAT number in WhatIsYourVATRegistrationNumber page and submit
    Then ViewAndUpdateYourBusinessType page should display updated VAT number
    And Verify Success Updated message is displayed for "VATnumber" on the page ViewAndUpdateYourBusinessType

    Examples:
      | Link   |
      | Change |

  @test13 @sfd286
  Scenario Outline: Verify relevant error message for various validation criteria on BusinessAddress page
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the BusinessAddress page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField       | TestData | ErrorMessage                                            |
      | AddressLine1    |      101 | Address line 1 must be 100 characters or less           |
      | AddressLine2    |      101 | Address line 2 must be 100 characters or less           |
      | BusinessCounty  |      101 | County must be 60 characters or less                    |
      | BusinessCountry |       61 | Country must be 60 characters or less                   |
      | BusinessTown    |      101 | Town or city must be 60 characters or less              |
      | AddressLine1    |        0 | Enter address line 1, typically the building and street |
      | BusinessCountry |        0 | Enter a country                                         |
      | BusinessTown    |        0 | Enter town or city                                      |

  @test14 @sfd286
  Scenario Outline: Verify relevant error message for various validation criteria on WhatIsYourBusinessName page
    When I click the "BusinessName" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField    | TestData | ErrorMessage                                 | ValidationPage         |
      | BusinessName |      301 | Business name must be 160 characters or less | WhatIsYourBusinessName |
      | BusinessName |        0 | Enter business name                          | WhatIsYourBusinessName |

  @test15 @sfd288
  Scenario Outline: Verify relevant error message for various validation criteria on WhatAreYourBusinessPhoneNumbers page
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField              | TestData | ErrorMessage                                            | ValidationPage                  |
      | BusinessPhone          |      101 | Business telephone number must be 50 characters or less | WhatAreYourBusinessPhoneNumbers |
      | BusinessPhone          |        1 | Business telephone number must be 10 characters or more | WhatAreYourBusinessPhoneNumbers |
      | BusinessAndMobilePhone |          | Enter at least one phone number                         | WhatAreYourBusinessPhoneNumbers |

  @test16 @sfd288
  Scenario Outline: Verify relevant error message for various validation criteria on WhatIsYourBusinessEmailAddress page
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField            | TestData | ErrorMessage                                          | ValidationPage                 |
      | BusinessEmailAddress |      255 | Business email address must be 254 characters or less | WhatIsYourBusinessEmailAddress |
      | BusinessEmailAddress |          | Enter business email address                          | WhatIsYourBusinessEmailAddress |

  @test20 @sfd383
  Scenario Outline: Verify relevant error message for various validation criteria on WhatIsYourVATRegistrationNumber page
    When I add the VAT Number
    And I click "<Link>" link
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | Link   | TextField | TestData | ErrorMessage                                    | ValidationPage                  |
      | Change | VATnumber |        8 | Enter a VAT registration number, like 123456789 | WhatIsYourVATRegistrationNumber |
      | Change | VATnumber |          | Enter a VAT registration number                 | WhatIsYourVATRegistrationNumber |
      | Change | VATnumber |       10 | Enter a VAT registration number, like 123456789 | WhatIsYourVATRegistrationNumber |

  @test45 @sfd2-809
  Scenario: Verify  Application is displaying relevant message whilist selecting Yes or No in AreYouSureYouWantToRemoveYourVATRegistrationNumber page
    When I add the VAT Number
    And I click "Remove" link
    And I click VAT submit button
    Then error message "Select yes if you want to remove your VAT registration number" on the page AreYouSureYouWantToRemoveYourVATRegistrationNumber page

  @test48 @sfd2-806
  Scenario Outline: Verify relevant Error message displaying for various validation criterias on WhatAreYourBusinessPhoneNumbers? page
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField              | TestData | ErrorMessage                                                | ValidationPage                  |
      | BusinessPhone          |       51 | Business telephone number must be 50 characters or less     | WhatAreYourBusinessPhoneNumbers |
      | BusinessPhone          |        1 | Business telephone number must be 10 characters or more     | WhatAreYourBusinessPhoneNumbers |
      | BusinessMobilePhone    |       51 | Business mobile phone number must be 50 characters or less  | WhatAreYourBusinessPhoneNumbers |
      | BusinessMobilePhone    |        1 | Business mobile phone number must be 10 characters or more  | WhatAreYourBusinessPhoneNumbers |
      | BusinessAndMobilePhone |          | Enter at least one phone number                             | WhatAreYourBusinessPhoneNumbers |

  @test49 @sfd2-806
  Scenario Outline: Verify format error displays for invalid characters (over 10 chars) on WhatAreYourBusinessPhoneNumbers? page
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I enter invalid characters "<InvalidChars>" on the "<TextField>" field on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField           | InvalidChars | ErrorMessage                                                                                                        | ValidationPage                  |
      | BusinessPhone       | abc!$%abc!$% | Business telephone number must only include numbers 0 to 9 and special characters such as spaces, brackets and +    | WhatAreYourBusinessPhoneNumbers |
      | BusinessMobilePhone | abc!$%abc!$% | Business mobile phone number must only include numbers 0 to 9 and special characters such as spaces, brackets and + | WhatAreYourBusinessPhoneNumbers |

  @test51 @sfd2-812
  Scenario: Verify Back and Sign out links are correct on WhatIsYourBusinessName page
    When I click the "BusinessName" link on the BusinessDetails page
    Then the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref      |
      | Back     | /business-details |
      | Sign out | /auth/sign-out    |

  @test52 @sfd2-813
  Scenario: Verify Back, Sign out and Change links are correct on CheckYourBusinessNameIsCorrectBeforeSubmitting page
    When I click the "BusinessName" link on the BusinessDetails page
    And I navigate to the CheckYourBusinessNameIsCorrectBeforeSubmitting page
    Then the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref          |
      | Back     | /business-name-change |
      | Sign out | /auth/sign-out        |    

  @test53 @sfd2-814
  Scenario: Verify elements and links are correct on WhatIsYourBusinessAddress page
    When I click the "BusinessAddress" link on the BusinessDetails page
    Then following texts should be visible:
      | Text                                                          |
      | Single business identifier (SBI):                             |
      | What is your business address?                                |
      | If you do not have a UK postcode, enter the address manually. |
      | UK postcode                                                   |
    And the following links should have the correct hrefs on the page:
      | Text                   | ExpectedHref            |
      | Back                   | /business-details       |
      | Sign out               | /auth/sign-out          |
      | Enter address manually | /business-address-enter |

  @test54 @sfd2-815
  Scenario: Verify elements and links are correct on ChooseYourBusinessAddress page
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I enter a valid postcode and continue to ChooseYourBusinessAddress page
    Then following texts should be visible:
      | Text                              |
      | Single business identifier (SBI): |
      | Choose your business address      |
      | Select an address                 |
      | UK postcode                       |
    And the following links should have the correct hrefs on the page:
      | Text                   | ExpectedHref             |
      | Back                   | /business-address-change |
      | Sign out               | /auth/sign-out           |
      | Enter address manually | /business-address-enter  |
      | Change                 | /business-address-change |        

  @test55 @sfd2-815
  Scenario: Verify business address can be updated using postcode lookup
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I enter a valid postcode and continue to ChooseYourBusinessAddress page
    And I select an address and submit
    Then Verify Success Updated message is displayed for "BusinessAddress" on the page ViewAndUpdateYourBusinessType  

  @test56 @sfd2-817
  Scenario: Verify Back, Sign out and Change links are correct on CheckYourBusinessAddressIsCorrectBeforeSubmitting page
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I navigate to the CheckYourBusinessAddressIsCorrectBeforeSubmitting page
    Then the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref            |
      | Back     | /business-address-enter |
      | Sign out | /auth/sign-out          |
      | Change   | /business-address-enter |  

  @test57 @sfd2-818
  Scenario: Verify elements and links are correct on WhatAreYourBusinessPhoneNumbers page
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    Then following texts should be visible:
      | Text                              |
      | Single business identifier (SBI): |
      | What are your business phone numbers? |
      | Enter at least one phone number   |
      | Business telephone number         |
      | Business mobile phone number      |
    And the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref      |
      | Back     | /business-details |
      | Sign out | /auth/sign-out    |    

  @test58 @sfd2-819
  Scenario: Verify elements and links are correct on CheckYourBusinessPhoneNumbersAreCorrectBeforeSubmitting page
    When I click the "BusinessPhoneNumbers" link on the BusinessDetails page
    And I navigate to the CheckYourBusinessPhoneNumbersAreCorrectBeforeSubmitting page
    Then following texts should be visible:
      | Text                                                            |
      | Single business identifier (SBI):                               |
      | Check your business phone numbers are correct before submitting |
      | Business phone numbers                                          |
    And the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref                    |
      | Back     | /business-phone-numbers-change  |
      | Sign out | /auth/sign-out                  |
      | Change   | /business-phone-numbers-change  |    

  @test59 @sfd2-820
  Scenario: Verify elements and links are correct on WhatIsYourBusinessEmailAddress page
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    Then following texts should be visible:
      | Text                                 |
      | Single business identifier (SBI):    |
      | What is your business email address? |
    And the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref      |
      | Back     | /business-details |
      | Sign out | /auth/sign-out    |    

  @test60 @sfd2-821
  Scenario: Verify elements and links are correct on CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting page
    When I click the "BusinessEmailAddress" link on the BusinessDetails page
    And I navigate to the CheckYourBusinessEmailAddressIsCorrectBeforeSubmitting page
    Then following texts should be visible:
      | Text                                                           |
      | Single business identifier (SBI):                              |
      | Check your business email address is correct before submitting |
      | Business email address                                         |
    And the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref           |
      | Back     | /business-email-change |
      | Sign out | /auth/sign-out         |
      | Change   | /business-email-change |

  @test61 @sfd2-822
  Scenario: Verify elements and links are correct on AreYouSureYouWantToRemoveYourVATRegistrationNumber page
    When I add the VAT Number
    And I click "Remove" link
    Then following texts should be visible:
      | Text                                                         |
      | Single business identifier (SBI):                            |
      | Are you sure you want to remove your VAT registration number? |
    And the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref      |
      | Back     | /business-details |
      | Sign out | /auth/sign-out    |

  @test62 @sfd2-823
  Scenario: Verify elements and links are correct on WhatIsYourVATRegistrationNumber page
    When I navigate to the WhatIsYourVATRegistrationNumber page
    Then following texts should be visible:
      | Text                                                                                                                                                                                            |
      | Single business identifier (SBI):                                                                                                                                                               |
      | What is your VAT registration number?                                                                                                                                                           |
      | This is the 9 digit number on your VAT registration certification. You only need to enter the numbers. For example, if your VAT registration number is GB123456789, you should enter 123456789. |
    And the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref      |
      | Back     | /business-details |
      | Sign out | /auth/sign-out    |

  @test63 @sfd2-824
  Scenario: Verify elements and links are correct on CheckYourVATRegistrationNumberIsCorrectBeforeSubmitting page
    When I navigate to the CheckYourVATRegistrationNumberIsCorrectBeforeSubmitting page
    Then following texts should be visible:
      | Text                                                            |
      | Single business identifier (SBI):                               |
      | Check your VAT registration number is correct before submitting |
      | VAT registration number                                         |
    And the following links should have the correct hrefs on the page:
      | Text     | ExpectedHref                            |
      | Back     | /business-vat-registration-number-change |
      | Sign out | /auth/sign-out                           |
      | Change   | /business-vat-registration-number-change |    

  @test75 @sfd2-716
  Scenario Outline: Verify relevant error message for various validation criteria on WhatIsYourBusinessAddress page
    When I click the "BusinessAddress" link on the BusinessDetails page
    And I enter the test data on with value as "<TestData>" on the WhatIsYourBusinessAddress page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TestData | ErrorMessage                           |
      |          | Enter a postcode                       |
      | BG20 9X  | Enter a full UK postcode, like AA3 1AB |
      | BG20 9XE | No addresses found for this postcode   |  