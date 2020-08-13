type packagejson = {
    models: string[],
    version: string
}

type modelInfo = {
    id: string,
    version: string,
    pkg: string,
    fileName: string,
    dtdlModel: object
}

type packageInfo = {
    name: string,
    version: string
}
