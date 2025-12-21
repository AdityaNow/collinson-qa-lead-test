Feature: Activity Ranking API - City-Based Weather Forecast Integration with Search Suggestions
  As a user, I want to enter a city or town name and receive a ranked list of activities 
  (Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing) for the next 7 days, 
  based on weather conditions. As I type, I should see autocomplete suggestions 
  for matching cities or towns.

  Background:
    Given the Activity Ranking API is available

  Scenario Outline: User receives ranked activities for valid city with all activity types
    Given the user searches for the city "<city>"
    When the system fetches the 7-day weather forecast
    Then the response should contain exactly 28 activity results (4 activities × 7 days)
    And each result should have a date in YYYY-MM-DD format
    And each result should have an activity name from "Skiing", "Surfing", "Outdoor Sightseeing", "Indoor Sightseeing"
    And each result should have a rank between 1 and 10
    And each result should have a non-empty reasoning string
    And the date should be within the next 7 days

    Examples:
      | city    |
      | London  |
      | Paris   |
      | New York|

  Scenario: User receives activities for each of the four activity types
    Given the user searches for the city "London"
    When the system fetches the 7-day weather forecast
    Then the response should include "Skiing" activities
    And the response should include "Surfing" activities
    And the response should include "Outdoor Sightseeing" activities
    And the response should include "Indoor Sightseeing" activities

  Scenario: Autocomplete provides suggestions while typing
    Given the user types "Lon" into the search box
    When the system retrieves autocomplete suggestions
    Then the suggestions should include "London"
    And the suggestions should be a valid array of city names
    And all suggestions should contain the typed text (case-insensitive)

  Scenario: Selecting autocomplete suggestion triggers activity ranking
    Given the user types "Lon" into the search box
    And the system shows autocomplete suggestions including "London"
    When the user selects "London" from the suggestions
    Then the system should fetch the 7-day weather forecast for "London"
    And the user should receive ranked activities

  Scenario: Autocomplete handles partial matches correctly
    Given the user types "New" into the search box
    When the system retrieves autocomplete suggestions
    Then the suggestions should include cities starting with "New"
    And suggestions should be filtered based on the input

  Scenario: No suggestions returned for non-matching input
    Given the user types "XYZ123" into the search box
    When the system retrieves autocomplete suggestions
    Then the suggestions should be an empty array

  Scenario: Handling invalid or non-existent city name
    Given the user searches for the city "NonExistentCity123"
    When the system attempts to fetch the 7-day weather forecast
    Then the system should handle the error gracefully
    And return an appropriate error response or empty result

  Scenario: Verify 7-day forecast coverage
    Given the user searches for the city "London"
    When the system fetches the 7-day weather forecast
    Then the response should contain exactly 7 unique dates
    And each date should be consecutive (no gaps)
    And the dates should start from tomorrow or today