const buildResetPasswordTemplate = (resetLink, username) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Password</title>
  </head>

  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0">

      <tr>
        <td align="center">

          <table width="600" style="background:white;border-radius:6px;overflow:hidden">

            <!-- HEADER -->
            <tr>
              <td style="background:white;padding:20px;text-align:center; border-bottom:5px solid #5b0f0f">
                <img src="cid:logo" alt="Royal Cafe" style="height:50px"/>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:40px">

                <h2 style="color:#333;margin-top:0">
                  Reset Your Password
                </h2>

                <p>Hello <b>${username}</b>,</p>

                <p>
                  We received a request to reset your password for
                  <b>The Royal Cafe</b>.
                </p>

                <p>
                  Click the button below to reset your password:
                </p>

                <p style="text-align:center;margin:30px 0">
                  <a href="${resetLink}"
                    style="
                      background:#5b0f0f;
                      color:white;
                      padding:12px 25px;
                      text-decoration:none;
                      border-radius:4px;
                      font-size:16px;
                      display:inline-block;
                    ">
                    Reset Password
                  </a>
                </p>

                <p>
                  This link will expire in <b>15 minutes</b>.
                </p>

                <p>
                  If you did not request this, please ignore this email.
                </p>

                <hr style="margin:30px 0"/>

                <p style="font-size:12px;color:#777">
                  Royal Cafe Security Team
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#5b0f0f;color:white;text-align:center;padding:15px;font-size:12px">
                © ${new Date().getFullYear()} The Royal Cafe
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

module.exports = buildResetPasswordTemplate;
