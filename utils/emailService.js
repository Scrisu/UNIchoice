require('dotenv').config();
const mailjet = require('node-mailjet').apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_API_SECRET
);

// Generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send verification email
const sendVerificationEmail = async (recipientEmail, verificationCode) => {
    try {
        console.log(`Sending email to ${recipientEmail} with code ${verificationCode}`);
        const request = await mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "validation@choose-uni.com",
                            Name: "UniChoice",
                        },
                        To: [
                            {
                                Email: recipientEmail,
                                Name: "User",
                            },
                        ],
                        Subject: "Your Verification Code",
                        TextPart: `Your verification code is: ${verificationCode}`,
                        HTMLPart: `<h3>Your verification code is: <strong>${verificationCode}</strong></h3>`,
                    },
                ],
            });
        console.log(`Email sent successfully to ${recipientEmail}. Status: ${request.body.Messages[0].Status}`);
        console.log(`MessageID: ${request.body.Messages[0].To[0].MessageID}`);
    } catch (error) {
        console.error(`Error sending email to ${recipientEmail}: ${error.message}`);
    }
};

module.exports = { generateVerificationCode, sendVerificationEmail };


