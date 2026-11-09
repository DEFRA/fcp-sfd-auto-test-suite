@accessibility @responsive-keyboard
Feature: Accessibility - reflow and keyboard operation (WCAG 2.2 AA)

  Scenario Outline: Personal details page "<Link>" works on narrow screens and with the keyboard
    Given I am on SignIn page and enter the credentials for "PersonalDetails"
    When I click the "<Link>" link on the "ViewAndUpdateYourPersonalDetails"Page
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

    Examples:
      | Link                 |
      | fullname             |
      | personaladdress      |
      | personalphonenumbers |
      | personalemailaddress |

  Scenario: Personal details summary page works on narrow screens and with the keyboard
    Given I am on SignIn page and enter the credentials for "PersonalDetails"
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

  Scenario: Business details summary page works on narrow screens and with the keyboard
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

  Scenario Outline: Business details page "<Link>" works on narrow screens and with the keyboard
    Given I am on SignIn page and enter the credentials for "BusinessDetails"
    When I click the "<Link>" link on the BusinessDetails page
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

    Examples:
      | Link                 |
      | BusinessName         |
      | BusinessAddress      |
      | BusinessPhoneNumbers |
      | BusinessEmailAddress |
