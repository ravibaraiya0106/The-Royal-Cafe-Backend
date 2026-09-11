const transporter = require("./mailTransport");

const sendEmail = async (to, subject, html, extraAttachments = []) => {
  try {
    const defaultAttachments = [
      {
        filename: "logo.png",
        path: "public/images/logo.png",
        cid: "logo",
      },
    ];

    const mailOptions = {
      from: `"The Royal Cafe" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: [...defaultAttachments, ...extraAttachments],
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
