import type { CustomShapePreset, EditorConfettiOptions } from './types'

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
  options: EditorConfettiOptions[],
  formatOptions?: FormatCodeOptions
): string {
  return `fire(${formatOptionsAsCode(options, formatOptions)})`
}

/**
 * 옵션을 JavaScript 코드 문자열로 포맷팅
 */
export function formatOptionsAsCode(
  options: EditorConfettiOptions[],
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
  // 메타데이터 추출 및 원본 객체에서 제거
  const {
    _useCustomShapes,
    _selectedCustomShapes,
    ...rest
  } = option

  const indentStr = ' '.repeat(indent)
  const lines: string[] = []

  // 이 효과가 커스텀 파티클을 사용하도록 설정되었는지 확인
  const isCustomEffect = _useCustomShapes === true || (option.shapes && option.shapes.some((s: any) => typeof s !== 'string'))
  const customShapesToUse = _selectedCustomShapes || formatOptions?.selectedCustomShapes || []

  // shapes를 코드로 표시해야 하는 경우 (커스텀 shape)
  if (isCustomEffect) {
    // shapes를 제외한 나머지 옵션들을 JSON으로 변환
    const { shapes: originalShapes, ...restWithoutShapes } = rest
    const restJson = JSON.stringify(restWithoutShapes, null, 2)
      .split('\n')
      .map((line) => indentStr + line)

    // 마지막 줄의 } 제거하고, 그 전 줄에 쉼표 추가 (shapes 속성을 위해)
    const restLines = restJson.slice(0, -1)

    // 마지막 속성 뒤에 쉼표가 없다면 추가
    if (restLines.length > 0) {
      const lastLineIndex = restLines.length - 1
      const lastLine = restLines[lastLineIndex]
      if (!lastLine.trim().endsWith(',')) {
        restLines[lastLineIndex] = lastLine + ','
      }
    }

    lines.push(...restLines)

    // shapes 추가
    lines.push(`${indentStr}  "shapes": [`)

    const allShapesCode: string[] = []

    // 기본 파티클 추가 (문자열 shapes)
    if (originalShapes && Array.isArray(originalShapes)) {
      originalShapes.forEach((shape: any) => {
        if (typeof shape === 'string') {
          allShapesCode.push(`${indentStr}    "${shape}"`)
        }
      })
    }

    // 커스텀 shape 코드 생성
    if (customShapesToUse.length > 0) {
      customShapesToUse.forEach((shapeMeta: CustomShapePreset) => {
        const shapeCode = formatShapeMetaAsCode(shapeMeta, indent + 4)
        allShapesCode.push(shapeCode)
      })
    }

    // 쉼표 추가하여 출력
    allShapesCode.forEach((shapeCode, index) => {
      const comma = index < allShapesCode.length - 1 ? ',' : ''
      lines.push(`${shapeCode}${comma}`)
    })

    lines.push(`${indentStr}  ]`)
    lines.push(`${indentStr}}`)
  } else {
    // 기본 파티클만 사용하는 경우 JSON.stringify 결과 그대로 사용 (shapes 포함됨)
    const restJson = JSON.stringify(rest, null, 2)
      .split('\n')
      .map((line) => indentStr + line)
    lines.push(...restJson)
  }

  return lines.join('\n')
}

/**
 * shapeMeta를 코드 문자열로 변환
 */
function formatShapeMetaAsCode(shapeMeta: CustomShapePreset, indent: number): string {
  const indentStr = ' '.repeat(indent)

  if (shapeMeta.type === 'svg' && shapeMeta.svg) {
    const svgStr = shapeMeta.svg.replace(/\n/g, ' ').replace(/\s+/g, ' ')
    return `${indentStr}createShape({ svg: \`${svgStr}\`, scalar: ${shapeMeta.scalar || 1} })`
  } else if (shapeMeta.type === 'path' && shapeMeta.path) {
    return `${indentStr}createShape({ path: "${shapeMeta.path}" })`
  }

  return `${indentStr}null`
}

