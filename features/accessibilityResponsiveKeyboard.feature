@accessibility @responsive-keyboard
Feature: Accessibility - reflow and keyboard operation (WCAG 2.2 AA)

  Scenario Outline: Personal details page "<Link>" works on narrow screens and with the keyboard
    Given I sign in as a standard user and open the "PersonalDetails" page
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
    Given I sign in as a standard user and open the "PersonalDetails" page
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

  Scenario: Business details summary page works on narrow screens and with the keyboard
    Given I sign in as a standard user and open the "BusinessDetails" page
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

  Scenario Outline: Business details page "<Link>" works on narrow screens and with the keyboard
    Given I sign in as a standard user and open the "BusinessDetails" page
    When I click the "<Link>" link on the BusinessDetails page
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

    Examples:
      | Link                 |
      | BusinessName         |
      | BusinessAddress      |
      | BusinessPhoneNumbers |
      | BusinessEmailAddress |


  @fix-user
  Scenario Outline: Personal fix journey page "<Source>" works on narrow screens and with the keyboard
    Given I sign in as test user "PERSONAL_FIX_1" and open the "PersonalDetails" page
    When I open the personal fix journey for "<Source>"
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

    Examples:
      | Source  |
      | name    |
      | address |

  @fix-user
  Scenario: Personal fix list page works on narrow screens and with the keyboard
    Given I sign in as test user "PERSONAL_FIX_1" and open the "PersonalDetails" page
    When I open the personal fix journey for "name"
    And I continue to the personal fix list page
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

  @fix-user
  Scenario Outline: Business fix journey page "<Source>" works on narrow screens and with the keyboard
    Given I sign in as test user "BUSINESS_FIX_1" and open the "BusinessDetails" page
    When I open the business fix journey for "<Source>"
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens

    Examples:
      | Source  |
      | name    |
      | address |

  @fix-user
  Scenario: Business fix list page works on narrow screens and with the keyboard
    Given I sign in as test user "BUSINESS_FIX_1" and open the "BusinessDetails" page
    When I open the business fix journey for "name"
    And I continue to the business fix list page
    Then the page should be fully operable with the keyboard
    And the page should have no accessibility violations on narrow screens
