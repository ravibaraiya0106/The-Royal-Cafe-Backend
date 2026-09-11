const buildOrderReceiptTemplate = ({
  customerName,
  orderNumber,
  orderDate,
  paymentMethod,
  paymentStatus,
  deliveryAddress,
  phone,
  orderItems = [],
  subtotal = 0,
  discountAmount = 0,
  finalAmount = 0,
  notes = "",
}) => {
  const formattedDate = new Date(orderDate || Date.now()).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toFixed(2)}`;
  };

  const itemRowsHtml = orderItems
    .map((item, index) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      const itemSubtotal = Number(item.subtotal || price * qty);
      const bg = index % 2 === 1 ? "background-color:#fdf8f6;" : "";
      return `
        <tr style="border-bottom: 1px solid #eee; ${bg}">
          <td style="padding: 10px; color: #333; font-weight: 500;">
            ${item.product_name || "Food Item"}
          </td>
          <td style="padding: 10px; color: #555; text-align: center;">
            ${qty}
          </td>
          <td style="padding: 10px; color: #555; text-align: right;">
            ${formatCurrency(price)}
          </td>
          <td style="padding: 10px; color: #333; font-weight: bold; text-align: right;">
            ${formatCurrency(itemSubtotal)}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Bill Receipt - The Royal Cafe</title>
  </head>
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

              <h2 style="color:#333;margin-top:0">Order Bill Receipt 🧾</h2>

              <p style="color:#333;font-size:15px;line-height:1.6">Hello <b>${customerName}</b>,</p>

              <p style="color:#444;font-size:14px;line-height:1.6">
                Your order has been successfully processed. Below are the complete billing and order details for your reference:
              </p>

              <!-- SUMMARY & HIGHLIGHT BOX -->
              <div style="background:#fdf8f6;border:1px solid #e5e7eb;border-left:4px solid #5b0f0f;border-radius:6px;padding:20px;margin:25px 0">
                <h3 style="margin:0 0 12px 0;color:#5b0f0f;font-size:14px;text-transform:uppercase;letter-spacing:1px">Order Summary</h3>
                
                <table width="100%" cellpadding="6" cellspacing="0" style="color:#333;font-size:14px">
                  <tr>
                    <td width="140" style="color:#666;font-weight:bold">Order Number:</td>
                    <td style="font-family:monospace;font-size:15px;color:#5b0f0f;font-weight:bold">#${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-weight:bold">Date & Time:</td>
                    <td style="color:#333;font-weight:bold">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-weight:bold">Payment Method:</td>
                    <td style="color:#333;font-weight:bold">${paymentMethod === "RAZORPAY" ? "Online Payment (Razorpay)" : "Cash on Delivery (COD)"}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-weight:bold">Payment Status:</td>
                    <td>
                      <span style="background-color:#dcfce7;color:#15803d;border:1px solid #bbf7d0;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:12px;text-transform:uppercase">
                        ${String(paymentStatus).toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-weight:bold">Phone Number:</td>
                    <td style="color:#333">${phone || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;font-weight:bold">Delivery Address:</td>
                    <td style="color:#333">${deliveryAddress || "N/A"}</td>
                  </tr>
                  ${notes ? `
                  <tr>
                    <td style="color:#666;font-weight:bold">Delivery Notes:</td>
                    <td style="color:#d97706;font-style:italic">${notes}</td>
                  </tr>
                  ` : ""}
                </table>
              </div>

              <!-- ORDER ITEMS TABLE -->
              <h3 style="color:#5b0f0f;font-size:15px;margin:25px 0 10px 0;text-transform:uppercase;letter-spacing:0.5px">Order Items</h3>

              <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:25px">
                <thead>
                  <tr style="background:#5b0f0f;color:white;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">
                    <th style="padding:10px;text-align:left">Item</th>
                    <th style="padding:10px;text-align:center">Qty</th>
                    <th style="padding:10px;text-align:right">Price</th>
                    <th style="padding:10px;text-align:right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRowsHtml}
                </tbody>
              </table>

              <!-- FINANCIAL BREAKDOWN -->
              <table width="100%" cellpadding="4" cellspacing="0" style="font-size:14px;margin-bottom:25px">
                <tr>
                  <td style="color:#666">Subtotal</td>
                  <td style="text-align:right;color:#333;font-weight:bold">${formatCurrency(subtotal)}</td>
                </tr>
                ${discountAmount > 0 ? `
                <tr>
                  <td style="color:#059669">Discount / Coupon</td>
                  <td style="text-align:right;color:#059669;font-weight:bold">-${formatCurrency(discountAmount)}</td>
                </tr>
                ` : ""}
                <tr style="border-top:2px dashed #eee">
                  <td style="padding-top:10px;color:#5b0f0f;font-weight:bold;font-size:16px">Total Amount Paid</td>
                  <td style="padding-top:10px;text-align:right;color:#5b0f0f;font-weight:bold;font-size:18px">${formatCurrency(finalAmount)}</td>
                </tr>
              </table>

              <p style="font-size:13px;color:#777;line-height:1.5">
                Thank you for choosing <b>The Royal Cafe</b>!
              </p>

              <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

              <p style="font-size:12px;color:#777;margin:0">
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

module.exports = buildOrderReceiptTemplate;
