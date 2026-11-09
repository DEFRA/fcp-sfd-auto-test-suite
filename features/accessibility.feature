@accessibility
Feature: Accessibility (WCAG 2.2 AA)

  Scenario: Personal details summary page has no accessibility violations
    Given I am on SignIn page and enter the credentials for "PersonalDetails"
    Then the page should have no accessibility violations
    And the page should declare a language and a skip link

  Scenario Outline: Personal details journey page "<Link>" has no accessibility violations
    Given I am on SignIn page and enter the credentials for "PersonalDetails"
    When I click the "<Link>" link on the "ViewAndUpdateYourPersonalDetails"Page
    Then the page should have no accessibility violations

    Examples:
      | Link                 |
      | fullname             |
      | personaldob          |
      | personaladdress      |
      | personalphonenumbers |
      | personalemailaddress |

  Scenario: Personal details error state has no accessibility violations
    Given I am on SignIn page and enter the credentials for "PersonalDetails"
    When I click the "personaladdress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter a valid postcode and continue to the address selection page
    And I continue without selecting an address on the ChooseYourPersonalAddress page
    Then Verfiy relevant ErrorMessage "Choose an address" is displayed
    And the page should have no accessibility violations

  Scenario: Business details summary page has no accessibility violations
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    Then the page should have no accessibility violations
    And the page should declare a language and a skip link

  Scenario Outline: Business details journey page "<Link>" has no accessibility violations
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "<Link>" link on the BusinessDetails page
    Then the page should have no accessibility violations

    Examples:
      | Link                 |
      | BusinessName         |
      | BusinessAddress      |
      | BusinessPhoneNumbers |
      | BusinessEmailAddress |
      | BusinessType         |
      | BusinessLegalStatus  |
