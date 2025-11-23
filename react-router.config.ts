import type { Config } from '@react-router/dev/config'

export default {
  /**
   * @see https://github.com/remix-run/react-router/issues/13446#issuecomment-2822107203
   */
  basename: '/confetti-editor/',
  ssr: false,
} satisfies Config
