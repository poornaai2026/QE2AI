# Enterprise Frontend UI Automation & Locator Standards

## 1. Quality Engineering DOM Contract
To maintain resilient test automation across releases, all production UI components adhere to standardized `data-testid` tags:

### Authentication Page (`/login`)
- Email Input: `[data-testid='input-email']` (Fallback: `input[type='email']`, `#email`)
- Password Input: `[data-testid='input-password']` (Fallback: `input[type='password']`, `#password`)
- Submit Button: `[data-testid='button-login']` (Fallback: `button[type='submit']`, `#login-btn`)
- Error Banner: `[data-testid='alert-error']`
- Success Banner: `[data-testid='alert-success']`
- Lockout Notice: `[data-testid='alert-lockout']`
- Email Validation Error: `[data-testid='error-email-validation']`
- Password Validation Error: `[data-testid='error-password-validation']`

### Dashboard Page (`/dashboard`)
- User Greeting: `[data-testid='user-greeting']`
- Logout Button: `[data-testid='button-logout']`

## 2. Common Automation Drift Scenarios
- When developers refactor UI libraries, locators may change from legacy `id="login-button"` to modern `data-testid="button-login"`.
- The AI Failure Analysis agent inspects locator drift and suggests replacing brittle CSS / ID selectors with certified `data-testid` attributes.
