import { PinButton } from "./PinController";
import "./ValveTable.css";

export default function ValveTable({ ws, wsIsOpen, log, setPin, pinNames, pinNormallyOpen }) {
    return <table className="ValveTable">
        <thead><td>Valve name</td><td>Inactive</td><td>Active</td></thead>
        {[...Array(9).keys()].map((idx) =>
            //<PinController name={pinNames[idx]} normallyOpen={pinNormallyOpen[idx]} pin={idx} ws={ws} wsIsOpen={wsIsOpen} key={[idx, log.pinStates[idx]]} setPin={setPin} pinState={log.pinStates[idx]}></PinController>
            <tr>
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
    </table>
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