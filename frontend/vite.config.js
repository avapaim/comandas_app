import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // Configuração do Proxy Vite para evitar problemas de SSL/TLS
    server: {
      proxy: {
        '/api': {
          // endereço da API - lido exclusivamente do .env
          target: env.VITE_PROXY_TARGET,

          // muda o host para o target
          changeOrigin: true,

          // ignora ou não a verificação SSL/TLS - lido exclusivamente do .env
          secure: env.VITE_PROXY_SECURE === 'true', // converte string para boolean

          // remove o prefixo /api antes de enviar para o backend
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});