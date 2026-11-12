@accessibility
Feature: Accessibility (WCAG 2.2 AA)

  Scenario: Personal details summary page has no accessibility violations
    Given I sign in as a standard user and open the "PersonalDetails" page
    Then the page should have no accessibility violations
    And the page should declare a language and a skip link

  Scenario Outline: Personal details journey page "<Link>" has no accessibility violations
      Given I sign in as a standard user and open the "PersonalDetails" page
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
    Given I sign in as a standard user and open the "PersonalDetails" page
    When I click the "personaladdress" link on the "ViewAndUpdateYourPersonalDetails"Page
    And I enter a valid postcode and continue to the address selection page
    And I continue without selecting an address on the ChooseYourPersonalAddress page
    Then Verfiy relevant ErrorMessage "Choose an address" is displayed
    And the page should have no accessibility violations

  Scenario: Business details summary page has no accessibility violations
    Given I sign in as a standard user and open the "BusinessDetails" page
    Then the page should have no accessibility violations
    And the page should declare a language and a skip link

  Scenario Outline: Business details journey page "<Link>" has no accessibility violations
      Given I sign in as a standard user and open the "BusinessDetails" page
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

  # The fix journey users have invalid data, so their details page links go to
  # the fix journey. They are not in the worker rotation, so these scenarios run
  # on one worker (see test:a11y). They only read pages and don't save anything.
  @fix-user
  Scenario: Personal details summary page with fix links has no accessibility violations
    Given I sign in as test user "PERSONAL_FIX_1" and open the "PersonalDetails" page
    Then the page should link to the personal fix journey
    And the page should have no accessibility violations

  @fix-user
  Scenario Outline: Personal fix journey start page for "<Source>" has no accessibility violations
    Given I sign in as test user "PERSONAL_FIX_1" and open the "PersonalDetails" page
    When I open the personal fix journey for "<Source>"
    Then the page should have no accessibility violations

    Examples:
      | Source  |
      | name    |
      | dob     |
      | address |
      | phone   |
      | email   |

  @fix-user
  Scenario: Personal fix list page has no accessibility violations
    Given I sign in as test user "PERSONAL_FIX_1" and open the "PersonalDetails" page
    When I open the personal fix journey for "name"
    And I continue to the personal fix list page
    Then the page should have no accessibility violations

  @fix-user
  Scenario Outline: Business fix journey start page for "<Source>" has no accessibility violations
    Given I sign in as test user "BUSINESS_FIX_1" and open the "BusinessDetails" page
    When I open the business fix journey for "<Source>"
    Then the page should have no accessibility violations

    Examples:
      | Source  |
      | name    |
      | address |
      | phone   |
      | email   |
      | vat     |

  @fix-user
  Scenario: Business fix list page has no accessibility violations
    Given I sign in as test user "BUSINESS_FIX_1" and open the "BusinessDetails" page
    When I open the business fix journey for "name"
    And I continue to the business fix list page
    Then the page should have no accessibility violations
