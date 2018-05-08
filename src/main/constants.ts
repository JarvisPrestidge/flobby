import { join } from "path";
import { app } from "electron";
import { log } from "./utils/logging";


const PROJECT_ROOT = join(__dirname, "..", "..");

// Generate paths relative the dist ASAR
const appPath = app.getAppPath();
log.info(`[ASAR-PATH]: ${appPath}`);

const pathComponents = appPath.split("\\");
pathComponents.pop();
const resourcePath = pathComponents.join("\\");
log.info(`[RESOURCE-PATH]: ${resourcePath}`);

const binaryPath = join(resourcePath, "bin");
log.info(`[BINARY-PATH]: ${binaryPath}`);

const GO_BINARIES = join(binaryPath, "golang");
const AHK_BINARIES = join(binaryPath, "ahk");


// // Paths relative to project root
// GO_BINARIES = join(PROJECT_ROOT, "bin", "golang");
// AHK_BINARIES = join(PROJECT_ROOT, "bin", "ahk");

class Constants {
    public static readonly PROJECT_ROOT = PROJECT_ROOT;
    public static readonly GO_BINARIES = GO_BINARIES;
    public static readonly AHK_BINARIES = AHK_BINARIES;
    public static readonly STATIC_FILES = join(PROJECT_ROOT, "static");
}

export default Constants;
