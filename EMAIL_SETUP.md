# Email Notifications Setup

This project includes email notifications for contact form submissions and project inquiries. Here's how to set it up:

## Prerequisites

1. A Gmail account (blutech18@gmail.com)
2. Gmail App Password (for secure authentication)
3. Netlify deployment (for serverless functions)

## Setup Steps

### 1. Enable Gmail App Passwords

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-factor authentication if not already enabled
4. Go to "App passwords"
5. Generate a new app password for "Mail"
6. Save this password securely "pkvr xphx yehd bgzp"

### 2. Configure Environment Variables

In your Netlify dashboard, add these environment variables:

```
EMAIL_USER=blutech18@gmail.com
EMAIL_PASSWORD=your_app_password_here
```

### 3. Deploy to Netlify

The email function is located at `netlify/functions/send-email.js` and will be automatically deployed with your site.

## How It Works

1. When someone submits a contact form or project inquiry
2. The form data is sent to `/.netlify/functions/send-email`
3. The function formats the data into a professional HTML email
4. The email is sent to blutech18@gmail.com using nodemailer
5. The sender's email is set as the reply-to address

## Email Templates

### Contact Form Emails
- Subject: "New Contact Message from [Name]"
- Contains: Name, email, message, timestamp
- Professional HTML formatting with BluTech branding

### Project Inquiry Emails
- Subject: "New Project Inquiry from [Name]"
- Contains: Full contact info, project details, budget, timeline, features
- Organized sections for easy reading

## Testing

To test email functionality:
1. Deploy to Netlify with proper environment variables
2. Submit a test contact form or project inquiry
3. Check blutech18@gmail.com for the notification email

## Troubleshooting

- Ensure EMAIL_PASSWORD is the app password, not your regular Gmail password
- Check Netlify function logs for any errors
- Verify environment variables are set correctly
- Make sure Gmail account has 2FA enabled

## Alternative Email Services

If you prefer to use a different email service, you can modify the transporter configuration in `netlify/functions/send-email.js`:

```javascript
// For SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// For AWS SES
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });
``` 