import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'react-turnstile',
            fileName: (format) => `index.${format}.js`,
            // formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['react', 'react-dom'], // Mark React as external
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
        sourcemap: false,
        emptyOutDir: true
    },
    plugins: [
        react(),
        dts({
            insertTypesEntry: true, // Ensure type declarations are bundled
        }),
    ],
});
