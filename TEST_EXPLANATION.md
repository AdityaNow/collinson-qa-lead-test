# Test Scenarios Explanation

This document explains each test scenario in the Activity Ranking API test suite, what it validates, and why it's important.

## How to Run Tests

```bash
# Run all tests
npm test

# Run with verbose output
npm run test:verbose

# View HTML report (after running tests)
# Open reports/cucumber-report.html in a browser
```

## Test Results Summary

After running `npm test`, you should see:
- ✅ **10 scenarios** (all passing)
- ✅ **66 steps** (all passing)
- Execution time: ~3-5 seconds

---

## Test Scenarios Explained

### Background
**Step:** `Given the Activity Ranking API is available`

**What it does:** Runs before every scenario. Simply verifies that the WeatherService is initialized and ready.

**Why it's important:** Ensures all tests start from a clean, consistent state.

---

## Scenario 1-3: User receives ranked activities for valid city with all activity types

**Type:** Scenario Outline (data-driven - runs 3 times with different cities)

**Test Data:**
- London
- Paris  
- New York

**Purpose:** Validates the core functionality - that users can search for different cities and receive properly formatted activity rankings.

### Step-by-Step Breakdown:

1. **`Given the user searches for the city "<city>"`**
   - **What it does:** Stores the city name (e.g., "London") as input for the API call
   - **Why:** Sets up the test data for the scenario

2. **`When the system fetches the 7-day weather forecast`**
   - **What it does:** Calls `weatherService.getRankedActivities(city)` which:
     - Looks up city coordinates (geocoding)
     - Fetches 7-day weather forecast from Open-Meteo API
     - Calculates rankings for all 4 activities for each day
   - **Why:** This is the main action being tested - the API integration

3. **`Then the response should contain exactly 28 activity results (4 activities × 7 days)`**
   - **What it validates:** 
     - Total count = 4 activities × 7 days = 28 results
     - Ensures we get complete data, not partial results
   - **Why:** Verifies the requirement that all activities are ranked for all 7 days

4. **`And each result should have a date in YYYY-MM-DD format`**
   - **What it validates:** Date format matches ISO 8601 standard (e.g., "2025-12-23")
   - **Why:** Ensures dates are properly formatted and can be parsed by other systems

5. **`And each result should have an activity name from "Skiing", "Surfing", "Outdoor Sightseeing", "Indoor Sightseeing"`**
   - **What it validates:** Each result contains one of the 4 valid activity types
   - **Why:** Ensures no invalid or missing activity types are returned

6. **`And each result should have a rank between 1 and 10`**
   - **What it validates:** Rank is an integer from 1 (worst) to 10 (best)
   - **Why:** Validates the ranking scale as specified in requirements

7. **`And each result should have a non-empty reasoning string`**
   - **What it validates:** Reasoning field is present and contains descriptive text
   - **Why:** Users need to understand WHY activities are ranked a certain way (e.g., "Clear skies and 22°C")

8. **`And the date should be within the next 7 days`**
   - **What it validates:** All dates are either today or in the future, and within 7 days from today
   - **Why:** Ensures the forecast is for the upcoming week, not past dates or too far in the future

**Real Example Output:**
```
Date: 2025-12-23, Activity: Skiing, Rank: 2, Reasoning: "Poor conditions: Too warm (15°C) and no snow"
Date: 2025-12-23, Activity: Outdoor Sightseeing, Rank: 9, Reasoning: "Good conditions: Comfortable temperature (15°C), light precipitation"
...
```

---

## Scenario 4: User receives activities for each of the four activity types

**Purpose:** Ensures that all 4 required activity types are included in the response for at least one day.

**Why this test exists:** The previous test validates structure, but this explicitly checks that each activity type appears at least once.

### Steps:

1. **`Given the user searches for the city "London"`**
   - Sets up the test with a known city

2. **`When the system fetches the 7-day weather forecast`**
   - Executes the API call

3. **`Then the response should include "Skiing" activities`**
   - Validates at least one "Skiing" result exists

4. **`And the response should include "Surfing" activities`**
   - Validates at least one "Surfing" result exists

5. **`And the response should include "Outdoor Sightseeing" activities`**
   - Validates at least one "Outdoor Sightseeing" result exists

6. **`And the response should include "Indoor Sightseeing" activities`**
   - Validates at least one "Indoor Sightseeing" result exists

**What it catches:** Bugs where one activity type might be missing from results due to filtering or logic errors.

---

## Scenario 5: Autocomplete provides suggestions while typing

**Purpose:** Tests the autocomplete/type-ahead feature that helps users find cities quickly.

### Steps:

1. **`Given the user types "Lon" into the search box`**
   - **What it does:** Simulates user typing a partial city name
   - **What happens:** Calls `weatherService.getSuggestions("Lon")` which filters cities matching "Lon"
   - **Expected:** Returns cities like "London", "Londonderry", "Long Beach"

2. **`When the system retrieves autocomplete suggestions`**
   - **What it does:** Verifies that suggestions were retrieved (this is more of a documentation step)
   - **Why:** Makes the test flow clear (Given → When → Then)

3. **`Then the suggestions should include "London"`**
   - **What it validates:** "London" appears in the suggestions array
   - **Why:** Users should see relevant matches for their input

4. **`And the suggestions should be a valid array of city names`**
   - **What it validates:**
     - Suggestions is an array (not null/undefined)
     - Each suggestion is a non-empty string
   - **Why:** Ensures the API returns data in the expected format

5. **`And all suggestions should contain the typed text (case-insensitive)`**
   - **What it validates:** All returned cities contain "Lon" (case-insensitive)
   - **Why:** Users expect to see only relevant matches, not random cities

**Real Example Output:**
```
Input: "Lon"
Suggestions: ["London", "Londonderry", "Long Beach"]
```

---

## Scenario 6: Selecting autocomplete suggestion triggers activity ranking

**Purpose:** Tests the complete user flow - typing → seeing suggestions → selecting one → getting results.

**Why this matters:** This is an end-to-end flow test that validates the integration between autocomplete and ranking features.

### Steps:

1. **`Given the user types "Lon" into the search box`**
   - User starts typing

2. **`And the system shows autocomplete suggestions including "London"`**
   - Verifies suggestions appeared (prerequisite for next step)

3. **`When the user selects "London" from the suggestions`**
   - **What it simulates:** User clicking/selecting a suggestion
   - **What happens:** Sets "London" as the city input

4. **`Then the system should fetch the 7-day weather forecast for "London"`**
   - **What it validates:** Selecting a suggestion triggers the weather API call
   - **Why:** Validates the feature requirement that "Selecting a suggestion triggers the activity ranking request"

5. **`And the user should receive ranked activities`**
   - **What it validates:** Activities are returned after selection
   - **Why:** Ensures the full flow works, not just individual components

**User Journey Tested:**
```
User types "Lon" 
  → Sees ["London", "Londonderry", ...] 
  → Clicks "London" 
  → Gets 28 activity rankings ✅
```

---

## Scenario 7: Autocomplete handles partial matches correctly

**Purpose:** Tests that autocomplete filters suggestions based on partial input.

### Steps:

1. **`Given the user types "New" into the search box`**
   - Input: "New" (should match cities starting with "New")

2. **`When the system retrieves autocomplete suggestions`**
   - Retrieves filtered suggestions

3. **`Then the suggestions should include cities starting with "New"`**
   - **What it validates:** At least one suggestion starts with "New" (e.g., "New York", "New Delhi")
   - **Why:** Ensures filtering logic works correctly

4. **`And suggestions should be filtered based on the input`**
   - **What it validates:** Suggestions array exists and is filtered (implicit validation)
   - **Why:** Documentation that filtering occurred

**Expected Behavior:**
- Input "New" → ["New York", "New Delhi"] ✅
- Input "New" → ["London", "Paris"] ❌ (would fail this test)

---

## Scenario 8: No suggestions returned for non-matching input

**Purpose:** Tests edge case - what happens when user types something that doesn't match any cities.

**Why this matters:** Users might type typos, random characters, or invalid input. The system should handle this gracefully.

### Steps:

1. **`Given the user types "XYZ123" into the search box`**
   - Input that won't match any real cities

2. **`When the system retrieves autocomplete suggestions`**
   - System attempts to find matches

3. **`Then the suggestions should be an empty array`**
   - **What it validates:** Returns `[]` (empty array) instead of crashing or returning errors
   - **Why:** Empty array is better than throwing errors - user can continue typing

**Expected Behavior:**
- Input: "XYZ123"
- Output: `[]` (empty array) ✅
- Alternative (bad): Error message ❌
- Alternative (bad): `null` or `undefined` ❌

---

## Scenario 9: Handling invalid or non-existent city name

**Purpose:** Tests error handling when a user searches for a city that doesn't exist.

**Why this matters:** Real users make mistakes. The system should handle errors gracefully without crashing.

### Steps:

1. **`Given the user searches for the city "NonExistentCity123"`**
   - Sets up test with invalid city name

2. **`When the system attempts to fetch the 7-day weather forecast`**
   - **What it does:** Tries to fetch weather for non-existent city
   - **What happens:** Geocoding fails or returns no coordinates
   - **Expected:** System catches the error instead of crashing

3. **`Then the system should handle the error gracefully`**
   - **What it validates:** 
     - Error was caught (stored in `errorOccurred` variable)
     - OR empty results returned
     - Test doesn't crash with unhandled exception
   - **Why:** Validates error handling requirement

4. **`And return an appropriate error response or empty result`**
   - **What it validates:** System returns either:
     - Error message (e.g., "City not found")
     - OR empty array `[]`
   - **Why:** User should get feedback, not a system crash

**Expected Behavior:**
```
Input: "NonExistentCity123"
Output: Error caught gracefully → Returns empty result or error message ✅
Bad Output: Unhandled exception, app crashes ❌
```

---

## Scenario 10: Verify 7-day forecast coverage

**Purpose:** Validates that the forecast covers exactly 7 consecutive days without gaps.

**Why this matters:** Missing days or gaps would make the forecast unreliable for users planning their week.

### Steps:

1. **`Given the user searches for the city "London"`**
   - Sets up test data

2. **`When the system fetches the 7-day weather forecast`**
   - Executes API call

3. **`Then the response should contain exactly 7 unique dates`**
   - **What it validates:** 
     - Exactly 7 different dates (not 6, not 8)
     - No duplicate dates
   - **Why:** Requirement states "next 7 days" - must be exactly 7

4. **`And each date should be consecutive (no gaps)`**
   - **What it validates:** Dates are sequential (e.g., Dec 23, Dec 24, Dec 25...)
   - **How:** Calculates difference between consecutive dates (should be 1 day)
   - **Why:** Gaps would indicate missing data or API issues

5. **`And the dates should start from tomorrow or today`**
   - **What it validates:** First date is either today or tomorrow (not yesterday, not next week)
   - **Why:** "Next 7 days" means starting from today/tomorrow, not arbitrary dates

**Example of Valid Output:**
```
Dates: [2025-12-23, 2025-12-24, 2025-12-25, 2025-12-26, 2025-12-27, 2025-12-28, 2025-12-29]
✅ 7 unique dates
✅ Consecutive (each date is 1 day after previous)
✅ Starts from today/tomorrow
```

**Example of Invalid Output:**
```
Dates: [2025-12-23, 2025-12-24, 2025-12-26, ...]  // Gap! Missing Dec 25 ❌
Dates: [2025-12-20, 2025-12-21, ...]  // Starts in the past ❌
```

---

## Test Coverage Summary

| Feature | Test Coverage |
|---------|--------------|
| ✅ Activity Ranking | Scenarios 1-4, 10 |
| ✅ All 4 Activity Types | Scenario 4 |
| ✅ Autocomplete Suggestions | Scenarios 5-8 |
| ✅ Error Handling | Scenarios 8-9 |
| ✅ Data Validation | Scenarios 1-3, 10 |
| ✅ Date Validation | Scenarios 1-3, 10 |
| ✅ Ranking Logic | Scenarios 1-4 |

## Running Individual Scenarios

While Cucumber doesn't have a built-in way to run individual scenarios easily, you can:

1. **Tag scenarios** and run by tag:
   ```gherkin
   @smoke
   Scenario: User receives ranked activities...
   ```
   Then run: `npm test -- --tags @smoke`

2. **Create separate feature files** for different test suites

3. **Use line numbers** (if your test runner supports it)

## Understanding Test Output

When you run `npm test`, you'll see:

```
10 scenarios (10 passed)    ← All scenarios passed
66 steps (66 passed)        ← All individual steps passed
0m04.761s                   ← Total execution time
```

Each `.` represents a passed step. If a test fails, you'll see:
- `F` = Failed step
- `U` = Undefined step (step definition missing)
- `-` = Skipped step

---

## Troubleshooting

**If tests fail:**

1. **Check internet connection** - Tests call real Open-Meteo API
2. **Check API availability** - Open-Meteo might be down
3. **Check city names** - Ensure cities exist in the city database
4. **Review error messages** - Cucumber provides detailed failure messages

**Common Issues:**

- **Date validation fails:** Timezone differences between local machine and API
- **City not found:** City name not in the mock database (falls back to geocoding API)
- **Slow tests:** Network latency when calling external APIs

---

## Next Steps

After understanding these tests, you can:
1. Add more test scenarios for additional edge cases
2. Add performance tests (response time validation)
3. Add integration tests with mocked APIs for faster execution
4. Add visual regression tests if testing UI components

