// import React, { forwardRef, useImperativeHandle, useState } from "react";
// import html2pdf from "html2pdf.js";
// import logo from "../components/logo.png";

// const PdfLayout = forwardRef(({ formData }, ref) => {
//     // Generate dynamic invoice number with sequential format
//     const [invoiceCounter, setInvoiceCounter] = useState(1);
//     const currentYear = new Date().getFullYear();
//     const nextYear = currentYear + 1;
//     const financialYear = `${currentYear}-${nextYear.toString().slice(2)}`;
//     const invoiceNumber = `WBPL/${financialYear}/${invoiceCounter.toString().padStart(3, '0')}`;

//     // Calculate item totals
//     const calculateItemTotals = (item) => {
//         const amount = parseFloat(item.amount) || 0;
//         const gstRate = parseFloat(item.gstRate) || 0;
//         const gstAmount = amount * (gstRate / 100);
//         const total = amount + gstAmount;

//         return {
//             amount,
//             gstAmount,
//             total
//         };
//     };

//     // Calculate grand totals
//     const grandTotals = formData.items.reduce((acc, item) => {
//         const itemTotals = calculateItemTotals(item);
//         return {
//             amount: acc.amount + itemTotals.amount,
//             gstAmount: acc.gstAmount + itemTotals.gstAmount,
//             total: acc.total + itemTotals.total
//         };
//     }, { amount: 0, gstAmount: 0, total: 0 });

//     const generatePDF = () => {
//         try {
//             const element = document.getElementById("pdf-content");
//             if (!element) {
//                 throw new Error("PDF content element not found");
//             }

//             const options = {
//                 margin: 10,
//                 filename: `Invoice_${invoiceNumber}.pdf`,
//                 image: { type: "jpeg", quality: 0.98 },
//                 html2canvas: {
//                     scale: 2,
//                     logging: true,
//                     useCORS: true,
//                     backgroundColor: "#FFFFFF"
//                 },
//                 jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//             };

//             html2pdf().set(options).from(element).save();
//             // Increment invoice counter after successful download
//             setInvoiceCounter(prev => prev + 1);
//         } catch (error) {
//             console.error("Error generating PDF:", error);
//         }
//     };

//     useImperativeHandle(ref, () => ({
//         generatePDF
//     }));

//     // Helper to format empty fields
//     const formatField = (value) => value || '-';

//     return (
//         <div style={{ display: "none" }}>
//             <div id="pdf-content" style={pdfStyles.content}>
//                 {/* Header with Logo */}
//                 <div style={pdfStyles.header}>
//                     <img src={logo} alt="Company Logo" style={pdfStyles.logo} />
//                     <h2 style={pdfStyles.title}>TAX INVOICE</h2>
//                 </div>

//                 {/* Invoice Details */}
//                 <div style={pdfStyles.detailsRow}>
//                     <div style={pdfStyles.invoiceColumn}>
//                         <p style={pdfStyles.detailItem}><strong>Invoice No:</strong> {invoiceNumber}</p>
//                         <p style={pdfStyles.detailItem}><strong>Invoice Date:</strong> {formatField(formData.date)}</p>
//                         <p style={pdfStyles.detailItem}><strong>Due Date:</strong> {formatField(formData.adate)}</p>
//                     </div>

//                     <div style={pdfStyles.billedByColumn}>
//                         <h3 style={pdfStyles.sectionTitle}>Billed By:</h3>
//                         <p style={pdfStyles.detailItem}>WebWave Business Pvt. Ltd.</p>
//                         <p style={pdfStyles.detailItem}>S-21 1st Floor Ajay Enclave</p>
//                         <p style={pdfStyles.detailItem}>Subhash Nagar, New Delhi 110027</p>
//                         <p style={pdfStyles.detailItem}><strong>GSTIN:</strong> 07AADCW8027D1ZE</p>
//                         <p style={pdfStyles.detailItem}><strong>PAN:</strong> AADCW8027D</p>
//                     </div>

//                     <div style={pdfStyles.billedToColumn}>
//                         <h3 style={pdfStyles.sectionTitle}>Billed To:</h3>
//                         <p style={pdfStyles.detailItem}>{formatField(formData.name)}</p>
//                         <p style={pdfStyles.detailItem}>{formatField(formData.company)}</p>
//                         <p style={pdfStyles.detailItem}>{formatField(formData.address)}</p>
//                         {formData.gst && <p style={pdfStyles.detailItem}><strong>GSTIN:</strong> {formData.gst}</p>}
//                         {formData.pan && <p style={pdfStyles.detailItem}><strong>PAN:</strong> {formData.pan}</p>}
//                     </div>
//                 </div>

//                 {/* Items Table */}
//                 <table style={pdfStyles.itemsTable}>
//                     <thead>
//                         <tr>
//                             <th style={pdfStyles.tableHeader}>#</th>
//                             <th style={{ ...pdfStyles.tableHeader, width: '30%' }}>Description</th>
//                             <th style={pdfStyles.tableHeader}>HSN/SAC</th>
//                             <th style={pdfStyles.tableHeader}>Qty</th>
//                             <th style={pdfStyles.tableHeader}>Amount (₹)</th>
//                             <th style={pdfStyles.tableHeader}>GST ({formData.items[0]?.gstRate || '0'}%)</th>
//                             <th style={pdfStyles.tableHeader}>Total (₹)</th>
//                             <th style={pdfStyles.tableHeader}>Tenure</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {formData.items.map((item, index) => {
//                             const { amount, gstAmount, total } = calculateItemTotals(item);
//                             return (
//                                 <tr key={index}>
//                                     <td style={pdfStyles.tableCell}>{index + 1}</td>
//                                     <td style={{ ...pdfStyles.tableCell, width: '30%' }}>{formatField(item.description)}</td>
//                                     <td style={pdfStyles.tableCell}>{formatField(item.hsn)}</td>
//                                     <td style={pdfStyles.tableCell}>{item.quantity}</td>
//                                     <td style={pdfStyles.tableCell}>{amount.toFixed(2)}</td>
//                                     <td style={pdfStyles.tableCell}>{gstAmount.toFixed(2)}</td>
//                                     <td style={pdfStyles.tableCell}>{total.toFixed(2)}</td>
//                                     <td style={pdfStyles.tableCell}>{item.tenure ? `${item.tenure} month(s)` : '-'}</td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>

//                 {/* Total Rows */}
//                 <div style={pdfStyles.totalContainer}>
//                     <div style={pdfStyles.totalRow}>
//                         <div style={pdfStyles.totalLabel}>Sub Total:</div>
//                         <div style={pdfStyles.totalValue}>₹ {grandTotals.amount.toFixed(2)}</div>
//                     </div>
//                     <div style={pdfStyles.totalRow}>
//                         <div style={pdfStyles.totalLabel}>Total GST:</div>
//                         <div style={pdfStyles.totalValue}>₹ {grandTotals.gstAmount.toFixed(2)}</div>
//                     </div>
//                     <div style={{ ...pdfStyles.totalRow, ...pdfStyles.grandTotal }}>
//                         <div style={pdfStyles.totalLabel}>Grand Total:</div>
//                         <div style={pdfStyles.totalValue}>₹ {grandTotals.total.toFixed(2)}</div>
//                     </div>
//                 </div>

//                 {/* Footer Note */}
//                 <div style={pdfStyles.footerNote}>
//                     <p style={pdfStyles.noteText}>
//                         Our company endeavors to provide our best services to our valuable clients.
//                         However, if any of our valuable clients feel deprived due to any wrong or
//                         misleading information, service, package, deficiency in providing any or all of
//                         our services or packages, or misbehavior or misrepresentation by any of our
//                         employees, then such person, client, company, or any other entity may report
//                         this matter to our official email (feedback@globalb2bmart.com) within 15
//                         days since it comes to their knowledge. *Verified & Contactable Buyers as
//                         per the chosen package(based on current availability on globalb2bmart.com)
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// });

// // PDF styling (unchanged from your original)
// const pdfStyles = {
//     content: {
//         backgroundColor: "#FFFFFF",
//         color: "#000000",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//         maxWidth: "800px",
//         margin: "0 auto",
//     },
//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "20px",
//         paddingBottom: "20px",
//         borderBottom: "1px solid #000",
//     },
//     logo: {
//         height: "60px"
//     },
//     title: {
//         color: "#333",
//         margin: 0,
//         fontSize: "20px",
//         fontWeight: "bold"
//     },
//     detailsRow: {
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: "20px",
//         paddingBottom: "15px",
//     },
//     invoiceColumn: {
//         flex: 1,
//         padding: "0 10px",
//     },
//     billedByColumn: {
//         flex: 1,
//         padding: "0 10px",
//     },
//     billedToColumn: {
//         flex: 1,
//         padding: "0 10px",
//     },
//     sectionTitle: {
//         fontSize: "14px",
//         fontWeight: "bold",
//         marginBottom: "8px",
//         color: "#333",
//     },
//     detailItem: {
//         margin: "5px 0",
//         fontSize: "12px",
//     },
//     itemsTable: {
//         width: "100%",
//         borderCollapse: "collapse",
//         margin: "20px 0",
//         border: "1px solid #000",
//     },
//     tableHeader: {
//         backgroundColor: "#f0f0f0",
//         padding: "8px",
//         textAlign: "center",
//         border: "1px solid #000",
//         fontSize: "12px",
//         fontWeight: "bold",
//     },
//     tableCell: {
//         padding: "8px",
//         textAlign: "center",
//         border: "1px solid #000",
//         fontSize: "12px",
//     },
//     totalContainer: {
//         marginTop: "20px",
//         marginLeft: "auto",
//         width: "300px",
//     },
//     totalRow: {
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: "5px",
//         padding: "8px 10px",
//     },
//     grandTotal: {
//         backgroundColor: "#f0f0f0",
//         fontWeight: "bold",
//         borderTop: "1px solid #000",
//         borderBottom: "1px solid #000",
//     },
//     totalLabel: {
//         fontSize: "14px",
//     },
//     totalValue: {
//         fontSize: "14px",
//         minWidth: "100px",
//         textAlign: "right",
//     },
//     footerNote: {
//         marginTop: "30px",
//         padding: "15px",
//         borderTop: "1px solid #000",
//         fontSize: "11px",
//         lineHeight: "1.4",
//     },
//     noteText: {
//         margin: 0,
//     }
// };

// export default PdfLayout;

import React, { forwardRef, useImperativeHandle, useState } from "react";
import html2pdf from "html2pdf.js";
import logo from "../components/logo.png";

const PdfLayout = forwardRef(({ formData }, ref) => {
    // Generate dynamic invoice number with sequential format (starting from 249)
    const [invoiceCounter, setInvoiceCounter] = useState(249);
    const currentYear = 2025;
    const nextYear = 2026;
    const financialYear = `${currentYear}-${nextYear.toString().slice(2)}`;
    const invoiceNumber = `WBPL/${financialYear}/${invoiceCounter.toString().padStart(3, '0')}`;

    // Calculate item totals
    // const calculateItemTotals = (item) => {
    //     const amount = parseFloat(item.amount) || 0;
    //     const igstRate = 18; // Fixed IGST 18%
    //     const cgstRate = 0;
    //     const sgstRate = 0;

    //     const igstAmount = amount * (igstRate / 100);
    //     const total = amount + igstAmount;

    //     return {
    //         amount,
    //         igstAmount,
    //         cgstAmount: amount * (cgstRate / 100),
    //         sgstAmount: amount * (sgstRate / 100),
    //         total
    //     };
    // };

    // Calculate item totals
// const calculateItemTotals = (item) => {
//     const amount = parseFloat(item.amount) || 0;
//     const igstRate = 0;  // IGST 0%
//     const cgstRate = 9;  // CGST 9%
//     const sgstRate = 9;  // SGST 9%

//     const igstAmount = amount * (igstRate / 100);
//     const cgstAmount = amount * (cgstRate / 100);
//     const sgstAmount = amount * (sgstRate / 100);
//     const total = amount + igstAmount + cgstAmount + sgstAmount;

//     return {
//         amount,
//         igstAmount,
//         cgstAmount,
//         sgstAmount,
//         total
//     };
// };

const calculateItemTotals = (item) => {
    const amount = parseFloat(item.amount) || 0;
    // Use rates from form (item.igst, item.cgst, item.sgst); fallback to 0
    const igstRate = parseFloat(String(item.igst || '').replace('%', '')) || 0;
    const cgstRate = parseFloat(String(item.cgst || '').replace('%', '')) || 0;
    const sgstRate = parseFloat(String(item.sgst || '').replace('%', '')) || 0;

    const igstAmount = amount * (igstRate / 100);
    const cgstAmount = amount * (cgstRate / 100);
    const sgstAmount = amount * (sgstRate / 100);
    const total = amount + igstAmount + cgstAmount + sgstAmount;

    return {
        amount,
        igstAmount,
        cgstAmount,
        sgstAmount,
        total
    };
};

// Grand totals: sum item totals so CGST/SGST amounts show correctly in PDF
const grandTotals = (formData?.items || []).reduce((acc, item) => {
    const itemTotals = calculateItemTotals(item);
    return {
        amount: acc.amount + itemTotals.amount,
        igstAmount: acc.igstAmount + itemTotals.igstAmount,
        cgstAmount: acc.cgstAmount + itemTotals.cgstAmount,
        sgstAmount: acc.sgstAmount + itemTotals.sgstAmount,
        total: acc.total + itemTotals.total
    };
}, { amount: 0, igstAmount: 0, cgstAmount: 0, sgstAmount: 0, total: 0 });

    const generatePDF = () => {
        try {
            const element = document.getElementById("pdf-content");
            if (!element) {
                throw new Error("PDF content element not found");
            }

            const options = {
                margin: 10,
                filename: `Invoice_${invoiceNumber}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: true,
                    useCORS: true,
                    backgroundColor: "#FFFFFF"
                },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            html2pdf().set(options).from(element).save();
            // Increment invoice counter after successful download
            setInvoiceCounter(prev => prev + 1);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    useImperativeHandle(ref, () => ({
        generatePDF
    }));

    // Helper to format empty fields
    const formatField = (value) => value || '-';

    // Display rates from first item for headers/totals (so PDF shows actual %)
    const firstItem = formData.items[0];
    const igstLabel = firstItem ? (parseFloat(String(firstItem.igst || '').replace('%', '')) || 0) : 0;
    const cgstLabel = firstItem ? (parseFloat(String(firstItem.cgst || '').replace('%', '')) || 0) : 0;
    const sgstLabel = firstItem ? (parseFloat(String(firstItem.sgst || '').replace('%', '')) || 0) : 0;

    return (
        <div style={{ display: "none" }}>
            <div id="pdf-content" style={pdfStyles.content}>
                {/* Header with Logo */}
                <div style={pdfStyles.header}>
                    <img src={logo} alt="Company Logo" style={pdfStyles.logo} />
                    <h2 style={pdfStyles.title}>TAX INVOICE</h2>
                </div>

                {/* Invoice Details */}
                <div style={pdfStyles.detailsRow}>
                    <div style={pdfStyles.invoiceColumn}>
                        <p style={pdfStyles.detailItem}><strong>Invoice No:</strong> {invoiceNumber}</p>
                        <p style={pdfStyles.detailItem}><strong>Invoice Date:</strong> {formatField(formData.date)}</p>
                        <p style={pdfStyles.detailItem}><strong>Due Date:</strong> {formatField(formData.adate)}</p>
                    </div>

                    <div style={pdfStyles.billedByColumn}>
                        <h3 style={pdfStyles.sectionTitle}>Billed By:</h3>
                        <p style={pdfStyles.detailItem}>WebWave Business Pvt. Ltd.</p>
                        <p style={pdfStyles.detailItem}>S-21 1st Floor Ajay Enclave</p>
                        
                        <p style={pdfStyles.detailItem}><strong>GSTIN:</strong> 07AADCW8027D1ZE</p>
                        <p style={pdfStyles.detailItem}><strong>PAN:</strong> AADCW8027D</p>
                    </div>

                    <div style={pdfStyles.billedToColumn}>
                        <h3 style={pdfStyles.sectionTitle}>Billed To:</h3>
                        {/* <p style={pdfStyles.detailItem}>{formatField(formData.name)}</p> */}
                        <p style={pdfStyles.detailItem}>{formatField(formData.company)}</p>
                        <p style={pdfStyles.detailItem}>{formatField(formData.address)}</p>
                        {formData.gst && <p style={pdfStyles.detailItem}><strong>GSTIN:</strong> {formData.gst}</p>}
                        {formData.pan && <p style={pdfStyles.detailItem}><strong>PAN:</strong> {formData.pan}</p>}
                    </div>
                </div>

                {/* Items Table */}
                <table style={pdfStyles.itemsTable}>
                    <thead>
                        <tr>
                            <th style={pdfStyles.tableHeader}>#</th>
                            <th style={{ ...pdfStyles.tableHeader, width: '30%' }}>Description</th>
                            <th style={pdfStyles.tableHeader}>HSN/SAC</th>
                            <th style={pdfStyles.tableHeader}>Qty</th>
                            <th style={pdfStyles.tableHeader}>Amount (₹)</th>
                            <th style={pdfStyles.tableHeader}>IGST ({igstLabel}%)</th>
                            <th style={pdfStyles.tableHeader}>CGST ({cgstLabel}%)</th>
                            <th style={pdfStyles.tableHeader}>SGST ({sgstLabel}%)</th>
                            <th style={pdfStyles.tableHeader}>Total (₹)</th>
                            <th style={pdfStyles.tableHeader}>Tenure</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.items.map((item, index) => {
                            const itemTotals = calculateItemTotals(item);
                            return (
                                <tr key={index}>
                                    <td style={pdfStyles.tableCell}>{index + 1}</td>
                                    <td style={{ ...pdfStyles.tableCell, width: '30%' }}>{formatField(item.description)}</td>
                                    <td style={pdfStyles.tableCell}>{formatField(item.hsn)}</td>
                                    <td style={pdfStyles.tableCell}>{item.quantity}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.amount.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.igstAmount.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.cgstAmount.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.sgstAmount.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{itemTotals.total.toFixed(2)}</td>
                                    <td style={pdfStyles.tableCell}>{item.tenure ? `${item.tenure} month(s)` : '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Total Rows */}
                <div style={pdfStyles.totalContainer}>
                    <div style={pdfStyles.totalRow}>
                        <div style={pdfStyles.totalLabel}>Sub Total:</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.amount.toFixed(2)}</div>
                    </div>
                    <div style={pdfStyles.totalRow}>
                        <div style={pdfStyles.totalLabel}>IGST ({igstLabel}%):</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.igstAmount.toFixed(2)}</div>
                    </div>
                    <div style={pdfStyles.totalRow}>
                        <div style={pdfStyles.totalLabel}>CGST ({cgstLabel}%):</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.cgstAmount.toFixed(2)}</div>
                    </div>
                    <div style={pdfStyles.totalRow}>
                        <div style={pdfStyles.totalLabel}>SGST ({sgstLabel}%):</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.sgstAmount.toFixed(2)}</div>
                    </div>
                    <div style={{ ...pdfStyles.totalRow, ...pdfStyles.grandTotal }}>
                        <div style={pdfStyles.totalLabel}>Grand Total:</div>
                        <div style={pdfStyles.totalValue}>₹ {grandTotals.total.toFixed(2)}</div>
                    </div>
                </div>

                {/* Footer Note */}
                <div style={pdfStyles.footerNote}>
                    <p style={pdfStyles.noteText}>
                        Our company endeavors to provide our best services to our valuable clients.
                        However, if any of our valuable clients feel deprived due to any wrong or
                        misleading information, service, package, deficiency in providing any or all of
                        our services or packages, or misbehavior or misrepresentation by any of our
                        employees, then such person, client, company, or any other entity may report
                        this matter to our official email (feedback@globalb2bmart.com) within 15
                        days since it comes to their knowledge. *Verified & Contactable Buyers as
                        per the chosen package(based on current availability on globalb2bmart.com)
                    </p>
                </div>
                <div style={pdfStyles.bankBox}>
                    <h3 style={pdfStyles.bankBoxTitle}>Billed By:</h3>
                    <p style={pdfStyles.detailItem}><strong>Account Name:</strong> Webwave Business Pvt Ltd</p>
                    <p style={pdfStyles.detailItem}><strong>Account Number:</strong> 923020060598477</p>
                    <p style={pdfStyles.detailItem}><strong>IFSC:</strong> UTIB0004098</p>
                    <p style={pdfStyles.detailItem}><strong>Branch Name:</strong> Ajay Enclave</p>
                    <p style={pdfStyles.detailItem}>
                        <strong>Address:</strong> Ground Floor, Property No. 26/1, Ajay Enclave, New Ajanta Cinema, New Delhi - 110026
                    </p>
                </div>
                <div style={pdfStyles.signatureContainer}>
                    <p style={pdfStyles.signatureLine}>Signature of authority</p>
                    {/* <div style={pdfStyles.signatureBox}>
                        
                    </div> */}
                </div>
            </div>
        </div>
    );
});

// PDF styling (unchanged)
const pdfStyles = {
    content: {
        backgroundColor: "#FFFFFF",
        color: "#000000",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "20px",
        borderBottom: "1px solid #000",
    },
    logo: {
        height: "60px"
    },
    title: {
        color: "#333",
        margin: 0,
        fontSize: "20px",
        fontWeight: "bold"
    },
    detailsRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
        paddingBottom: "15px",
    },
    invoiceColumn: {
        flex: 1,
        padding: "0 10px",
    },
    billedByColumn: {
        flex: 1,
        padding: "0 10px",
    },
    billedToColumn: {
        flex: 1,
        padding: "0 10px",
    },
    sectionTitle: {
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "8px",
        color: "#333",
    },
    detailItem: {
        margin: "5px 0",
        fontSize: "12px",
    },
    itemsTable: {
        width: "100%",
        borderCollapse: "collapse",
        margin: "20px 0",
        border: "1px solid #000",
    },
    tableHeader: {
        backgroundColor: "#f0f0f0",
        padding: "8px",
        textAlign: "center",
        border: "1px solid #000",
        fontSize: "12px",
        fontWeight: "bold",
    },
    tableCell: {
        padding: "8px",
        textAlign: "center",
        border: "1px solid #000",
        fontSize: "12px",
    },
    totalContainer: {
        marginTop: "20px",
        marginLeft: "auto",
        width: "300px",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px",
        padding: "8px 10px",
    },
    grandTotal: {
        backgroundColor: "#f0f0f0",
        fontWeight: "bold",
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000",
    },
    totalLabel: {
        fontSize: "14px",
    },
    totalValue: {
        fontSize: "14px",
        minWidth: "100px",
        textAlign: "right",
    },
    footerNote: {
        marginTop: "30px",
        padding: "15px",
        borderTop: "1px solid #000",
        fontSize: "11px",
        lineHeight: "1.4",
    },
    noteText: {
        margin: 0,
    },
    bankBox: {
        marginTop: "20px",
        border: "1px solid #000",
        padding: "12px",
        borderRadius: "6px",
        backgroundColor: "#f9f9f9",
        fontSize: "12px",
    },
    bankBoxTitle: {
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "8px",
        textAlign: "Start",
        textTransform: "uppercase",
        color: "#333",
    },
    signatureContainer: {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "80px",
  paddingRight: "30px",
},

signatureBox: {
  textAlign: "center",
  width: "200px",
  borderTop: "1px solid #000",
  paddingTop: "8px",
},

signatureLine: {
  fontSize: "13px",
  fontWeight: "bold",
  margin: "0",
},

signatureLabel: {
  fontSize: "12px",
  marginTop: "14px",
  color: "#333",
},
};

export default PdfLayout;
