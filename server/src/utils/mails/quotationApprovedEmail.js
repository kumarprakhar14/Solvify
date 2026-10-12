export const getQuotationApprovedEmailTemplate = (quotationData) => {
    const clientName = quotationData.clientName || "Valued Client";
    const clientEmail = quotationData.clientEmail || "";
    const projectTitle = quotationData.projectName || quotationData.projectTitle || quotationData.subject || "Your Project";
    const quotationId = quotationData.quotationId || (quotationData._id ? `#${quotationData._id}` : "N/A");
    const totalAmount = quotationData.totalAmount !== undefined ? quotationData.totalAmount : "N/A";
    const timeline = quotationData.timeline || "To be discussed";
    const validUntil = quotationData.validUntil
        ? new Date(quotationData.validUntil).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
          })
        : null;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 20px 10px; text-align: center; background: #030816;">
                            <img src="https://res.cloudinary.com/dkjxsipsx/image/upload/v1764654587/svgviewer-png-output_2_ouinht_larx8k.png" alt="Solvify Logo" style="width: 260px; height: auto; display: block; margin: 0 auto;">
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="display: inline-block; padding: 6px 14px; background-color: #dcfce7; color: #15803d; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 16px;">
                                ✓ Approved
                            </div>

                            <h1 style="color: #111827; font-size: 26px; margin: 0 0 16px 0; font-weight: 700;">
                                Quotation Approved! 🎉
                            </h1>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                                Dear <strong style="color: #111827;">${clientName}</strong>,
                            </p>
                            
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                We are pleased to inform you that your quotation for <strong style="color: #111827;">${projectTitle}</strong> has been officially approved!
                            </p>
                            
                            <!-- Quotation Summary Card -->
                            <div style="margin: 24px 0; padding: 20px 24px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; border-left: 4px solid #22c55e;">
                                <h2 style="color: #111827; font-size: 17px; margin: 0 0 14px 0; font-weight: 600;">
                                    💼 Quotation Summary
                                </h2>
                                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 6px 0; color: #6b7280; font-size: 14px; width: 40%;">Quotation ID:</td>
                                        <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${quotationId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Project:</td>
                                        <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${projectTitle}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Total Amount:</td>
                                        <td style="padding: 6px 0; color: #15803d; font-size: 16px; font-weight: 700;">$${totalAmount}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Timeline:</td>
                                        <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${timeline}</td>
                                    </tr>
                                    ${validUntil ? `
                                    <tr>
                                        <td style="padding: 6px 0; color: #6b7280; font-size: 14px;">Valid Until:</td>
                                        <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${validUntil}</td>
                                    </tr>
                                    ` : ""}
                                </table>
                            </div>
                            
                            <!-- Next Steps -->
                            <div style="margin: 28px 0; padding: 18px 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                <h3 style="color: #1e40af; font-size: 15px; margin: 0 0 8px 0; font-weight: 600;">
                                    What happens next?
                                </h3>
                                <p style="color: #1e3a8a; font-size: 14px; line-height: 1.6; margin: 0;">
                                    Our project team will be in touch shortly to finalize documentation, discuss kickoff timelines, and set up your project workspace.
                                </p>
                            </div>

                            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 24px 0 0 0;">
                                If you have any immediate questions or need to make adjustments, please reply directly to this email.
                            </p>

                            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 24px 0 0 0;">
                                Best regards,<br>
                                <strong style="color: #111827;">The Solvify Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 13px; margin: 0 0 8px 0;">
                                © ${new Date().getFullYear()} Solvify. All rights reserved.
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                You are receiving this transactional update because you have an active quotation with Solvify.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};
