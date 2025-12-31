import { useCallback, useRef } from 'react'
import confetti from './vendors/canvas-confetti/confetti.js'
import type { ConfettiOptions, Shape, CreateTypes, ConfettiFrame } from './types'

interface ShapeFromPathOptions {
  path: string
  matrix?: number[]
}

interface ShapeFromSvgOptions {
  svg: string
  scalar?: number
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
 *
 * // 커스텀 SVG 사용 예시
 * const star = createShape({
 *   svg: '<svg viewBox="0 0 100 100"><path d="..." fill="currentColor"/></svg>',
 *   scalar: 1.5
 * });
 * fire({ shapes: [star], particleCount: 50 });
 * ```
 */
export function useConfetti() {
  const customConfettiRef = useRef<CreateTypes | null>(null)
  const customConfettiWorkerlessRef = useRef<CreateTypes | null>(null)
  const workerlessConfettiRef = useRef<CreateTypes | null>(null)

  // Worker 없는 confetti 인스턴스 (SVG shape 사용 시)
  if (!workerlessConfettiRef.current) {
    workerlessConfettiRef.current = confetti.create(null, {
      resize: true,
      useWorker: false
    })
  }

  // Canvas ref setter
  const setConfettiCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      // Worker 활성화 인스턴스 (성능 최대화)
      customConfettiRef.current = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      })
      // Worker 비활성화 인스턴스 (SVG 혼합 시 사용)
      customConfettiWorkerlessRef.current = confetti.create(canvas, {
        resize: true,
        useWorker: false,
      })
    } else {
      customConfettiRef.current = null
      customConfettiWorkerlessRef.current = null
    }
  }, [])

  /**
   * SVG shape 포함 여부 확인 (resolved Shape 객체 기반)
   */
  const hasSvgShape = (option: ConfettiOptions): boolean => {
    if (!option.shapes || !Array.isArray(option.shapes)) {
      return false
    }
    return option.shapes.some((shape) => {
      if (typeof shape === 'object' && shape !== null && 'type' in shape) {
        const shapeType = (shape as any).type
        return shapeType === 'svg'
      }
      return false
    })
  }

  /**
   * SVG가 아닌 다른 shape 포함 여부 확인 (기본 파티클 + Path)
   */
  const hasNonSvgShape = (option: ConfettiOptions): boolean => {
    // shapes가 없는 경우 = 기본 파티클만 사용
    if (!option.shapes || option.shapes.length === 0) {
      return true
    }

    // 문자열 shape (기본 파티클) 또는 SVG가 아닌 Shape 객체가 있는지 확인
    return option.shapes.some((shape) => {
      // 문자열 (기본 파티클)
      if (typeof shape === 'string') {
        return true
      }
      // Shape 객체이고 SVG가 아닌 경우 (path, bitmap 등)
      if (typeof shape === 'object' && shape !== null && 'type' in shape) {
        const shapeType = (shape as any).type
        return shapeType !== 'svg'
      }
      return false
    })
  }

  /**
   * SVG shape와 non-SVG shape가 혼합되어 있는지 확인
   *
   * @description
   * canvas-confetti는 성능 향상을 위해 기본적으로 Web Worker를 사용합니다.
   *
   * 그러나 SVG shape와 다른 타입(Path, 기본 파티클)을 혼합해서 사용할 때
   * Worker를 활성화하면 다음 에러가 발생합니다:
   * "Cannot get context from a canvas that has transferred its control to offscreen"
   *
   * 이는 Worker가 canvas 제어권을 OffscreenCanvas로 이전하는 과정에서
   * SVG shape 처리와 충돌하기 때문으로 추정됩니다.
   *
   * 따라서 다음과 같이 조건부로 worker를 비활성화합니다:
   * - SVG만 사용: Worker 사용 ✅ (성능 최대화)
   * - Path만 사용: Worker 사용 ✅ (성능 최대화)
   * - 기본 파티클만 사용: Worker 사용 ✅ (성능 최대화)
   * - SVG + 다른 타입 혼합: Worker 비활성화 ❌ (OffscreenCanvas 충돌 방지)
   *
   * @param options - 확인할 confetti 옵션 배열 (shapes가 이미 resolve된 상태)
   * @returns SVG와 non-SVG가 혼합되어 있으면 true
   */
  const shouldUseWorkerlessMode = (options: ConfettiOptions[]): boolean => {
    let hasSvgEffect = false
    let hasNonSvgEffect = false

    for (const opt of options) {
      if (hasSvgShape(opt)) hasSvgEffect = true
      if (hasNonSvgShape(opt)) hasNonSvgEffect = true
      // 둘 다 발견되면 조기 종료 (성능 최적화)
      if (hasSvgEffect && hasNonSvgEffect) break
    }

    return hasSvgEffect && hasNonSvgEffect
  }

  const fire = useCallback(async (options?: ConfettiOptions | ConfettiOptions[]) => {
    if (!options) {
      const confettiFn = customConfettiRef.current || confetti
      confettiFn({})
      return
    }

    // 옵션 배열 여부 확인
    const optionsArray = Array.isArray(options) ? options : [options]

    // Promise<Shape>를 해결하는 헬퍼 함수
    const resolveShapes = async (option: ConfettiOptions) => {
      if (!option.shapes || !Array.isArray(option.shapes)) {
        return option
      }

      // shapes 배열의 Promise를 순차적으로 해결 (canvas 접근 충돌 방지)
      const resolvedShapes = []
      for (const shape of option.shapes) {
        resolvedShapes.push(await shape)
      }
      return { ...option, shapes: resolvedShapes }
    }

    // 1. 먼저 모든 shapes를 resolve
    const resolvedOptions = []
    for (const option of optionsArray) {
      resolvedOptions.push(await resolveShapes(option))
    }

    // 2. resolve된 shapes로 Worker 모드 결정
    const needsWorkerless = shouldUseWorkerlessMode(resolvedOptions)

    // 3. Worker 모드에 따라 적절한 인스턴스 선택
    const confettiFn = needsWorkerless
      ? customConfettiWorkerlessRef.current || workerlessConfettiRef.current!
      : customConfettiRef.current || confetti

    // 5. resolve된 효과들을 순차적으로 실행
    for (const resolved of resolvedOptions) {
      confettiFn(resolved as any)
    }
  }, [])

  const createShape = useCallback(
    (options: ShapeFromPathOptions | ShapeFromSvgOptions): Shape | Promise<Shape> => {
      // SVG 타입인 경우
      if ('svg' in options) {
        return confetti.shapeFromSvg(options)
      }

      // Path 타입인 경우
      if (options.matrix) {
        const matrix = new DOMMatrix(options.matrix)
        return confetti.shapeFromPath({ path: options.path, matrix })
      }
      return confetti.shapeFromPath({ path: options.path })
    },
    []
  )

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
    const startTime = performance.now()
    let animationId: number | null = null

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime

      // 지속 시간이 초과되면 종료
      if (elapsed >= frame.duration) {
        animationId = null
        return
      }

      // 프레임의 execute 함수 실행 (fire 함수 전달)
      frame.execute(fire)

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
  }, [fire])

  return { fire, fireFrame, createShape, setConfettiCanvasRef }
}
