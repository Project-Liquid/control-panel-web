import { useState, useReducer } from "react";
import { useWS } from "./ReconnectingWebSocket"
import { useProcessor } from "./MessageProcessor"
import './App.css';
import ValveTable from "./ValveTable";

// TODO:
// - Implement a model-update opaque interface
// - Async function for sending and waiting for a specific response 

const pinNames = [
  "1: N2O Pressurant Line",
  "2: IPA Pressurant Line",
  "3: N2O Run Valve",
  "4: IPA Run Valve",
  "5: N2O Vent Valve",
  "6: IPA Vent Valve",
  "7: Pneumatics Air Supply",
  "8: Pneumatics Line Vent Valve",
  "9: Purge Valve",
]

const pinNormallyOpen = [
  false,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
]

const sensorNames = [
  "N2O Inlet", "IPA Inlet", "N2O Tank", "IPA Tank", "N2 Inlet"
]

function SubmitField({ buttonText = "Submit", submit = (_) => { }, children }) {
  let [textValue, setTextValue] = useState("");
  return (
    <form onSubmit={ev => ev.preventDefault()}>
      <p>{children}</p>
      <input onChange={(e) => setTextValue(e.target.value)} value={textValue}></input>
      <input type="submit" onClick={() => { submit(textValue); setTextValue(""); }} value={buttonText}></input>
    </form>
  );
}

// 0,0,0,0,0,0,0,0,0,15,0,15,0,18,0,14,0,14,0 
function useCSVLog() {
  const [log, setLog] = useState({
    // pinStates:
    // * 0: off
    // * 1: on
    // * 2: off, waiting to turn on
    // * 3: on, waiting to turn off
    pinStates: [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    sensorData: [{ p: 0, t: 0 }, { p: 0, t: 0 }, { p: 0, t: 0 }, { p: 0, t: 0 }, { p: 0, t: 0 }]
  });
  function fromLogString(logString) {
    let newLog = JSON.parse(JSON.stringify(log));
    let list = logString.split(",").slice(1);
    list.forEach((element, idx) => {
      if (idx < 9) {
        newLog.pinStates[idx] = parseInt(element);
      } else {
        if ((idx - 9) % 2 === 0) {
          newLog.sensorData[(idx - 9) / 2].t = parseInt(element);
        } else {
          newLog.sensorData[(idx - 10) / 2].p = parseInt(element);
        }
      }
    });
    setLog(newLog);
  }
  function setPin(pin, value) {
    let newLog = JSON.parse(JSON.stringify(log));
    newLog.pinStates[pin] = value;
    setLog(newLog);
  }
  return [log, fromLogString, setPin];
}

function serverDataReducer(oldData, dataString) {
  let newData;
  if (dataString === "REC_ON") {
    newData = {
      ...oldData,
      recording: true,
    };
  } else if (dataString === "REC_OFF") {
    newData = {
      ...oldData,
      recording: false,
      recfile: null,
    };
  } else {
    const match = dataString.match(/REC_FILE=(.+)/);
    if (match[1]) {
      newData = {
        ...oldData,
        recfile: match[1],
      };
    }
  }
  return newData;
}

function App() {
  const WS_URL = "ws://localhost:8000";
  const [serverData, handleServerData] = useReducer(serverDataReducer, {
    recording: false, recfile: null
  });
  const [log, setLog, setPin] = useCSVLog();
  const [err, setErr] = useState("");
  const [fallback, setFallback] = useState("")
  const processor = useProcessor({
    LOG: setLog,
    ERR: setErr,
    SER: handleServerData,
  }, setFallback);
  //let [mostRecentMessage, setMostRecentMessage] = useState(null);

  // Subscribe to websocket connection
  const [ws, wsIsOpen] = useWS(WS_URL, processor);

  return (
    <div className="App">
      <header className='App__header'><h1>E&C Control Panel</h1><p>Server status: <span style={{ color: wsIsOpen ? "yellowgreen" : "red" }}>{wsIsOpen ? "CONNECTED" : "DISCONNECTED"}</span></p></header>
      <main className="App__main">
        <ValveTable ws={ws} wsIsOpen={wsIsOpen} log={log} setPin={setPin} pinNames={pinNames} pinNormallyOpen={pinNormallyOpen} serverData={serverData}></ValveTable>
        <hr></hr>
        <div className={"App__sensors"}>
          {log.sensorData.map((el, idx) =>
            <span key={idx}>
              <p>{sensorNames[idx]}</p>
              <h3 style={{ color: `rgb(${el.p * 255 / 60}, 0, ${255 - el.p * 255 / 60})` }}>{el.p} psi</h3>
              <p>{el.t} °C</p>
            </span>
          )}
        </div>
        <hr></hr>
        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "35em", width: "90vw" }}>
          <SubmitField submit={ws ? (data) => ws.send(data) : (_) => { }} buttonText="Send">Send raw command</SubmitField>
          <div style={{ paddingLeft: "5em" }}>
            <strong>ERR <button className="linkbtn" onClick={() => { setErr(""); }}>(clear)</button>:</strong>
            <p>{err || "(none)"}</p>
            <strong>Unclassifiable message:</strong>
            <p>{fallback || "(none)"}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
