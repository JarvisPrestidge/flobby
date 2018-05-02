import C from "../constants";
import { exec } from "child_process";
import { execFileSync } from "child_process";
import { join } from "path";
import { promisify } from "util";

const asyncExec = promisify(exec);

/**
 * Executes an AHK binary with admin privileges
 *
 * @param {string} fileName
 * @returns {Promise<void>}
 */
export const execAsAdminAHK = async (fileName: string): Promise<void> => {

    const binaryPath = join(C.AHK_BINARIES, `${fileName}.exe`);

    const powershellCmd = `powershell -command "Start-Process ${binaryPath} -Verb runAs"`;

    const { stderr } = await asyncExec(powershellCmd);

    if (stderr) {
        console.error(stderr);
    }
};

/**
 * Executes a Golang binary
 *
 * @param {string} fileName
 * @returns {string}
 */
export const execSyncGoBinary = (fileName: string, ...args: string[]): string => {

    const binaryPath = join(C.GO_BINARIES, `${fileName}.exe`);

    console.log(binaryPath);

    const result = execFileSync(binaryPath, args).toString();

    return result;
};
