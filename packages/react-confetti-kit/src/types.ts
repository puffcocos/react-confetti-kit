/**
 * canvas-confetti 타입 re-export
 *
 * @description
 * canvas-confetti 라이브러리에서 제공하는 모든 타입을 re-export합니다.
 * 사용자는 이 파일에서 필요한 타입을 import하여 사용할 수 있습니다.
 *
 * @example
 * ```tsx
 * import type { ConfettiOptions, Shape } from '~/components/types';
 *
 * const options: ConfettiOptions = {
 *   particleCount: 100,
 *   spread: 70
 * };
 * ```
 */

// 로컬 confetti import
import type { Shape } from './vendors/canvas-confetti/confetti'

// 로컬 canvas-confetti의 기본 타입
import type { Options as BaseConfettiOptions } from './vendors/canvas-confetti/confetti'

// canvas-confetti의 나머지 타입들 re-export
export type { Shape, CreateTypes, GlobalOptions, Origin } from './vendors/canvas-confetti/confetti'

// 새로운 실험적 옵션들을 포함한 확장 타입
export interface ConfettiOptions extends Omit<BaseConfettiOptions, 'shapes'> {
  tiltRange?: [number, number]
  tiltSpeed?: [number, number]
  wobbleRange?: [number, number]
  wobbleSpeed?: [number, number]
  randomRotationDirection?: boolean

  // 평면 회전 (z축 회전)
  rotation?: number // 초기 회전 각도 (degrees)
  rotationSpeed?: [number, number] // 회전 속도 범위 (degrees per frame)

  // shapes 속성 재정의 - Promise<Shape>도 허용
  shapes?: Array<Shape | Promise<Shape> | string>
}

/**
 * Confetti Frame 타입
 * fire 호출을 포함하는 함수와 지속 시간을 정의합니다.
 */
export interface ConfettiFrame {
  /**
   * confetti fire 함수를 받아서 실행할 로직
   * @param fire - confetti 발사 함수 (ConfettiOptions 또는 배열을 받음)
   */
  execute: (fire: (options?: ConfettiOptions | ConfettiOptions[]) => Promise<void>) => void
  /**
   * 프레임 실행 지속 시간 (밀리초)
   */
  duration: number
}

/**
 * Confetti 프리셋 타입
 * 기존 배열 방식 또는 프레임 방식을 모두 지원합니다.
 */
export type ConfettiPreset = ConfettiOptions[] | ConfettiFrame
