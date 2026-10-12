import { inngest } from "../index.js";
import User from "../../models/user.model.js";
import Inquiry from "../../models/inquiry.model.js";
import Quotation from "../../models/quotation.model.js";
import { sendMail } from "../../utils/mailer.js";
import { getInquirySubmissionEmailTemplate } from "../../utils/mails/inquirySubmissionEmail.js";
import { generateQuotationContent } from "../../services/ai.service.js";

const parseBudgetAmount = (budgetStr) => {
    if (!budgetStr) return 0;
    const str = String(budgetStr).toLowerCase();
    const kMatch = str.match(/(\d+)\s*k/);
    if (kMatch) {
        return parseInt(kMatch[1], 10) * 1000;
    }
    const numMatch = str.replace(/[^0-9]/g, '');
    return numMatch ? parseInt(numMatch, 10) : 0;
};

export const onInquirySubmission = inngest.createFunction(
    { id: "on-inquiry-submission", retries: 2 },
    { event: "inquiry/submit" },
    async ({ event, step }) => {
        try {
            const rawInquiry = event.data.inquiry;
            const inquiryId = event.data.inquiryId || rawInquiry?._id;

            // 1. Fetch fresh Inquiry document from DB if available
            const inquiry = await step.run("fetch-inquiry", async () => {
                if (inquiryId) {
                    const inquiryDoc = await Inquiry.findById(inquiryId);
                    if (inquiryDoc) return inquiryDoc;
                }
                return rawInquiry;
            });

            if (!inquiry) {
                console.error("❌ Inquiry data is missing from event");
                return { success: false, error: "Inquiry data missing" };
            }

            // 2. Fetch User if available (do not fail if guest)
            const user = await step.run("fetch-user-optional", async () => {
                if (!inquiry.email) return null;
                return await User.findOne({ email: inquiry.email });
            });

            // 3. Format Date for Email
            const createdAt = await step.run("change-time-to-ist", async () => {
                const dateToFormat = inquiry.createdAt ? new Date(inquiry.createdAt) : new Date();
                return new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "full",
                    timeStyle: "long",
                    timeZone: "Asia/Kolkata",
                }).format(dateToFormat);
            });

            // 4. Send Confirmation Email to Client
            await step.run("send-inquiry-submission-email", async () => {
                try {
                    const recipientName = user?.name || inquiry.name || "Valued Client";
                    const recipientEmail = user?.email || inquiry.email;
                    if (!recipientEmail) return;

                    const subject = `Inquiry Submitted: ${inquiry.projectTitle || "Project Request"}`;
                    const message = getInquirySubmissionEmailTemplate(recipientName, recipientEmail, inquiry.projectTitle, createdAt);
                    await sendMail(recipientEmail, subject, message, {
                        idempotencyKey: `inquiry-${inquiry._id || inquiry.inquiryId || Date.now()}`
                    });
                } catch (mailError) {
                    console.error("⚠️ Failed to send inquiry confirmation email:", mailError?.message || mailError);
                }
            });

            // 5. Generate Quotation with AI (safely caught so AI failure never prevents quotation creation)
            const aiResult = await step.run("generate-quotation-ai", async () => {
                try {
                    const aiGeneratedContent = await generateQuotationContent(inquiry);
                    return { success: true, data: aiGeneratedContent };
                } catch (aiError) {
                    console.error("⚠️ AI quotation generation encountered an error:", aiError?.message || aiError);
                    return { 
                        success: false, 
                        error: aiError?.message || "Failed to generate quotation with AI" 
                    };
                }
            });

            // 6. Save Quotation to DB (Always executes - for both AI success and AI error fallback)
            const savedQuotation = await step.run("save-quotation-db", async () => {
                // Idempotency: avoid creating duplicate quotation if already created
                if (inquiry._id) {
                    const existing = await Quotation.findOne({ inquiryId: inquiry._id });
                    if (existing) {
                        return { quotationId: existing._id, quotationCode: existing.quotationId, isExisting: true };
                    }
                }

                const validUntilDate = new Date();
                validUntilDate.setDate(validUntilDate.getDate() + 14);
                const validUntilStr = validUntilDate.toISOString().split("T")[0];

                let quotationData;

                if (aiResult?.success && aiResult?.data) {
                    const aiData = aiResult.data;
                    const parsedBudget = parseBudgetAmount(inquiry.budget);
                    const total = Number(aiData.totalAmount) || parsedBudget || 0;
                    const subtotal = Number(aiData.subtotal) || total;

                    quotationData = {
                        inquiryId: inquiry._id,
                        clientName: inquiry.name,
                        clientEmail: inquiry.email,
                        clientCompany: inquiry.company || aiData.clientCompany || "",
                        clientPhone: inquiry.phone || aiData.clientPhone || "",
                        clientAddress: aiData.clientAddress || "",
                        subject: aiData.subject || (inquiry.projectTitle ? `Quotation for ${inquiry.projectTitle}` : "Project Quotation"),
                        projectName: inquiry.projectTitle || aiData.projectName || "Project Quotation",
                        projectOverview: aiData.projectOverview || inquiry.description || "",
                        lineItems: Array.isArray(aiData.lineItems) && aiData.lineItems.length > 0 ? aiData.lineItems : [
                            {
                                description: inquiry.service ? `Service: ${inquiry.service}` : (inquiry.projectTitle || "Custom Solution Development"),
                                quantity: 1,
                                unitPrice: total,
                                subtotal: total,
                            }
                        ],
                        subtotal: subtotal,
                        taxPercentage: Number(aiData.taxPercentage) || 0,
                        taxAmount: Number(aiData.taxAmount) || 0,
                        discount: Number(aiData.discount) || 0,
                        totalAmount: total,
                        paymentTerms: aiData.paymentTerms || "Milestone 1: 40%, Milestone 2: 30%, Milestone 3: 30%",
                        timeline: aiData.timeline || inquiry.timeline || "2-4 Weeks",
                        exclusions: aiData.exclusions || "Domain, hosting, and cloud servers are not included unless specified.",
                        termsAndConditions: aiData.termsAndConditions || "This quotation is valid until the validity date.",
                        validUntil: aiData.validUntil || validUntilStr,
                        status: "pending",
                        generatedByAi: true,
                        aiError: ""
                    };
                } else {
                    // Fallback for AI processing error: create quotation with inquiry baseline details so it appears for manual processing
                    const budgetAmount = parseBudgetAmount(inquiry.budget);
                    quotationData = {
                        inquiryId: inquiry._id,
                        clientName: inquiry.name,
                        clientEmail: inquiry.email,
                        clientCompany: inquiry.company || "",
                        clientPhone: inquiry.phone || "",
                        clientAddress: "",
                        subject: inquiry.projectTitle ? `Quotation for ${inquiry.projectTitle}` : "Project Quotation",
                        projectName: inquiry.projectTitle || "Project Quotation",
                        projectOverview: inquiry.description || "Project inquiry submitted by client. Requires manual quotation review and pricing.",
                        lineItems: [
                            {
                                description: inquiry.service ? `Service: ${inquiry.service}` : (inquiry.projectTitle || "Custom Project Scope"),
                                quantity: 1,
                                unitPrice: budgetAmount,
                                subtotal: budgetAmount
                            }
                        ],
                        subtotal: budgetAmount,
                        taxPercentage: 0,
                        taxAmount: 0,
                        discount: 0,
                        totalAmount: budgetAmount,
                        paymentTerms: "Milestone 1: 40%, Milestone 2: 30%, Milestone 3: 30%",
                        timeline: inquiry.timeline || "To be determined",
                        exclusions: "Domain, hosting, and cloud servers are not included unless specified. Third-party services billed separately.",
                        termsAndConditions: "This quotation is valid until the validity date. Source code and deliverables transferred after full payment.",
                        validUntil: validUntilStr,
                        status: "pending", // MUST be 'pending' to appear in Admin Dashboard
                        generatedByAi: false,
                        aiError: aiResult?.error || "AI generation failed or was bypassed"
                    };
                }

                const newQuotation = new Quotation(quotationData);
                await newQuotation.save();

                // Link Inquiry with newly created Quotation
                if (inquiry._id) {
                    await Inquiry.findByIdAndUpdate(inquiry._id, {
                        quotationId: newQuotation._id,
                        status: "under_review"
                    });
                }

                return { 
                    quotationId: newQuotation._id, 
                    quotationCode: newQuotation.quotationId,
                    generatedByAi: newQuotation.generatedByAi 
                };
            });

            return { 
                success: true, 
                quotationId: savedQuotation?.quotationId, 
                generatedByAi: savedQuotation?.generatedByAi 
            };
        } catch (error) {
            console.error("❌ Error processing inquiry submission: ", error);
            return { success: false, error: error.message };
        }
    }
);