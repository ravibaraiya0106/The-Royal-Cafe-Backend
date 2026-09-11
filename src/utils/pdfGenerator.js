const PDFDocument = require("pdfkit");

/**
 * Generates a PDF receipt buffer for an order, matching the exact styling and color theme of email templates.
 * @param {Object} orderData
 * @returns {Promise<Buffer>}
 */
const generateOrderReceiptPDF = (orderData) => {
  return new Promise((resolve, reject) => {
    try {
      // A4 page setup with standard margins
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      const {
        customerName = "Valued Customer",
        orderNumber = "",
        orderDate = new Date(),
        paymentMethod = "COD",
        paymentStatus = "paid",
        deliveryAddress = "N/A",
        phone = "N/A",
        orderItems = [],
        subtotal = 0,
        discountAmount = 0,
        finalAmount = 0,
        notes = "",
      } = orderData;

      const formattedDate = new Date(orderDate).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

      const primaryColor = "#5b0f0f";
      const lightBg = "#fdf8f6";
      const textColor = "#333333";
      const mutedText = "#666666";

      let y = 40;

      // 1. HEADER (White background with 5pt solid #5b0f0f bottom border matching email)
      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(22).text("THE ROYAL CAFE", 40, y, { align: "center" });
      doc.fillColor(mutedText).font("Helvetica").fontSize(9).text("Delivering happiness, one bite at a time.", 40, y + 26, { align: "center" });
      
      y += 45;
      // 5px solid #5b0f0f header bottom border line
      doc.rect(40, y, 515, 5).fill(primaryColor);
      y += 20;

      // 2. TITLE & GREETING
      doc.fillColor(textColor).font("Helvetica-Bold").fontSize(16).text("Order Bill Receipt", 40, y);
      y += 24;
      doc.fillColor(textColor).font("Helvetica").fontSize(10).text(`Hello `, 40, y, { continued: true });
      doc.font("Helvetica-Bold").text(`${customerName},`);
      y += 16;
      doc.font("Helvetica").fontSize(9.5).fillColor("#444444").text("Your order has been successfully processed. Below are the complete billing and order details:");
      y += 20;

      // 3. HIGHLIGHTED ORDER SUMMARY BOX (#fdf8f6 background, border-left 4pt solid #5b0f0f)
      const boxHeight = notes ? 120 : 105;
      doc.rect(40, y, 515, boxHeight).fill(lightBg);
      doc.rect(40, y, 4, boxHeight).fill(primaryColor); // 4pt left accent border
      doc.rect(44, y, 511, boxHeight).stroke("#e5e7eb");

      let boxY = y + 10;
      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(10).text("ORDER SUMMARY", 55, boxY);
      boxY += 18;

      doc.fontSize(9);
      // Left Column
      doc.fillColor(mutedText).font("Helvetica-Bold").text("Order Number:", 55, boxY);
      doc.fillColor(primaryColor).font("Helvetica-Bold").text(`#${orderNumber}`, 145, boxY);

      doc.fillColor(mutedText).font("Helvetica-Bold").text("Date & Time:", 55, boxY + 16);
      doc.fillColor(textColor).font("Helvetica").text(formattedDate, 145, boxY + 16);

      doc.fillColor(mutedText).font("Helvetica-Bold").text("Payment Method:", 55, boxY + 32);
      doc.fillColor(textColor).font("Helvetica").text(paymentMethod === "RAZORPAY" ? "Online Payment (Razorpay)" : "Cash on Delivery (COD)", 145, boxY + 32);

      doc.fillColor(mutedText).font("Helvetica-Bold").text("Payment Status:", 55, boxY + 48);
      doc.fillColor("#15803d").font("Helvetica-Bold").text(String(paymentStatus).toUpperCase(), 145, boxY + 48);

      // Right Column
      doc.fillColor(mutedText).font("Helvetica-Bold").text("Phone Number:", 320, boxY);
      doc.fillColor(textColor).font("Helvetica").text(phone || "N/A", 410, boxY);

      doc.fillColor(mutedText).font("Helvetica-Bold").text("Delivery Address:", 320, boxY + 16);
      doc.fillColor(textColor).font("Helvetica").text(deliveryAddress || "N/A", 410, boxY + 16, { width: 135 });

      if (notes) {
        doc.fillColor(mutedText).font("Helvetica-Bold").text("Delivery Notes:", 320, boxY + 48);
        doc.fillColor("#d97706").font("Helvetica-Oblique").text(notes, 410, boxY + 48, { width: 135 });
      }

      y += boxHeight + 25;

      // 4. ORDER ITEMS TABLE
      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(11).text("ORDER ITEMS", 40, y);
      y += 16;

      // Table Header (Solid #5b0f0f background with white uppercase text)
      doc.rect(40, y, 515, 20).fill(primaryColor);
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(8.5);
      doc.text("ITEM DESCRIPTION", 50, y + 5, { width: 220 });
      doc.text("QTY", 280, y + 5, { width: 40, align: "center" });
      doc.text("PRICE", 330, y + 5, { width: 100, align: "right" });
      doc.text("SUBTOTAL", 440, y + 5, { width: 100, align: "right" });

      y += 20;

      // Table Rows
      doc.font("Helvetica").fontSize(9);
      orderItems.forEach((item, index) => {
        const itemPrice = Number(item.price || 0);
        const itemQty = Number(item.quantity || 1);
        const itemSubtotal = Number(item.subtotal || itemPrice * itemQty);

        if (index % 2 === 1) {
          doc.rect(40, y, 515, 20).fill(lightBg);
        }

        doc.fillColor(textColor);
        doc.text(item.product_name || "Food Item", 50, y + 5, { width: 220 });
        doc.text(String(itemQty), 280, y + 5, { width: 40, align: "center" });
        doc.text(formatCurrency(itemPrice), 330, y + 5, { width: 100, align: "right" });
        doc.fillColor(textColor).font("Helvetica-Bold");
        doc.text(formatCurrency(itemSubtotal), 440, y + 5, { width: 100, align: "right" });
        doc.font("Helvetica");

        doc.strokeColor("#eeeeee").lineWidth(0.5).moveTo(40, y + 20).lineTo(555, y + 20).stroke();
        y += 20;
      });

      y += 15;

      // 5. FINANCIAL SUMMARY
      doc.font("Helvetica").fontSize(9.5);
      doc.fillColor(mutedText).text("Subtotal:", 330, y);
      doc.fillColor(textColor).font("Helvetica-Bold").text(formatCurrency(subtotal), 440, y, { width: 105, align: "right" });
      y += 16;

      if (discountAmount > 0) {
        doc.fillColor("#059669").font("Helvetica").text("Discount / Coupon:", 330, y);
        doc.text(`-${formatCurrency(discountAmount)}`, 440, y, { width: 105, align: "right" });
        y += 16;
      }

      doc.strokeColor("#eeeeee").lineWidth(1).dash(3, { space: 3 }).moveTo(330, y).lineTo(545, y).stroke().undash();
      y += 8;

      doc.fillColor(primaryColor).font("Helvetica-Bold").fontSize(12);
      doc.text("Total Amount Paid:", 300, y);
      doc.text(formatCurrency(finalAmount), 440, y, { width: 105, align: "right" });

      y += 35;

      // CLOSING NOTE
      doc.fillColor("#777777").font("Helvetica").fontSize(9).text("Thank you for choosing The Royal Cafe!", 40, y);
      y += 20;
      doc.fillColor("#777777").fontSize(8.5).text("Royal Cafe Team", 40, y);

      // 6. FOOTER (Solid #5b0f0f bar at bottom matching email template footer)
      const footerY = doc.page.height - 45;
      doc.rect(0, footerY, doc.page.width, 45).fill(primaryColor);
      doc.fillColor("#ffffff").font("Helvetica").fontSize(9).text(
        `© ${new Date().getFullYear()} The Royal Cafe`,
        0,
        footerY + 16,
        { align: "center", width: doc.page.width }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateOrderReceiptPDF;
