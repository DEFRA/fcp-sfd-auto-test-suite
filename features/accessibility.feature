@accessibility
Feature: Accessibility (WCAG 2.2 AA)

  Scenario: Personal details summary page has no accessibility violations
    Given I sign in as standard user 2 and open the "PersonalDetails" page
    Then the page should have no accessibility violations
    And the page should declare a language and a skip link

  Scenario Outline: Personal details journey page "<Link>" has no accessibility violations
    Given I sign in as standard user 2 and open the "PersonalDetails" page
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
    Given I sign in as standard user 2 and open the "PersonalDetails" page
    When I click the "personaladdress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter a valid postcode and continue to the address selection page
    And I continue without selecting an address on the ChooseYourPersonalAddress page
    Then Verfiy relevant ErrorMessage "Choose an address" is displayed
    And the page should have no accessibility violations

  Scenario: Business details summary page has no accessibility violations
    Given I sign in as standard user 2 and open the "BusinessDetails" page
    Then the page should have no accessibility violations
    And the page should declare a language and a skip link

  Scenario Outline: Business details journey page "<Link>" has no accessibility violations
    Given I sign in as standard user 2 and open the "BusinessDetails" page
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


  # STANDARD_1 has invalid personal details, so its personal details page links
  # go to the fix journey. These scenarios only read the pages and never submit.
  Scenario: Personal details summary page with fix links has no accessibility violations
    Given I sign in as standard user 1 and open the "PersonalDetails" page
    Then the page should have no accessibility violations

  Scenario Outline: Personal fix journey start page for "<Source>" has no accessibility violations
    Given I sign in as standard user 1 and open the "PersonalDetails" page
    When I open the personal fix journey for "<Source>"
    Then the page should have no accessibility violations

    Examples:
      | Source |
      | name   |
      | dob    |
      | address |
      | phone  |
      | email  |

  Scenario: Personal fix list page has no accessibility violations
    Given I sign in as standard user 1 and open the "PersonalDetails" page
    When I open the personal fix journey for "name"
    And I continue to the personal fix list page
    Then the page should have no accessibility violations
