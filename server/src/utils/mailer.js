import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend Node.js SDK
 * @param {string|string[]} to - Recipient email address(es)
 * @param {string} subject - Email subject line
 * @param {string} message - HTML message content
 * @param {object} [options] - Optional parameters (idempotencyKey, tags, replyTo, etc.)
 * @returns {Promise<object>} - Returns Resend response data { id }
 */
export const sendMail = async (to, subject, message, options = {}) => {
  try {
    const fromAddress = process.env.EMAIL_FROM || "Solvify <onboarding@resend.dev>";
    const recipients = Array.isArray(to) ? to : [to];

    const payload = {
      from: fromAddress,
      to: recipients,
      subject,
      html: message,
    };

    if (options.idempotencyKey) {
      payload.idempotencyKey = options.idempotencyKey;
    }

    if (options.tags) {
      payload.tags = options.tags;
    } else {
      payload.tags = [{ name: "category", value: "transactional" }];
    }

    if (options.replyTo) {
      payload.replyTo = options.replyTo;
    }

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("❌ Resend mail error:", error);
      throw new Error(error.message || "Failed to send email via Resend");
    }

    console.log("✅ Mail sent via Resend:", data?.id);
    return data;
  } catch (error) {
    console.error("❌ Mail error:", error.message);
    throw error;
  }
};
