import { useCallback, useRef } from 'react'
import confetti from './lib/canvas-confetti/confetti'
import type { ConfettiOptions, Shape, CreateTypes, ConfettiFrame } from './types'

interface ShapeFromPathOptions {
  path: string
  matrix?: number[]
}

/**
 * useConfetti Hook
 *
 * @description
 * confetti를 프로그래밍 방식으로 제어할 수 있는 훅입니다.
 * 단일 옵션 또는 배열 형태로 제공 가능하며, 배열인 경우 순차적으로 모든 효과가 실행됩니다.
 * createShape 함수를 통해 SVG Path 기반 커스텀 도형을 생성할 수 있습니다.
 * setConfettiCanvasRef를 통해 특정 canvas 요소에서만 confetti를 렌더링할 수 있습니다.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { fire, createShape, setConfettiCanvasRef } = useConfetti();
 *
 *   const handleSuccess = () => {
 *     // 단일 효과
 *     fire({ particleCount: 100, spread: 70 });
 *
 *     // 여러 효과 (배열)
 *     fire([
 *       { particleCount: 50, origin: { x: 0 } },
 *       { particleCount: 50, origin: { x: 1 } }
 *     ]);
 *
 *     // 커스텀 도형 사용
 *     const heart = createShape({ path: 'M5 2 C5 0.5 6 0...' });
 *     fire({ shapes: [heart], particleCount: 50 });
 *   };
 *
 *   return (
 *     <>
 *       <canvas ref={setConfettiCanvasRef} />
 *       <button onClick={handleSuccess}>성공!</button>
 *     </>
 *   );
 * }
 * ```
 */
export function useConfetti() {
  const customConfettiRef = useRef<CreateTypes | null>(null)

  // Canvas ref setter
  const setConfettiCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      customConfettiRef.current = confetti.create(canvas, { resize: true })
    } else {
      customConfettiRef.current = null
    }
  }, [])

  const fire = useCallback((options?: ConfettiOptions | ConfettiOptions[]) => {
    // 커스텀 canvas가 설정되어 있으면 해당 canvas 사용, 아니면 기본 confetti 사용
    const confettiFn = customConfettiRef.current || confetti

    if (!options) {
      confettiFn({})
      return
    }

    // 배열인 경우 모든 효과를 순차적으로 실행
    if (Array.isArray(options)) {
      options.forEach((option) => confettiFn(option))
    } else {
      confettiFn(options)
    }
  }, [])

  const createShape = useCallback((options: ShapeFromPathOptions): Shape => {
    if (options.matrix) {
      // 배열을 DOMMatrix로 변환
      const matrix = new DOMMatrix(options.matrix)
      return confetti.shapeFromPath({ path: options.path, matrix })
    }
    return confetti.shapeFromPath({ path: options.path })
  }, [])

  /**
   * 프레임 기반으로 confetti를 실행합니다.
   * requestAnimationFrame을 사용하여 지정된 시간 동안 execute 함수를 반복 실행합니다.
   *
   * @param frame - 실행할 프레임 정의 (execute 함수와 duration)
   * @returns cleanup 함수 - 프레임 실행을 중단하고 싶을 때 호출
   *
   * @example
   * ```tsx
   * const cleanup = fireFrame({
   *   execute: (fire) => {
   *     fire({ particleCount: 10, spread: 180, origin: { y: -0.1 } })
   *   },
   *   duration: 5000 // 5초 동안 실행
   * })
   *
   * // 필요시 조기 종료
   * cleanup()
   * ```
   */
  const fireFrame = useCallback((frame: ConfettiFrame) => {
    // 커스텀 canvas가 설정되어 있으면 해당 canvas 사용, 아니면 기본 confetti 사용
    const confettiFn = customConfettiRef.current || confetti

    const startTime = performance.now()
    let animationId: number | null = null

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime

      // 지속 시간이 초과되면 종료
      if (elapsed >= frame.duration) {
        animationId = null
        return
      }

      // 프레임의 execute 함수 실행
      frame.execute(confettiFn)

      // 다음 프레임 요청
      animationId = requestAnimationFrame(animate)
    }

    // 애니메이션 시작
    animationId = requestAnimationFrame(animate)

    // cleanup 함수 반환
    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    }
  }, [])

  return { fire, fireFrame, createShape, setConfettiCanvasRef }
}
