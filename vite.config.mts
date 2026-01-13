import devServer from '@hono/vite-dev-server';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({ jsxImportSource: '@emotion/react' }),
    devServer({
      entry: './server.mjs',
      exclude: [/^(?!\/api).*/],
    }),
  ],
});
