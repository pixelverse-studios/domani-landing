# Waitlist Signup Form Documentation

## Overview

The Domani landing page includes a sophisticated waitlist signup system with both modal and inline form variants, real-time validation, and backend integration support.

## Features Implemented

### 1. Form Variants

#### Modal Form (`WaitlistForm.tsx`)
- Full modal overlay with name and email fields
- Real-time field validation with visual feedback
- Success animations and confirmation messaging
- Accessibility compliant with ARIA attributes
- Auto-close after successful submission

#### Inline Form (`WaitlistInline.tsx`)
- Embedded directly in hero section
- Quick email-only signup
- Falls back to modal for additional information
- Compact, mobile-friendly design
- Success state with confirmation message

### 2. Backend Integration

#### API Route (`/api/waitlist`)
- Rate limiting (5 requests per hour per IP)
- Email and name validation
- Supabase database integration (when configured)
- Resend email service integration (when configured)
- Mock mode for development/testing

#### Supported Services
- **Database**: Supabase PostgreSQL
- **Email**: Resend for transactional emails
- **Validation**: validator.js for input sanitization
- **Rate Limiting**: In-memory rate limiter

### 3. Validation & Error Handling

#### Client-Side Validation
- Real-time email format validation
- Name validation (letters only, 2-100 chars)
- Visual feedback with green checkmarks
- Error messages with helpful guidance
- Touch-based validation (on blur)

#### Server-Side Validation
- Email format and length validation
- Name sanitization and validation
- Duplicate email detection
- Rate limit enforcement

### 4. User Experience

#### Micro-interactions
- Smooth animations with Framer Motion
- Loading states with spinners
- Success animations with checkmarks
- Hover effects and transitions
- Field focus states

#### Accessibility
- ARIA labels and descriptions
- Error announcements for screen readers
- Keyboard navigation support
- Focus management
- Semantic HTML structure

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```bash
# Resend API Key (get from https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase Configuration (get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Database Setup (Supabase)

1. Create a new Supabase project at https://supabase.com
2. Run the migration in `supabase/migrations/001_create_waitlist_table.sql`
3. Copy your project URL and keys to `.env.local`

### 3. Email Setup (Resend)

1. Sign up for Resend at https://resend.com
2. Verify your domain
3. Create an API key
4. Add the API key to `.env.local`

## Usage

### Basic Implementation

```jsx
// Modal form (opens in overlay)
import WaitlistForm from '@/components/WaitlistForm'

function MyComponent() {
  const [showForm, setShowForm] = useState(false)
  
  return (
    <>
      <button onClick={() => setShowForm(true)}>Join Waitlist</button>
      {showForm && (
        <WaitlistForm 
          variant="modal"
          onClose={() => setShowForm(false)}
          onSuccess={() => console.log('Success!')}
        />
      )}
    </>
  )
}
```

```jsx
// Inline form (embedded in page)
import WaitlistInline from '@/components/WaitlistInline'

function HeroSection() {
  return (
    <div className="hero">
      <h1>Join Our Waitlist</h1>
      <WaitlistInline />
    </div>
  )
}
```

## API Endpoint

### POST `/api/waitlist`

#### Request Body
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### Success Response (201)
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!"
}
```

#### Error Responses
- `400 Bad Request` - Invalid email or name
- `409 Conflict` - Email already exists
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

#### Headers
- `X-RateLimit-Remaining` - Requests remaining
- `Retry-After` - Seconds until rate limit resets (on 429)

## Mock Mode

When Supabase and Resend are not configured, the system runs in mock mode:
- API calls are simulated with 1-second delay
- No actual emails are sent
- No database records are created
- Perfect for development and testing

## Analytics

The forms track the following events:
- `waitlist_signup` - Successful submission
  - `event_label`: Form variant (modal/inline/inline_quick)
- `hero_cta_click` - CTA button clicks
- `hero_secondary_cta_click` - Secondary CTA clicks

## Testing

### Manual Testing

```bash
# Test the API endpoint
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Expected response (mock mode):
# {"success":true,"message":"Successfully joined the waitlist (mock mode)","mock":true}
```

### Test Scenarios

1. **Valid Submission**
   - Enter valid email and name
   - Should show success message
   - Should receive confirmation email (if configured)

2. **Invalid Email**
   - Enter invalid email format
   - Should show inline error message
   - Submit button should be enabled

3. **Duplicate Email**
   - Submit same email twice
   - Should show "already on list" message

4. **Rate Limiting**
   - Submit 6 times from same IP
   - Should show rate limit error

5. **Mobile Responsiveness**
   - Test on various screen sizes
   - Form should stack vertically on mobile
   - Touch targets should be 44px minimum

## Customization

### Styling
- All components use Tailwind CSS classes
- Color scheme uses CSS variables from globals.css
- Animations use Framer Motion

### Copy Changes
- Update placeholder text in form components
- Modify success messages in components
- Change email template in API route

### Validation Rules
- Adjust email/name validation in `utils/validation.ts`
- Modify rate limits in `lib/rate-limit.ts`
- Change field requirements in components

## Troubleshooting

### Form Not Submitting
1. Check browser console for errors
2. Verify API route is accessible
3. Check rate limiting

### Email Not Sending
1. Verify Resend API key is correct
2. Check domain is verified in Resend
3. Review email logs in Resend dashboard

### Database Not Saving
1. Verify Supabase credentials
2. Check table exists with migration
3. Review Supabase logs

### Rate Limit Issues
1. Clear browser cookies
2. Wait 1 hour for reset
3. Adjust limits in `lib/rate-limit.ts`

## Performance

- Form validation is debounced
- API calls use proper error handling
- Loading states prevent duplicate submissions
- Images are optimized with Next.js Image
- Animations use GPU acceleration

## Security

- Input sanitization on server
- Rate limiting prevents abuse
- CSRF protection via SameSite cookies
- SQL injection prevention via parameterized queries
- XSS protection via input escaping

## Future Enhancements

- [ ] Add CAPTCHA for spam prevention
- [ ] Implement double opt-in confirmation
- [ ] Add referral tracking
- [ ] Create admin dashboard
- [ ] Add webhook support
- [ ] Implement A/B testing for form variations
- [ ] Add more email providers (SendGrid, Mailgun)
- [ ] Create waitlist analytics dashboard