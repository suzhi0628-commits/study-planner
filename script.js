let currentUser = localStorage.getItem("userName") || null;
document.getElementById("user-name").textContent = currentUser || "未登录";

const tabs = document.querySelectorAll(".tab-bar button");
const pages = document.querySelectorAll(".tab-page");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  });
});

document.getElementById("login-btn").onclick = () => {
  const name = prompt("请输入用户名登录:");
  if (name) { currentUser = name; localStorage.setItem("userName", name); document.getElementById("user-name").textContent = name; }
};
document.getElementById("register-btn").onclick = () => {
  const name = prompt("请输入用户名注册:");
  if (name) { currentUser = name; localStorage.setItem("userName", name); document.getElementById("user-name").textContent = name; }
};

// 全部题库
let tasks = [], dailyTasks = [];

fetch("ielts_questions.json")
  .then(res => res.json())
  .then(data => {
    tasks = data;
    generateDailyTasks();
    renderTasks();
  });

function generateDailyTasks() {
  const vocab = tasks.filter(t => t.type === "vocab").sort(() => 0.5 - Math.random()).slice(0, 2);
  const reading = tasks.filter(t => t.type === "reading").sort(() => 0.5 - Math.random()).slice(0, 1);
  const listening = tasks.filter(t => t.type === "listening").sort(() => 0.5 - Math.random()).slice(0, 1);
  const writing = tasks.filter(t => t.type === "writing").sort(() => 0.5 - Math.random()).slice(0, 1);
  dailyTasks = [...vocab, ...reading, ...listening, ...writing];

  const saved = JSON.parse(localStorage.getItem("dailyTasks")) || {};
  dailyTasks.forEach(t => t.completed = saved[t.id] || false);
}

function renderTasks() {
  const container = document.getElementById("task-list");
  container.innerHTML = "";
  dailyTasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task-card";

    let html = "";
    if (task.type === "vocab") {
      html = `<h3>词汇: ${task.question}</h3><p>释义: ${task.answer}</p>`;
    } else if (task.type === "reading") {
      html = `<h3>阅读</h3><p>${task.passage}</p>`;
      if (task.questions && task.questions.length) {
        html += `<p><strong>问题:</strong> ${task.questions[0].question}</p>`;
      }
    } else if (task.type === "listening") {
      html = `<h3>听力</h3><p>${task.question}</p>`;
    } else if (task.type === "writing") {
      html = `<h3>写作</h3><p>${task.prompt}</p>`;
    }

    div.innerHTML = `
      ${html}
      <p>任务成长: ${task.growth}</p>
      <p>预计时长: ${task.duration} min</p>
      <button>${task.completed ? "已完成" : "开始"}</button>
    `;

    const btn = div.querySelector("button");
    btn.onclick = () => {
      task.completed = true;
      saveDailyTasks();
      renderTasks();
      updateGrowth();
    };

    container.appendChild(div);
  });
  updateGrowth();
}

function saveDailyTasks() {
  const saved = {};
  dailyTasks.forEach(t => saved[t.id] = t.completed);
  localStorage.setItem("dailyTasks", JSON.stringify(saved));
}

function updateGrowth() {
  const done = dailyTasks.filter(t => t.completed).length;

  const growthText = document.querySelector("#growth-container p");
  if (growthText) growthText.textContent = `你今天完成了 ${done} 个任务`;

  const weekData = JSON.parse(localStorage.getItem("weekData")) || [];
  const today = new Date().toISOString().slice(0, 10);
  const existing = weekData.find(d => d.date === today);

  if (existing) {
    existing.completed = done;
    existing.total = dailyTasks.length;
  } else {
    weekData.push({ date: today, completed: done, total: dailyTasks.length });
  }
  localStorage.setItem("weekData", JSON.stringify(weekData));

  renderGrowthCurve();
}

function renderGrowthCurve() {
  const weekData = JSON.parse(localStorage.getItem("weekData")) || [];
  let curve = document.querySelector("#growth-container .curve");

  if (!curve) {
    curve = document.createElement("div");
    curve.className = "curve";
    curve.style.display = "flex";
    curve.style.justifyContent = "space-between";
    curve.style.marginTop = "12px";
    document.querySelector("#growth-container").appendChild(curve);
  }

  curve.innerHTML = "";
  weekData.forEach(d => {
    const bar = document.createElement("div");
    bar.style.height = (d.completed / d.total * 50 + 10) + "px";
    bar.style.width = "20px";
    bar.style.background = "#22c55e";
    bar.title = `${d.date}: ${d.completed}/${d.total}`;
    bar.style.borderRadius = "6px";
    curve.appendChild(bar);
  });
}

updateGrowth();