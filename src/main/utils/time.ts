/**
 * Sleep the main process for a given number of ms
 *
 * @param {number} ms
 * @returns
 */
export const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
