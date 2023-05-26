const express = require('express')
const SocketServer = require('ws').Server
const PORT = 3000 //指定 port

//創建 express 物件，綁定監聽  port , 設定開啟後在 console 中提示
const server = express().listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})
//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })

// status
const status = [
  'sleep',
  'kill',
  'wakeup',
  'vote'
]

//當有 client 連線成功時
wss.on('connection', ws => {

  let currentIndex = 0

  console.log('Client connected')
  ws.send(JSON.stringify({
    event: status[currentIndex],
    data: currentIndex
  }))

  const id = setInterval(()=> {
    const newIndex = currentIndex + 1 > (status.length -1) ? 0 : currentIndex + 1
    ws.send(JSON.stringify({
      event: status[newIndex],
      data: newIndex
    }))
    currentIndex = newIndex
  }, 10 * 1000)

  ws.on('message', data => {
    // 收回來是 Buffer 格式、需轉成字串
    data = data.toString()  
    console.log(Number(data)) // 可在 terminal 看收到的訊息
    currentIndex = Number(data)
    /// 發送消息給client 
  })

  // 當連線關閉
  ws.on('close', () => {
    clearInterval(id)
    console.log('Close connected')
  })
})