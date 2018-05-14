import { exec } from "child_process";
import { execFileSync } from "child_process";
import { join } from "path";
import { promisify } from "util";
import { log } from "./logging";

const asyncExec = promisify(exec);

/**
 * Executes a file with admin privileges
 *
 * @param {string} fileName
 * @returns {Promise<void>}
 */
export const execAsyncBinaryAsAdmin = async (directory: string, fileName: string): Promise<void> => {

    const binaryPath = join(directory, `${fileName}.exe`);

    log.info(`[EXEC-ASYNC-BINARY-ADMIN]: path: ${binaryPath}`);

    const powershellCmd = `powershell -command "Start-Process ${binaryPath} -Verb runAs"`;

    try {
        await asyncExec(powershellCmd);
    } catch (err) {
        log.error(`[EXEC-ASYNC-BINARY-ADMIN]: failed: ${err.message}`, err);
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

    log.info(`[EXEC-SYNC-BINARY]: path: ${binaryPath}`);

    let result;
    try {
        result = execFileSync(binaryPath, args).toString();
    } catch (err) {
        log.error(`[EXEC-SYNC-BINARY]: failed: ${err.message}`, err);
    }

    if (!result) {
        result = "";
    }

    return result;
};
