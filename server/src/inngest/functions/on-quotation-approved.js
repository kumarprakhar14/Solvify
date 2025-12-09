import { inngest } from "../index.js";
import nodemailer from "nodemailer";

export const onQuotationApproved = inngest.createFunction(
    { id: "on-quotation-approved" },
    { event: "quotation/approved" },
    async ({ event, step }) => {
        const { quotationData } = event.data;

        await step.run("send-approval-email", async () => {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: quotationData.clientEmail,
                subject: `Quotation Approved: ${quotationData.projectTitle || quotationData.subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #22c55e;">Quotation Approved!</h2>
                        <p>Dear ${quotationData.clientName},</p>
                        <p>We are pleased to inform you that your quotation for <strong>${quotationData.projectTitle || quotationData.subject}</strong> has been approved.</p>
                        
                        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Quotation ID:</strong> ${quotationData.quotationId}</p>
                            <p><strong>Total Amount:</strong> $${quotationData.totalAmount}</p>
                            <p><strong>Valid Until:</strong> ${new Date(quotationData.validUntil).toLocaleDateString()}</p>
                        </div>

                        <p>Our team will be in touch shortly to discuss the next steps and project kickoff.</p>
                        
                        <p>Best regards,<br>The Solvify Team</p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            return { sent: true, recipient: quotationData.clientEmail };
        });

        return { success: true };
    }
);
