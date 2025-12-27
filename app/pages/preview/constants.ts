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
  drift: 0,
  flat: false,
  tiltRangeMin: 45, // degrees (converted to 0.25 * Math.PI radians)
  tiltRangeMax: 135, // degrees (converted to 0.75 * Math.PI radians)
  tiltSpeedMin: 0.05,
  tiltSpeedMax: 0.4,
  wobbleRangeMin: 5,
  wobbleRangeMax: 10,
  wobbleSpeedMin: 0.05,
  wobbleSpeedMax: 0.11,
  rotation: 0,
  rotationSpeedMin: 0,
  rotationSpeedMax: 0,
  randomRotationDirection: false,
} as const

/**
 * 옵션 설명 및 정보
 */
export const OPTION_INFO = {
  particleCount: {
    label: '파티클 개수',
    description: '한 번에 생성되는 confetti 파티클의 개수',
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
    description: '파티클의 초기 이동 속도',
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
    description: '가로 시작 위치 (0 = 왼쪽, 0.5 = 중앙, 1 = 오른쪽)',
    min: 0,
    max: 1,
    step: 0.1,
  },
  originY: {
    label: 'Y 위치',
    description: '세로 시작 위치 (0 = 상단, 0.5 = 중앙, 1 = 하단)',
    min: 0,
    max: 1,
    step: 0.1,
  },
  angle: {
    label: '방향 각도',
    description: '파티클 진행 방향 (90 = 위, 0 = 오른쪽, 180 = 왼쪽)',
    min: 0,
    max: 360,
  },
  scalar: {
    label: '파티클 크기 배율',
    description: '파티클의 크기 배율 (1 = 기본 크기)',
    min: 0.1,
    max: 3,
    step: 0.1,
  },
  drift: {
    label: '좌우 흔들림',
    description: '파티클의 좌우 흔들림 정도 (0 = 흔들림 없음)',
    min: -1,
    max: 1,
    step: 0.1,
  },
  flat: {
    label: '2D 파티클',
    description: '파티클을 입체감 없이 평면으로 표시',
    type: 'boolean',
  },
  tiltRangeMin: {
    label: '기울기 최소값',
    description: '파티클의 최소 기울기 각도 (도 단위, 라디안으로 자동 변환됨)',
    min: -180,
    max: 180,
  },
  tiltRangeMax: {
    label: '기울기 최대값',
    description: '파티클의 최대 기울기 각도 (도 단위, 라디안으로 자동 변환됨)',
    min: -180,
    max: 180,
  },
  tiltSpeedMin: {
    label: '기울기 속도 최소값',
    description: '파티클이 기울어지는 최소 속도 (라디안/프레임)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  tiltSpeedMax: {
    label: '기울기 속도 최대값',
    description: '파티클이 기울어지는 최대 속도 (라디안/프레임)',
    min: 0,
    max: 1,
    step: 0.01,
  },
  wobbleRangeMin: {
    label: '흔들림 최소값',
    description: '파티클의 최소 흔들림 반경 (단위 없음)',
    min: 0,
    max: 50,
  },
  wobbleRangeMax: {
    label: '흔들림 최대값',
    description: '파티클의 최대 흔들림 반경 (단위 없음)',
    min: 0,
    max: 50,
  },
  wobbleSpeedMin: {
    label: '흔들림 속도 최소값',
    description: '파티클이 흔들리는 최소 속도 (프레임당)',
    min: 0,
    max: 0.5,
    step: 0.01,
  },
  wobbleSpeedMax: {
    label: '흔들림 속도 최대값',
    description: '파티클이 흔들리는 최대 속도 (프레임당)',
    min: 0,
    max: 0.5,
    step: 0.01,
  },
  rotation: {
    label: '초기 회전 각도',
    description: '파티클의 초기 회전 각도 (도)',
    min: 0,
    max: 360,
  },
  rotationSpeedMin: {
    label: '회전 속도 최소값',
    description: '파티클이 회전하는 최소 속도 (도/프레임)',
    min: -20,
    max: 20,
    step: 0.1,
  },
  rotationSpeedMax: {
    label: '회전 속도 최대값',
    description: '파티클이 회전하는 최대 속도 (도/프레임)',
    min: -20,
    max: 20,
    step: 0.1,
  },
  randomRotationDirection: {
    label: '회전 방향 랜덤',
    description: '각 파티클의 회전 방향을 무작위로 설정',
    type: 'boolean',
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
