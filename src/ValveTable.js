import { PinButton } from "./PinController";
import "./ValveTable.css";

export default function ValveTable({ ws, wsIsOpen, log, setPin, pinNames, pinNormallyOpen, serverData }) {
    return <div className="ValveTable">
        <table className="ValveTable__table">
            <thead><tr>
                <th>Valve name</th><th>Inactive</th><th>Active</th>
            </tr></thead>
            <tbody>
                {[...Array(9).keys()].map((idx) =>
                    //<PinController name={pinNames[idx]} normallyOpen={pinNormallyOpen[idx]} pin={idx} ws={ws} wsIsOpen={wsIsOpen} key={[idx, log.pinStates[idx]]} setPin={setPin} pinState={log.pinStates[idx]}></PinController>
                    <tr key={idx}>
                        <td>
                            {pinNames[idx]}
                        </td>
                        <td>
                            <PinButton ws={ws} wsIsOpen={wsIsOpen} name={pinNormallyOpen[idx] ? "OPEN" : "CLOSED"} pin={idx} pinState={log.pinStates[idx]} value={0} setPin={setPin}></PinButton>
                        </td>
                        <td>
                            <PinButton ws={ws} wsIsOpen={wsIsOpen} name={pinNormallyOpen[idx] ? "CLOSED" : "OPEN"} pin={idx} pinState={log.pinStates[idx]} value={1} setPin={setPin}></PinButton>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
        <table className="ValveTable__table">
            <thead><tr>
                <th><strong>Commands</strong></th>
            </tr></thead>
            <tbody>
                <tr>
                    <td>Vent all except N2 Tank</td>
                    <td><button className="PinController__btn" onClick={() => {
                        // Ensure N2 air supply closed
                        ws.send("PDW 1 7");
                        // Then depower all other valves
                        ws.send("PDW 0 1 2 3 4 5 6 8 9");
                    }}>VENT</button></td>
                </tr>
                <tr>
                    <td>Close Outlets</td>
                    <td><button className="PinController__btn" onClick={() => {
                        ws.send("PDW 1 3 4 5 6 8");
                    }}>CLOSE</button></td>
                </tr>
                <tr>
                    <td>
                        <div>Recording</div>
                        <div style={{ fontSize: "0.5em", textAlign: "left" }}>
                            {serverData.recfile || "(not recording)"}
                        </div>
                    </td>
                    <td><button className={"PinController__btn" + (serverData.recording ? " PinController__btn--active" : "")} onClick={() => {
                        ws.send(serverData.recording ? "SEREND_REC" : "SERNEW_REC");
                    }}>{serverData.recording ? "STOP" : "START"}</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    //return <div className="ValveTable">
    //    <div>{[...Array(9).keys()].map((idx) =>
    //        <p>{pinNames[idx]}</p>
    //    )}</div>
    //    <div>{[...Array(9).keys()].map((idx) =>
    //        <PinButton ws={ws} wsIsOpen={wsIsOpen} name="CLOSED" pin={idx} pinState={log.pinStates[idx]} value={0} setPin={setPin}></PinButton>
    //    )}</div>
    //    <div>{[...Array(9).keys()].map((idx) =>
    //        <PinButton ws={ws} wsIsOpen={wsIsOpen} name="OPEN" pin={idx} pinState={log.pinStates[idx]} value={1} setPin={setPin}></PinButton>
    //    )}</div>
    //</div>
}