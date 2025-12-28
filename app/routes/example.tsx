import type { Route } from './+types/example'
import { ExamplePage } from '~/pages/example'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Confetti Editor - 예제 테스트' },
    { name: 'description', content: '복사한 코드를 직접 테스트해보세요' },
  ]
}

export default function Example() {
  return <ExamplePage />
}
