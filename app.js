let officers = [];
let extras = [];
let ra_ro_list = [];

function generateTimeline(shift){
  let times = [];
  let start = shift === "morning" ? 10 : 22;

  for(let i=0;i<48;i++){  // 12h x 4 intervals per hour
    let hour = (start + Math.floor(i/4)) % 24;
    let min = (i%4)*15;
    times.push(
      String(hour).padStart(2,'0') +
      String(min).padStart(2,'0')
    );
  }
  return times;
}

function generateBaseRoster(){
  officers = [];
  let total = parseInt(document.getElementById("baseOfficers").value);
  let shift = document.getElementById("shift").value;

  for(let i=1;i<=total;i++){
    officers.push({
      name: "Officer"+i,
      type:"BASE",
      start: shift==="morning"?"1000":"2200",
      end: shift==="morning"?"2200":"1000",
      breakTimes:[]
    });
  }

  autoAssignBreaks();
  renderGrid();
}

function autoAssignBreaks(){
  let shift = document.getElementById("shift").value;

  officers.forEach(o=>{
    if(o.type==="BASE"){
      if(shift==="morning"){
        o.breakTimes = ["1300","1500"];
      }else{
        o.breakTimes = ["0100","0400"];
      }
    }
  });
}

function addRA_RO(){
  let name = document.getElementById("raName").value;
  let time = document.getElementById("raTime").value;
  let type = document.getElementById("raType").value;

  ra_ro_list.push({name,time,type});
  adjustForRA_RO();
  renderGrid();
}

function adjustForRA_RO(){
  ra_ro_list.forEach(r=>{
    let o = officers.find(x=>x.name===r.name);
    if(!o) return;

    if(r.type==="RA"){
      o.start = r.time;
    }
    if(r.type==="RO"){
      o.end = minus30(r.time);
    }
  });
}

function minus30(time){
  let h=parseInt(time.slice(0,2));
  let m=parseInt(time.slice(2));
  m-=30;
  if(m<0){ m+=60; h--; }
  return String(h).padStart(2,'0')+String(m).padStart(2,'0');
}

function addExtra(){
  let type=document.getElementById("extraType").value;
  let start=document.getElementById("extraStart").value;
  let end=document.getElementById("extraEnd").value;
  let count=parseInt(document.getElementById("extraCount").value);

  for(let i=0;i<count;i++){
    officers.push({
      name:type+i+Date.now(),
      type:type,
      start:start,
      end:adjustRelease(type,start,end),
      breakTimes:getOTBreaks(type,start)
    });
  }

  renderGrid();
}

function adjustRelease(type,start,end){
  if(type==="OT"){
    if(start==="1600") return "2030";
    if(start==="1100") return "1530";
    if(start==="0600") return "1030";
  }
  return end;
}

function getOTBreaks(type,start){
  if(type!=="OT") return [];
  if(start==="1100") return ["1230","1315","1400"];
  if(start==="1600") return ["1730","1815","1900"];
  if(start==="0600") return ["0730","0815","0900"];
  return [];
}

function renderGrid(){
  let grid=document.getElementById("grid");
  grid.innerHTML="";
  let shift=document.getElementById("shift").value;
  let times=generateTimeline(shift);

  officers.forEach(o=>{
    let row=document.createElement("div");
    row.innerHTML=o.name+" ";

    times.forEach(t=>{
      let cell=document.createElement("div");
      cell.classList.add("cell");

      if(isWorking(o,t)){
        cell.classList.add("zone1");
      }else{
        cell.classList.add("empty");
      }

      if(o.breakTimes.includes(t)){
        cell.classList.add("break");
      }

      row.appendChild(cell);
    });

    grid.appendChild(row);
  });
}

function isWorking(o,time){
  return time>=o.start && time<o.end;
}

function searchOfficer(){
  let name=document.getElementById("searchName").value;
  let o=officers.find(x=>x.name===name);
  let view=document.getElementById("officerView");
  if(!o){ view.textContent="Not found"; return;}
  view.textContent=JSON.stringify(o,null,2);
}
