import type { KeyType } from "./keyTypes";



function Key(key: KeyType, secondary: boolean, tertiary: boolean) {
    console.log(key)
    console.log(secondary)
    console.log(tertiary)
    return <button className="key">{secondary ? key.secondary : tertiary ? key?.tertiary : key.key}</button>
}


export default Key