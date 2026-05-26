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

  @test50 @sfd2-811
  Scenario: Verify all section headings and field labels are displayed on the View and update your business details page
    Then following texts should be visible:
      | Text                             |
      | Business contact details         |
      | Reference numbers                |
      | Additional details               |
      | Business name                    |
      | Business address                 |
      | Business phone numbers           |
      | Business email address           |
      | Single business identifier (SBI) |
      | VAT registration number          |
      | Vendor registration number       |
      | Business legal status            |
      | Business type                    |