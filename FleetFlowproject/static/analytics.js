document.addEventListener("DOMContentLoaded", () => {
  const revenue = parseInt(document.getElementById("rev").innerText.replace(/[₹,]/g, "")) || 0;
  const fuelCost = parseInt(document.getElementById("fuelCost").innerText.replace(/[₹,]/g, "")) || 0;
  const maintenance = parseInt(document.getElementById("maint").innerText.replace(/[₹,]/g, "")) || 0;
  const acquisition = parseInt(document.getElementById("acq").innerText.replace(/[₹,]/g, "")) || 0;

  const ctx1 = document.getElementById("financeTrend").getContext("2d");
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Monthly Revenue (₹)",
        data: [25000, 32000, 28000, 35000, 40000, 45000],
        backgroundColor: "#4f46e5"
      }]
    },
    options: { plugins: { legend: { display: false } } }
  });

  const ctx2 = document.getElementById("fuelChart").getContext("2d");
  new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: ["Fuel", "Maintenance", "Profit Margin"],
      datasets: [{
        data: [fuelCost, maintenance, revenue - (fuelCost + maintenance + acquisition)],
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"]
      }]
    },
    options: { plugins: { legend: { position: "bottom" } } }
  });

  document.getElementById("csvBtn").addEventListener("click", () => {
    const csv = [
      ["Revenue", "Fuel Cost", "Maintenance", "Acquisition", "Net Profit (₹)"],
      [revenue, fuelCost, maintenance, acquisition, revenue - (fuelCost + maintenance + acquisition)]
    ].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "FleetFlow_Financial_Report.csv";
    link.click();
  });

  document.getElementById("pdfBtn").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("FleetFlow Financial Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Revenue: ₹${revenue.toLocaleString()}`, 14, 40);
    doc.text(`Fuel Cost: ₹${fuelCost.toLocaleString()}`, 14, 48);
    doc.text(`Maintenance: ₹${maintenance.toLocaleString()}`, 14, 56);
    doc.text(`Acquisition: ₹${acquisition.toLocaleString()}`, 14, 64);
    doc.text(`Net Profit: ₹${(revenue - (fuelCost + maintenance + acquisition)).toLocaleString()}`, 14, 72);
    doc.save("FleetFlow_Report.pdf");
  });
});