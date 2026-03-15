const buildWelcomeTemplate = (username) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;background:#f4f4f4;font-family:Arial">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px">

    <tr>
      <td align="center">

        <table width="600" style="background:white;border-radius:6px">

          <!-- HEADER -->
          <tr>
            <td style="padding:20px;text-align:center;border-bottom:5px solid #5b0f0f">
              <img src="cid:logo" alt="Royal Cafe" style="height:50px"/>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px">

              <h2 style="color:#333">Welcome to The Royal Cafe ☕</h2>

              <p>Hello <b>${username}</b>,</p>

              <p>
                Your account has been successfully created.
              </p>

              <p>
                You can now explore our delicious menu and place orders anytime.
              </p>

              <p>
                Thank you for joining <b>The Royal Cafe</b>.
              </p>

              <hr style="margin:30px 0"/>

              <p style="font-size:12px;color:#777">
                Royal Cafe Team
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

module.exports = buildWelcomeTemplate;
