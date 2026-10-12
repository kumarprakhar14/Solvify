import { inngest } from "../index.js";
import { sendMail } from "../../utils/mailer.js";
import { getQuotationApprovedEmailTemplate } from "../../utils/mails/quotationApprovedEmail.js";

export const onQuotationApproved = inngest.createFunction(
    { id: "on-quotation-approved", retries: 2 },
    { event: "quotation/approved" },
    async ({ event, step }) => {
        try {
            const { quotationData } = event.data;

            if (!quotationData || !quotationData.clientEmail) {
                console.error("❌ Invalid quotation data for approval email");
                return { success: false, message: "Missing quotation client email" };
            }

            await step.run("send-approval-email", async () => {
                const projectTitle =
                    quotationData.projectName ||
                    quotationData.projectTitle ||
                    quotationData.subject ||
                    "Project";

                const subject = `Quotation Approved: ${projectTitle}`;
                const message = getQuotationApprovedEmailTemplate(quotationData);

                await sendMail(quotationData.clientEmail, subject, message, {
                    idempotencyKey: `quotation-approved-${quotationData._id || quotationData.quotationId}`
                });
                return { sent: true, recipient: quotationData.clientEmail };
            });

            return { success: true };
        } catch (error) {
            console.error("❌ Error sending quotation approved email:", error.message);
            return { success: false };
        }
    }
);
