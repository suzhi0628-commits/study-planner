export default async function handler(req, res) {
  try {
    // 👉 强制解析 body（避免 undefined 报错）
    let body = req.body

    if (!body) {
      body = {}
    }

    if (typeof body === "string") {
      body = JSON.parse(body)
    }

    const weeks = Number(body.weeks || 4)
    const hours = Number(body.hours || 1)

    const contentPool = {
      listening: ["Cambridge 10 Test1 Section1"],
      reading: ["Passage 1"],
      vocab: ["List 1"]
    }

    function randomItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    }
//顶顶顶
    function generateDailyTasks(hours) {
      const tasks = []

      if (hours >= 1) {
        tasks.push({
          type: "Listening",
          content: randomItem(contentPool.listening),
          note: "熟悉听力题型"
        })
      }

      if (hours >= 2) {
        tasks.push({
          type: "Reading",
          content: randomItem(contentPool.reading),
          note: "训练阅读能力"
        })
      }

      if (hours >= 3) {
        tasks.push({
          type: "Vocabulary",
          content: randomItem(contentPool.vocab),
          note: "积累词汇"
        })
      }

      return tasks
    }

    const days = weeks * 7
    const plan = []

    for (let i = 0; i < days; i++) {
      plan.push({
        day: i + 1,
        tasks: generateDailyTasks(hours)
      })
    }

    res.status(200).json({ plan })

  } catch (err) {
    // 👉 把错误直接返回（方便你调试）
    res.status(500).json({
      error: "Server error",
      message: err.message
    })
  }
}
