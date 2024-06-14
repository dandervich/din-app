import type { KeyboardType, KeyType } from "./keyTypes";
import Key from "./key";

function Keyboard(keyboard: KeyboardType) {
    return <div className="keyboard">
        {/* @ts-ignore */}
        {keyboard.keyboard.keys.map((key: KeyType) => { return <Key key={keys} secondary={false} tertiary={false} /> })}
    </div>
}

export default Keyboard