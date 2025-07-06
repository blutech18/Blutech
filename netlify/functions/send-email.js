const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'blutech18@gmail.com',
    pass: process.env.EMAIL_PASSWORD // App password for Gmail
  }
});

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { type, data, recipient } = JSON.parse(event.body);

    let subject, htmlContent;

    if (type === 'contact') {
      subject = `New Contact Message from ${data.name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00BFFF; border-bottom: 2px solid #00BFFF; padding-bottom: 10px;">
            New Contact Message
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #00BFFF; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${data.message}</p>
          </div>
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 6px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              You can reply directly to this email or contact ${data.name} at ${data.email}
            </p>
          </div>
        </div>
      `;
    } else if (type === 'inquiry') {
      subject = `New Project Inquiry from ${data.name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00BFFF; border-bottom: 2px solid #00BFFF; padding-bottom: 10px;">
            New Project Inquiry
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
            <p><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #00BFFF; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Details</h3>
            ${data.service_type ? `<p><strong>Service Type:</strong> ${data.service_type}</p>` : ''}
            ${data.project_type ? `<p><strong>Project Type:</strong> ${data.project_type}</p>` : ''}
            ${data.budget_range ? `<p><strong>Budget Range:</strong> ${data.budget_range}</p>` : ''}
            ${data.timeline ? `<p><strong>Timeline:</strong> ${data.timeline}</p>` : ''}
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Description</h3>
            <p style="line-height: 1.6; color: #555;">${data.description}</p>
          </div>
          
          ${data.requested_features && data.requested_features.length > 0 ? `
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Requested Features</h3>
            <ul style="color: #555; line-height: 1.6;">
              ${data.requested_features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${data.social_media_links && (data.social_media_links.facebook || data.social_media_links.instagram || data.social_media_links.tiktok) ? `
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Social Media Links</h3>
            ${data.social_media_links.facebook ? `<p><strong>Facebook:</strong> <a href="${data.social_media_links.facebook}" target="_blank">${data.social_media_links.facebook}</a></p>` : ''}
            ${data.social_media_links.instagram ? `<p><strong>Instagram:</strong> <a href="${data.social_media_links.instagram}" target="_blank">${data.social_media_links.instagram}</a></p>` : ''}
            ${data.social_media_links.tiktok ? `<p><strong>TikTok:</strong> <a href="${data.social_media_links.tiktok}" target="_blank">${data.social_media_links.tiktok}</a></p>` : ''}
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 6px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              You can reply directly to this email or contact ${data.name} at ${data.email}
            </p>
          </div>
        </div>
      `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'blutech18@gmail.com',
      to: recipient || 'blutech18@gmail.com',
      subject: subject,
      html: htmlContent,
      replyTo: data.email
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send email', details: error.message })
    };
  }
}; 