import * as lasso from "lasso";
import * as path from "path";
import * as browserFS from "browserfs";

const isProduction = !!process.env.NODE_ENV;

lasso.configure({
    outputDir: path.join(__dirname, "static"),
    urlPrefix: "/static",
    resolveCssUrls: true,
    minify: isProduction,
    fingerprintsEnabled: isProduction,
    bundlingEnabled: isProduction,
    require: {
        builtins: {
            fs: browserFS
        }
    },
    plugins: ["lasso-marko", "lasso-require"]
});

const app = path.join(__dirname, "dist", "renderer", "app.js")

lasso.lassoPage({
    pageName: "app",
    dependencies: [
        `require-run: ${app}`
    ]
});
