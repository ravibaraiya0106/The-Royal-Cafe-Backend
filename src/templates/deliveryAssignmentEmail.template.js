const buildDeliveryAssignmentTemplate = ({
  deliveryPersonName,
  orderNumber,
  totalAmount,
  paymentMethod,
  address,
  phone,
  notes,
  portalUrl = "http://localhost:5173/delivery/dashboard",
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;background:#f4f4f4;font-family:Arial,sans-serif">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px">
    <tr>
      <td align="center">
        <table width="600" style="background:white;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

          <!-- HEADER -->
          <tr>
            <td style="padding:20px;text-align:center;border-bottom:5px solid #5b0f0f">
              <img src="cid:logo" alt="Royal Cafe" style="height:50px"/>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px">

              <h2 style="color:#333;margin-top:0">🛵 New Delivery Order Assigned!</h2>

              <p style="color:#333;font-size:15px;line-height:1.6">Hello <b>${deliveryPersonName}</b>,</p>

              <p style="color:#444;font-size:14px;line-height:1.6">
                You have been assigned a new delivery order. Please review the details below and proceed with pickup and delivery.
              </p>

              <!-- ORDER DETAILS BOX -->
              <div style="background:#fdf8f6;border:1px solid #e5e7eb;border-left:4px solid #5b0f0f;border-radius:6px;padding:20px;margin:25px 0">
                <h3 style="margin:0 0 12px 0;color:#5b0f0f;font-size:14px;text-transform:uppercase;letter-spacing:1px">Order Details</h3>
                
                <table width="100%" cellpadding="6" cellspacing="0" style="color:#333;font-size:14px">
                  <tr>
                    <td width="140" style="color:#666;font-weight:bold">Order Number:</td>
                    <td style="font-family:monospace;font-size:15px;color:#5b0f0f;font-weight:bold">#${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-weight:bold">Total Amount:</td>
                    <td style="font-weight:bold">₹${totalAmount} (${paymentMethod})</td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-weight:bold">Customer Phone:</td>
                    <td><a href="tel:${phone}" style="color:#5b0f0f;text-decoration:none;font-weight:bold">${phone}</a></td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-weight:bold">Delivery Address:</td>
                    <td style="color:#333">${address}</td>
                  </tr>
                  ${
                    notes
                      ? `
                  <tr>
                    <td style="color:#666;font-weight:bold">Notes:</td>
                    <td style="color:#d97706;font-style:italic">${notes}</td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <!-- BUTTON -->
              <div style="text-align:center;margin:30px 0">
                <a href="${portalUrl}" style="background:#5b0f0f;color:white;padding:12px 28px;border-radius:5px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
                  Open Delivery Dashboard &rarr;
                </a>
              </div>

              <p style="font-size:13px;color:#777;line-height:1.5">
                Drive safely and contact the customer if you have trouble navigating to the address.
              </p>

              <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

              <p style="font-size:12px;color:#777;margin:0">
                The Royal Cafe Team
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

module.exports = buildDeliveryAssignmentTemplate;
