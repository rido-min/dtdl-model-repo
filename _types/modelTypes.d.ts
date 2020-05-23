

export interface packagejson {
    models: string[],
    version: string
}

export interface modelInfo {
    id: string,
    version: string,
    pkg?: string,
    dtdlModel: object
}

export interface packageInfo {
    name: string,
    version: string
}
