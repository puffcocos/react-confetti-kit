/**
 * canvas-confetti 로컬 빌드 타입 선언
 *
 * @description
 * canvas-confetti 라이브러리의 타입을 re-export하여
 * 로컬 JS 파일에 대한 타입 지원을 제공합니다.
 */

import type { Options, Shape, CreateTypes, GlobalOptions, Origin } from 'canvas-confetti'

// 타입들을 re-export
export type { Options, Shape, CreateTypes, GlobalOptions, Origin } from 'canvas-confetti'

declare const confetti: {
  (options?: Options): Promise<null> | null
  shapeFromPath(options: { path: string; matrix?: number[] | DOMMatrix }): Shape
  shapeFromText(options: { text: string; scalar?: number; fontFamily?: string }): Shape
  create(canvas: HTMLCanvasElement | null, options?: GlobalOptions): CreateTypes
  reset(): void
}

export = confetti
export as namespace confetti
