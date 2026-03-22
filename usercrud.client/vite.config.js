import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],

    server: {
      port: 3000,
      host: '0.0.0.0', // Важно для Docker, чтобы Vite был доступен снаружи
      strictPort: true,
      proxy: {
        // Все запросы, начинающиеся с /api, пойдут на бэкенд
        '/api': {
          // 'api' — это имя сервиса бэкенда из твоего docker-compose.yml
          target: 'http://api:8080', 
          changeOrigin: true,
          secure: false,
          // Если в .NET контроллерах маршруты НЕ начинаются с /api, 
          // то rewrite удалит /api перед отправкой на бэк
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});