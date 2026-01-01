/**
 * canvas-confetti 로컬 빌드 타입 선언
 *
 * @description
 * canvas-confetti 라이브러리의 타입을 re-export하여
 * 로컬 JS 파일에 대한 타입 지원을 제공합니다.
 */

import type { Options, Shape, CreateTypes, GlobalOptions, Origin } from 'canvas-confetti'

declare namespace confetti {
  export { Options, Shape, CreateTypes, GlobalOptions, Origin }
}

declare function confetti(options?: Options): Promise<null> | null

declare namespace confetti {
  function shapeFromPath(options: { path: string; matrix?: number[] | DOMMatrix }): Shape
  function shapeFromSvg(options: { svg: string; scalar?: number }): Promise<Shape>
  function shapeFromText(options: { text: string; scalar?: number; fontFamily?: string }): Shape
  function create(canvas: HTMLCanvasElement | null, options?: GlobalOptions): CreateTypes
  function reset(): void
}

export = confetti
export as namespace confetti
