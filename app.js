function generateRoster() {
    const operation = document.getElementById("operation").value;
    const shift = document.getElementById("shift").value;
    const totalOfficers = parseInt(document.getElementById("officers").value);

    let maxCounters = operation === "arrival" ? 40 : 36;

    if (totalOfficers > maxCounters) {
        alert("ERROR: Exceeds max counters by " + (totalOfficers - maxCounters));
        return;
    }

    let perZone = Math.floor(totalOfficers / 4);
    let remainder = totalOfficers % 4;

    let zones = [perZone, perZone, perZone, perZone];

    for (let i = 3; i >= 0 && remainder > 0; i--) {
        zones[i]++;
        remainder--;
    }

    renderGrid(zones, operation);
    renderSummary(zones, totalOfficers, shift);
}

function renderGrid(zones, operation) {
    const grid = document.getElementById("counterGrid");
    grid.innerHTML = "";

    const zoneColors = ["zone1", "zone2", "zone3", "zone4"];
    const zoneMax = operation === "arrival" ? 10 : [8, 10, 10, 8];

    for (let z = 0; z < 4; z++) {
        let max = Array.isArray(zoneMax) ? zoneMax[z] : zoneMax;

        for (let c = 1; c <= max; c++) {
            const div = document.createElement("div");
            div.classList.add("counter");

            if (c <= zones[z]) {
                div.classList.add(zoneColors[z]);
                div.innerText = `Z${z + 1}-${c}`;
            } else {
                div.classList.add("closed");
                div.innerText = "";
            }

            grid.appendChild(div);
        }
    }
}

function renderSummary(zones, total, shift) {
    const summary = document.getElementById("summary");

    let times = [];
    let start = shift === "morning" ? 10 : 22;

    for (let i = 0; i < 24; i++) {
        let hour = (start + Math.floor(i / 2)) % 24;
        let min = i % 2 === 0 ? "00" : "30";
        times.push(String(hour).padStart(2, "0") + min);
    }

    let output = shift.toUpperCase() + " SHIFT\n\n";

    times.forEach(t => {
        output += `${t}: ${total}/01\n`;
        output += `${zones[0]}/${zones[1]}/${zones[2]}/${zones[3]}\n\n`;
    });

    summary.textContent = output;
}
