import { exec } from "child_process";
import { execFileSync } from "child_process";
import { join } from "path";
import { promisify } from "util";

const asyncExec = promisify(exec);

/**
 * Executes a file with admin privileges
 *
 * @param {string} fileName
 * @returns {Promise<void>}
 */
export const execAsyncBinaryAsAdmin = async (directory: string, fileName: string): Promise<void> => {

    const binaryPath = join(directory, `${fileName}.exe`);

    const powershellCmd = `powershell -command "Start-Process ${binaryPath} -Verb runAs"`;

    const { stderr } = await asyncExec(powershellCmd);

    if (stderr) {
        console.error(stderr);
    }
};

/**
 * Executes a binary
 *
 * @param {string} fileName
 * @returns {string}
 */
export const execSyncBinary = (directory: string, binary: string, ...args: string[]): string => {

    const binaryPath = join(directory, `${binary}.exe`);

    console.log(binaryPath);

    const result = execFileSync(binaryPath, args).toString();

    return result;
};
