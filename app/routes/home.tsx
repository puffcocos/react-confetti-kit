import type { Route } from './+types/home'
import { HomePage } from '~/pages/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Confetti Web' },
    { name: 'description', content: 'canvas-confetti를 활용한 React 컴포넌트' },
  ]
}

export default function Home() {
  return <HomePage />
}
