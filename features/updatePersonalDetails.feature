Feature: Update personal details

  Background:
    Given I am on SignIn page and enter the credentials for "PersonalDetails"

  @test21 @sfd351
  Scenario: Verify personal phone number gets updated on ViewAndUpdateYourPersonalDetails page
    When I click the "PersonalPhoneNumbers" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal phone number
    Then Verfiy updated phone details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly
    And Verify Success Updated message is displayed for "PersonalPhoneNumbers" on the page ViewAndUpdateYourPersonalDetails page

  @test22 @sfd347
  Scenario: Verify personal name gets updated on ViewAndUpdateYourPersonalDetails page
    When I click the "FullName" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal Name
    Then Verfiy Updated Personal Full Name details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly
    And Verify Success Updated message is displayed for "FullName" on the page ViewAndUpdateYourPersonalDetails page

  @test23 @sfd347
  Scenario: Verify personal name gets updated again by clicking change link on CheckYourNameIsCorrectBeforeSubmitting page
    When I click the "FullName" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal Name and click the Change link in CheckYourNameIsCorrectBeforeSubmitting page
    And Change the Personal Name again in WhatIsYourFullName? Page
    Then Verfiy Updated Personal Full Name details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly
    And Verify Success Updated message is displayed for "FullName" on the page ViewAndUpdateYourPersonalDetails page

  @test26 @sfd349
  Scenario Outline: Verify personal postal address gets updated on ViewAndUpdateYourPersonalDetails page
    When I click the "PersonalAddress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I Update the Personal address "<AddressType>"
    And Verify Success Updated message is displayed for "PersonalAddress" on the page ViewAndUpdateYourPersonalDetails page

    Examples:
      | AddressType    |
      | Manually       |
      | PostcodeLookup |

  @test27 @sfd349
  Scenario: Verify personal postal address gets updated again by clicking change link on CheckYourPersonalAddressIsCorrectBeforeSubmitting page
    When I click the "PersonalAddress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal Address Manually and click the Change link in CheckYourPersonalAddressIsCorrectBeforeSubmitting Page
    And Change the Personal Address Manually again in EnterYourPersonalAddress Page
    Then Verfiy updated Personal Address Manually changed details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly

  @test30 @sfd350
  Scenario: Verify personal date of birth gets updated on ViewAndUpdateYourPersonalDetails page
    When I click the "PersonalDOB" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update the dob
    And Verify Success Updated message is displayed for "DOB" on the page ViewAndUpdateYourPersonalDetails page

  @test34 @sfd348
  Scenario: Verify personal email address gets updated on ViewAndUpdateYourPersonalDetails page
    When I click the "personalemailaddress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal Email
    Then Verfiy Updated Personal Email Address details on the ViewAndUpdateYourPersonalDetails page are been displayed correctly
    And Verify Success Updated message is displayed for "personalemailaddress" on the page ViewAndUpdateYourPersonalDetails page

  @test24 @sfd385
  Scenario Outline: Verify relevant error message for various validation criteria on WhatAreYourPersonalPhoneNumbers page
    When I click the "PersonalPhoneNumbers" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField              | TestData | ErrorMessage                                               | ValidationPage                  |
      | PersonalPhone          |      101 | Personal telephone number must be 50 characters or less    | WhatAreYourPersonalPhoneNumbers |
      | PersonalPhone          |        1 | Personal telephone number must be 10 characters or more    | WhatAreYourPersonalPhoneNumbers |
      | PersonalAndMobilePhone |          | Enter at least one phone number                            | WhatAreYourPersonalPhoneNumbers |
      | PersonalMobilePhone    |      101 | Personal mobile phone number must be 50 characters or less | WhatAreYourPersonalPhoneNumbers |
      | PersonalMobilePhone    |        1 | Personal mobile phone number must be 10 characters or more | WhatAreYourPersonalPhoneNumbers |

  @test28 @sfd457
  Scenario Outline: Verify relevant error message for various validation criteria on EnterYourPersonalAddress page
    When I click the "PersonalAddress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the EnterYourPersonalAddress page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField    | TestData | ErrorMessage                                            |
      | AddressLine1 |      101 | Address line 1 must be 100 characters or less           |
      | AddressLine2 |      101 | Address line 2 must be 100 characters or less           |
      | County       |      101 | County must be 60 characters or less                    |
      | Country      |       61 | Country must be 60 characters or less                   |
      | Town         |      101 | Town or city must be 60 characters or less              |
      | AddressLine1 |        0 | Enter address line 1, typically the building and street |
      | Country      |        0 | Enter a country                                         |
      | Town         |        0 | Enter town or city                                      |

  @test29 @sfd457
  Scenario Outline: Verify relevant error message for postcode validation on WhatIsYourPersonalAddress page
    When I click the "PersonalAddress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter the test data on with value as "<TestData>" on the WhatIsYourPersonalAddress page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TestData  | ErrorMessage                             |
      |           | Enter a postcode                         |
      | BS1   5AH | Postal code must be 8 characters or less |

  @test32 @sfd455
  Scenario Outline: Verify relevant error message for various validation criteria on WhatIsYourFullName page
    When I click the "FullName" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the WhatIsYourFullName? page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField          | TestData | ErrorMessage                                |
      | Personalfirstname  |      101 | First name must be 100 characters or less   |
      | personalmiddlename |      101 | Middle names must be 100 characters or less |
      | personallastname   |      101 | Last name must be 100 characters or less    |
      | Personalfirstname  |          | Enter first name                            |
      | personallastname   |          | Enter last name                             |

  @test33 @sfd544 @rerun
  Scenario Outline: Verify relevant error message for various invalid date of birth values on WhatIsYourDateOfBirth page
    When I click the "PersonalDOB" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter the test data with value on the field Day "<Day>" Month "<Month>" and Year "<Year>" On the WhatIsYourDateOfBirth page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | Day | Month | Year | ErrorMessage                                |
      |  32 |    01 | 2001 | Date of birth must be a real date           |
      |  02 |    13 | 2002 | Date of birth must be a real date           |
      |  30 |    02 | 2002 | Date of birth must be a real date           |
      |  30 | fe    | 2002 | Date of birth must be a real date           |
      |     |       |      | Enter your date of birth                    |
      |     |    01 | 1990 | Date of birth must include a day            |
      |  10 |       | 1960 | Date of birth must include a month          |
      |  15 |       | 1970 | Date of birth must include a month          |
      |  15 |    02 |      | Date of birth must include a year           |
      |     |       | 2000 | Date of birth must include a day and month  |
      |     |    03 |      | Date of birth must include a day and year   |
      |  11 |       |      | Date of birth must include a month and year |
      |  29 |    03 | 2029 | Date of birth must be in the past           |
      |   1 |     2 |   90 | Enter a year with 4 numbers, like 1975      |
      |  31 |    12 |  990 | Enter a year with 4 numbers, like 1975      |

  @test37 @sfd456
  Scenario Outline: Verify relevant error message for empty personal email address on WhatIsYourPersonalEmailAddress page
    When I click the "personalemailaddress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter the test data on the field "<TextField>" with value as "<TestData>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | TextField            | TestData | ErrorMessage                   | ValidationPage                 |
      | PersonalEmailAddress |          | Enter a personal email address | WhatIsYourBusinessEmailAddress |

  @test38 @sfd456
  Scenario Outline: Verify relevant error message for invalid personal email formats on WhatIsYourPersonalEmailAddress page
    When I click the "personalemailaddress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter the test data on the Emailformat as "<EmailFormat>" on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed

    Examples:
      | EmailFormat                 | ErrorMessage                                  | ValidationPage                 |
      | testemailaddress            | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |
      | test.email.address          | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |
      | testemailaddress.com        | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |
      | @testemailaddress.com       | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |
      | @testemailaddress@com       | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |
      | .testemailaddress@email.com | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |
      | testemailaddress;@email.com | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |
      | testemailaddress[@email.com | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |
      | test emailaddress@email.com | Enter an email address, like name@example.com | WhatIsYourPersonalEmailAddress |

  @test47 @sfd2-807
  Scenario Outline: Verify relevant Error message displaying for various validation criterias on WhatAreYourPersonalPhoneNumbers? page
    When I click the "PersonalPhoneNumbers" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter invalid characters "<InvalidChars>" on the "<TextField>" field on the "<ValidationPage>" page
    Then Verfiy relevant ErrorMessage "<ErrorMessage>" is displayed
    Examples:
      | TextField               | InvalidChars | ErrorMessage                                                                                                         | ValidationPage                  |
      | PersonalPhone           | abc!$%       | Personal telephone number must only include numbers 0 to 9 and special characters such as spaces, brackets and +     | WhatAreYourPersonalPhoneNumbers |
      | PersonalMobilePhone     | abc!$%       | Personal mobile phone number must only include numbers 0 to 9 and special characters such as spaces, brackets and +  | WhatAreYourPersonalPhoneNumbers |