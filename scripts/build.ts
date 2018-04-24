require("marko/node-require").install();

import * as lasso from "lasso";
import * as path from "path";
import * as fs from "fs";

const isProduction = !!process.env.NODE_ENV;

// Project root path
const projectRoot = path.join(__dirname, "..");

const outputDir = path.join(projectRoot, "static");
const templatePath = path.join(projectRoot, "dist", "renderer", "app.marko");

// Configure bundler
lasso.configure({
    outputDir,
    urlPrefix: "./",
    minify: isProduction,
    fingerprintsEnabled: isProduction,
    bundlingEnabled: isProduction,
    plugins: ["lasso-marko"],
    require: {
        builtins: {
            fs: require.resolve("browserfs")
        }
    }
});

// Crate static folder
fs.mkdirSync(outputDir);

// Require the root marko template
const template = require(templatePath);

// Render the template to an output HTML file
template.render({}, fs.createWriteStream(path.join(outputDir, "index.html"), { encoding: "utf8" }));
