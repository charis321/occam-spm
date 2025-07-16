import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'



// https://vite.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) =>{

  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    base: env.VITE_BASE,
  }
})
