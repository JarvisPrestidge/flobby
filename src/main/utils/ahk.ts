import { promisify } from "util";
import { exec } from "child_process";

const asyncExec = promisify(exec);

/**
 * Executes an AHK binary with admin privileges
 *
 * @param {string} fileName
 * @returns {Promise<void>}
 */
export const execAsAdmin = async (fileName: string): Promise<void> => {

    const binaryPath = `Start-Process D:\\projects\\typescript\\electro\\ahk\\${fileName}.exe`

    const powershellCmd = `powershell -command "${binaryPath} -Verb runAs"`;

    const { stderr } = await asyncExec(powershellCmd);

    if (stderr) {
        console.error(stderr);
    }
};
