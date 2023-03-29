import React from "react";
import axios from "axios";

const EventSourcing = () => {
  const [message, setMessage] = React.useState([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const eventSource = new EventSource("http://localhost:5000/connect");
    eventSource.onmessage = function (event) {
      const message = JSON.parse(event.data);
      setMessage((prev) => [...prev, message]);
      console.log(event.data);
    };
  };

  const sendMessage = async () => {
    try {
      await axios.post("http://localhost:5000/new-message", {
        message: value,
        id: Date.now(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ margin: "0 auto" }}>
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
        {message.map((el) => (
          <div
            style={{ border: "1px solid orange" }}
            className="message"
            key={el.id}
          >
            '{"-->"}
            {el.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSourcing;
