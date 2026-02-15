let officers = [];
let extraOfficers = [];

function generateTimeSlots(shift){
  let slots=[];
  let start = shift==="morning" ? 600 : 1320;
  for(let i=0;i<48;i++){
    let total = start + i*15;
    total = total % 1440;
    let h = String(Math.floor(total/60)).padStart(2,"0");
    let m = String(total%60).padStart(2,"0");
    slots.push(h+m);
  }
  return slots;
}

function generateBase(){
  officers=[];
  let count = parseInt(document.getElementById("baseOfficers").value);
  let operation=document.getElementById("operation").value;
  let max = operation==="arrival"?40:36;

  if(count>max){
    alert("Exceed max counters by "+(count-max));
    return;
  }

  for(let i=1;i<=count;i++){
    officers.push({
      name:"Officer"+i,
      start:null,
      end:null,
      type:"base"
    });
  }

  render();
}

function addRA(){
  let name=document.getElementById("raName").value;
  let time=document.getElementById("raTime").value.replace(":","");
  officers.forEach(o=>{
    if(o.name===name) o.start=time;
  });
  render();
}

function addRO(){
  let name=document.getElementById("roName").value;
  let time=document.getElementById("roTime").value.replace(":","");
  officers.forEach(o=>{
    if(o.name===name) o.end=time;
  });
  render();
}

function addOT(){
  let count=parseInt(document.getElementById("otCount").value);
  let block=document.getElementById("otBlock").value;
  let parts=block.split("-");
  for(let i=0;i<count;i++){
    officers.push({
      name:"OT"+(i+1),
      start:parts[0],
      end:parts[1],
      type:"ot"
    });
  }
  render();
}

function addSOS(){
  let count=parseInt(document.getElementById("sosCount").value);
  let start=document.getElementById("sosStart").value.replace(":","");
  let end=document.getElementById("sosEnd").value.replace(":","");
  for(let i=0;i<count;i++){
    officers.push({
      name:"SOS"+(i+1),
      start:start,
      end:end,
      type:"sos"
    });
  }
  render();
}

function render(){
  renderSummary();
  renderOfficers();
}

function renderSummary(){
  let shift=document.getElementById("shift").value;
  let slots=generateTimeSlots(shift);
  let summary="";
  slots.forEach(t=>{
    summary+=t+": "+officers.length+"/01\n";
    summary+="5/5/5/5\n\n";
  });
  document.getElementById("summary").textContent=summary;
}

function renderOfficers(){
  let text="";
  officers.forEach(o=>{
    text+=o.name+" ("+o.type+") ";
    if(o.start) text+=" RA:"+o.start;
    if(o.end) text+=" RO:"+o.end;
    text+="\n";
  });
  document.getElementById("officerRoster").textContent=text;
}

function searchOfficer(){
  let q=document.getElementById("searchBox").value.toLowerCase();
  let text="";
  officers.filter(o=>o.name.toLowerCase().includes(q))
          .forEach(o=>text+=o.name+"\n");
  document.getElementById("officerRoster").textContent=text;
}
