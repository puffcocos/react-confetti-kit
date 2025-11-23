import type { OptionInfo } from './types'

/**
 * 기본값 상수 정의
 */
export const DEFAULT_VALUES = {
  particleCount: 100,
  spread: 70,
  startVelocity: 45,
  decay: 0.9,
  gravity: 1,
  ticks: 200,
  originX: 0.5,
  originY: 0.6,
  angle: 90,
  scalar: 1,
} as const

/**
 * 옵션 설명 및 정보
 */
export const OPTION_INFO: Record<string, OptionInfo> = {
  particleCount: {
    label: '파티클 개수',
    description: '한 번에 발사되는 confetti 파티클의 개수',
    min: 1,
    max: 500,
  },
  spread: {
    label: '퍼짐 각도',
    description: '파티클이 퍼지는 각도 (0-360도)',
    min: 0,
    max: 360,
  },
  startVelocity: {
    label: '초기 속도',
    description: '파티클의 초기 발사 속도',
    min: 0,
    max: 100,
  },
  decay: {
    label: '감쇠율',
    description: '파티클 속도가 감소하는 비율 (0.9 = 매 프레임마다 10% 감소)',
    min: 0.5,
    max: 1,
    step: 0.01,
  },
  gravity: {
    label: '중력',
    description: '파티클에 적용되는 중력 효과',
    min: 0,
    max: 3,
    step: 0.1,
  },
  ticks: {
    label: '지속 시간',
    description: '파티클이 화면에 표시되는 프레임 수',
    min: 50,
    max: 500,
  },
  originX: {
    label: 'X 위치',
    description: '가로 발사 위치 (0 = 왼쪽, 0.5 = 중앙, 1 = 오른쪽)',
    min: 0,
    max: 1,
    step: 0.1,
  },
  originY: {
    label: 'Y 위치',
    description: '세로 발사 위치 (0 = 상단, 0.5 = 중앙, 1 = 하단)',
    min: 0,
    max: 1,
    step: 0.1,
  },
  angle: {
    label: '발사 각도',
    description: '파티클 발사 방향 (90 = 위, 0 = 오른쪽, 180 = 왼쪽)',
    min: 0,
    max: 360,
  },
  scalar: {
    label: '크기 배율',
    description: '파티클의 크기 배율 (1 = 기본 크기)',
    min: 0.1,
    max: 3,
    step: 0.1,
  },
} as const

/**
 * 기본 색상 프리셋
 */
export const COLOR_PRESETS = {
  rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
  pastel: ['#FFB6C1', '#FFC0CB', '#FFD1DC', '#FFE4E1', '#E0BBE4', '#D4A5A5'],
  gold: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B'],
  ocean: ['#006994', '#0099CC', '#66CCFF', '#99CCFF', '#CCE5FF'],
} as const
