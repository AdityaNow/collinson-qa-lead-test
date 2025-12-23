# Step Definition Templates

Quick reference templates for common step patterns. Copy and customize as needed.

---

## User Actions

### User Input/Search

```gherkin
Given the user searches for the city {string}
Given the user enters {string} into the search box
Given the user types {string} into the {string} field
```

```typescript
Given('the user searches for the city {string}', function (city: string) {
    cityInput = city;
});
```

### User Selection

```gherkin
When the user selects {string} from the suggestions
When the user clicks on {string}
When the user chooses {string}
```

```typescript
When('the user selects {string} from the suggestions', function (selection: string) {
    selectedItem = selection;
});
```

---

## System Actions

### API Calls

```gherkin
When the system fetches the {string} forecast
When the system retrieves {string}
When the system calls the {string} API
```

```typescript
When('the system fetches the {string} forecast', async function (forecastType: string) {
    response = await apiService.fetch(forecastType);
});
```

### Data Retrieval

```gherkin
When the system retrieves autocomplete suggestions
When the system loads the data
When the system queries the database
```

---

## Assertions

### Response Content

```gherkin
Then the response should contain exactly {int} {string}
Then the response should include {string}
Then the {string} should have {int} items
```

```typescript
Then('the response should contain exactly {int} {string}', function (count: number, itemType: string) {
    expect(response.length).to.equal(count);
});
```

### Property Validation

```gherkin
Then each {string} should have a {string} between {int} and {int}
Then each {string} should have a {string} in {string} format
Then each {string} should have a non-empty {string}
```

```typescript
Then('each {string} should have a {string} between {int} and {int}', 
    function (item: string, property: string, min: number, max: number) {
    items.forEach(item => {
        expect(item[property]).to.be.at.least(min);
        expect(item[property]).to.be.at.most(max);
    });
});
```

### Existence Checks

```gherkin
Then the {string} should include {string}
Then the {string} should exist
Then the {string} should be an empty array
```

---

## Error Handling

### Error Scenarios

```gherkin
When the system attempts to {string}
Then the system should handle the error gracefully
Then the system should return an appropriate error response
```

```typescript
When('the system attempts to {string}', async function (action: string) {
    try {
        result = await performAction(action);
    } catch (error) {
        errorOccurred = error;
    }
});

Then('the system should handle the error gracefully', function () {
    expect(errorOccurred).to.not.be.null;
});
```

---

## Common Combinations

### Search and Validate

```gherkin
Given the user searches for the city {string}
When the system fetches the 7-day weather forecast
Then the response should contain exactly {int} activity results
```

### Input and Suggestions

```gherkin
Given the user types {string} into the search box
When the system retrieves autocomplete suggestions
Then the suggestions should include {string}
```

### Error Flow

```gherkin
Given the user searches for the city {string}
When the system attempts to fetch the 7-day weather forecast
Then the system should handle the error gracefully
And return an appropriate error response or empty result
```

---

## Parameter Types Quick Reference

| Type | Usage | Example |
|------|-------|---------|
| `{string}` | Text values, names, IDs | `"London"`, `"user@example.com"` |
| `{int}` | Whole numbers | `28`, `10`, `0` |
| `{float}` | Decimal numbers | `3.14`, `99.9` |
| `{word}` | Single word (no spaces) | `"active"`, `"success"` |

---

## Copy-Paste Ready Steps

### Authentication
```gherkin
Given the user is authenticated
Given the user has a valid API key
Given the user session is active
```

### Data Setup
```gherkin
Given the {string} exists
Given a {string} with {string} is available
Given the database contains {int} {string}
```

### Actions
```gherkin
When the user submits the form
When the system processes the request
When the API receives {string}
```

### Validations
```gherkin
Then the status code should be {int}
Then the error message should contain {string}
Then the response time should be less than {int} milliseconds
```

---

**Tip:** Copy these templates and customize for your specific use case. Always follow the BDD Style Guide patterns!

