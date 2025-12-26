import type { ConfettiOptions } from '~/shared/confetti/types'

/**
 * 커스텀 프리셋 타입
 */
export interface CustomPreset {
  name: string
  options: ConfettiOptions[]
  duration?: number // 애니메이션 지속 시간 (밀리초)
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
