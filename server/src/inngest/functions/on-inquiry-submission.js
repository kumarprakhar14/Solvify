import { inngest } from "../index.js";
import User from "../../models/user.model.js";
import Quotation from "../../models/quotation.model.js";
import Inquiry from "../../models/inquiry.model.js";
import { sendMail } from "../../utils/mailer.js"
import { getInquirySubmissionEmailTemplate } from "../../utils/mails/inquirySubmissionEmail.js";
import { generateQuotationContent } from "../../services/ai.service.js";

export const onInquirySubmission = inngest.createFunction(
    { id: "on-inquiry-submission", retries: 2 },
    { event: "inquiry/submit" },
    async ({ event, step }) => {
        try {
            const { inquiryId } = event.data;

            // 0. Fetch Inquiry
            const inquiry = await step.run("fetch-inquiry", async () => {
                const inquiryDoc = await Inquiry.findById(inquiryId);
                if (!inquiryDoc) throw new Error("Inquiry not found");
                return inquiryDoc;
            });
            
            // 1. Fetch User (Optional - Do not throw error if missing)
            // We search for a registered user to potentially link them, but we don't block guests.
            const user = await step.run("fetch-user-optional", async () => {
                return await User.findOne({ email: inquiry.email });
            });

            // 2. Format Date for Email
            const createdAt = await step.run("change-time-to-ist", async () => {
                return new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "full",
                    timeStyle: "long",
                    timeZone: "Asia/Kolkata",
                }).format(new Date(inquiry.createdAt || Date.now()));
            });

            // 3. Send Confirmation Email
            // Use registered user details if available, otherwise fall back to inquiry details
            await step.run("send-inquiry-submission-email", async () => {
                const recipientName = user?.name || inquiry.name;
                const recipientEmail = user?.email || inquiry.email;
                
                const subject = `Inquiry Submitted: ${inquiry.projectTitle}`;
                const message = getInquirySubmissionEmailTemplate(recipientName, recipientEmail, inquiry.projectTitle, createdAt);
                
                await sendMail(recipientEmail, subject, message);
            });

            // 4. Generate Quotation Content with AI
            // This interacts with your ai.service.js to get the structured JSON
            const aiGeneratedContent = await step.run("generate-quotation-ai", async () => {
                return await generateQuotationContent(inquiry);
            });

            // 5. Save Quotation to DB
            // We map the AI result to your Mongoose Schema specifically
            await step.run("save-quotation-db", async () => {
                const validUntilDate = new Date();
                validUntilDate.setDate(validUntilDate.getDate() + 14); // Valid for 14 days

                const newQuotation = new Quotation({
                    // Link to the Inquiry ID
                    inquiryId: inquiry._id,
                    
                    // Client Details (Ensure these match Schema requirements)
                    clientName: inquiry.name,
                    clientEmail: inquiry.email,
                    clientCompany: inquiry.company || aiGeneratedContent.clientCompany,
                    clientPhone: inquiry.phone || aiGeneratedContent.clientPhone,
                    
                    // AI Generated Content (Spread the JSON structure)
                    // This covers: subject, projectOverview, lineItems, subtotal, tax, totalAmount, etc.
                    ...aiGeneratedContent,

                    // Overwrite critical fields to ensure system integrity
                    status: 'pending', // MUST be 'pending' to show in Admin Dashboard
                    generatedByAi: true,
                    validUntil: validUntilDate
                });

                await newQuotation.save();
                return { quotationId: newQuotation._id };
            });

            return { success: true };

        } catch (error) {
            console.error("❌ Error processing inquiry submission: ", error);
            // We return false but don't re-throw, so Inngest stops retrying on fatal logic errors
            return { success: false, error: error.message };
        }
    }
);