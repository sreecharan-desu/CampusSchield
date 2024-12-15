import nodemailer from "nodemailer";

export const sendMailToUserOnCreatingReport = (user, report) => {
    console.log(user);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sreecharan309@gmail.com',  // Your email
            pass: 'bwkr cccx ltfc lydw'  // Your email password (Note: Use environment variables in production)
        }
    });

    var mailOptions = {
        from: 'sreecharan309@gmail.com',  // Sender's email
        to: user.email,  // Recipient's email
        subject: 'Acknowledgement of Your Report & Ongoing Support',
        html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    p {
                        margin-bottom: 10px;
                    }
                    .status-update {
                        background-color: #f9f9f9;
                        padding: 10px;
                        border-radius: 5px;
                    }
                    .status-update ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    .status-update li {
                        margin-bottom: 8px;
                    }
                    .bold {
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <h1>Acknowledgement of Your Report & Ongoing Support</h1>
                
                <p>Dear ${user.name},</p>

                <p>We hope this message finds you well. We would like to begin by thanking you for submitting the detailed report regarding the harassment incident. Your courage in sharing such important information is truly appreciated, and we want you to know that we are fully committed to addressing this matter with the utmost care and urgency.</p>

                <div class="status-update">
                    <h2>Status Update:</h2>
                    <p>We want to keep you informed at every step of the process. Below is the current status of your report:</p>
                    <ul>
                        <li><span class="bold">Date of Report Received:</span> ${report.createdAt}</li>
                        <li><span class="bold">Harassment Type:</span> [Detail the nature of the harassment, if appropriate]</li>
                        <li><span class="bold">Investigation Progress:</span> Ongoing (we are reviewing the details and gathering all relevant data)</li>
                    </ul>

                    <h3>Current Actions:</h3>
                    <ul>
                        <li><span class="bold">Initial Review Completed:</span> ✔</li>
                        <li><span class="bold">Witness Statements Collected:</span> ✔</li>
                        <li><span class="bold">Investigator Assigned:</span> ✔</li>
                        <li><span class="bold">Next Steps:</span> We will update you each step we take on this to you./li>
                    </ul>
                </div>

                <p>We understand that this situation may be difficult, but we want to assure you that our team is working diligently to ensure a fair and thorough process. We are committed to bringing about the necessary actions and maintaining a safe space for all involved.</p>

                <h3>Your Support Matters:</h3>
                <p>As we move forward with the investigation, we encourage you to continue sharing any additional information or thoughts you might have. Your voice is crucial in helping us address these issues effectively and supportively.</p>

                <h3>What to Expect Next:</h3>
                <p>We will continue to update you regularly on the progress. You can expect another update on [insert expected date/time]. We understand how important it is to you that this matter is handled swiftly, and we are here to support you through every step.</p>

                <p><span class="bold">Remember, you are not alone in this.</span> We are here to make sure you feel heard, respected, and supported. Your bravery in coming forward already makes a significant impact, and we are hopeful that together, we can ensure that such behavior is addressed and prevented moving forward.</p>

                <p>If you have any concerns or need further assistance, please do not hesitate to reach out to us. You can contact us at [Contact Information]. We are here for you.</p>

                <p>With Warm Regards,<br/>
                WE PROTECT YOU<br/>
                CampusShield<br/>
                <a href="https://campus-schield.vercel.app/" target="_blank">Visit Our Website</a></p>
            </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
