import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 相対パス出力にしておくと、GitHub Pages などサブパス配信でも動く（デプロイは別タスク）
  base: './',
})
