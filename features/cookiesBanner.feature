@cookiesBanner
Feature: Cookies Banner
  As a user of the Single Front Door service
  I want to manage my cookie preferences
  So that I can choose how my information is collected

  Background:
    Given I navigate to the SFD application home page

  @sfd101
  Scenario: Display cookies banner on first visit
    Then the cookies banner should be displayed
    And the cookies banner should contain a "Accept analytics cookies" button
    And the cookies banner should contain a "Reject analytics cookies" button
    And the cookies banner should contain a "View cookies" link

  @sfd102
  Scenario: Accept analytics cookies
    Given the cookies banner is displayed
    When I click the "Accept analytics cookies" button
    Then I should see the message "You’ve accepted analytics cookies"

  @sfd103
  Scenario: Reject analytics cookies
    Given the cookies banner is displayed
    When I click the "Reject analytics cookies" button
    Then I should see the message "You’ve rejected analytics cookies"

  @sfd104
  Scenario: Navigate to cookie preferences page
    Given the cookies banner is displayed
    When I click the "View cookies" link
    Then I should be taken to the cookie preferences page

  @sfd105
  Scenario: Save cookie preferences
    Given I am on the cookie preferences page
    When I select "Yes" for analytics cookies
    And I click the "Save cookie settings" button
    Then my cookie preferences should be saved
    And I should see the message "You’ve set your cookie preferences."

  @sfd106
  Scenario: Do not display banner after preferences are saved
    Given I have saved my cookie preferences
    When I revisit the SFD application
    Then the cookies banner should not be displayed

  @sfd107
  Scenario: Change cookie preferences
    Given I have previously accepted analytics cookies
    When I navigate to the cookie preferences page
    And I select "No" for analytics cookies
    And I click the "Save cookie settings" button
    Then analytics cookies should be disabled
    And I should see the message "You’ve set your cookie preferences."

  @sfd108
  Scenario: Revisit after rejecting analytics cookies
    Given I have previously rejected analytics cookies
    When I revisit the SFD application
    Then the cookies banner should not be displayed
