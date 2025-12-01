import { inngest} from "../index.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js"
import { getInquirySubmissionEmailTemplate } from "../../utils/mails/inquirySubmissionEmail.js";

export const onInquirySubmission = inngest.createFunction(
    { id: "on-inquiry-submission", retries: 2 },
    { event: "inquiry/submit" },
    async ({ event, step }) => {
        try {
            const { inquiry } = event.data;  // inquiry object
            const user = await step.run("fetch-user", async () => {
                const userObject = await User.findOne({ email: inquiry.email });
                if (!userObject) {
                    throw new NonRetriableError("User no longer exists in our database");
                }
                return userObject;
            });
            

            const createdAt = await step.run("change-time-to-ist", async () => {
                const createdAtFormatted = new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "full",
                    timeStyle: "long",
                    timeZone: "Asia/Kolkata",
                }).format(new Date(inquiry.createdAt));
                return createdAtFormatted;
            })

            await step.run("send-inquiry-submission-email", async () => {
                const subject = `Inquiry Submitted`;
                const message = getInquirySubmissionEmailTemplate(user.name, user.email, inquiry.projectTitle, createdAt);
                await sendMail(user.email, subject, message);
            });
            return { success: true };
        } catch (error) {
            console.error("❌ Error sending inquiry submission email: ", error);
            return { success: true };
            
        }
    }
)