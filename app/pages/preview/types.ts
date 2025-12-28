import type { ConfettiOptions } from '~/shared/confetti/types'

/**
 * 에디터 전용 ConfettiOptions 확장 타입
 *
 * @description
 * 에디터에서 UI 동기화 및 코드 생성을 위해 필요한 메타데이터를 포함합니다.
 * useConfetti 훅은 이 속성들을 사용하지 않으며, 순수하게 shapes 배열만 확인합니다.
 */
export interface EditorConfettiOptions extends ConfettiOptions {
  // 커스텀 파티클 사용 여부 (UI 토글 상태)
  _useCustomShapes?: boolean
  // 커스텀 파티클 메타데이터 (코드 생성 및 프리셋 저장용)
  _selectedCustomShapes?: CustomShapePreset[]
}

/**
 * 커스텀 프리셋 타입
 */
export interface CustomPreset {
  name: string
  options: EditorConfettiOptions[]
  duration?: number // 애니메이션 지속 시간 (밀리초)
  shapeMeta?: CustomShapePreset[] // 코드 미리보기용 shape 메타데이터
}

/**
 * 커스텀 색상 프리셋 타입
 */
export interface CustomColorPreset {
  name: string
  colors: string[]
}

/**
 * 커스텀 파티클 프리셋 타입
 */
export interface CustomShapePreset {
  name: string
  type: 'path' | 'svg' // 'path' for d path, 'svg' for full SVG markup
  path?: string // SVG d path (type이 'path'일 때)
  svg?: string // Full SVG markup (type이 'svg'일 때)
  matrix?: number[] // 미리 계산된 transform matrix (성능 최적화용)
  scalar?: number // SVG 크기 조절 (type이 'svg'일 때)
}

/**
 * 옵션 정보 타입
 */
export type OptionInfo =
  | {
      label: string
      description: string
      min: number
      max: number
      step?: number
      type?: never
    }
  | {
      label: string
      description: string
      type: 'boolean'
      min?: never
      max?: never
      step?: never
    }
