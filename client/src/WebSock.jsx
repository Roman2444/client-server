import React from "react";

const WebSock = () => {
  const [messages, setMessages] = React.useState([]);
  const [value, setValue] = React.useState("");

  //   при помощи рефа храним веб-сокет, чтобы он не пропадал от рендера к рендеру
  const socket = React.useRef();

  //стейт для определения есть соединение или нет
  const [connected, setConnected] = React.useState(false);
  const [userName, setUsername] = React.useState("");

  function connect() {
    // создаем веб-сокет, передаем адрес в качестве параметра, указывая протокол WS
    socket.current = new WebSocket("ws://localhost:5000");

    // при подключении ставим состояние в тру, а также отправляем сообщение
    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: "connection",
        userName,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
      console.log("socket open");
    };

    socket.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessages((prev) => [message, ...prev]);
      console.log("socket получено сообщение");
    };

    socket.current.onclose = () => {
      console.log("socket close");
    };

    socket.current.onerror = () => {
      console.log("socket произошла ошибка");
    };
  }

  const sendMessage = async () => {
    const message = {
      userName,
      message: value,
      id: Date.now(),
      event: "message",
    };
    socket.current.send(JSON.stringify(message));
    setValue("");
  };

  //   если нет соединения, то нужно зарегистрироваться
  if (!connected) {
    return (
      <div className="registration">
        <h3>зарегистрируйтесь</h3>
        <input
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="введите имя"
        />
        <button onClick={connect}>войти</button>
      </div>
    );
  }

  return (
    <div>
      <div className="form">
        <input
          onChange={(e) => setValue(e.target.value)}
          type="text"
          value={value}
        />
        <button
          onClick={() => {
            sendMessage();
            setValue("");
          }}
        >
          отравить
        </button>
      </div>
      <div className="messages">
        CHAT:
        {messages.map((el) => (
          <div key={el.id}>
            {el.event === "connection" ? (
              <div style={{ color: "red" }}>
                Пользователь {el.userName} подключился
              </div>
            ) : (
              <div className="message">
                {el.userName}: {el.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebSock;
