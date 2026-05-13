import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'public/dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:          resolve(__dirname, 'public/index.html'),
        cart:          resolve(__dirname, 'public/cart.html'),
        login:         resolve(__dirname, 'public/login.html'),
        signup:        resolve(__dirname, 'public/signup.html'),
        orders:        resolve(__dirname, 'public/orders.html'),
        account:       resolve(__dirname, 'public/account.html'),
        resetPassword: resolve(__dirname, 'public/reset-password.html'),
        about:         resolve(__dirname, 'public/about.html'),
        faq:           resolve(__dirname, 'public/faq.html'),
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true,
      }
    }
  }
})
