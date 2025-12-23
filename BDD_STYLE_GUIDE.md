# BDD Style Guide - Standardizing Given/When/Then Steps

Quick reference guide for consistent BDD step writing across international teams.

---

## Core Principles

1. **Consistency First** - Use consistent patterns across all scenarios
2. **Plain English** - Simple, clear language
3. **Reusability** - Design steps for multiple scenarios
4. **International Friendly** - Avoid regional slang, use standard English

---

## Given/When/Then Rules

### **Given** - Setup/Precondition (Past Tense or Present State)

✅ **Pattern:** `Given the <actor> <past action> <object>` or `Given the <system> is <state>`

**Examples:**
- `Given the user searches for the city {string}`
- `Given the Activity Ranking API is available`
- `Given a valid API key exists`

❌ **Avoid:** Missing articles, present continuous, mixing Given/When concepts

---

### **When** - Action/Trigger (Present Tense)

✅ **Pattern:** `When the <actor> <present action> <object>`

**Examples:**
- `When the system fetches the 7-day weather forecast`
- `When the user selects {string} from the suggestions`
- `When the system retrieves autocomplete suggestions`

❌ **Avoid:** Past tense, future tense, gerund forms

---

### **Then** - Expected Outcome (Use "should" or "will")

✅ **Pattern:** `Then the <entity> should <expected state>` or `Then the <system> will <behavior>`

**Examples:**
- `Then the response should contain exactly {int} activity results`
- `Then the suggestions should include {string}`
- `Then each result should have a rank between {int} and {int}`

❌ **Avoid:** Missing "should", unclear entities ("it", ambiguous references)

---

## Grammar Standards

### Articles
- ✅ Always use: `the user`, `the system`, `a city`, `an error`
- ❌ Never skip: `user`, `system` (missing articles)

### Tense Reference
| Context | Tense | Example |
|---------|-------|---------|
| Given | Past/State | "the user searches", "the API is available" |
| When | Present | "the system fetches", "the user selects" |
| Then | Should/Will | "should contain", "will display" |

---

## Parameter Usage

| Type | Usage | Example |
|------|-------|---------|
| `{string}` | Text values, names | `"London"`, `"user@example.com"` |
| `{int}` | Whole numbers | `28`, `10` |
| `{float}` | Decimals | `3.14`, `99.9` |
| `{word}` | Single word | `"active"`, `"success"` |

**In Step Definitions:**
```typescript
Given('the user searches for the city {string}', function (city: string) {
    cityInput = city;
});
```

---

## Vocabulary Standards

Create a **Terminology Dictionary** and stick to it:

| Standard Term | Don't Use |
|---------------|-----------|
| `searches for` | `looks for`, `finds` |
| `fetches` | `gets`, `retrieves` |
| `suggestions` | `options`, `recommendations` |
| `activity results` | `activities`, `items` |
| `rank` | `rating`, `score` |
| `reasoning` | `reason`, `explanation` |

---

## Step Naming Rules

### Always Include Actor
- ✅ `Given the user searches for the city {string}`
- ❌ `Given searches for city` (missing actor)

### Be Specific About Objects
- ✅ `When the system retrieves autocomplete suggestions`
- ❌ `When the system retrieves` (missing object)

### Use Clear Entity Names
- ✅ `Then the suggestions should include {string}`
- ❌ `Then it should include {string}` (ambiguous "it")

---

## Reusability

### ✅ Create Reusable Steps
```gherkin
Given the user searches for the city {string}
```
Can be used in multiple scenarios with different cities.

### ❌ Avoid Scenario-Specific Steps
```gherkin
Given the user searches for London specifically for this test
```

---

## International Team Guidelines

1. **Use International English** - Pick US or UK spelling and be consistent
2. **Avoid Regional Slang** - Use standard terms (`cancels` not `bails on`)
3. **Use ISO 8601 Dates** - `YYYY-MM-DD` format (e.g., `2025-12-23`)
4. **Explicit Units** - `7 days`, `28 results`, `rank between 1 and 10`

---

## Step Organization

Group related steps in your step definition file:

```typescript
// ===== RANKING SCENARIOS =====
Given('the user searches for the city {string}', ...);
When('the system fetches the 7-day weather forecast', ...);

// ===== AUTOCOMPLETE SCENARIOS =====
Given('the user types {string} into the search box', ...);
When('the system retrieves autocomplete suggestions', ...);
```

---

## Checklist Before Adding New Steps

- [ ] Correct tense (Given=past/state, When=present, Then=should/will)
- [ ] Includes actor (user/system/component)
- [ ] Uses articles (a/an/the)
- [ ] Parameters use correct types ({string}, {int}, etc.)
- [ ] Step is reusable across scenarios
- [ ] Uses consistent terminology
- [ ] Matches existing step patterns

---

## Quick Reference

```
GIVEN:  the <actor> <past action> <object>
        the <system> is <state>

WHEN:   the <actor> <present action> <object>
        the system <present verb>

THEN:   the <entity> should <state>
        the <system> will <behavior>

ALWAYS: Use articles (a/an/the)
        Specify actor clearly
        Use parameters ({string}, {int})
        Be consistent with terminology
```

---

## Example: Bad vs Good

### ❌ Bad
```gherkin
Given user searches London
When system fetches forecast
Then response contains 28 results
```

### ✅ Good
```gherkin
Given the user searches for the city "London"
When the system fetches the 7-day weather forecast
Then the response should contain exactly 28 activity results
```

---

**See `STEP_TEMPLATES.md` for copy-paste ready step templates.**

**Remember:** Consistency is key! When in doubt, follow existing patterns.
