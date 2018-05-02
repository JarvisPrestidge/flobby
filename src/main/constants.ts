import { join } from "path";


class Constants {
    public static readonly GO_BINARIES = join(__dirname, "..", "..", "golang");
    public static readonly AHK_BINARIES = join(__dirname, "..", "..", "ahk");
    public static readonly STATIC_FILES = join(__dirname, "..", "..", "static");
}

export default Constants;
