const ws = require("ws");
//импортируем пакет ws

// создаем ws server
const wss = new ws.Server(
  {
    port: 5000,
  },
  () => console.log("Server started on 5000")
);

// подписываемся на событие подключение
// на каждое подключение вешаем слушатель, чтобы получать сообщения
wss.on("connection", function connection(ws) {
  ws.on("message", function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case "message":
        broadcastMessage(message);
        break;
      case "connection":
        // можно добавить свою логику
        broadcastMessage(message);
        break;
    }
  });
});
// на каждое событие типа "connection" или "message" мы делаем рассылку всем подключенным при помощи
// функции broadcastMessage, где через forEach перебираем всех клиентов
// т.к. каждый клиент является веб-сокетом то рассылаем при помощи client.send

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}
