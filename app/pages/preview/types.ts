import type { Options as ConfettiOptions } from 'canvas-confetti'

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
  path: string
  matrix?: number[] // 미리 계산된 transform matrix (성능 최적화용)
}

/**
 * 옵션 정보 타입
 */
export interface OptionInfo {
  label: string
  description: string
  min: number
  max: number
  step?: number
}
