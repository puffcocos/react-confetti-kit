import { useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import type { Options as ConfettiOptions } from 'canvas-confetti'

/**
 * Confetti 컴포넌트의 Props 타입
 */
export interface ConfettiProps {
  /**
   * 자식 요소 (트리거 요소)
   * 클릭 시 confetti 효과가 발생합니다
   */
  children: React.ReactNode

  /**
   * canvas-confetti 커스터마이징 옵션
   * @see https://github.com/catdad/canvas-confetti
   */
  options?: ConfettiOptions

  /**
   * 자동으로 confetti를 실행할지 여부
   * @default false
   */
  autoFire?: boolean

  /**
   * 트리거 요소의 클래스명
   */
  className?: string

  /**
   * confetti 실행 전 콜백 함수
   */
  onBeforeFire?: () => void

  /**
   * confetti 실행 후 콜백 함수
   */
  onAfterFire?: () => void
}

/**
 * canvas-confetti를 활용한 Confetti 컴포넌트
 *
 * @description
 * 클릭 이벤트 또는 자동 실행을 통해 confetti 효과를 발생시키는 컴포넌트입니다.
 * canvas-confetti의 모든 커스터마이징 옵션을 지원합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <Confetti>
 *   <button>클릭하세요!</button>
 * </Confetti>
 *
 * // 커스텀 옵션 사용
 * <Confetti
 *   options={{
 *     particleCount: 100,
 *     spread: 70,
 *     origin: { y: 0.6 }
 *   }}
 * >
 *   <button>축하합니다!</button>
 * </Confetti>
 *
 * // 자동 실행
 * <Confetti autoFire options={{ particleCount: 200 }}>
 *   <div>자동으로 confetti가 실행됩니다</div>
 * </Confetti>
 * ```
 */
export function Confetti({
  children,
  options = {},
  autoFire = false,
  className,
  onBeforeFire,
  onAfterFire,
}: ConfettiProps) {
  const hasAutoFired = useRef(false)

  /**
   * confetti 실행 함수
   */
  const fireConfetti = useCallback(() => {
    onBeforeFire?.()
    confetti(options)
    onAfterFire?.()
  }, [options, onBeforeFire, onAfterFire])

  /**
   * 클릭 핸들러
   */
  const handleClick = useCallback(() => {
    fireConfetti()
  }, [fireConfetti])

  /**
   * 자동 실행 처리
   */
  if (autoFire && !hasAutoFired.current) {
    hasAutoFired.current = true
    // 다음 렌더링 사이클에서 실행
    setTimeout(fireConfetti, 0)
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

/**
 * useConfetti Hook
 *
 * @description
 * confetti를 프로그래밍 방식으로 제어할 수 있는 훅입니다.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const fire = useConfetti();
 *
 *   const handleSuccess = () => {
 *     fire({ particleCount: 100, spread: 70 });
 *   };
 *
 *   return <button onClick={handleSuccess}>성공!</button>;
 * }
 * ```
 */
export function useConfetti() {
  return useCallback((options?: ConfettiOptions) => {
    confetti(options || {})
  }, [])
}

/**
 * 미리 정의된 confetti 프리셋
 */
export const confettiPresets = {
  /**
   * 기본 confetti
   */
  default: {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  } as ConfettiOptions,

  /**
   * 폭발 효과
   */
  explosion: {
    particleCount: 150,
    spread: 180,
    origin: { y: 0.5 },
    startVelocity: 45,
  } as ConfettiOptions,

  /**
   * 별 효과
   */
  stars: {
    particleCount: 50,
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
  } as ConfettiOptions,

  /**
   * 눈 효과
   */
  snow: {
    particleCount: 200,
    spread: 180,
    origin: { y: -0.1 },
    startVelocity: 0,
    ticks: 300,
    gravity: 0.5,
    colors: ['#ffffff'],
  } as ConfettiOptions,

  /**
   * 불꽃놀이 효과
   */
  fireworks: {
    particleCount: 100,
    spread: 360,
    ticks: 100,
    gravity: 1,
    decay: 0.94,
    startVelocity: 30,
  } as ConfettiOptions,

  /**
   * 양쪽에서 발사
   */
  sides: {
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
  } as ConfettiOptions,

  /**
   * 학교 졸업식 스타일
   */
  school: {
    particleCount: 100,
    spread: 26,
    startVelocity: 55,
  } as ConfettiOptions,

  /**
   * 랜덤 방향
   */
  random: {
    particleCount: 100,
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
  } as ConfettiOptions,
} as const
