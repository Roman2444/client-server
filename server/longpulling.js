const express = require("express");
const cors = require("cors");
const events = require("events"); //способ управления событиями в nod.js

const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express();

app.use(cors()); //подключаем мидлвэ корс
app.use(express.json()); // парсер json

app.get("/get-messages", (req, res) => {
  // оповещаем всех пользователей о том что сообщение было отправлено
  // регистрируем событие с названием newMessage
  // т.е. всем пользователям у которых висит подключение возвращаем это сообщение
  emitter.once("newMessage", (message) => {
    res.json(message);
  });
});

app.post("/new-message", (req, res) => {
  const message = req.body; //достаем сообщение из тела запроса

  emitter.emit("newMessage", message);
  //вызываем событие эмит и передаем сообщение в эмитер, для последующей передачи в колбэк

  res.status(200); //сообщаем, что сообщение доставлено
});

app.listen(PORT, () => console.log(`....server started on port ${PORT}`));

//пользователь направляет get-запрос, но сразу не возвращаем ему ответ, мы подписываемся на событие и ждем.
//Затем когда какой-то друго участник чата отправил сообщение. Мы это событие вызываем после чего всем участникам чата направляется ответ.
//
