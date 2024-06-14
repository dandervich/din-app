import type { KeyType } from "./keyTypes";


interface Props {
    keyVal: KeyType;
    secondary: boolean;
    tertiary: boolean;
    OnClickFunc: (key: KeyType, secondary: boolean, tertiary: boolean) => Promise<void>;
}

function Key(props: Props) {
    let { keyVal, secondary, tertiary, OnClickFunc } = props;
    return <button onClick={() => { OnClickFunc(keyVal, secondary, tertiary) }} className="key">{secondary ? keyVal.secondary : tertiary ? keyVal?.tertiary : keyVal.key}</button>
}


export default Key