export interface INmpItem {
    isDev: boolean;
    command: string;
}

export class NmpItem implements INmpItem {
    constructor(isDev: boolean, command: string) {
        this.isDev = isDev;
        this.command = command;
    }

    isDev: boolean;
    command: string;
}

export interface IConfigItem {
    id: string;
    npmRun: INmpItem;
    importModules: string;
    requiredFunctions: string;
    moduleNodePath: string;
    configText: string;
    replaceFunction: object;
}

export class ConfigItem implements IConfigItem{
    constructor(id: string, isDevCommand: boolean,
                npmRunCommand: string, importModules: string,
                moduleNodePath: string, requiredFunctions: string,
                configText: string, replaceFunction: object) {
        this.id = id;
        this.importModules = importModules;
        this.moduleNodePath = moduleNodePath;
        this.npmRun = new NmpItem(isDevCommand, npmRunCommand);
        this.configText = configText;
        this.replaceFunction = replaceFunction;
        this.requiredFunctions = requiredFunctions;
    }

    id: string;
    importModules: string;
    moduleNodePath: string;
    npmRun: INmpItem;
    configText: string;
    replaceFunction: object;
    requiredFunctions: string;
}
