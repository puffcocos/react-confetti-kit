import type { ConfettiOptions, ConfettiFrame } from './types'

/**
 * 미리 정의된 confetti 프리셋
 * 각 프리셋은 ConfettiOptions 배열로 구성되어 여러 효과를 순차적으로 실행할 수 있습니다.
 */
export const confettiPresets = {
  /**
   * 축하 효과 (현실적인 폭죽)
   */
  celebration: [
    {
      particleCount: 50,
      spread: 26,
      startVelocity: 55,
      origin: { y: 0.7 },
    },
    {
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    },
    {
      particleCount: 70,
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { y: 0.7 },
    },
    {
      particleCount: 20,
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { y: 0.7 },
    },
    {
      particleCount: 20,
      spread: 120,
      startVelocity: 45,
      origin: { y: 0.7 },
    },
  ] as ConfettiOptions[],

  /**
   * 폭발 효과
   */
  explosion: [
    {
      particleCount: 150,
      spread: 180,
      origin: { y: 0.5 },
      startVelocity: 45,
    },
  ] as ConfettiOptions[],

  /**
   * 별 효과
   */
  stars: [
    {
      particleCount: 50,
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    },
  ] as ConfettiOptions[],

  /**
   * 눈 효과 (지속적으로 눈 내림)
   * fireFrame을 사용하여 매 프레임마다 작은 눈송이를 발사합니다.
   */
  snow: {
    duration: 12000,
    execute: (fire) => {
      // 매 프레임마다 작은 눈송이를 발사
      fire({
        particleCount: 3, // 한 번에 3개 발사 (60fps * 3 = 180개/초)
        spread: 180,
        origin: { x: Math.random(), y: -0.1 },
        startVelocity: 0,
        ticks: 900, // 15초 동안 화면에 유지 (60fps * 15초)
        gravity: 0.5, // 중력 더 감소로 매우 천천히 떨어지도록
        decay: 0.99, // 감속 최소화로 투명도 유지
        scalar: 0.4 + Math.random() * 0.3, // 0.4 ~ 0.7 랜덤 크기
        drift: Math.random() * 1 - 0.5, // -0.5 ~ 0.5 랜덤 drift
        colors: ['#ffffff', '#e0f7ff', '#f0f8ff'],
      })
    },
  } satisfies ConfettiFrame,

  /**
   * 불꽃놀이 효과
   */
  fireworks: [
    {
      particleCount: 100,
      spread: 360,
      ticks: 100,
      gravity: 1,
      decay: 0.94,
      startVelocity: 30,
    },
  ] as ConfettiOptions[],

  /**
   * 양쪽에서 효과
   */
  sides: [
    {
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
    },
    {
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
    },
  ] as ConfettiOptions[],

  /**
   * 학교 졸업식 스타일
   */
  school: [
    {
      particleCount: 100,
      spread: 26,
      startVelocity: 55,
    },
  ] as ConfettiOptions[],

  /**
   * 랜덤 방향
   */
  random: [
    {
      particleCount: 100,
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
    },
  ] as ConfettiOptions[],
} as const
