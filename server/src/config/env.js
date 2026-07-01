import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const serverRoot = resolve(currentDir, "..", "..");
const projectRoot = resolve(serverRoot, "..");

dotenv.config({ path: resolve(projectRoot, ".env"), quiet: true });
dotenv.config({ path: resolve(serverRoot, ".env"), quiet: true });
dotenv.config({ quiet: true });
