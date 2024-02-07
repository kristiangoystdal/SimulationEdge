import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createFilter } from '@rollup/pluginutils'; // Import createFilter from @rollup/pluginutils
import { readFileSync } from 'fs';

export default defineConfig({
  plugins: [
    vue(),
    {
      // Adjust the configuration of the raw plugin
      name: 'raw',
      transform(code, id) {
        if (id.endsWith('.raw')) {
          const contents = readFileSync(id, 'utf-8');
          return {
            code: `export default ${JSON.stringify(contents)};`,
            map: null,
          };
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  assetsInclude: ['**/*.mov']
});
