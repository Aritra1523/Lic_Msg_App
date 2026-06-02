import { useEffect, useState } from "react";
import {
  databases,
  storage,
  DATABASE_ID,
  COLLECTION_ID,
  BUCKET_ID,
} from "../../appwrite/appwrite";

import "./Customer.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCustomers = async () => {
    try {
      const response =
        await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID
        );

      setCustomers(response.documents);
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const viewPDF = (pdfId) => {
    const pdfUrl = storage.getFileView(
      BUCKET_ID,
      pdfId
    );

    window.open(pdfUrl, "_blank");
  };

  const downloadPDF = (pdfId) => {
    const pdfUrl = storage.getFileDownload(
      BUCKET_ID,
      pdfId
    );

    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="customers-container">
      <h1>Customer Payment History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <p className="no-data">
          No customer data found.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Policy Number</th>
              <th>Amount</th>
              <th>Paid Date</th>
              <th>Send Date</th>
              <th>View PDF</th>
              <th>Download PDF</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((item) => (
              <tr key={item.$id}>
                <td>{item.name}</td>

                <td>{item.phone}</td>

                <td>{item.policyNumber}</td>

                <td>₹{item.amount}</td>

                <td>{item.paidDate}</td>

                <td>{item.sendDate}</td>

                <td>
                  {item.pdfId ? (
                    <button
                      onClick={() =>
                        viewPDF(item.pdfId)
                      }
                    >
                      View
                    </button>
                  ) : (
                    "No PDF"
                  )}
                </td>

                <td>
                  {item.pdfId ? (
                    <button
                      onClick={() =>
                        downloadPDF(item.pdfId)
                      }
                    >
                      Download
                    </button>
                  ) : (
                    "No PDF"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Customers;