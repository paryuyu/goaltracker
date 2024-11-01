import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from "path"

export default defineConfig({
    plugins: [svelte({
        configFile: 'svelte.config.js'
    })],
    resolve: {
        alias: {
            $lib: path.resolve("./src/lib"),
        },
    },
    base: '/', // 서브디렉토리 경로
})