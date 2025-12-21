# Manual Test Script: Activity Ranking API

## Overview
This manual test script validates the Activity Ranking API feature, which provides ranked activities (Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing) based on 7-day weather forecasts for a given city, along with autocomplete suggestions for city names.

---

## Test Environment Setup

### Preconditions
- User has access to the search interface/API endpoint
- Internet connection is active
- API service is running and accessible
- Open-Meteo API is available (external dependency)

### Test Data
- Valid cities: London, Paris, New York, Tokyo, Sydney
- Invalid city names: XYZ123, NonExistentCity999
- Partial city names: "Lon", "New", "Par"

---

## Test Case 1: Validate Activity Ranking for Valid City

**Test ID:** TC-001

**Priority:** High

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Open the application/access the API endpoint
2. In the search box, type "London"
3. Observe autocomplete suggestions appear
4. Select "London" from the autocomplete dropdown (or press Enter)
5. Wait for the API response

**Expected Results:**
- Autocomplete suggestions appear showing "London" and other matching cities
- After selection, a ranked list of activities is displayed
- The response contains exactly 28 results (4 activities × 7 days)
- Each result includes:
  - Date (in YYYY-MM-DD format)
  - Activity name (one of: Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing)
  - Rank (numeric value between 1 and 10)
  - Reasoning (non-empty descriptive text, e.g., "Clear skies and 22°C", "High snowfall expected")
- Dates are consecutive and cover the next 7 days starting from tomorrow or today
- All four activity types appear in the results

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 2: Validate All Four Activity Types Are Returned

**Test ID:** TC-002

**Priority:** High

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Open the application
2. Search for city "Paris"
3. Review the returned activity list

**Expected Results:**
- The response includes activities for "Skiing"
- The response includes activities for "Surfing"
- The response includes activities for "Outdoor Sightseeing"
- The response includes activities for "Indoor Sightseeing"
- Each activity type appears 7 times (once for each day)

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 3: Autocomplete Suggestions While Typing

**Test ID:** TC-003

**Priority:** High

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Open the application
2. In the search box, type "Lon" (partial city name)
3. Observe autocomplete dropdown
4. Continue typing to "Lond"
5. Observe updated suggestions

**Expected Results:**
- Autocomplete suggestions appear after typing "Lon"
- Suggestions include "London" and other matching cities (e.g., "Londonderry", "Long Beach")
- All suggestions contain the typed text (case-insensitive)
- Suggestions update as more characters are typed
- Suggestions are displayed as a list of valid city names

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 4: Selecting Autocomplete Suggestion Triggers Ranking

**Test ID:** TC-004

**Priority:** High

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Open the application
2. Type "New" into the search box
3. Verify autocomplete shows suggestions (e.g., "New York", "New Delhi")
4. Click on "New York" from the suggestions
5. Observe the activity ranking response

**Expected Results:**
- After selecting a suggestion, the search is automatically triggered
- The 7-day weather forecast is fetched for the selected city
- Ranked activities are displayed for "New York"
- The response follows the same structure as Test Case 1

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 5: Invalid City Name Handling

**Test ID:** TC-005

**Priority:** Medium

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Open the application
2. In the search box, type "XYZ123" (non-existent city)
3. Attempt to search/submit

**Expected Results:**
- System handles the error gracefully
- An appropriate error message is displayed (e.g., "City not found" or "Unable to fetch weather data")
- OR the system returns an empty result set
- Application does not crash or show unhandled exceptions
- User can attempt another search

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 6: No Autocomplete Suggestions for Non-Matching Input

**Test ID:** TC-006

**Priority:** Medium

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Open the application
2. Type "XYZ123" into the search box
3. Observe autocomplete dropdown

**Expected Results:**
- No suggestions appear (empty dropdown)
- OR dropdown shows "No suggestions found" message
- User can still proceed to search (which will fail as per TC-005)

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 7: Ranking Logic Validation

**Test ID:** TC-007

**Priority:** Medium

**Preconditions:**
- User has access to the search interface
- Internet connection is active
- Knowledge of current/expected weather conditions for test city

**Test Steps:**
1. Search for a city with known weather conditions (e.g., a cold city in winter)
2. Review the rankings and reasoning for Skiing activities
3. Search for a city with warm weather
4. Review the rankings and reasoning for Outdoor Sightseeing activities

**Expected Results:**
- Skiing activities have higher ranks (7-10) in cold/snowy conditions
- Skiing activities have lower ranks (1-3) in warm/sunny conditions
- Outdoor Sightseeing has higher ranks in pleasant weather (15-25°C, clear skies)
- Indoor Sightseeing has higher ranks when outdoor conditions are poor (heavy rain, extreme temperatures)
- Reasoning text accurately describes the weather conditions influencing the rank

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 8: Date Range Validation

**Test ID:** TC-008

**Priority:** Medium

**Preconditions:**
- User has access to the search interface
- Internet connection is active
- System date is known

**Test Steps:**
1. Search for city "Tokyo"
2. Extract all unique dates from the response
3. Verify date format and sequence

**Expected Results:**
- Response contains exactly 7 unique dates
- All dates are in YYYY-MM-DD format
- Dates are consecutive (no gaps between days)
- Dates start from tomorrow (or today if current time allows)
- Dates are within the next 7 days (not past dates, not beyond 7 days)

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 9: Rank Value Validation

**Test ID:** TC-009

**Priority:** High

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Search for any valid city (e.g., "Sydney")
2. Review all rank values in the response

**Expected Results:**
- All rank values are integers
- All rank values are between 1 and 10 (inclusive)
- No rank values are null, undefined, or non-numeric

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 10: Reasoning Text Validation

**Test ID:** TC-010

**Priority:** Medium

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Search for city "Dubai"
2. Review all reasoning text fields in the response

**Expected Results:**
- All reasoning fields contain non-empty strings
- Reasoning text is descriptive and relevant (e.g., mentions temperature, precipitation, weather conditions)
- Reasoning text explains why the rank was assigned
- Examples: "Clear skies and 22°C", "High snowfall expected", "Heavy rain (15mm)"

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 11: Slow API Response Handling

**Test ID:** TC-011

**Priority:** Low

**Preconditions:**
- User has access to the search interface
- Ability to throttle network (e.g., Chrome DevTools Network Throttling)

**Test Steps:**
1. Open browser DevTools
2. Enable network throttling (3G or Slow 3G)
3. Search for city "Toronto"
4. Observe loading behavior

**Expected Results:**
- A loading indicator/spinner appears while fetching data
- User receives feedback that the request is processing
- After timeout or completion, results are displayed or error is shown
- Application remains responsive during the wait

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 12: Multiple City Searches

**Test ID:** TC-012

**Priority:** Low

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Search for "London"
2. After results are displayed, search for "Mumbai"
3. After results are displayed, search for "New York"
4. Verify each search returns correct results

**Expected Results:**
- Each search returns results specific to that city
- Results are not mixed or cached incorrectly
- Each search completes successfully
- Response times are acceptable (< 5 seconds per search)

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 13: Case-Insensitive City Search

**Test ID:** TC-013

**Priority:** Low

**Preconditions:**
- User has access to the search interface
- Internet connection is active

**Test Steps:**
1. Search for "london" (lowercase)
2. Search for "LONDON" (uppercase)
3. Search for "LoNdOn" (mixed case)
4. Compare results

**Expected Results:**
- All variations return the same results (or appropriate results for London)
- Autocomplete suggestions are case-insensitive
- System handles case variations gracefully

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Test Case 14: Empty Input Handling

**Test ID:** TC-014

**Priority:** Low

**Preconditions:**
- User has access to the search interface

**Test Steps:**
1. Leave search box empty
2. Attempt to search/submit
3. Type a single space character
4. Attempt to search/submit

**Expected Results:**
- System prevents submission or shows validation error
- OR system returns empty suggestions for autocomplete
- No crashes or unhandled errors occur

**Actual Results:**
- [To be filled during testing]

**Status:** ☐ Pass  ☐ Fail  ☐ Blocked

---

## Edge Cases Summary

| Edge Case | Test ID | Expected Behavior |
|-----------|---------|-------------------|
| Invalid city name | TC-005 | Graceful error handling |
| No matching suggestions | TC-006 | Empty suggestions array |
| Slow API response | TC-011 | Loading indicator, timeout handling |
| Empty input | TC-014 | Validation or empty result |
| Case variations | TC-013 | Case-insensitive matching |
| Multiple consecutive searches | TC-012 | Correct results for each city |

---

## Test Execution Notes

### Environment Variables
- API Base URL: [To be configured]
- Test Environment: [Development/Staging/Production]

### Known Issues
- [List any known bugs or limitations]

### Test Data Cleanup
- No cleanup required (read-only operations)

### Dependencies
- Open-Meteo Weather API (external)
- Geocoding API (if used for city lookup)

---

## Sign-off

**Tested By:** ___________________  
**Date:** ___________________  
**Environment:** ___________________  
**Overall Status:** ☐ Pass  ☐ Fail  ☐ Partial
