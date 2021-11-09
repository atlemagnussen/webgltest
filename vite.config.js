import { defineConfig } from "vite"
import path from "path"
// import vitePluginString from "vite-plugin-string"


const projectRootDir = path.resolve(__dirname)
const appSrcPath = path.resolve(projectRootDir, "src")
const buildOutput = path.resolve(projectRootDir, "dist")

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    resolve: {
        alias: {
            "@app": appSrcPath
        }
    },
    build: {
        outDir: buildOutput,
        sourcemap: true
    }
})
