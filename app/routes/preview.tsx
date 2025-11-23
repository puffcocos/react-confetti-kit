import type { Route } from './+types/preview'
import { PreviewPage } from '~/pages/preview'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Confetti Preview - 미리보기' },
    { name: 'description', content: 'Confetti 효과를 실시간으로 테스트해보세요' },
  ]
}

export default function Preview() {
  return <PreviewPage />
}
