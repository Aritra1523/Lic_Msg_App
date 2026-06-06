import jsPDF from "jspdf";
import licLogo from '../../assets/licLogo.png';

export const generateReceiptPDF = async (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const receiptId = `LIC-${Date.now()}`;
  const primaryColor = [31, 78, 121];    // Deep navy blue
  const accentColor = [0, 153, 76];      // LIC green
  const lightGray = [245, 245, 245];
  const darkGray = [80, 80, 80];
  const midGray = [150, 150, 150];

  // ── Header background band ──────────────────────────────────────────────
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, "F");

  // ── Logo (centered in header) ───────────────────────────────────────────
  doc.addImage(licLogo, "PNG", pageWidth / 2 - 15, 5, 30, 18);

  // ── Title ───────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("LIC PREMIUM RECEIPT", pageWidth / 2, 36, { align: "center" });

  // ── Receipt ID badge ────────────────────────────────────────────────────
  doc.setFillColor(...lightGray);
  doc.roundedRect(14, 52, pageWidth - 28, 12, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(...midGray);
  doc.setFont("helvetica", "normal");
  doc.text("RECEIPT ID", 20, 60);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text(receiptId, pageWidth - 20, 60, { align: "right" });

  // ── Section: Payment Details ────────────────────────────────────────────
  const sectionTop = 74;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text("PAYMENT DETAILS", 14, sectionTop);

  // Green underline
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(14, sectionTop + 2, 14 + 48, sectionTop + 2);

  // ── Info table rows ─────────────────────────────────────────────────────
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric"
    });

  const rows = [
    ["Customer Name", data.name],
    ["Policy Number", data.policyNumber],
    ["Paid Amount", `Rs ${Number(data.amount).toLocaleString("en-IN")}`],
    ["Paid Date", formatDate(data.date)],
    ["Generated On", formatDate(new Date().toISOString())],
  ];

  let rowY = sectionTop + 12;
  rows.forEach(([label, value], i) => {
    // Alternating row background
    if (i % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.rect(14, rowY - 5, pageWidth - 28, 12, "F");
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...darkGray);
    doc.text(label, 20, rowY + 2);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(String(value), pageWidth - 20, rowY + 2, { align: "right" });

    rowY += 14;
  });

  // ── Divider ─────────────────────────────────────────────────────────────
  const dividerY = rowY + 4;
  doc.setDrawColor(...midGray);
  doc.setLineWidth(0.3);
  doc.line(14, dividerY, pageWidth - 14, dividerY);

  // ── Status: plain text, no badge box ────────────────────────────────────
  const badgeY = dividerY + 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...accentColor);
  doc.text("✓  Payment Received", 14, badgeY);

  // ── Agent signature block ────────────────────────────────────────────────
  const agentBoxY = badgeY + 10;
  doc.setFillColor(248, 248, 255);
  doc.setDrawColor(200, 200, 220);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, agentBoxY, pageWidth - 28, 32, 3, 3, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...midGray);
  doc.text("Received & Verified by LIC Agent", 20, agentBoxY + 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text("Krishna Mohan Das", 20, agentBoxY + 21);

  // Signature underline
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.4);
  doc.line(20, agentBoxY + 24, 80, agentBoxY + 24);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...midGray);
  doc.text("Authorized LIC Agent", 20, agentBoxY + 30);

  // ── Footer ───────────────────────────────────────────────────────────────
  doc.setFillColor(...primaryColor);
  doc.rect(0, pageHeight - 20, pageWidth, 20, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 220, 255);
  doc.text(
    "Thank you for your premium payment. This is a computer-generated receipt.",
    pageWidth / 2, pageHeight - 12, { align: "center" }
  );
  doc.setTextColor(150, 180, 230);
  doc.text(
    "Life Insurance Corporation of India  |  www.licindia.in",
    pageWidth / 2, pageHeight - 5, { align: "center" }
  );

  return doc;
};