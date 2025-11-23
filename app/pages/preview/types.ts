import type { Options as ConfettiOptions } from 'canvas-confetti'

/**
 * 커스텀 프리셋 타입
 */
export interface CustomPreset {
  name: string
  options: ConfettiOptions[]
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
