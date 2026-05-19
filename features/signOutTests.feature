Feature: Sign out tests 
  
  @test6 @sfd176
  Scenario: Verify sign out invalidates session across multiple tabs
    Given I sign In on the first tab
    When I open another tab with the same session
    And I signOut on the first tab
    And I switch to the second tab
    And I click on the link on the second tab
    Then I should be redirected to the signIn page from the second tab