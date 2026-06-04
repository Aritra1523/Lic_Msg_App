import { useEffect, useState } from "react";
import {
  databases,
  storage,
  DATABASE_ID,
  COLLECTION_ID,
  BUCKET_ID,
} from "../../appwrite/appwrite";
import Swal from "sweetalert2";
import "./Customer.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getCustomers = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
      );

      setCustomers(response.documents);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const viewPDF = (pdfId) => {
    const pdfUrl = storage.getFileView(BUCKET_ID, pdfId);

    window.open(pdfUrl, "_blank");
  };

  const downloadPDF = (pdfId) => {
    const pdfUrl = storage.getFileDownload(BUCKET_ID, pdfId);

    window.open(pdfUrl, "_blank");
  };

  const deleteCustomer = async (customer) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) return;

    try {
      if (customer.pdfId) {
        await storage.deleteFile(BUCKET_ID, customer.pdfId);
      }

      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, customer.$id);

      setCustomers(customers.filter((item) => item.$id !== customer.$id));

      Swal.fire({
        title: "Deleted!",
        text: "Customer deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search) ||
      customer.policyNumber?.includes(search),
  );

  return (
    <div className="customers-container">
      <h1>Customer Payment History</h1>

      <input
        type="text"
        placeholder="Search by Name, Phone or Policy Number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="no-data">No customer data found.</p>
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
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((item) => (
              <tr key={item.$id}>
                <td>{item.name}</td>

                <td>{item.phone}</td>

                <td>{item.policyNumber}</td>

                <td>₹{item.amount}</td>

                <td>{item.paidDate}</td>

                <td>{item.sendDate}</td>

                <td>
                  {item.pdfId ? (
                    <button onClick={() => viewPDF(item.pdfId)}>View</button>
                  ) : (
                    "No PDF"
                  )}
                </td>

                <td>
                  {item.pdfId ? (
                    <button onClick={() => downloadPDF(item.pdfId)}>
                      Download
                    </button>
                  ) : (
                    "No PDF"
                  )}
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteCustomer(item)}
                  >
                    Delete
                  </button>
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
