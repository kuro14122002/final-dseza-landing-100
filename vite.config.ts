import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI library chunks
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-select',
            '@radix-ui/react-accordion',
            '@radix-ui/react-navigation-menu',
          ],
          // Query and state management
          'query-vendor': ['@tanstack/react-query'],
          // Form libraries
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Rich text editor
          'editor-vendor': ['@tinymce/tinymce-react', 'tinymce'],
          // Utils and helpers
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
    // Increase chunk size limit
    chunkSizeWarningLimit: 1000,
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
    ],
  },
  // Enable caching
  cacheDir: '.vite',
}));
