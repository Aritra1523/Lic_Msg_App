import jsPDF from "jspdf";
import licLogo from '../../assets/licLogo.png';
export const generateReceiptPDF = async (data) => {
  const doc = new jsPDF();

  const receiptId = `LIC-${Date.now()}`;

  // Logo
  doc.addImage(licLogo, "PNG", 80, 10, 50, 30);

  // Title
  doc.setFontSize(18);
  doc.text("LIC PREMIUM RECEIPT", 60, 50);

  // Line
  doc.line(20, 55, 190, 55);

  doc.setFontSize(12);

  doc.text(`Receipt ID: ${receiptId}`, 20, 70);

  doc.text(`Customer Name: ${data.name}`, 20, 85);

  doc.text(
    `Policy Number: ${data.policyNumber}`,
    20,
    100
  );

  doc.text(
    `Premium Amount: ₹${data.amount}`,
    20,
    115
  );

  doc.text(
    `Paid Date: ${data.date}`,
    20,
    130
  );

  doc.text(
    `Generated On: ${new Date().toLocaleDateString()}`,
    20,
    145
  );

  doc.line(20, 160, 190, 160);

  doc.setFontSize(11);

  doc.text(
    "Received by LIC Agent",
    20,
    175
  );

  doc.text(
    "Thank you for your premium payment.",
    20,
    190
  );

  return doc;
};