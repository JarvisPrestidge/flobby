import { join } from "path";

const PROJECT_ROOT = join(__dirname, "..", "..");

class Constants {
    public static readonly PROJECT_ROOT = PROJECT_ROOT;
    public static readonly GO_BINARIES = join(PROJECT_ROOT, "bin", "golang");
    public static readonly AHK_BINARIES = join(PROJECT_ROOT, "bin", "ahk");
    public static readonly STATIC_FILES = join(PROJECT_ROOT, "static");
}

export default Constants;
