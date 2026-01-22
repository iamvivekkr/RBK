import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateQuotationPDF(q) {
  const doc = new jsPDF("p", "mm", "a4");

  let y = 15;

  /* ---------- HEADER ---------- */
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("QUOTATION", 14, y);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("ORIGINAL FOR RECIPIENT", 160, y);

  y += 10;

  /* ---------- COMPANY ---------- */
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Sandesh", 14, y);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  y += 5;
  doc.text("GSTIN 128855252255852", 14, y);
  y += 4;
  doc.text("ARUNACHAL PRADESH", 14, y);
  y += 4;
  doc.text("Mobile +91 8252117463", 14, y);

  /* ---------- META ---------- */
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text(`Quotation #: ${q.document.prefix}-${q.document.number}`, 14, y);
  doc.text(`Quotation Date: ${q.document.date}`, 80, y);
  doc.text(`Validity: ${q.document.dueDate || q.document.date}`, 150, y);

  y += 8;

  /* ---------- CUSTOMER / ADDRESS ---------- */
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details:", 14, y);
  doc.text("Shipping Address:", 110, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(q.customer?.name || "", 14, y);
  doc.text(`${q.dispatchAddress?.addressLine1 || ""}`, 110, y);

  y += 4;
  doc.text(`Ph: ${q.customer?.phone || ""}`, 14, y);
  doc.text(
    `${q.dispatchAddress?.city || ""}, ${q.dispatchAddress?.state || ""} - ${
      q.dispatchAddress?.pincode || ""
    }`,
    110,
    y,
  );

  y += 6;
  doc.text(`Dispatch From: ${q.dispatchAddress?.addressLine1 || ""}`, 14, y);

  y += 6;
  doc.text(`Reference: ${q.reference || "-"}`, 110, y);

  y += 8;

  /* ---------- ITEMS TABLE ---------- */
  const itemRows = q.products.map((p, i) => {
    const taxable = p.qty * p.price;
    const tax = ((taxable * (p.taxRate || 0)) / 100).toFixed(2);

    return [
      i + 1,
      `${p.name}\nHSN: ${p.hsn || "00000000"}`,
      p.price.toFixed(2),
      p.qty,
      taxable.toFixed(2),
      `${tax} (${p.taxRate || 0}%)`,
      taxable.toFixed(2),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [
      [
        "#",
        "Item",
        "Rate / Item",
        "Qty",
        "Taxable Value",
        "Tax Amount",
        "Amount",
      ],
    ],
    body: itemRows,
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [240, 240, 240] },
  });

  y = doc.lastAutoTable.finalY + 5;

  /* ---------- TOTALS (RIGHT) ---------- */
  const rightX = 130;

  const addTotal = (label, value, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, rightX, y);
    doc.text(value, 190, y, { align: "right" });
    y += 5;
  };

  q.charges.forEach((c) => addTotal(c.label, `₹${c.amount.toFixed(2)}`));

  addTotal("Taxable Amount", `₹${q.totals.subTotal.toFixed(2)}`);
  addTotal("CGST 2.5%", "₹0.24");
  addTotal("SGST 2.5%", "₹0.24");

  if (q.extraDiscount > 0) {
    addTotal("Discount", `-₹${q.extraDiscount.toFixed(2)}`);
  }

  addTotal("Round Off", "-0.25");
  addTotal("Total", `₹${q.totals.grandTotal.toFixed(2)}`, true);

  y += 10;

  /* ---------- SIGNATURE ---------- */
  doc.text("For Sandesh", 150, y);
  y += 15;
  doc.text("Authorized Signatory", 150, y);

  y += 10;

  /* ---------- NOTES ---------- */
  if (q.notes) {
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 14, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(q.notes, 14, y);
  }

  y += 10;

  if (q.terms) {
    doc.setFont("helvetica", "bold");
    doc.text("Terms and Conditions:", 14, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.text(q.terms, 14, y);
  }

  /* ---------- FOOTER ---------- */
  doc.setFontSize(8);
  doc.text("This is a digitally signed document.", 14, 290);

  doc.save(`Quotation-${q.document.prefix}-${q.document.number}.pdf`);
}
