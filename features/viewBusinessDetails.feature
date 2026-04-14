Feature: View business details

  Background:
    Given I am on SignIn page and enter the credentials for "BusinessDetails"

  @test7 @sfd179
  Scenario Outline: Verify all relevant details shown whilst clicking the BusinessLegalStatus and BusinessType link
    When I click the "<ExpectedLink>" link on the BusinessDetails page
    Then Verfiy all relevant details on the "<ExpectedPage>" page are been displayed correctly

    Examples:
      | ExpectedLink        | ExpectedPage           |
      | BusinessType        | ChangeYourBusinessType |
      | BusinessLegalStatus | ChangeYourLegalStatus  |
