import { defineConfig } from 'vite'
import path from 'path'
import preact from '@preact/preset-vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    build: {
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'src/backend.ts'),
            formats: ['iife'],
            name: 'backend',
            fileName: 'backend',
        },
    },
})
