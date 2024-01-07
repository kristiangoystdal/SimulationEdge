import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist', // Specify the output directory
    assetsDir: 'assets', // Specify the assets directory
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js', // Customize the entry file naming
        chunkFileNames: 'js/[name]-[hash].js', // Customize the chunk file naming
        assetFileNames: 'assets/[name]-[hash].[ext]', // Customize the asset file naming
      },
    },
  },
  assetsInclude: ['**/*.mov']
})
