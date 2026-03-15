const transporter = require("./mailTransport");

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      attachments: [
        {
          filename: "logo.png",
          path: "public/images/logo.png",
          cid: "logo",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
