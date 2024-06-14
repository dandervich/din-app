interface KeyType {
    key: string | number;
    secondary: string;
    tertiary?: string;
}

interface KeyboardType {
    keys: KeyType[];
}

export type { KeyType, KeyboardType };