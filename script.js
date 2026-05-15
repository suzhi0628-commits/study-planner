let currentUser = localStorage.getItem("userName") || null;
document.getElementById("user-name").textContent = currentUser || "未登录";

// Tab切换
const tabs = document.querySelectorAll(".tab-bar button");
const pages = document.querySelectorAll(".tab-page");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  });
});

// 登录注册
document.getElementById("login-btn").onclick = () => {
  const name = prompt("请输入用户名登录:");
  if(name){ currentUser=name; localStorage.setItem("userName", name); document.getElementById("user-name").textContent=name;}
};
document.getElementById("register-btn").onclick = () => {
  const name = prompt("请输入用户名注册:");
  if(name){ currentUser=name; localStorage.setItem("userName", name); document.getElementById("user-name").textContent=name;}
};

// 点击成长中心看板
const boards = document.querySelectorAll(".board");
boards.forEach(board=>{
  board.addEventListener("click", ()=>{
    const type = board.dataset.board;
    alert(`进入 ${board.textContent} 页面（占位）`);
    // TODO: 可跳转到对应页面或显示弹窗
  });
});

// ==================== 每日任务功能 ====================
// 假设词汇题库
let vocabTasks = [];
let dailyTasks = [];
fetch("ielts_vocab.json")
  .then(res=>res.json())
  .then(data=>{
    vocabTasks=data;
    generateDailyTasks();
    renderTasks();
  });

function generateDailyTasks(){
  dailyTasks = vocabTasks.sort(()=>0.5-Math.random()).slice(0,5);
  const saved = JSON.parse(localStorage.getItem("dailyTasks")) || {};
  dailyTasks.forEach(t=>t.completed = saved[t.id] || false);
}

function renderTasks(){
  const container = document.getElementById("task-list");
  container.innerHTML="";
  dailyTasks.forEach(task=>{
    const div = document.createElement("div");
    div.className="task-card";
    div.innerHTML = `
      <h3>${task.word}</h3>
      <p>释义: ${task.definition}</p>
      <p>例句: ${task.example}</p>
      <p>能力成长: ${task.growth}</p>
      <button>${task.completed?"已完成":"开始"}</button>
    `;
    div.querySelector("button").onclick = ()=>{
      task.completed=true;
      saveDailyTasks();
      renderTasks();
      updateGrowth();
    };
    container.appendChild(div);
  });
  updateGrowth();
}

function saveDailyTasks(){
  const saved = {};
  dailyTasks.forEach(t=>saved[t.id]=t.completed);
  localStorage.setItem("dailyTasks", JSON.stringify(saved));
}

// 成长中心功能
function updateGrowth(){
  const done = dailyTasks.filter(t=>t.completed).length;
  const growthText = document.querySelector("#growth-container p");
  if(growthText) growthText.textContent=`你今天完成了 ${done} 个任务`;

  const weekData = JSON.parse(localStorage.getItem("weekData")) || [];
  const today = new Date().toISOString().slice(0,10);
  const existing = weekData.find(d=>d.date===today);
  if(existing){existing.completed=done; existing.total=dailyTasks.length;}
  else{weekData.push({date:today, completed:done, total:dailyTasks.length});}
  localStorage.setItem("weekData", JSON.stringify(weekData));

  renderGrowthCurve();
}

function renderGrowthCurve(){
  const weekData = JSON.parse(localStorage.getItem("weekData")) || [];
  let curve = document.querySelector("#growth-container .curve");
  if(!curve){
    curve=document.createElement("div");
    curve.className="curve";
    curve.style.display="flex";
    curve.style.justifyContent="space-between";
    curve.style.marginTop="12px";
    document.querySelector("#growth-container").appendChild(curve);
  }
  curve.innerHTML="";
  weekData.forEach(d=>{
    const bar = document.createElement("div");
    bar.style.height=(d.completed/d.total*50+10)+"px";
    bar.style.width="20px";
    bar.style.background="#22c55e";
    bar.title=`${d.date}: ${d.completed}/${d.total}`;
    bar.style.borderRadius="6px";
    curve.appendChild(bar);
  });
}

updateGrowth();