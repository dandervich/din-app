import type { KeyboardType, KeyType } from "./keyTypes";
import Key from "./key";

interface Props {
    keyboard: KeyboardType;
    OnClickFunc: (key: KeyType, secondary: boolean, tertiary: boolean) => Promise<void>;
    secondary: boolean;
}

function Keyboard({ keyboard, OnClickFunc, secondary }: Props) {
    return <div className="keyboard">
        {keyboard.keys.map((key: KeyType) => {
            if (key.key == "BR")
                return <br />
            return <Key OnClickFunc={OnClickFunc} keyVal={key} secondary={secondary} tertiary={false} />
        })}
    </div>
}

export default Keyboard