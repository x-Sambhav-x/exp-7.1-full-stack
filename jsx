import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const getMessage = async () => {
    const res = await axios.get("http://localhost:5000/api/message");
    setMessage(res.data.message);
  };

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:5000/api/send", {
      name: "React User"
    });
    setReply(res.data.reply);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button onClick={getMessage}>GET Message</button>
      <p>{message}</p>

      <button onClick={sendMessage}>POST Message</button>
      <p>{reply}</p>
    </div>
  );
}

export default App;
