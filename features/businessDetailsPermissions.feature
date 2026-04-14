Feature: Business details permissions

  @test36 @sfd569
  Scenario Outline: Verify relevant change links are shown for AmendPermission level type
    Given I am on SignIn page and enter the credentials for "BusinessDetails" with "AmendPermission"
    Then The "<Element>" change link should be "<Visible>"
    And Verify relevant Permission message type for "AmendPermission" is displayed on the page ViewAndUpdateYourBusinessType

    Examples:
      | Element              | Visible |
      | BusinessAddress      | Yes     |
      | BusinessPhoneNumbers | Yes     |
      | BusinessEmailAddress | Yes     |
      | BusinessName         | No      |
      | BusinessLegalStatus  | No      |
      | BusinessType         | No      |
      | VATNumber            | No      |

  @test41 @sfd571
  Scenario Outline: Verify relevant change links are shown for ViewPermission level type
    Given I am on SignIn page and enter the credentials for "BusinessDetails" with "ViewPermission"
    Then The "<Element>" change link should be "<Visible>"
    And Verify relevant Permission message type for "ViewPermission" is displayed on the page ViewAndUpdateYourBusinessType
    And Verify relevant Header for "ViewPermission" is displayed on the ViewAndUpdateYourBusinessType Page

    Examples:
      | Element              | Visible |
      | BusinessAddress      | No      |
      | BusinessPhoneNumbers | No      |
      | BusinessEmailAddress | No      |
      | BusinessName         | No      |
      | BusinessLegalStatus  | No      |
      | BusinessType         | No      |
      | VATNumber            | No      |

  @test39 @sfd572
  Scenario Outline: Verify AmendPermission level redirects to unauthorised page for restricted journeys
    Given I am on SignIn page and enter the credentials for "BusinessDetails" with "AmendPermission"
    Then Navigate to "<URL>"
    And Application should display with Message as "<Message>"

    Examples:
      | URL                                      | Message                                        |
      | /business-type-change                    | You do not have permission to access this page |
      | /business-legal-status-change            | You do not have permission to access this page |
      | /business-vat-registration-remove        | You do not have permission to access this page |
      | /business-vat-registration-number-check  | You do not have permission to access this page |
      | /business-vat-registration-number-change | You do not have permission to access this page |
      | /business-name-change                    | You do not have permission to access this page |
      | /business-name-check                     | You do not have permission to access this page |

  @test40 @sfd572
  Scenario Outline: Verify AmendPermission level redirects correctly for permitted change journeys
    Given I am on SignIn page and enter the credentials for "BusinessDetails" with "AmendPermission"
    Then Navigate to "<URL>"
    And Application should display with Message as "<Message>"

    Examples:
      | URL                            | Message                                                        |
      | /business-address-change       | What is your business address?                                 |
      | /business-address-enter        | Enter your business address                                    |
      | /business-address-check        | Check your business address is correct before submitting       |
      | /business-phone-numbers-change | What are your business phone numbers?                          |
      | /business-email-change         | What is your business email address?                           |
      | /business-email-check          | Check your business email address is correct before submitting |

  @test44 @sfd573
  Scenario Outline: Verify ViewPermission level redirects to unauthorised page for all change journeys
    Given I am on SignIn page and enter the credentials for "BusinessDetails" with "ViewPermission"
    Then Navigate to "<URL>"
    And Application should display with Message as "<Message>"

    Examples:
      | URL                                      | Message                                        |
      | /business-type-change                    | You do not have permission to access this page |
      | /business-legal-status-change            | You do not have permission to access this page |
      | /business-vat-registration-remove        | You do not have permission to access this page |
      | /business-vat-registration-number-check  | You do not have permission to access this page |
      | /business-vat-registration-number-change | You do not have permission to access this page |
      | /business-name-change                    | You do not have permission to access this page |
      | /business-name-check                     | You do not have permission to access this page |
      | /business-email-change                   | You do not have permission to access this page |
      | /business-email-check                    | You do not have permission to access this page |
      | /business-phone-numbers-change           | You do not have permission to access this page |
      | /business-phone-numbers-check            | You do not have permission to access this page |
      | /business-address-change                 | You do not have permission to access this page |
      | /business-address-select                 | You do not have permission to access this page |
      | /business-address-enter                  | You do not have permission to access this page |
      | /business-address-check                  | You do not have permission to access this page |
