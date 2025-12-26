import type { ConfettiOptions } from '~/shared/confetti/types'
import type { CustomShapePreset } from './types'

/**
 * 코드 포맷팅 유틸리티
 *
 * @description
 * ConfettiOptions를 실제 사용 가능한 JavaScript 코드로 포맷팅합니다.
 * SVG shape 등 non-serializable 객체를 올바른 코드 표현으로 변환합니다.
 */

interface FormatCodeOptions {
  customShapeType?: 'path' | 'svg'
  customShapePath?: string
  customShapeSvg?: string
  customShapeScalar?: number
  selectedCustomShapes?: CustomShapePreset[]
}

/**
 * ConfettiOptions 배열을 fire() 함수 호출 코드로 포맷팅
 */
export function formatAsFireCode(
  options: ConfettiOptions[],
  formatOptions?: FormatCodeOptions
): string {
  return `fire(${formatOptionsAsCode(options, formatOptions)})`
}

/**
 * 옵션을 JavaScript 코드 문자열로 포맷팅
 */
export function formatOptionsAsCode(
  options: ConfettiOptions[],
  formatOptions?: FormatCodeOptions
): string {
  if (options.length === 1) {
    return formatSingleOption(options[0], 0, formatOptions)
  }

  const formattedOptions = options.map((opt) => formatSingleOption(opt, 2, formatOptions))
  return `[\n${formattedOptions.join(',\n')}\n]`
}

/**
 * 단일 옵션을 JavaScript 코드로 포맷팅
 */
function formatSingleOption(
  option: any,
  indent = 0,
  formatOptions?: FormatCodeOptions
): string {
  const { shapes, ...rest } = option
  const indentStr = ' '.repeat(indent)
  const lines: string[] = []

  // 기본 옵션들을 JSON으로 변환
  const restJson = JSON.stringify(rest, null, 2)
    .split('\n')
    .map((line) => indentStr + line)

  // shapes가 있는 경우
  if (shapes && shapes.length > 0) {
    // 마지막 줄의 } 제거
    const restLines = restJson.slice(0, -1)
    lines.push(...restLines)

    // shapes 추가
    lines.push(`${indentStr}  "shapes": [`)

    shapes.forEach((shape: any, index: number) => {
      const shapeCode = formatShapeAsCode(shape, indent + 4, formatOptions)
      const comma = index < shapes.length - 1 ? ',' : ''
      lines.push(`${shapeCode}${comma}`)
    })

    lines.push(`${indentStr}  ]`)
    lines.push(`${indentStr}}`)
  } else {
    lines.push(...restJson)
  }

  return lines.join('\n')
}

/**
 * Shape 객체를 코드 문자열로 변환
 */
function formatShapeAsCode(
  shape: any,
  indent: number,
  formatOptions?: FormatCodeOptions
): string {
  const indentStr = ' '.repeat(indent)

  if (!shape) return `${indentStr}null`

  // 기본 도형 문자열인 경우 (circle, square, star)
  if (typeof shape === 'string') {
    return `${indentStr}"${shape}"`
  }

  // Promise인 경우 또는 resolve된 shape 객체인 경우
  const isPromise = typeof shape === 'object' && 'then' in shape
  const isSvgShape = shape.type === 'svg'
  const isPathShape = shape.type === 'path'

  if (isPromise || isSvgShape || isPathShape) {
    // 현재 입력 중인 커스텀 shape 확인 (formatOptions가 제공된 경우)
    if (formatOptions) {
      const {
        customShapeType,
        customShapePath,
        customShapeSvg,
        customShapeScalar,
        selectedCustomShapes,
      } = formatOptions

      if (customShapeType === 'svg' && customShapeSvg?.trim()) {
        const svgStr = customShapeSvg.replace(/\n/g, ' ').replace(/\s+/g, ' ')
        return `${indentStr}createShape({ svg: \`${svgStr}\`, scalar: ${customShapeScalar || 1} })`
      } else if (customShapeType === 'path' && customShapePath?.trim()) {
        return `${indentStr}createShape({ path: "${customShapePath}" })`
      }

      // 선택된 저장된 커스텀 shape 확인
      if (selectedCustomShapes) {
        for (const preset of selectedCustomShapes) {
          if (preset.type === 'svg' && preset.svg) {
            const svgStr = preset.svg.replace(/\n/g, ' ').replace(/\s+/g, ' ')
            return `${indentStr}createShape({ svg: \`${svgStr}\`, scalar: ${preset.scalar || 1} })`
          } else if (preset.type === 'path' && preset.path) {
            return `${indentStr}createShape({ path: "${preset.path}" })`
          }
        }
      }
    }

    // fallback
    if (isSvgShape) {
      return `${indentStr}createShape({ svg: "...", scalar: 1 })`
    } else if (isPathShape) {
      return `${indentStr}createShape({ path: "..." })`
    }
  }

  return `${indentStr}null`
}
