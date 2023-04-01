import "./PinController.css"

function pinDigitalWrite(pin, pinOn) {
    const pinStr = (pin + 1).toString().padStart(1, 0);
    return `PDW ${pinOn ? "1" : "0"} ${pinStr}`;
}

export function PinButton({ ws, wsIsOpen, name, pin, pinState, value = 0, setPin }) {
    let stateClass = "";
    if (!name) {
        name = value ? "ON" : "OFF"
    }
    if (pinState >= 0) {
        if (pinState % 2 === value) {
            stateClass = "active";
        } else if (pinState > 1) {
            stateClass = "pending";
        }
    } else {
        stateClass = "no-data";
    }

    return <button className={"PinController__btn" + (stateClass ? " PinController__btn--" + stateClass : "")} onClick={() => {
        if (!wsIsOpen) return;
        if (!stateClass) setPin(pin, 3 - value);
        else if (stateClass === "active") setPin(pin, value);
        ws.send(pinDigitalWrite(pin, value));
    }}>{name}</button>
}

export default function PinController({
    ws, wsIsOpen, children, name = null, normallyOpen = false,
    pin = 7, pinState = -1, setPin = (() => { }) }) {
    let offState = "";
    let onState = "";
    if (pinState >= 0) {
        if (pinState === 0) {
            offState = "active";
        } else if (pinState === 1) {
            onState = "active";
        } else if (pinState === 2) {
            offState = "active";
            onState = "pending";
        } else if (pinState === 3) {
            onState = "active";
            offState = "pending";
        }
    }
    return (
        <form onSubmit={ev => ev.preventDefault()} className={
            "PinController" +
            (wsIsOpen ? " PinController--ws-open" : " PinController--ws-closed")
        }>
            {/* OFF button */}
            <input
                type="submit"
                onClick={() => {
                    if (!wsIsOpen) return;
                    if (pinState === 1) setPin(pin, 3);
                    else if (pinState === 2) setPin(pin, 0);
                    ws.send(pinDigitalWrite(pin, false));
                }}
                value={normallyOpen ? "OPEN" : "CLOSED"}
                className={"PinController__btn PinController__btn--off" + (offState ? " PinController__btn--" + offState : "")}
            ></input>
            {/* ON button */}
            <input
                type="submit"
                onClick={() => {
                    if (!wsIsOpen) return;
                    if (pinState === 0) setPin(pin, 2);
                    else if (pinState === 3) setPin(pin, 1);
                    ws.send(pinDigitalWrite(pin, true));
                }}
                value={normallyOpen ? "CLOSED" : "OPEN"}
                className={"PinController__btn PinController__btn--on" + (onState ? " PinController__btn--" + onState : "")}
            ></input>

            <label className="PinController__label">{children || name ? name : `Set pin ${pin}`}</label>
            <label></label>
        </form>
    );
}