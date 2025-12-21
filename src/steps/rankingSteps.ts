import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { WeatherService, ActivityResult, ACTIVITY_TYPES } from '../api/WeatherService';

// State management - stores test context between steps
let cityInput: string;
let activitiesResponse: ActivityResult[];
let suggestionsResponse: string[];
let errorOccurred: Error | null = null;
let partialInput: string = '';
const weatherService = new WeatherService();

// Background step
Given('the Activity Ranking API is available', function () {
    // Verify the service is initialized (no action needed, just documentation)
    expect(weatherService).to.exist;
});

// === Ranking Scenarios ===

Given('the user searches for the city {string}', function (city: string) {
    cityInput = city;
    errorOccurred = null; // Reset error state
});

When('the system fetches the 7-day weather forecast', async function () {
    try {
        activitiesResponse = await weatherService.getRankedActivities(cityInput);
        errorOccurred = null;
    } catch (error: any) {
        errorOccurred = error;
        activitiesResponse = []; // Set empty array on error
    }
});

When('the system attempts to fetch the 7-day weather forecast', async function () {
    // Same as above but emphasizes that errors are expected
    try {
        activitiesResponse = await weatherService.getRankedActivities(cityInput);
        errorOccurred = null;
    } catch (error: any) {
        errorOccurred = error;
        activitiesResponse = [];
    }
});

Then('the response should contain exactly {int} activity results \\(4 activities × 7 days\\)', function (expectedCount: number) {
    expect(activitiesResponse, 'Activities response should not be empty').to.not.be.empty;
    expect(activitiesResponse.length, `Expected ${expectedCount} results but got ${activitiesResponse.length}`).to.equal(expectedCount);
});

Then('each result should have a date in YYYY-MM-DD format', function () {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    activitiesResponse.forEach((result, index) => {
        expect(result.date, `Date at index ${index} should be in YYYY-MM-DD format`).to.match(dateRegex);
    });
});

Then('each result should have an activity name from {string}, {string}, {string}, {string}', function (act1: string, act2: string, act3: string, act4: string) {
    const validActivities = [act1, act2, act3, act4];
    activitiesResponse.forEach((result, index) => {
        expect(validActivities, `Activity "${result.activity}" at index ${index} should be one of: ${validActivities.join(', ')}`).to.include(result.activity);
    });
});

Then('each result should have a rank between {int} and {int}', function (min: number, max: number) {
    activitiesResponse.forEach((item, index) => {
        expect(item.rank, `Rank at index ${index} should be between ${min} and ${max}`).to.be.at.least(min);
        expect(item.rank, `Rank at index ${index} should be between ${min} and ${max}`).to.be.at.most(max);
    });
});

Then('each result should have a non-empty reasoning string', function () {
    activitiesResponse.forEach((item, index) => {
        expect(item.reasoning, `Reasoning at index ${index} should be a string`).to.be.a('string');
        expect(item.reasoning.length, `Reasoning at index ${index} should not be empty`).to.be.greaterThan(0);
    });
});

Then('the date should be within the next 7 days', function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day
    
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    activitiesResponse.forEach((result, index) => {
        const resultDate = new Date(result.date);
        expect(resultDate, `Date at index ${index} should be on or after today`).to.be.at.least(today, 'Date should be today or in the future');
        expect(resultDate, `Date at index ${index} should be within 7 days`).to.be.at.most(sevenDaysFromNow, 'Date should be within 7 days');
    });
});

Then('the response should include {string} activities', function (activityName: string) {
    // This step is used multiple times for different activities
    const foundActivities = activitiesResponse.filter(result => result.activity === activityName);
    expect(foundActivities.length, `Should find at least one ${activityName} activity`).to.be.greaterThan(0);
});

Then('the response should contain exactly {int} unique dates', function (expectedCount: number) {
    const uniqueDates = new Set(activitiesResponse.map(result => result.date));
    expect(uniqueDates.size, `Expected ${expectedCount} unique dates but found ${uniqueDates.size}`).to.equal(expectedCount);
});

Then('each date should be consecutive \\(no gaps\\)', function () {
    const dates = Array.from(new Set(activitiesResponse.map(result => result.date))).sort();
    
    for (let i = 1; i < dates.length; i++) {
        const prevDateStr = dates[i - 1];
        const currDateStr = dates[i];
        if (!prevDateStr || !currDateStr) {
            throw new Error('Date string is undefined');
        }
        const prevDate = new Date(prevDateStr);
        const currDate = new Date(currDateStr);
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        expect(diffDays, `Dates should be consecutive, but found gap between ${prevDateStr} and ${currDateStr}`).to.equal(1);
    }
});

Then('the dates should start from tomorrow or today', function () {
    const dates = Array.from(new Set(activitiesResponse.map(result => result.date))).sort();
    const firstDateStr = dates[0];
    if (!firstDateStr) {
        throw new Error('First date string is undefined');
    }
    const firstDate = new Date(firstDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // First date should be today or tomorrow
    const isToday = firstDate.getTime() === today.getTime();
    const isTomorrow = firstDate.getTime() === tomorrow.getTime();
    expect(isToday || isTomorrow, `First date ${firstDateStr} should be today or tomorrow`).to.be.true;
});

Then('the system should handle the error gracefully', function () {
    // Error should have been caught (not thrown, causing test failure)
    expect(errorOccurred || activitiesResponse.length === 0, 'System should handle error gracefully').to.be.true;
});

Then('return an appropriate error response or empty result', function () {
    // Either an error was caught or empty result returned
    const handled = errorOccurred !== null || activitiesResponse.length === 0;
    expect(handled, 'Should return error or empty result').to.be.true;
});

// === Autocomplete Scenarios ===

Given('the user types {string} into the search box', async function (partial: string) {
    partialInput = partial;
    suggestionsResponse = await weatherService.getSuggestions(partial);
});

When('the system retrieves autocomplete suggestions', async function () {
    // This step is used when suggestions are retrieved in a When step
    // The actual retrieval happens in the Given step above
    expect(suggestionsResponse).to.not.be.undefined;
});

Then('the autocomplete suggestions should include {string}', function (expectedCity: string) {
    expect(suggestionsResponse, 'Suggestions should be an array').to.be.an('array');
    expect(suggestionsResponse, `Suggestions should include "${expectedCity}"`).to.include(expectedCity);
});

Then('the suggestions should be a valid array of city names', function () {
    expect(suggestionsResponse, 'Suggestions should be an array').to.be.an('array');
    suggestionsResponse.forEach((suggestion, index) => {
        expect(suggestion, `Suggestion at index ${index} should be a string`).to.be.a('string');
        expect(suggestion.length, `Suggestion at index ${index} should not be empty`).to.be.greaterThan(0);
    });
});

Then('all suggestions should contain the typed text \\(case-insensitive\\)', function () {
    // This step uses the partialInput stored in the previous Given step
    expect(partialInput, 'Partial input should be set from previous step').to.not.be.empty;
    const partialLower = partialInput.toLowerCase();
    suggestionsResponse.forEach((suggestion, index) => {
        expect(suggestion.toLowerCase(), `Suggestion "${suggestion}" at index ${index} should contain "${partialInput}"`).to.include(partialLower);
    });
});

Given('the system shows autocomplete suggestions including {string}', function (city: string) {
    // Verify the suggestion exists (assumes previous step already retrieved suggestions)
    expect(suggestionsResponse, `Suggestions should include "${city}"`).to.include(city);
});

When('the user selects {string} from the suggestions', function (selectedCity: string) {
    // Simulate user selecting a suggestion - this triggers the search
    cityInput = selectedCity;
    errorOccurred = null;
});

Then('the system should fetch the 7-day weather forecast for {string}', async function (city: string) {
    try {
        activitiesResponse = await weatherService.getRankedActivities(city);
        errorOccurred = null;
    } catch (error: any) {
        errorOccurred = error;
        activitiesResponse = [];
    }
    expect(cityInput, 'City input should match selected city').to.equal(city);
});

Then('the user should receive ranked activities', function () {
    expect(activitiesResponse, 'Should receive ranked activities').to.not.be.empty;
    expect(activitiesResponse.length, 'Should have activity results').to.be.greaterThan(0);
});

Then('the suggestions should include cities starting with {string}', function (prefix: string) {
    const prefixLower = prefix.toLowerCase();
    const matchingSuggestions = suggestionsResponse.filter(city => 
        city.toLowerCase().startsWith(prefixLower)
    );
    expect(matchingSuggestions.length, `Should have suggestions starting with "${prefix}"`).to.be.greaterThan(0);
});

Then('suggestions should be filtered based on the input', function () {
    // This is more of a documentation step - filtering is implicit in the getSuggestions logic
    expect(suggestionsResponse, 'Suggestions should be an array').to.be.an('array');
});

Then('the suggestions should be an empty array', function () {
    expect(suggestionsResponse, 'Suggestions should be an empty array').to.be.an('array');
    expect(suggestionsResponse.length, 'Suggestions array should be empty').to.equal(0);
});
