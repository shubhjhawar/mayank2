import {defineConfig, Plugin} from 'vite';
import react from '@vitejs/plugin-react-swc';
import laravel from 'laravel-vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import replace from '@rollup/plugin-replace';
import * as path from 'path';
import { resolve } from 'path';
// const path = require('path');


// override laravel plugin base option (from absolute to relative to html base tag)
function basePath(): Plugin {
  return {
    name: 'test',
    enforce: 'post',
    config: () => {
      return {
        base: 'https://demo.kvspt.com/',
      };
    },
  };
}

export default defineConfig({
  server: {
    host: 'localhost',
    hmr: {
      host: 'localhost',
    },
  },
  base: '',
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@common': path.resolve(__dirname, 'common/resources/client/'),
      '@app': path.resolve(__dirname, 'resources/client/'),
    },
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
  },
  plugins: [
    tsconfigPaths(),
    react(),
    laravel({
      input: ['resources/client/main.tsx'],
      refresh: false,
    }),
    basePath(),
    replace({
      preventAssignment: true,
      __SENTRY_DEBUG__: false,
      "import { URL } from 'url'": false,
    }),
  ],
});
