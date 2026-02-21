document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("driverBody");

  async function fetchDrivers() {
    const res = await fetch("/drivers/");
    const data = await res.json();
    renderDrivers(data);
  }

  function daysUntil(dateStr) {
    const today = new Date();
    const target = new Date(dateStr);
    return Math.floor((target - today) / (1000 * 60 * 60 * 24));
  }

  function renderDrivers(drivers) {
    tbody.innerHTML = "";
    drivers.forEach(d => {
      const daysLeft = daysUntil(d.licenseExpiry);
      const expired = d.expired;

      const licenseCell = expired
        ? `<span style="color:#ef4444;font-weight:600;">Expired</span>`
        : `${d.licenseExpiry}<br><small style="color:#6b7280;">(${daysLeft} days left)</small>`;

      const completionBar = `
        <div class="progress-bar">
          <div class="progress-fill" style="width:${d.completionRate}%;"></div>
        </div>
        <small>${d.completionRate}%</small>`;

      const safetyBar = `
        <div class="progress-bar">
          <div class="progress-fill" style="background:#10b981;width:${d.safetyScore}%;"></div>
        </div>
        <small>${d.safetyScore}%</small>`;

      const statusClass =
        d.status === "On Duty" ? "on-duty" :
        d.status === "Off Duty" ? "off-duty" : "suspended";

      const assignCell = expired
        ? `<span style="color:#ef4444;font-weight:600;">❌ Blocked</span>`
        : d.assigned
        ? `<span style="color:#10b981;font-weight:600;">✅ Assigned</span>`
        : `<span style="color:#6b7280;">Not Assigned</span>`;

      const row = `
        <tr>
          <td>${d.name}</td>
          <td>${licenseCell}</td>
          <td>${completionBar}</td>
          <td>${safetyBar}</td>
          <td><span class="status-pill ${statusClass}" data-id="${d.id}">${d.status}</span></td>
          <td>${assignCell}</td>
        </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    });
    bindStatusToggle();
  }

  function bindStatusToggle() {
    document.querySelectorAll(".status-pill").forEach(el => {
      el.addEventListener("click", async () => {
        const id = el.dataset.id;
        const res = await fetch(`/drivers/toggle/${id}/`);
        const result = await res.json();
        if (result.success) fetchDrivers();
        else alert("Error updating driver");
      });
    });
  }

  fetchDrivers();
});