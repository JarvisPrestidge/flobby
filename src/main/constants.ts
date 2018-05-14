import { join } from "path";
import { log } from "./utils/logging";
import global from "./utils/global";

const PROJECT_ROOT = join(__dirname, "..", "..");


class Constants {

    // Static paths
    public static readonly PROJECT_ROOT = PROJECT_ROOT;
    public static readonly GO_BINARIES = join(PROJECT_ROOT, "bin", "golang");
    public static readonly STATIC_FILES = join(PROJECT_ROOT, "static");

    // Dynamically created path
    public static getAHKBinaryPath () {
        // Generate paths relative the dist ASAR
        const appPath = global.appPath;
        log.info(`[ASAR-PATH]: ${appPath}`);

        const pathComponents = appPath.split("\\");
        pathComponents.pop();
        const resourcePath = pathComponents.join("\\");
        log.info(`[RESOURCE-PATH]: ${resourcePath}`);

        const AHK_BINARIES = join(resourcePath, "ahk");
        log.info(`[BINARY-PATH]: ${AHK_BINARIES}`);

        return AHK_BINARIES;
    }
}

export default Constants;
