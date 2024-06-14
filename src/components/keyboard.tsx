import type { KeyboardType, KeyType } from "./keyTypes";
import Key from "./key";

interface Props {
    keyboard: KeyboardType;
    OnClickFunc: (key: KeyType, secondary: boolean, tertiary: boolean) => Promise<void>;
}

function Keyboard({ keyboard, OnClickFunc }: Props) {
    return <div className="keyboard">
        {keyboard.keys.map((key: KeyType) => {
            return <Key OnClickFunc={OnClickFunc} keyVal={key} secondary={false} tertiary={false} />
        })}
    </div>
}

export default Keyboard