import { useState } from "react";
import jsPDF from "jspdf";
import { ID } from "appwrite";
import { generateReceiptPDF } from "../ReceiptPDF/generateReceiptPDF";
import {
  databases,
  storage,
  DATABASE_ID,
  COLLECTION_ID,
  BUCKET_ID,
} from "../../appwrite/appwrite";

import "./SendMessage.css";

function SendMessage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    policyNumber: "",
    amount: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const receiptId = `LIC-${Date.now()}`;

    doc.setFontSize(20);
    doc.text("LIC PREMIUM RECEIPT", 20, 20);

    doc.setFontSize(12);

    doc.text(`Receipt ID: ${receiptId}`, 20, 40);
    doc.text(`Customer Name: ${formData.name}`, 20, 55);
    doc.text(`Policy Number: ${formData.policyNumber}`, 20, 70);
doc.text(`Premium Amount: Rs. ${data.amount}`, 20, 115);    doc.text(`Paid Date: ${formData.date}`, 20, 100);
    doc.text("Received By: LIC Agent", 20, 120);
    doc.text("Thank You", 20, 140);

    return doc;
  };

  const sendWhatsApp = async () => {
    const { name, phone, policyNumber, amount, date } = formData;

    if (!name || !phone  || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Generate PDF
     const doc = await generateReceiptPDF(formData);

      // Download PDF locally
      // doc.save(`${name}_Receipt.pdf`);

      // Convert PDF to Blob
      const pdfBlob = doc.output("blob");

      // Create File
      const file = new File([pdfBlob], `${name}_Receipt.pdf`, {
        type: "application/pdf",
      });

      // Upload PDF to Appwrite Storage
      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file,
      );

      const pdfId = uploadedFile.$id;

      // Save Customer Data
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        name,
        phone,
        policyNumber,
        amount,
        paidDate: date,
        sendDate: new Date().toLocaleDateString(),
        pdfId,
      });

      // WhatsApp Message
      const message = `Dear ${name},

Received ₹${amount} for LIC premium.

Policy Number: ${policyNumber}
Date: ${date}

Thank you.`;

      const whatsappURL = `https://wa.me/91${phone}?text=${encodeURIComponent(
        message,
      )}`;

      window.open(whatsappURL, "_blank");

      alert("Receipt Sent Successfully");

      setFormData({
        name: "",
        phone: "",
        policyNumber: "",
        amount: "",
        date: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-container">
      <div className="send-card">
        <h1>Send LIC Receipt</h1>

        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="policyNumber"
          placeholder="Policy Number"
          value={formData.policyNumber}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Premium Amount"
          value={formData.amount}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <button onClick={sendWhatsApp} disabled={loading}>
          {loading ? "Sending..." : "Send Receipt"}
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
