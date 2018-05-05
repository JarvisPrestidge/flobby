import { exec } from "shelljs";
import { join } from "path";
import C from "../src/main/constants";

const electronPath = join(C.PROJECT_ROOT, "node_modules", ".bin", "electron");

const args = process.argv.slice(2).join(" ");


exec(`electronPath ${args}`, {async: true})("node");
