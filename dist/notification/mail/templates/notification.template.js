"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationInfoTemplate = exports.notificationSuccessTemplate = exports.notificationErrorTemplate = exports.notificationWarningTemplate = exports.notificationExitingTemplate = void 0;
function notificationExitingTemplate(message) {
    const template = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Aladdin Notification</title>
            <style type="text/css">
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                }
                .footer {
                    background-color: #333;
                    color: white;
                    text-align: center;
                    padding: 10px 20px;
                    font-size: 0.8em;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Aladdin Notification</h1>
                </div>
                <div class="content">
                    <p>${message}</p>
                </div>
                <div class="footer">
                    <p>This is an automated notification. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return template;
}
exports.notificationExitingTemplate = notificationExitingTemplate;
function notificationWarningTemplate(message) {
    const template = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Warning Notification From Aladdin</title>
            <style type="text/css">
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #d9534f; /* Red for warning */
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .footer {
                    background-color: #555;
                    color: white;
                    text-align: center;
                    padding: 10px 20px;
                    font-size: 0.8em;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Urgent Warning</h1>
                </div>
                <div class="content">
                    <p>${message}</p>
                </div>
                <div class="footer">
                    <p>Please address this issue promptly.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return template;
}
exports.notificationWarningTemplate = notificationWarningTemplate;
function notificationErrorTemplate(message) {
    const template = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error Notification of Aladdin</title>
            <style type="text/css">
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #d9534f; /* Dark red for error */
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .footer {
                    background-color: #282828; /* Dark footer for emphasis */
                    color: white;
                    text-align: center;
                    padding: 10px 20px;
                    font-size: 0.8em;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Critical Error Alert</h1>
                </div>
                <div class="content">
                    <p>${message}</p>
                </div>
                <div class="footer">
                    <p>Immediate attention required.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return template;
}
exports.notificationErrorTemplate = notificationErrorTemplate;
function notificationSuccessTemplate(message) {
    const template = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Success Notification of Aladdin</title>
            <style type="text/css">
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #5cb85c; /* Bright green for success */
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .footer {
                    background-color: #f8f8f8; /* Light footer for a positive vibe */
                    color: #333;
                    text-align: center;
                    padding: 10px 20px;
                    font-size: 0.8em;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Congratulations!</h1>
                </div>
                <div class="content">
                    <p>${message}</p>
                </div>
                <div class="footer">
                    <p>Thank you for being with us.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return template;
}
exports.notificationSuccessTemplate = notificationSuccessTemplate;
function notificationInfoTemplate(message) {
    const template = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Information Notification</title>
            <style type="text/css">
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #337ab7; /* Medium blue for information */
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                    color: #333;
                }
                .footer {
                    background-color: #f8f8f8; /* Light footer */
                    color: #333;
                    text-align: center;
                    padding: 10px 20px;
                    font-size: 0.8em;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Important Information</h1>
                </div>
                <div class="content">
                    <p>${message}</p>
                </div>
                <div class="footer">
                    <p>Stay updated with the latest information.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return template;
}
exports.notificationInfoTemplate = notificationInfoTemplate;
//# sourceMappingURL=notification.template.js.map