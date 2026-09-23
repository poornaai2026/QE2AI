# Enterprise Security Policy: Account Lockout & Brute-Force Defense

## 1. Threshold Requirements
- To mitigate automated credential-stuffing and brute-force attacks, the authentication gateway tracks consecutive failed attempts per unique email.
- **Lockout Threshold**: Exactly 5 consecutive failed attempts.
- Attempts counter resets to zero upon:
  1. Any successful authentication before reaching the limit of 5.
  2. Administrative unlock via security ops console.
  3. Automatic expiration of 30-minute lockout window.

## 2. User Experience on Lockout
- When the 5th failed attempt is registered:
  - Account state transitions to `LOCKED`.
  - The UI MUST display: `Account locked due to 5 failed attempts. Please contact support.`
  - The Login button MUST be disabled (`disabled="true"` attribute).
  - Subsequent requests with even valid credentials during the lockout period must still be rejected with `HTTP 423 Locked`.

## 3. QA Automation Acceptance Notes
- Test cases verifying lockout must assert that attempts 1 through 4 increment the failure count and show `Invalid email or password`.
- Attempt 5 MUST trigger the lockout message and disable further submission.
- Under NO circumstances should an account lock prior to 5 failed attempts (e.g. 3 attempts is a severe regression and security misconfiguration).
