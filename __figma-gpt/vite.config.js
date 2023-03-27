import { defineConfig } from 'vite'
import path from 'path'
import preact from '@preact/preset-vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        preact({ prefreshEnabled: false }),
        viteSingleFile(), //
    ],
    build: {
        emptyOutDir: false,
        target: 'esnext',
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        brotliSize: false,
        rollupOptions: {
            inlineDynamicImports: false,
        },
    },
})
