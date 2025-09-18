interface WaitlistWelcomeEmailProps {
  name: string
  position?: number
}

export function WaitlistWelcomeEmail({ name, position }: WaitlistWelcomeEmailProps) {
  const firstName = name.split(' ')[0]

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Domani</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .content p {
            color: #666666;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .highlight-box {
            background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
        }
        .highlight-box h3 {
            color: #667eea;
            margin-top: 0;
            font-size: 18px;
        }
        .highlight-box p {
            margin-bottom: 0;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
        }
        .social-section {
            background-color: #f7f7f7;
            padding: 30px;
            text-align: center;
            margin-top: 40px;
        }
        .social-section h3 {
            color: #333333;
            margin-bottom: 15px;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 600;
        }
        .footer {
            background-color: #333333;
            color: #999999;
            text-align: center;
            padding: 30px;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .content, .header {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌙 Domani</h1>
        </div>

        <div class="content">
            <h2>Welcome to the future of evening planning, ${firstName}!</h2>

            <p>
                Thank you for joining the Domani waitlist! You're now part of an exclusive group
                of forward-thinking professionals who are ready to transform their productivity.
            </p>

            <div class="highlight-box">
                <h3>✨ What happens next?</h3>
                <p>
                    We're working hard to perfect Domani's evening planning experience. As an early
                    supporter, you'll be among the first to:
                </p>
                <ul>
                    <li>Get early access when we launch</li>
                    <li>Lock in special founding member pricing</li>
                    <li>Shape the product with your feedback</li>
                    <li>Join our community of productivity enthusiasts</li>
                </ul>
            </div>

            <p>
                <strong>The Problem We're Solving:</strong> You wake up overwhelmed, scrambling to
                figure out what's important. Your morning mental energy gets wasted on planning
                instead of doing.
            </p>

            <p>
                <strong>The Domani Solution:</strong> Plan tomorrow tonight, when you're calm and
                reflective. Wake up with clarity and execute with focus.
            </p>

            <div style="text-align: center; margin: 40px 0;">
                <a href="https://domani.app" class="button">Visit Domani</a>
            </div>

            <div class="social-section">
                <h3>Help us spread the word!</h3>
                <p>
                    Know someone who struggles with chaotic mornings? Share Domani with them:
                </p>
                <div class="social-links">
                    <a href="https://twitter.com/intent/tweet?text=I just joined the waitlist for @DomaniApp - an evening planning app that transforms your mornings! Check it out: https://domani.app">Share on Twitter</a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://domani.app">Share on LinkedIn</a>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>
                © ${new Date().getFullYear()} Domani. Plan Tomorrow Tonight.
            </p>
            <p>
                Questions? Reply to this email or reach out at
                <a href="mailto:hello@domani.app">hello@domani.app</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px; color: #666666;">
                You're receiving this because you signed up for the Domani waitlist.
            </p>
        </div>
    </div>
</body>
</html>
`
}

export function WaitlistWelcomeEmailText({ name }: WaitlistWelcomeEmailProps) {
  const firstName = name.split(' ')[0]

  return `Welcome to the future of evening planning, ${firstName}!

Thank you for joining the Domani waitlist! You're now part of an exclusive group of forward-thinking professionals who are ready to transform their productivity.

✨ What happens next?

We're working hard to perfect Domani's evening planning experience. As an early supporter, you'll be among the first to:

• Get early access when we launch
• Lock in special founding member pricing
• Shape the product with your feedback
• Join our community of productivity enthusiasts

The Problem We're Solving:
You wake up overwhelmed, scrambling to figure out what's important. Your morning mental energy gets wasted on planning instead of doing.

The Domani Solution:
Plan tomorrow tonight, when you're calm and reflective. Wake up with clarity and execute with focus.

Visit us at: https://domani.app

Help us spread the word!
Know someone who struggles with chaotic mornings? Share Domani with them.

Questions? Reply to this email or reach out at hello@domani.app

© ${new Date().getFullYear()} Domani. Plan Tomorrow Tonight.

You're receiving this because you signed up for the Domani waitlist.`
}