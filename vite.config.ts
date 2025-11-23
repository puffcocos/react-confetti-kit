import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  /**
   * @see https://github.com/remix-run/react-router/issues/13446#issuecomment-2822107203
   */
  base: '/confetti-editor/',
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
})
