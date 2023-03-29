const express = require("express");
const cors = require("cors");
const events = require("events"); //способ управления событиями в nod.js

const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express();

app.use(cors()); //подключаем мидлвэ корс
app.use(express.json()); // парсер json

app.get("/connect", (req, res) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  emitter.on("newMessage", (message) => {
    res.write(`data: ${JSON.stringify(message)} \n\n`);
    
  });
});

app.post("/new-message", (req, res) => {
  const message = req.body; //достаем сообщение из тела запроса

  emitter.emit("newMessage", message);
  //вызываем событие эмит и передаем сообщение в эмитер, для последующей передачи в колбэк

  res.status(200); //сообщаем, что сообщение доставлено
});

app.listen(PORT, () => console.log(`....server started on port ${PORT}`));

 