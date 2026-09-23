# Enterprise Security Architecture: Authentication & Password Governance

## 1. Authentication Specifications
- Authentication requests are processed via HTTPS POST to `/api/auth/login`.
- Email addresses must be normalized to lowercase before validation against user records.
- Standard compliant regex for email validation: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`.
- Any submission with whitespace-only or empty strings must be rejected on the client-side with status indicators before network dispatch.

## 2. Error Message Disclosures & OWASP Compliance
- To prevent user enumeration attacks, login failures caused by non-existent accounts or incorrect passwords MUST return the generic message:
  `Invalid email or password`.
- System error codes:
  - `AUTH_401_CREDENTIALS`: Bad password or unverified email.
  - `AUTH_423_LOCKED`: Account temporarily or permanently suspended.
  - `AUTH_400_INVALID_PAYLOAD`: Missing required parameters.

## 3. Session Management & Redirects
- Upon successful authentication (`HTTP 200`), the client is issued a secure HttpOnly session cookie `session_token`.
- The UI MUST automatically redirect authenticated users to the `/dashboard` route.
- Unauthenticated access to `/dashboard` must immediately redirect to `/login`.
