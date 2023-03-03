import {useEffect, useState} from "react";
import {useWS} from "./ReconnectingWebSocket"
import {useProcessor} from "./MessageProcessor"
import './App.css';

// TODO:
// - Implement a model-update opaque interface
// - Async function for sending and waiting for a specific response 

function SubmitField({buttonText="Submit", submit=(_) => {}, children}) {
  let [textValue, setTextValue] = useState("");
  return (
    <form onSubmit={ev => ev.preventDefault()}>
      <p>{children}</p>
      <input onChange={(e) => setTextValue(e.target.value)} value={textValue}></input>
      <input type="submit" onClick={() => {submit(textValue); setTextValue("");}} value={buttonText}></input>
    </form>
  );
}

function PinController({pin=7, ws, children}) {
  const [pinValue, setPinValue] = useState()
  const pinStr = pin.toString().padStart(2, 0);
  return (
    <form onSubmit={ev => ev.preventDefault()}>
      <label>{children || `Set pin ${pinStr}: `}</label>
      <input type="submit" onClick={() => { ws.send(`PDW${pinStr}0`) }} value="LOW"></input>
      <input type="submit" onClick={() => { ws.send(`PDW${pinStr}1`) }} value="HIGH"></input>
      <label></label>
    </form>
  );
}

function App() {
  const WS_URL = "ws://localhost:8000";
  const [log, setLog] = useState("");
  const [err, setErr] = useState("");
  const [fallback, setFallback] = useState("")
  const processor = useProcessor({
    LOG: setLog,
    ERR: setErr,
  }, setFallback);
  //let [mostRecentMessage, setMostRecentMessage] = useState(null);
  
  // Subscribe to websocket connection
  const [ws, wsIsOpen] = useWS(WS_URL, processor);
    
  return (
    <div className="App">
      <header className='App-header'><h1>E&C Control Panel</h1></header>
      <main>
        <p>WebSocket is {wsIsOpen? "open :)" : "closed :("}</p>
        <SubmitField submit={ws? (data) => ws.send(data) : (_) => {}} buttonText="Send">Send raw command</SubmitField>
        <p>LOG: {log}</p>
        <p>ERR: {err}</p>
        <p>Unclassifiable message: {fallback}</p>
        {/*<div><span style={{ display: "inline-block", width: "100px", transform: `scaleX(${parseInt(log) / 100})`, height: "20px", backgroundColor: `rgb(${log}, 0, 0)`, transition: "transform ease-in-out 1s" }}></span></div>*/}
        <hr></hr>
        <button onClick={() => ws.send("POK")}>Poke server (rude)</button>
        <span> -- </span>
        <button onClick={() => ws.send("EXT")}>Remote server shutdown (extremely rude)</button>
        <hr></hr>
        <PinController pin={13} ws={ws}></PinController>
      </main>
    </div>
  );
}

export default App;
