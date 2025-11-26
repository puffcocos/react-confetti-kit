import { useMemo } from 'react'
import { svgPathBbox } from 'svg-path-bbox'

interface SvgPathPreviewProps {
  path: string
  width?: number
  height?: number
  className?: string
  padding?: number
}

/**
 * SVG Path 미리보기 컴포넌트
 *
 * @description
 * SVG path의 경계 박스를 자동으로 계산하여 적절한 viewBox로 렌더링합니다.
 * 어떤 좌표 범위의 path가 오더라도 자동으로 맞춰서 표시됩니다.
 *
 * @example
 * ```tsx
 * <SvgPathPreview
 *   path="M5 2 C5 0.5 6 0 7 0..."
 *   width={100}
 *   height={100}
 * />
 * ```
 */
export function SvgPathPreview({
  path,
  width = 100,
  height = 100,
  className = '',
  padding = 10,
}: SvgPathPreviewProps) {
  const viewBox = useMemo(() => {
    try {
      // path의 bounding box 계산: [minX, minY, maxX, maxY]
      const [minX, minY, maxX, maxY] = svgPathBbox(path)

      // 너비와 높이 계산
      const pathWidth = maxX - minX
      const pathHeight = maxY - minY

      // 패딩 추가
      const viewBoxX = minX - padding
      const viewBoxY = minY - padding
      const viewBoxWidth = pathWidth + padding * 2
      const viewBoxHeight = pathHeight + padding * 2

      return `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
    } catch (error) {
      console.error('Failed to calculate path bbox:', error)
      // 기본값 반환
      return '-50 -50 1124 1124'
    }
  }, [path, padding])

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      <path d={path} fill="currentColor" stroke="none" />
    </svg>
  )
}
