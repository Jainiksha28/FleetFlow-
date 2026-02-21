/* Dashboard.js — Final Polished Version
   - Maintenance Alert card opens maintenance modal
   - Utilization Rate card opens utilization modal
   - Chart placement fixed inside KPI
*/

document.addEventListener('DOMContentLoaded', () => {
  const KEY_V = 'ff_vehicles';
  const KEY_T = 'ff_trips';
  const KEY_E = 'ff_expenses';
  const $ = s => document.querySelector(s);
  const read = k => JSON.parse(localStorage.getItem(k) || '[]');
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const nowISO = () => new Date().toISOString();

  // ---------- SEED DATA ----------
  function seed() {
    if (!localStorage.getItem(KEY_V)) {
      write(KEY_V, [
        { id: "VH-2847-XK", driver: "John Doe", route: "NYC → Boston", cargo: "Electronics", status: "On Trip", lastUpdated: nowISO() },
        { id: "VH-8392-PL", driver: "", route: "LA → San Diego", cargo: "Furniture", status: "Pending", lastUpdated: nowISO() },
        { id: "VH-1056-QR", driver: "Mike Johnson", route: "Chicago → Detroit", cargo: "Food Supplies", status: "Busy", lastUpdated: nowISO() },
        { id: "VH-7734-MN", driver: "Emily Davis", route: "Houston → Dallas", cargo: "Medical Supplies", status: "On Trip", lastUpdated: nowISO() },
        { id: "VH-4521-WT", driver: "", route: "", cargo: "", status: "In Shop", lastUpdated: nowISO() },
      ]);
    }
    if (!localStorage.getItem(KEY_T)) {
      write(KEY_T, [
        { tripId: "#1", vehicleId: "VH-2847-XK", driver: "John Doe", route: "NYC → Boston", cargo: "Electronics", status: "On Trip", updatedAt: nowISO() },
        { tripId: "#2", vehicleId: "", driver: "", route: "LA → San Diego", cargo: "Furniture", status: "Pending", updatedAt: nowISO() },
        { tripId: "#3", vehicleId: "VH-1056-QR", driver: "Mike Johnson", route: "Chicago → Detroit", cargo: "Food Supplies", status: "Busy", updatedAt: nowISO() },
        { tripId: "#4", vehicleId: "VH-7734-MN", driver: "Emily Davis", route: "Houston → Dallas", cargo: "Medical Supplies", status: "On Trip", updatedAt: nowISO() },
        { tripId: "#5", vehicleId: "VH-4521-WT", driver: "", route: "", cargo: "", status: "In Shop", updatedAt: nowISO() },
      ]);
    }
    if (!localStorage.getItem(KEY_E)) {
      const y = new Date().getFullYear();
      const ex = [];
      for (let m = 1; m <= 12; m++) {
        ex.push({ date: `${y}-${String(m).padStart(2, '0')}-05`, amount: Math.round(200 + Math.random() * 1200) });
      }
      write(KEY_E, ex);
    }
  }

  // ---------- KPI COMPUTE ----------
  function computeKPIs() {
    const v = read(KEY_V);
    const t = read(KEY_T);
    const active = v.filter(x => x.status === "On Trip" || x.status === "Busy").length;
    const maint = v.filter(x => x.status === "In Shop").length;
    const pending = t.filter(x => x.status === "Pending" || !x.vehicleId).length;
    const util = v.length ? Math.round((active / v.length) * 100) : 0;
    return { active, maint, pending, util };
  }

  function renderKPIs() {
    const k = computeKPIs();
    $("#activeFleet").textContent = k.active;
    $("#maintCount").textContent = k.maint;
    $("#pendingCargo").textContent = k.pending;
    $("#utilRate").textContent = k.util + "%";
    drawUtilizationChart(k.util);
  }

  // ---------- TABLE ----------
  function renderTable() {
    const trips = read(KEY_T);
    const tbody = $("#tableBody");
    tbody.innerHTML = "";
    trips.forEach(r => {
      const statusClass =
        r.status === "On Trip" ? "ontrip" :
        r.status === "Busy" ? "busy" :
        r.status === "Pending" ? "ready" :
        r.status === "In Shop" ? "maint" : "";
      tbody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${r.tripId}</td>
          <td>${r.vehicleId || "—"}</td>
          <td>${r.driver || "—"}</td>
          <td>${r.route || "—"}</td>
          <td>${r.cargo || "—"}</td>
          <td><span class="status ${statusClass}">${r.status}</span></td>
          <td>${new Date(r.updatedAt).toLocaleString()}</td>
         
        </tr>
      `);
    });
  }

  // ---------- MAINTENANCE CHARTS ----------
  function drawMaintenanceCharts() {
    const exp = read(KEY_E);
    const year = new Date().getFullYear();
    const months = Array(12).fill(0);
    exp.forEach(e => {
      const d = new Date(e.date);
      if (d.getFullYear() === year) months[d.getMonth()] += e.amount;
    });

    const ctxM = document.getElementById("monthlyChart").getContext("2d");
    new Chart(ctxM, {
      type: "bar",
      data: { labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], datasets: [{ label:"Maintenance ₹", data: months, backgroundColor:"#4f46e5" }] },
      options: { plugins:{ legend:{ display:false } } }
    });

    const yearly = [];
    const years = [year-3, year-2, year-1, year];
    years.forEach(y => {
      yearly.push(exp.filter(e => new Date(e.date).getFullYear() === y).reduce((a,b) => a + b.amount, 0));
    });

    const ctxY = document.getElementById("yearlyChart").getContext("2d");
    new Chart(ctxY, {
      type: "line",
      data: { labels: years.map(String), datasets: [{ label:"Yearly Maintenance", data: yearly, borderColor:"#10b981", backgroundColor:"rgba(16,185,129,0.15)", fill:true }] },
      options: { plugins:{ legend:{ display:false } } }
    });
  }

  // ---------- UTILIZATION CHART ----------
  function drawUtilizationChart(utilPercent) {
    const elId = "utilizationChart";
    let canvas = document.getElementById(elId);
    if (!canvas) {
      const card = $("#utilRate").closest(".kpi");
      card.classList.add("clickable");
      const newCanvas = document.createElement("canvas");
      newCanvas.id = elId;
      newCanvas.height = 90;
      card.appendChild(newCanvas);
      canvas = newCanvas;
    }
    // new Chart(canvas, {
    //   type: "doughnut",
    //   data: { labels:["Utilized","Idle"], datasets:[{ data:[utilPercent,100-utilPercent], backgroundColor:["#4f46e5","#e5e7eb"], borderWidth:0 }] },
    //   options: { cutout:"75%", plugins:{ legend:{ display:false } } }
    // });
  }

  // ---------- MODALS ----------
  function openMaintModal() {
    $("#maintModal").classList.add("show");
    drawMaintenanceCharts();
  }
  function closeMaintModal() { $("#maintModal").classList.remove("show"); }

  function openUtilModal() {
    const modal = document.createElement("div");
    modal.className = "modal show";
    modal.innerHTML = `
      <div class="modal-content" style="max-width:600px">
        <div class="modal-top">
          <h3>Fleet Utilization Trend</h3>
          <button class="icon-btn" id="closeUtil">✖</button>
        </div>
        <canvas id="utilTrendChart" height="250"></canvas>
      </div>
    `;
    document.body.appendChild(modal);

    const ctx = modal.querySelector("#utilTrendChart").getContext("2d");
    const utilHistory = Array.from({length:7}, (_,i)=>Math.round(50+Math.random()*50));
    new Chart(ctx,{
      type:"line",
      data:{ labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], datasets:[{ label:"Utilization %", data:utilHistory, borderColor:"#4f46e5", backgroundColor:"rgba(79,70,229,0.1)", fill:true }] },
      options:{ plugins:{ legend:{display:false}}, responsive:true }
    });

    modal.querySelector("#closeUtil").onclick = ()=>modal.remove();
    modal.onclick = e=>{ if(e.target===modal) modal.remove(); };
  }

  // ---------- EVENTS ----------
  function bind() {
    $("#maintCount").parentElement.addEventListener("click", openMaintModal);
    $("#closeMaint").addEventListener("click", closeMaintModal);
    $("#closeMaint2").addEventListener("click", closeMaintModal);
    $("#utilRate").closest(".kpi").addEventListener("click", openUtilModal);
  }

  // ---------- INIT ----------
  seed();
  renderKPIs();
  renderTable();
  bind();
});