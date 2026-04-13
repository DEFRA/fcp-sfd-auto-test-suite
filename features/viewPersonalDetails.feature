Feature: View personal details

  Background:
    Given I am on SignIn page and enter the credentials for "PersonalDetails"

  @test25 @sfd386
  Scenario Outline: Verify previously entered phone details are retained when navigating back from CheckYourPersonalPhoneNumbersAreCorrectBeforeSubmitting page
    When I click the "PersonalPhoneNumbers" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal phone number and click the "<Link>" in the CheckYourPersonalPhoneNumbersAreCorrectBeforeSubmitting page
    Then Verify the previously entered details are still displayed in WhatAreYourPersonalPhoneNumbers? page

    Examples:
      | Link   |
      | change |
      | back   |

  @test31 @sfd350
  Scenario Outline: Verify previously entered date of birth details are retained when navigating back from CheckYourDateOfBirthIsCorrectBeforeSubmitting page
    When I click the "PersonalDOB" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal DateOfBirth and click the "<Link>" in the CheckYourDateOfBirthIsCorrectBeforeSubmitting page
    Then Verify the previously entered details are still displayed in WhatIsYourDateOfBirth? page

    Examples:
      | Link   |
      | change |
      | back   |

  @test35 @sfd348
  Scenario Outline: Verify previously entered personal email address is retained when navigating back from CheckYourPersonalEmailAddressIsCorrectBeforeSubmitting page
    When I click the "personalemailaddress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I update Personal email address and click the "<Link>" in the CheckYourPersonalEmailAddressIsCorrectBeforeSubmitting page
    Then Verify the previously entered details are still displayed in WhatIsYourPersonalEmailAddress? page

    Examples:
      | Link   |
      | change |
      | back   |
