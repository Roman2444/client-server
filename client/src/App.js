import React from "react";
import Longpulling from "./Longpulling";
import "./App.css";
import "./index.css";
import EventSourcing from "./EventSourcing";
import WebSock from "./WebSock";

const App = () => {
  return (
    <div className="App">
      <WebSock />
    </div>
  );
};

export default App;
