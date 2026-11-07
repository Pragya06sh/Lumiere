import { siteConfig } from "@/config/site";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Sends transactional email via Resend if emailVerificationEnabled is true and API key is present.
 * Defaults to logging safely in console if verification is disabled or remote keys are absent.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[Email Mock (No RESEND_API_KEY)] To: ${to} | Subject: ${subject}`);
    return { success: true };
  }

  try {
    const from = process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL || `${siteConfig.brandName} <notifications@${siteConfig.domain}>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Resend Error]", err);
      return { success: false, error: err };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[Resend Exception]", error);
    return { success: false, error: error.message };
  }
}

/**
 * Sends Password Reset Email with single-use link expiring in 30 minutes.
 */
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${siteConfig.url}/reset-password?token=${encodeURIComponent(resetToken)}`;

  const subject = `Reset Your Password | ${siteConfig.brandName}`;
  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #2A1B15; background-color: #FAF6F0; border-radius: 8px;">
      <h2 style="font-size: 24px; font-weight: normal; margin-bottom: 16px; color: #2A1B15; text-align: center;">${siteConfig.brandName}</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #5C463B;">
        We received a request to reset the password for your ${siteConfig.brandName} account.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #2A1B15; color: #FAF6F0; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 13px; line-height: 1.5; color: #7A6255;">
        This single-use reset link expires in 30 minutes. If you did not request this change, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #E6D8C6; margin: 24px 0;" />
      <p style="font-size: 11px; color: #9C8578; text-align: center;">
        ${siteConfig.brandName} · Handcrafted Candles
      </p>
    </div>
  `;

  const result = await sendEmail({
    to: email,
    subject,
    html,
    text: `Reset your ${siteConfig.brandName} password: ${resetUrl} (Link expires in 30 minutes)`,
  });

  return result.success;
}

/**
 * Sends a notification copy of customer messages to ORDERS_NOTIFY_EMAIL.
 */
export async function sendContactNotificationEmail(data: {
  name: string;
  phone: string;
  orderNumber?: string | null;
  message: string;
}): Promise<boolean> {
  const notifyEmail = process.env.ORDERS_NOTIFY_EMAIL;
  if (!notifyEmail) {
    return true;
  }

  const subject = `[Customer Inquiry] From ${data.name}${data.orderNumber ? ` (Order #${data.orderNumber})` : ""}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; padding: 24px; color: #2A1B15; background: #FAF6F0; border-radius: 8px;">
      <h3 style="margin-top: 0; color: #3A1410;">New Customer Message</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${data.orderNumber ? `<p><strong>Order Number:</strong> #${data.orderNumber}</p>` : ""}
      <p><strong>Message:</strong></p>
      <div style="background: #FFFFFF; padding: 16px; border-radius: 6px; border: 1px solid #E6D8C6; white-space: pre-wrap;">
        ${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
      </div>
      <p style="font-size: 11px; color: #888; margin-top: 24px;">Wick &amp; Wish Atelier Concierge</p>
    </div>
  `;

  const result = await sendEmail({
    to: notifyEmail,
    subject,
    html,
    text: `New customer message from ${data.name} (${data.phone}):\n\n${data.message}`,
  });

  return result.success;
}
