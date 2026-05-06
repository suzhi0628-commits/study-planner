export default function handler(req, res) {
  const { weeks, hours } = req.body

  const contentPool = {
    listening: ["Cambridge 10 Test1 Section1"],
    reading: ["Passage 1"],
    vocab: ["List 1"]
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

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
}