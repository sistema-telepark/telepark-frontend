import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // carga TODAS las vars (incl. PORT, REACT_APP_*)
  return {
    plugins: [react()],
    envPrefix: ['REACT_APP_', 'VITE_'], // D-ENV B
    server: { port: Number(env.PORT) || 3000 }, // D-PORT
    build: {
      outDir: 'dist', // D-BUILD
      target: 'es2020', // D-BUILD-TARGET
    },
  };
});
