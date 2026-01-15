import jsPDF from "jspdf";

export function generateQuotationPDF(q) {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(16);
  doc.text("Quotation", 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.text(`No: ${q.document.prefix}-${q.document.number}`, 14, y);
  y += 10;

  // Customer
  doc.setFontSize(12);
  doc.text("Customer", 14, y);
  y += 6;

  doc.setFontSize(10);
  doc.text(q.customer.name, 14, y);
  y += 5;
  doc.text(q.customer.phone, 14, y);
  y += 10;

  // Items
  doc.setFontSize(12);
  doc.text("Items", 14, y);
  y += 6;

  doc.setFontSize(10);
  q.products.forEach((p) => {
    doc.text(`${p.name} (${p.qty} × ${p.price}) = ₹ ${p.qty * p.price}`, 14, y);
    y += 5;
  });

  y += 8;

  // Totals
  doc.text(`Subtotal: ₹ ${q.totals.subTotal}`, 14, y);
  y += 5;

  if (q.extraDiscount > 0) {
    doc.text(`Discount: - ₹ ${q.extraDiscount}`, 14, y);
    y += 5;
  }

  q.charges.forEach((c) => {
    doc.text(`${c.label}: ₹ ${c.amount}`, 14, y);
    y += 5;
  });

  y += 5;
  doc.setFontSize(12);
  doc.text(`Grand Total: ₹ ${q.totals.grandTotal}`, 14, y);

  doc.save(`Quotation-${q.document.prefix}-${q.document.number}.pdf`);
}
