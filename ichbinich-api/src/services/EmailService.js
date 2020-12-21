const nodemailer = require('nodemailer');
const ErrorService = require('./ErrorService');

module.exports.initEmail = function() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};
module.exports.createEmailOptions = function(to, subject, text, html, attachments) {
    return {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments
    }
};
module.exports.sendEmail = function(mailOptions) {
    return new Promise((resolve, reject) => {
        const transport = this.initEmail();
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(new ErrorService.Error('Sending email failed.', err));
            }
            resolve();
        });
    });
};
