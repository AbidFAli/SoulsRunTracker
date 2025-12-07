// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unnullified<T> = T extends Record<string | number | symbol, any> ? 
{[Property in keyof T]: Unnullified<T[Property]>} : Exclude<T, null>;