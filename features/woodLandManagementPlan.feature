Feature: View WoodLand Management Plan details
    @test76 @sfd182
    Scenario: Verify elements and links are correct Whilist loging through WMP creds on YourBusiness page
        Given I Enter "WMP" credentials on SignIn page and navigate to YourBusiness page
        Then following texts should be visible:
            | Text                         |
            | Apply for schemes and grants |
            | Woodland Management Plan     |
            | Business details             |
            | Personal details             |
        And the following links should have the correct hrefs on the page:
            | Text                                  | ExpectedHref                                                         |
            | Go to application                     | https://grants-ui.test.cdp-int.defra.cloud/woodland?ssoOrgId=5560725 |
            | View and update your business details | /business-details                                                    |
            | View and update your personal details | /personal-details                                                    |
    @test77 @sfd182
    Scenario: Verify Application Navigates to WMP page whilist clicking GoToApplication link on YourBusiness page
        Given I Enter "WMP" credentials on SignIn page and navigate to YourBusiness page
        And Click "GoToApplication" link on YourBusiness page
        Then Application should Navigate to WMP page
    @test78 @sfd182
    Scenario: Verify GoToApplication link is not displayed Whilist loging through NonWMP creds on YourBusiness page
        Given I Enter "NonWMP" credentials on SignIn page and navigate to YourBusiness page
        And Application should not display "GoToApplication" link on YourBusiness page
