import { defineConfig } from 'vite'
import path from 'path'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
    // plugins: [preact({ prefreshEnabled: false })],

    build: {
        assetsInlineLimit: 0,
        lib: {
            entry: path.resolve(__dirname, './src/main.tsx'),
            name: 'main',
            fileName: 'main',
            formats: ['iife'],
        },
    },
})
