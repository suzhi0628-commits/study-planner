const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.use(express.static(__dirname))

// 内容库
const contentPool = {
  listening: [
    "Cambridge 10 Test1 Section1",
    "Cambridge 10 Test1 Section2",
    "Cambridge 11 Test1 Section1"
  ],
  reading: [
    "Passage 1",
    "Passage 2",
    "Passage 3"
  ],
  vocab: [
    "List 1",
    "List 2",
    "List 3"
  ]
}

// 随机函数
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// 每日任务
functfunction generateDailyTasks(hours) {
  const tasks = []

  if (hours >= 1) {
    tasks.push({
      type: "Listening",
      content: "Cambridge 10 Test1 Section1",
      note: "熟悉基础听力题型"
    })
  }

  if (hours >= 2) {
    tasks.push({
      type: "Reading",
      content: "Passage 1",
      note: "训练快速定位能力"
    })
  }

  if (hours >= 3) {
    tasks.push({
      type: "Vocabulary",
      content: "List 1",
      note: "积累核心词汇"
    })
  }

  return tasks
}

// 生成计划
function generatePlan(weeks, hours) {
  const days = weeks * 7
  const plan = []

  for (let i = 0; i < days; i++) {
    plan.push({
      day: i + 1,
      tasks: generateDailyTasks(hours)
    })
  }

  return plan
}

// API接口
app.post('/generate', (req, res) => {
  const { weeks, hours } = req.body

  const plan = generatePlan(weeks, hours)

  res.json({ plan })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
