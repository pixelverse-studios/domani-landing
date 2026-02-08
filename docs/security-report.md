# Security Audit Report - PR #35

**Date**: 2026-02-07
**PR**: #35 - feat(DOM-434): Replace evening-* color references with sage palette
**Branch**: dom-434 → dev/color-redesign
**Auditor**: Claude Code Security Analysis
**Scope**: Color migration changes across 10 component files

---

## Executive Summary

This security audit assessed PR #35, which migrates color references from `evening-*` to the sage palette (`primary-*`) across 10 component files. The PR is a **CSS-only refactoring** with minimal security implications.

### Risk Assessment

- **Critical Vulnerabilities**: 0
- **High Vulnerabilities**: 3 (pre-existing, not introduced by this PR)
- **Medium Vulnerabilities**: 3 (pre-existing, not introduced by this PR)
- **Low Vulnerabilities**: 2 (pre-existing, not introduced by this PR)

### PR-Specific Finding

**Result**: ✅ **SAFE TO MERGE**

The changes in PR #35 are purely cosmetic CSS class replacements with no security impact. All modified code consists of static Tailwind CSS class names with no dynamic generation, user input, or logic changes.

However, this audit revealed several **pre-existing vulnerabilities** in the codebase that require immediate attention.

---

## Critical Vulnerabilities

### None introduced by PR #35

---

## High Vulnerabilities (Pre-existing)

### 1. Outdated Dependencies with Known CVEs

**Location**: `package.json` and `node_modules/`

**Description**: Multiple dependencies have known security vulnerabilities:
- **validator**: v13.15.15 (CVE: GHSA-vghf-hv5q-vc8g, GHSA-9965-vmph-33xx)
  - Severity: HIGH (CVSS 7.5)
  - Issue: Incomplete filtering of special elements, URL validation bypass
- **next**: v15.6.0+ (GHSA-h25m-26qc-wcjf, GHSA-9g9p-9gw9-jx7f, GHSA-5f7q-jpqc-wp7h)
  - Severity: HIGH/MODERATE (CVSS 7.5, 5.9)
  - Issues: HTTP request deserialization DoS, Image Optimizer DoS, unbounded memory consumption
- **glob**: v10.2.0-10.4.5 (GHSA-5j98-mcp5-4vw2)
  - Severity: HIGH (CVSS 7.5)
  - Issue: Command injection via CLI

**Impact**:
- Validator vulnerabilities could enable XSS attacks through URL validation bypass
- Next.js vulnerabilities could lead to Denial of Service attacks
- Glob vulnerability poses command injection risk if used in CLI contexts

**Remediation Checklist**:
- [ ] Update `validator` to version ≥13.15.22
  ```bash
  npm install validator@latest
  ```
- [ ] Update `next` to version ≥16.1.5
  ```bash
  npm install next@latest
  ```
- [ ] Update `glob` to version ≥10.5.0
  ```bash
  npm update glob
  ```
- [ ] Run `npm audit fix --force` to auto-fix remaining issues
- [ ] Test application thoroughly after updates
- [ ] Create a scheduled dependency update workflow (Dependabot/Renovate)

**References**:
- [GHSA-vghf-hv5q-vc8g](https://github.com/advisories/GHSA-vghf-hv5q-vc8g)
- [GHSA-9965-vmph-33xx](https://github.com/advisories/GHSA-9965-vmph-33xx)
- [GHSA-h25m-26qc-wcjf](https://github.com/advisories/GHSA-h25m-26qc-wcjf)

---

### 2. Missing Security Headers

**Location**: `next.config.js`

**Description**: The Next.js configuration lacks critical HTTP security headers that protect against common web vulnerabilities.

**Impact**:
- No Content Security Policy (CSP) exposes the site to XSS attacks
- Missing X-Frame-Options allows clickjacking attacks
- No X-Content-Type-Options enables MIME-type sniffing attacks
- Missing HSTS header leaves connections vulnerable to downgrade attacks

**Remediation Checklist**:
- [ ] Add security headers to `next.config.js`:

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.posthog.com *.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              font-src 'self' data:;
              connect-src 'self' *.supabase.co *.posthog.com *.google-analytics.com;
              frame-ancestors 'self';
              base-uri 'self';
              form-action 'self';
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}
```

- [ ] Test CSP implementation with browser console
- [ ] Adjust CSP directives based on third-party services used
- [ ] Verify headers are applied using browser DevTools (Network tab)
- [ ] Run [securityheaders.com](https://securityheaders.com) scan after deployment

**References**:
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Next.js Security Headers Documentation](https://nextjs.org/docs/advanced-features/security-headers)

---

### 3. No CSRF Protection on Form Submissions

**Location**:
- `/Users/phil/PVS-local/Projects/domani/domani-landing/src/components/WaitlistForm.tsx`
- `/Users/phil/PVS-local/Projects/domani/domani-landing/src/components/UnsubscribeForm.tsx`
- `/Users/phil/PVS-local/Projects/domani/domani-landing/src/components/AccountUnsubscribeForm.tsx`
- `/Users/phil/PVS-local/Projects/domani/domani-landing/src/app/api/waitlist/route.ts`

**Description**: Form submissions to API routes lack Cross-Site Request Forgery (CSRF) protection. While Next.js provides some default protections for server actions, traditional POST endpoints need explicit CSRF tokens.

**Impact**:
- Attackers could craft malicious websites that submit forms on behalf of authenticated users
- Unintended email subscriptions or unsubscriptions could occur
- Though limited to public endpoints, it's a security best practice gap

**Remediation Checklist**:
- [ ] Install CSRF protection library:
  ```bash
  npm install csrf
  ```
- [ ] Create CSRF token utility (`src/lib/csrf.ts`):
  ```typescript
  import Tokens from 'csrf'

  const tokens = new Tokens()
  const secret = process.env.CSRF_SECRET || 'default-secret-change-in-production'

  export function generateCsrfToken(): string {
    return tokens.create(secret)
  }

  export function verifyCsrfToken(token: string): boolean {
    return tokens.verify(secret, token)
  }
  ```
- [ ] Add CSRF secret to `.env.local`:
  ```
  CSRF_SECRET=<generate-random-32-char-string>
  ```
- [ ] Modify API routes to require CSRF tokens:
  ```typescript
  // In route.ts
  const csrfToken = request.headers.get('x-csrf-token')
  if (!csrfToken || !verifyCsrfToken(csrfToken)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }
  ```
- [ ] Update form components to include CSRF token in requests
- [ ] Add CSRF token generation endpoint (`/api/csrf`)
- [ ] Test CSRF protection with valid and invalid tokens

**Alternative**: Use Next.js Server Actions which have built-in CSRF protection

**References**:
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

## Medium Vulnerabilities (Pre-existing)

### 1. Weak Rate Limiting Implementation

**Location**: `/Users/phil/PVS-local/Projects/domani/domani-landing/src/app/api/waitlist/route.ts` (lines 7-40)

**Description**: The current rate limiting uses in-memory storage which has limitations:
- Not shared across multiple server instances (horizontal scaling issue)
- Cleared on server restart
- Memory leak potential with unbounded growth
- IP address spoofing not handled (X-Forwarded-For can be forged)

**Code snippet**:
```typescript
// Current implementation
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitStore.get(identifier)
  // ... basic in-memory rate limiting
}
```

**Impact**:
- Attackers could bypass rate limits by restarting the server or using distributed attacks
- Legitimate users might be incorrectly rate-limited after server restarts
- IP spoofing could allow unlimited requests

**Remediation Checklist**:
- [ ] Implement Redis-based rate limiting for production:
  ```bash
  npm install @upstash/redis @upstash/ratelimit
  ```
- [ ] Create rate limit utility (`src/lib/rateLimit.ts`):
  ```typescript
  import { Ratelimit } from '@upstash/ratelimit'
  import { Redis } from '@upstash/redis'

  const redis = Redis.fromEnv()

  export const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
  })

  export async function checkRateLimit(identifier: string) {
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
    return { success, limit, reset, remaining }
  }
  ```
- [ ] Add Redis environment variables to `.env.local`
- [ ] Improve IP detection to prevent spoofing:
  ```typescript
  function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip') // Cloudflare

    // Prefer Cloudflare's IP (most trustworthy if using CF)
    return cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown'
  }
  ```
- [ ] Add fingerprinting as secondary identifier (browser fingerprint + IP)
- [ ] Implement progressive delays for repeated violations
- [ ] Add monitoring/alerts for rate limit violations

**References**:
- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)
- [OWASP Rate Limiting Guide](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

---

### 2. Input Sanitization Not Applied in All Contexts

**Location**:
- `/Users/phil/PVS-local/Projects/domani/domani-landing/src/utils/validation.ts` (lines 9-11)
- Form components

**Description**: While a `sanitizeInput` function exists, it's not consistently applied to all user inputs before storage or display. Email validation is good, but other potential inputs need sanitization.

**Code snippet**:
```typescript
// Sanitization function exists but not used everywhere
export function sanitizeInput(input: string): string {
  return validator.escape(input.trim())
}
```

**Impact**:
- Potential for stored XSS if unsanitized data is stored and later rendered
- While React escapes by default, edge cases with `dangerouslySetInnerHTML` exist
- Database pollution with malicious content

**Remediation Checklist**:
- [ ] Apply sanitization to all user inputs before API submission:
  ```typescript
  // In form components
  import { sanitizeInput } from '@/utils/validation'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const sanitizedEmail = sanitizeInput(email)
    // ... submit sanitized data
  }
  ```
- [ ] Add server-side sanitization in API routes:
  ```typescript
  // In API routes
  const { email } = body
  const sanitizedEmail = sanitizeInput(email).toLowerCase().trim()
  ```
- [ ] Review all `dangerouslySetInnerHTML` usage:
  - `/src/components/privacy/SiteBehaviourConsentGate.tsx`
  - `/src/components/admin/EnhancedEmailPreview.tsx`
  - `/src/components/admin/SendConfirmationModal.tsx`
  - `/src/components/admin/EmailComposer.tsx`
- [ ] Add DOMPurify for HTML sanitization where needed:
  ```bash
  npm install dompurify @types/dompurify
  ```
- [ ] Implement output encoding for user-generated content
- [ ] Document sanitization requirements in code comments

**References**:
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

---

### 3. Dependency with Moderate Vulnerabilities

**Location**: `package.json` (indirect dependencies)

**Description**: Secondary vulnerabilities in indirect dependencies:
- **js-yaml** v4.0.0-4.1.0 (GHSA-mh29-5h37-fv8m): Prototype pollution vulnerability
- **mdast-util-to-hast** v13.0.0-13.2.0 (GHSA-4fh9-h7wg-q85m): Unsanitized class attribute

**Impact**:
- Prototype pollution could lead to application-wide security issues
- Unsanitized class attributes in markdown processing could enable CSS injection

**Remediation Checklist**:
- [ ] Update affected packages:
  ```bash
  npm update js-yaml mdast-util-to-hast
  ```
- [ ] Run comprehensive audit:
  ```bash
  npm audit fix
  ```
- [ ] Verify all dependencies are updated:
  ```bash
  npm outdated
  ```
- [ ] Set up automated dependency updates (Dependabot)
- [ ] Add `npm audit` to CI/CD pipeline

**References**:
- [GHSA-mh29-5h37-fv8m](https://github.com/advisories/GHSA-mh29-5h37-fv8m)
- [GHSA-4fh9-h7wg-q85m](https://github.com/advisories/GHSA-4fh9-h7wg-q85m)

---

## Low Vulnerabilities (Pre-existing)

### 1. No Request Size Limits

**Location**: API routes (`/src/app/api/waitlist/route.ts`)

**Description**: API routes don't explicitly limit request body size, which could enable DoS attacks through large payload submissions.

**Impact**:
- Attackers could send extremely large requests to exhaust server memory
- Potential for application crashes or slowdowns

**Remediation Checklist**:
- [ ] Add request size validation in API routes:
  ```typescript
  // In route.ts
  const MAX_BODY_SIZE = 1024 // 1KB
  const bodyText = await request.text()

  if (bodyText.length > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: 'Request body too large' },
      { status: 413 }
    )
  }
  ```
- [ ] Configure Next.js body size limit in `next.config.js`:
  ```javascript
  module.exports = {
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
    },
  }
  ```
- [ ] Add request timeout limits
- [ ] Implement request validation middleware

**References**:
- [Next.js API Routes Configuration](https://nextjs.org/docs/api-routes/request-helpers)

---

### 2. Missing Request Logging for Security Events

**Location**: All API routes

**Description**: Security-relevant events (failed login attempts, rate limit violations, validation failures) are not consistently logged for security monitoring.

**Impact**:
- Difficult to detect and respond to attacks
- No audit trail for security incidents
- Limited visibility into application security posture

**Remediation Checklist**:
- [ ] Implement structured logging:
  ```bash
  npm install pino pino-pretty
  ```
- [ ] Create logging utility (`src/lib/logger.ts`):
  ```typescript
  import pino from 'pino'

  export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
  })

  export function logSecurityEvent(event: string, details: object) {
    logger.warn({
      type: 'security',
      event,
      timestamp: new Date().toISOString(),
      ...details
    })
  }
  ```
- [ ] Add security event logging to API routes:
  ```typescript
  // Log rate limit violations
  if (!checkRateLimit(ip)) {
    logSecurityEvent('rate_limit_exceeded', { ip, endpoint: '/api/waitlist' })
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Log validation failures
  if (!validateEmail(email)) {
    logSecurityEvent('invalid_email_submission', { ip, email: '[redacted]' })
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  ```
- [ ] Set up log aggregation (Datadog, Logtail, etc.)
- [ ] Create security monitoring dashboard
- [ ] Set up alerts for suspicious patterns

**References**:
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

---

## PR #35 Specific Analysis

### Changes Summary

PR #35 replaces color class names across 10 files:
- `evening-600` → `primary-700`
- `evening-700` → `primary-800`
- `evening-500` → `primary-600`
- `evening-300` → `primary-300/400`
- `evening-200` → `primary-300`

### Files Modified

1. `AccountUnsubscribeForm.tsx` - 3 changes (button gradients)
2. `UnsubscribeForm.tsx` - 3 changes (button gradients)
3. `WaitlistForm.tsx` - 1 change (button gradient)
4. `WaitlistInline.tsx` - 1 change (button gradient)
5. `DynamicCTA.tsx` - 2 changes (button gradients)
6. `AboutContent.tsx` - 11 changes (backgrounds, badges, text gradients)
7. `FloatingSidebar.tsx` - 1 change (CTA box gradient)
8. `AppPreviewSection.tsx` - 2 changes (screen background, glow effect)
9. `PricingContent.tsx` - 7 changes (backgrounds, badges, glows)
10. `TestimonialsSection.tsx` - 1 change (background gradient)

### Security Assessment

✅ **All changes are safe**:
- No logic modifications
- No user input handling changes
- No API changes
- No authentication/authorization changes
- No database query modifications
- Static Tailwind class replacements only

**CSS Injection Analysis**:
- All className attributes use static strings or template literals with predefined values
- No dynamic class generation based on user input
- No string concatenation with unsanitized data
- Tailwind CSS classes are statically analyzed at build time

**Example from PR**:
```typescript
// SAFE - Static template literal with hardcoded values
className={`
  ${buttonPadding} rounded-xl font-semibold
  bg-gradient-to-r from-primary-600 to-primary-700
  hover:from-primary-700 hover:to-primary-800
  text-white shadow-lg hover:shadow-xl
`}
```

---

## General Security Recommendations

### Immediate Actions (Within 1 Week)

- [ ] Update all vulnerable dependencies (HIGH priority)
- [ ] Implement security headers in `next.config.js` (HIGH priority)
- [ ] Deploy Redis-based rate limiting (MEDIUM priority)
- [ ] Add CSRF protection to forms (MEDIUM priority)

### Short-term Actions (Within 1 Month)

- [ ] Implement comprehensive request logging
- [ ] Set up security monitoring dashboard
- [ ] Add request size limits
- [ ] Review and secure all `dangerouslySetInnerHTML` usage
- [ ] Implement automated dependency scanning in CI/CD

### Long-term Actions (Ongoing)

- [ ] Conduct quarterly security audits
- [ ] Set up automated penetration testing
- [ ] Implement Web Application Firewall (WAF)
- [ ] Create security incident response plan
- [ ] Add security awareness training for developers
- [ ] Implement automated security testing in CI/CD pipeline

---

## Security Posture Improvement Plan

### Phase 1: Critical Fixes (Week 1)
1. Update all dependencies with HIGH/CRITICAL vulnerabilities
2. Implement security headers
3. Test application thoroughly after updates

### Phase 2: Enhanced Protection (Weeks 2-3)
1. Deploy Redis rate limiting
2. Add CSRF protection
3. Implement request size limits
4. Add security event logging

### Phase 3: Monitoring & Automation (Week 4)
1. Set up log aggregation and monitoring
2. Configure security alerts
3. Integrate Dependabot or Renovate
4. Add `npm audit` to CI/CD pipeline

### Phase 4: Continuous Improvement (Ongoing)
1. Regular security reviews
2. Quarterly penetration testing
3. Security training for team
4. Stay updated on security best practices

---

## Testing Considerations

### Security Testing Checklist

- [ ] Dependency vulnerability scanning
  ```bash
  npm audit
  npm outdated
  ```

- [ ] OWASP ZAP automated scan
- [ ] Manual penetration testing of forms
- [ ] CSRF token validation testing
- [ ] Rate limiting effectiveness testing
- [ ] Security headers verification
- [ ] XSS vulnerability testing
- [ ] SQL injection testing (if applicable)
- [ ] Authentication bypass attempts
- [ ] Session management testing

### Tools to Use

- **OWASP ZAP**: Automated vulnerability scanning
- **Burp Suite**: Manual penetration testing
- **npm audit**: Dependency vulnerability checking
- **Snyk**: Continuous dependency monitoring
- **SecurityHeaders.com**: Header configuration validation
- **SSL Labs**: TLS/SSL configuration testing

---

## Compliance Considerations

### GDPR Compliance
- ✅ Privacy policy links present
- ✅ Explicit consent for newsletter subscription
- ✅ Unsubscribe functionality implemented
- ⚠️ Ensure data deletion requests are handled
- ⚠️ Document data retention policies

### OWASP Top 10 Coverage

1. **A01:2021 – Broken Access Control**: ⚠️ Review admin routes
2. **A02:2021 – Cryptographic Failures**: ✅ HTTPS enforced
3. **A03:2021 – Injection**: ✅ Validated inputs, but needs more sanitization
4. **A04:2021 – Insecure Design**: ⚠️ CSRF protection needed
5. **A05:2021 – Security Misconfiguration**: ❌ Missing security headers
6. **A06:2021 – Vulnerable Components**: ❌ Outdated dependencies
7. **A07:2021 – Authentication Failures**: N/A (no auth in landing page)
8. **A08:2021 – Software/Data Integrity**: ⚠️ Needs SRI for CDN resources
9. **A09:2021 – Security Logging**: ❌ Insufficient logging
10. **A10:2021 – SSRF**: ✅ No server-side requests to user-controlled URLs

---

## Appendix

### Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Next.js Security Best Practices](https://nextjs.org/docs/authentication)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### Automated Security Tools

```bash
# Install security scanning tools
npm install -D @snyk/protect
npm install -D eslint-plugin-security

# Add to package.json scripts
{
  "scripts": {
    "security:audit": "npm audit",
    "security:check": "snyk test",
    "security:monitor": "snyk monitor"
  }
}
```

### ESLint Security Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:security/recommended'],
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'warn',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
  }
}
```

---

## Conclusion

PR #35 is **safe to merge** from a security perspective as it contains only CSS color class replacements with no logic changes.

However, the codebase has **several pre-existing security vulnerabilities** that require immediate attention:

**Priority 1 (Immediate)**:
1. Update vulnerable dependencies (validator, next, glob)
2. Implement security headers

**Priority 2 (Short-term)**:
1. Add CSRF protection
2. Improve rate limiting with Redis
3. Enhance input sanitization

The security posture can be significantly improved by following the remediation checklists provided in this report.

---

**Report Generated**: 2026-02-07
**Next Review Date**: 2026-03-07 (monthly review recommended)

