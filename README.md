# Activity Ranking API - QA Lead Test Solution

## Overview

This repository contains a complete BDD (Behavior-Driven Development) test solution for the Activity Ranking API feature. The feature provides ranked activities (Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing) based on 7-day weather forecasts for a given city, along with autocomplete suggestions for city names.

## Project Structure

```
.
├── features/
│   └── activity_ranking.feature      # Gherkin BDD scenarios
├── src/
│   ├── api/
│   │   └── WeatherService.ts         # Service layer for weather API integration
│   ├── steps/
│   │   └── rankingSteps.ts           # Cucumber step definitions
│   └── support/                      # Test support files
├── tests/                            # Additional test files (if needed)
├── reports/                          # Cucumber HTML reports
├── manual-test-script.md             # Comprehensive manual test script
├── cucumber.js                       # Cucumber configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## Approach

### BDD Test Design (Gherkin)

The BDD scenarios are written in Gherkin format and cover:

1. **Core Functionality**
   - Activity ranking for valid cities with all activity types
   - Verification of response structure (date, activity, rank, reasoning)
   - 7-day forecast coverage validation

2. **Autocomplete Features**
   - Suggestions while typing
   - Selecting suggestions triggers ranking
   - Partial match handling
   - Empty suggestions for non-matching input

3. **Edge Cases**
   - Invalid city name handling
   - Error handling and graceful degradation
   - Date validation and consecutive day checks

The scenarios use **Scenario Outline** for data-driven testing with multiple cities, ensuring broader coverage with less duplication.

### Automated Test Implementation

**Technology Stack:**
- **Cucumber** - BDD test framework
- **TypeScript** - Type-safe test code
- **Chai** - Assertion library
- **Axios** - HTTP client for API calls

**Key Design Decisions:**

1. **Service Object Pattern**: Created a `WeatherService` class that encapsulates API interactions, making tests maintainable and reusable.

2. **Real API Integration**: Tests interact with the actual Open-Meteo API to validate real-world behavior, not just mocks.

3. **Activity Ranking Logic**: Implemented realistic ranking algorithms for each activity type:
   - **Skiing**: Favors cold temperatures and snowfall
   - **Surfing**: Prefers moderate temperatures and minimal rain
   - **Outdoor Sightseeing**: Optimal in pleasant weather (15-25°C, clear skies)
   - **Indoor Sightseeing**: Higher ranks when outdoor conditions are poor

4. **Error Handling**: Tests validate both happy paths and error scenarios, ensuring the system handles failures gracefully.

5. **State Management**: Used module-level variables for test context (simple approach for this scale). In larger projects, Cucumber's World object pattern would be preferred.

### Manual Test Script

The manual test script (`manual-test-script.md`) provides:

- **14 comprehensive test cases** covering all acceptance criteria
- **Detailed test steps** with preconditions and expected results
- **Edge case coverage** including invalid inputs, slow API responses, and error scenarios
- **Execution tracking** with status checkboxes and notes sections
- **Professional format** suitable for sharing with stakeholders

## How AI Assisted Me

### AI Tools Used

I used **Cursor AI (Auto)** and **Gemini** to assist with this solution:

1. **Initial Problem Analysis**: AI helped break down the requirements and identify all acceptance criteria and edge cases.

2. **Code Structure**: AI suggested the Service Object pattern and helped structure the TypeScript code for maintainability.

3. **Ranking Algorithm Design**: AI assisted in designing realistic ranking logic for each activity type based on weather conditions.

4. **BDD Scenario Writing**: AI helped refine Gherkin scenarios to be clear, comprehensive, and follow best practices.

5. **Edge Case Identification**: AI suggested additional edge cases beyond the requirements (e.g., case-insensitive search, empty input, multiple searches).

6. **Error Handling**: AI recommended patterns for graceful error handling in both automated tests and manual test scenarios.

7. **Documentation**: AI assisted in writing clear, professional documentation and comments.

### My Judgment in Applying AI Output

- **Critical Review**: I reviewed all AI suggestions to ensure they aligned with BDD best practices and the specific requirements.

- **Real-World Validation**: I validated that the ranking algorithms make logical sense (e.g., skiing requires cold/snowy conditions).

- **Test Coverage**: I ensured the scenarios cover all acceptance criteria explicitly mentioned in the ticket, not just what AI suggested.

- **Code Quality**: I applied TypeScript best practices (interfaces, type safety) that AI suggested but adapted them to the project's needs.

- **API Integration**: I verified that the Open-Meteo API usage matches their actual API structure and requirements.

- **Balance**: I balanced completeness with the 2-3 hour time expectation, focusing on clarity and structure over exhaustive coverage.

## Omissions & Trade-offs

### What Was Omitted

1. **Full Geocoding Implementation**: The solution uses a limited city database with hardcoded coordinates. A production system would fully integrate with Open-Meteo's geocoding API or a dedicated geocoding service.

2. **Comprehensive City Database**: The autocomplete uses a small mock database. In production, this would connect to a comprehensive city database or geocoding API.

3. **Frontend UI Tests**: The solution focuses on API/backend testing. Frontend-specific tests (e.g., UI interactions, accessibility) are covered in the manual test script but not automated.

4. **Performance Testing**: No load testing or performance benchmarks are included (beyond basic timeout handling in manual tests).

5. **Security Testing**: Authentication, authorization, and input sanitization tests are not included (assumed to be handled by the backend).

6. **Integration with Real Backend**: The solution simulates the backend logic. In a real scenario, tests would hit the actual backend API endpoint rather than the service layer directly.

7. **Data Validation for Weather Data**: Limited validation of the weather data structure from Open-Meteo (assumes API returns expected format).

### Trade-offs Made

1. **Simplicity over Completeness**: Focused on clear, maintainable code that demonstrates testing approach rather than production-ready complexity.

2. **Service Layer Testing**: Tests the service layer logic directly rather than full end-to-end API testing, which is faster and more focused on business logic.

3. **Mock vs. Real API**: Used real Open-Meteo API calls for realistic testing, but this means tests depend on external service availability.

4. **Error Handling**: Implemented basic error handling. Production would need more sophisticated retry logic, circuit breakers, etc.

5. **Time Constraint**: Prioritized clear structure and coverage of main scenarios over exhaustive edge case automation (many edge cases covered in manual tests).

6. **TypeScript Configuration**: Used a simplified TypeScript config focused on testing needs rather than full production setup.

## Setup & Running Tests

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Running Tests

```bash
# Run all BDD tests
npm test

# Run tests with detailed output
npm run test:verbose

# Generate HTML report
npm test
# Report will be available at reports/cucumber-report.html
```

### Test Configuration

Cucumber configuration is in `cucumber.js`. It specifies:
- TypeScript support via `ts-node`
- Step definitions location
- Feature files location
- Report formats (progress bar and HTML)

## Key Features Tested

✅ API accepts city/town name as input  
✅ Fetches 7-day weather data using Open-Meteo APIs  
✅ Ranks each day for each activity (4 activities × 7 days = 28 results)  
✅ Response includes date, activity name, rank (1-10), and reasoning  
✅ Search box provides autocomplete suggestions  
✅ Suggestions based on predefined/dynamic city list  
✅ Selecting suggestion triggers activity ranking  

## Testing Philosophy

This solution follows BDD principles:

- **User-Centric**: Scenarios are written from the user's perspective
- **Clear Documentation**: Gherkin scenarios serve as living documentation
- **Automated Where Valuable**: Automate repetitive and regression-critical tests
- **Manual for Exploration**: Manual tests cover exploratory scenarios and edge cases
- **Maintainable**: Code is structured for easy maintenance and extension

## Future Enhancements

If given more time, I would add:

1. **Cucumber World Object**: For better state management in larger test suites
2. **API Mocking**: Option to use mocks for faster, more reliable tests
3. **CI/CD Integration**: GitHub Actions or similar for automated test execution
4. **Test Data Management**: Externalized test data (JSON/YAML files)
5. **Parallel Execution**: Run scenarios in parallel for faster execution
6. **Visual Regression**: If testing UI, add visual regression testing
7. **API Contract Testing**: Validate API contracts and schema

## Contact

For questions or feedback about this solution, please reach out through the repository issues or contact the repository owner.

---

**Note**: This solution was created as part of a QA Lead assessment. It demonstrates BDD thinking, test automation skills, and the ability to create comprehensive test coverage within time constraints.

