const nodemailer = require('nodemailer');
const {internalServerError} = require("./errors-helper");

const credentials = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'joannie90@ethereal.email',
        pass: 'zHEQdDfzeS6vwQyeFJ'
    }
}

const sendEmailAlert = (recipient, subject, text) => {
    // The following credentials use Ethereal Email's fake SMTP service
    const transporter = nodemailer.createTransport(credentials);

    try {
        let message = {
            from: 'timegenie.service.account@timegenie.com',
            to: recipient,
            subject: subject,
            text: text,
            html: `<p>${text}</p>`
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return;
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    } catch (error) {
        internalServerError(error);
    }

}

const sendEmailAlertWithHTML = (recipient, subject, text, html) => {
    // The following credentials use Ethereal Email's fake SMTP service
    const transporter = nodemailer.createTransport(credentials);

    try {
        let message = {
            from: 'timegenie.service.account@timegenie.com',
            to: recipient,
            subject: subject,
            text: text,
            html: html
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return;
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    } catch (error) {
        internalServerError(error);
    }
}

module.exports = {
    sendEmailAlert,
    sendEmailAlertWithHTML
}
