import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FormToPDF = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    const input = document.getElementById("pdf-content");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
      pdf.save("form-data.pdf");
    });
  };

  return (
    <div>
      <div id="pdf-content" style={{ padding: 20, background: "#fff" }}>
        <h2>Form Data</h2>
        <p><b>Name:</b> {formData.name}</p>
        <p><b>Email:</b> {formData.email}</p>
        <p><b>Phone:</b> {formData.phone}</p>
      </div>

      <form>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Enter Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <button type="button" onClick={generatePDF}>
          Download PDF
        </button>
      </form>
    </div>
  );
};

export default FormToPDF;
