import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env.js";

// Initialize Gemini
// Note: Ensure GEMINI_API_KEY is added to .env and config
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateQuotationContent = async (inquiryDetails) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert IT Sales Engineer. Your goal is to generate a structured quotation based on client requirements. 
    You must analyze the user's request and populate the following sections based on standard industry practices:
    
    Inquiry Details:
    ${JSON.stringify(inquiryDetails, null, 2)}
    
    Please generate a quotation in JSON format that strictly matches the following structure. Do not include any markdown formatting (like \`\`\`json), just return the raw JSON.
    
    Structure:
    {
        "clientName": "Client Name",
        "clientEmail": "Client Email",
        "clientCompany": "Company Name (if available)",
        "clientPhone": "Phone (if available)",
        "clientAddress": "Address (if available)",
        "subject": "Quotation for [Web Development / App Development / AI Automation / IT Services]",
        "projectOverview": "Brief summary of the requirement (2-4 lines). E.g., Development of a responsive web application with user login, admin dashboard...",
        "lineItems": [
            {
                "description": "Service/Module Name | Detailed description of features included",
                "quantity": 1,
                "unitPrice": 1000,
                "subtotal": 1000
            }
        ],
        "subtotal": 1000,
        "taxPercentage": 0,
        "taxAmount": 0,
        "discount": 0,
        "totalAmount": 1000,
        "paymentTerms": "Milestone 1 (Project Initiation): 40%, Milestone 2 (Prototype): 30%, Milestone 3 (Delivery): 30%",
        "timeline": "Expected Project Duration: [X Weeks]. Development begins within [X Days] after receipt of advance.",
        "exclusions": "Domain, hosting, and cloud servers are not included unless specified. Third-party services billed separately.",
        "termsAndConditions": "This quotation is valid until the validity date. Source code ownership transferred after full payment.",
        "validUntil": "YYYY-MM-DD"
    }
    
    Ensure the pricing is realistic for IT services (Web Dev, App Dev, AI) in USD or the currency implied by the inquiry.
    The "validUntil" date should be 14 days from today (${new Date().toISOString().split('T')[0]}).
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean up markdown if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        return JSON.parse(text);
    } catch (error) {
        console.error("Error generating quotation with AI:", error);
        throw new Error("Failed to generate quotation content");
    }
};
