import { useState } from 'react'
import type { Route } from './+types/preview'
import { confettiPresets } from '../components/confetti'
import { useConfetti } from '../components/use-confetti'
import type { Options as ConfettiOptions } from 'canvas-confetti'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Confetti Preview - 미리보기' },
    { name: 'description', content: 'Confetti 효과를 실시간으로 테스트해보세요' },
  ]
}

// 기본값 상수 정의
const DEFAULT_VALUES = {
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
}

// 옵션 설명 및 정보
const OPTION_INFO = {
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

export default function Preview() {
  const fire = useConfetti()
  const [selectedPreset, setSelectedPreset] = useState<string>('celebration')

  // 커스텀 옵션 상태
  const [particleCount, setParticleCount] = useState(DEFAULT_VALUES.particleCount)
  const [spread, setSpread] = useState(DEFAULT_VALUES.spread)
  const [startVelocity, setStartVelocity] = useState(DEFAULT_VALUES.startVelocity)
  const [decay, setDecay] = useState(DEFAULT_VALUES.decay)
  const [gravity, setGravity] = useState(DEFAULT_VALUES.gravity)
  const [ticks, setTicks] = useState(DEFAULT_VALUES.ticks)
  const [originX, setOriginX] = useState(DEFAULT_VALUES.originX)
  const [originY, setOriginY] = useState(DEFAULT_VALUES.originY)
  const [angle, setAngle] = useState(DEFAULT_VALUES.angle)
  const [scalar, setScalar] = useState(DEFAULT_VALUES.scalar)

  // 색상 옵션
  const [useCustomColors, setUseCustomColors] = useState(false)
  const [customColors, setCustomColors] = useState<string[]>(['#ff0000', '#00ff00', '#0000ff'])
  const [colorInput, setColorInput] = useState('#ff0000')

  // 모양 옵션
  const [shapes, setShapes] = useState<string[]>(['square', 'circle'])

  // 커스텀 프리셋 저장
  interface CustomPreset {
    name: string
    options: ConfettiOptions[]
  }
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([])
  const [presetName, setPresetName] = useState('')
  const [presetOptions, setPresetOptions] = useState<ConfettiOptions[]>([]) // 프리셋에 추가할 옵션들

  // 색상 프리셋
  const colorPresets = {
    rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
    pastel: ['#FFB6C1', '#FFC0CB', '#FFD1DC', '#FFE4E1', '#E0BBE4', '#D4A5A5'],
    gold: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B'],
    ocean: ['#006994', '#0099CC', '#66CCFF', '#99CCFF', '#CCE5FF'],
    fire: ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FFA500'],
    forest: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF00'],
    purple: ['#9370DB', '#8A2BE2', '#9932CC', '#BA55D3', '#DA70D6'],
    sunset: ['#FF6B6B', '#FFA07A', '#FFD93D', '#6BCF7F', '#4ECDC4'],
  }

  // 현재 옵션 조합
  const currentOptions: ConfettiOptions = {
    particleCount,
    spread,
    startVelocity,
    decay,
    gravity,
    ticks,
    origin: { x: originX, y: originY },
    angle,
    scalar,
    ...(useCustomColors && customColors.length > 0 ? { colors: customColors } : {}),
    ...(shapes.length > 0 ? { shapes: shapes as any } : {}),
  }

  // 색상 추가
  const addColor = () => {
    if (colorInput && !customColors.includes(colorInput)) {
      setCustomColors([...customColors, colorInput])
    }
  }

  // 색상 제거
  const removeColor = (color: string) => {
    setCustomColors(customColors.filter((c) => c !== color))
  }

  // 색상 프리셋 적용
  const applyColorPreset = (presetName: string) => {
    const preset = colorPresets[presetName as keyof typeof colorPresets]
    setCustomColors(preset)
    setUseCustomColors(true)
  }

  // 모양 토글
  const toggleShape = (shape: string) => {
    if (shapes.includes(shape)) {
      setShapes(shapes.filter((s) => s !== shape))
    } else {
      setShapes([...shapes, shape])
    }
  }

  // 기본값으로 리셋
  const resetToDefaults = () => {
    setParticleCount(DEFAULT_VALUES.particleCount)
    setSpread(DEFAULT_VALUES.spread)
    setStartVelocity(DEFAULT_VALUES.startVelocity)
    setDecay(DEFAULT_VALUES.decay)
    setGravity(DEFAULT_VALUES.gravity)
    setTicks(DEFAULT_VALUES.ticks)
    setOriginX(DEFAULT_VALUES.originX)
    setOriginY(DEFAULT_VALUES.originY)
    setAngle(DEFAULT_VALUES.angle)
    setScalar(DEFAULT_VALUES.scalar)
    setUseCustomColors(false)
    setCustomColors(['#ff0000', '#00ff00', '#0000ff'])
    setShapes(['square', 'circle'])
  }

  // 프리셋 실행
  const firePreset = (presetName: string) => {
    setSelectedPreset(presetName)
    const preset = confettiPresets[presetName as keyof typeof confettiPresets]
    fire(preset)
  }

  // 커스텀 옵션으로 실행
  const fireCustom = () => {
    fire(currentOptions)
  }

  // 프리셋에 현재 옵션 추가
  const addToPreset = () => {
    setPresetOptions([...presetOptions, currentOptions])
  }

  // 프리셋에서 옵션 제거
  const removeFromPreset = (index: number) => {
    setPresetOptions(presetOptions.filter((_, i) => i !== index))
  }

  // 커스텀 프리셋 저장
  const saveCustomPreset = () => {
    if (!presetName.trim()) {
      alert('프리셋 이름을 입력해주세요')
      return
    }

    if (presetOptions.length === 0) {
      alert('최소 1개 이상의 옵션을 추가해주세요')
      return
    }

    const newPreset: CustomPreset = {
      name: presetName,
      options: presetOptions,
    }

    setCustomPresets([...customPresets, newPreset])
    setPresetName('')
    setPresetOptions([])
    alert(`"${presetName}" 프리셋이 저장되었습니다! (${presetOptions.length}개 효과)`)
  }

  // 커스텀 프리셋 실행
  const fireCustomPreset = (preset: CustomPreset) => {
    fire(preset.options)
  }

  // 커스텀 프리셋 삭제
  const deleteCustomPreset = (index: number) => {
    setCustomPresets(customPresets.filter((_, i) => i !== index))
  }

  // 선택된 프리셋 코드 미리보기
  const [selectedPresetForCode, setSelectedPresetForCode] = useState<number | null>(null)

  // 복사 상태 관리
  const [copiedMain, setCopiedMain] = useState(false)
  const [copiedPresetIndex, setCopiedPresetIndex] = useState<number | null>(null)

  // 코드 미리보기 생성
  const generateCodePreview = () => {
    if (presetOptions.length === 0) {
      return `fire(${JSON.stringify(currentOptions, null, 2)})`
    }
    return `fire(${JSON.stringify(presetOptions, null, 2)})`
  }

  // 클립보드 복사 함수
  const copyToClipboard = async (text: string, type: 'main' | number) => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'main') {
        setCopiedMain(true)
        setTimeout(() => setCopiedMain(false), 2000)
      } else {
        setCopiedPresetIndex(type)
        setTimeout(() => setCopiedPresetIndex(null), 2000)
      }
    } catch (err) {
      console.error('복사 실패:', err)
      alert('클립보드 복사에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Confetti 미리보기</h1>
        <p className="text-gray-600 mb-8">다양한 옵션을 조절하며 confetti 효과를 테스트해보세요</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 프리셋 & 특수 효과 */}
          <div className="space-y-6">
            {/* 프리셋 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">프리셋</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(confettiPresets).map((presetName) => (
                  <button
                    key={presetName}
                    onClick={() => firePreset(presetName)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      selectedPreset === presetName
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {presetName}
                  </button>
                ))}
              </div>
            </div>

            {/* 커스텀 프리셋 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">커스텀 프리셋</h2>

              {/* 프리셋 구성 중 */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-blue-900">
                    프리셋 구성 ({presetOptions.length}개 효과)
                  </label>
                  <button
                    onClick={addToPreset}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    + 현재 옵션 추가
                  </button>
                </div>

                {/* 추가된 옵션들 */}
                {presetOptions.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {presetOptions.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-white rounded border border-blue-300"
                      >
                        <span className="flex-1 text-xs text-gray-700 font-mono truncate">
                          효과 {index + 1}: {option.particleCount}개 파티클, {option.spread}° 퍼짐
                        </span>
                        <button
                          onClick={() => removeFromPreset(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                        >
                          제거
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {presetOptions.length === 0 && (
                  <p className="text-xs text-blue-600 mb-3">
                    오른쪽의 커스텀 효과 설정을 조절한 후 "+ 현재 옵션 추가" 버튼을 눌러 효과를 추가하세요
                  </p>
                )}

                {/* 프리셋 저장 */}
                <div className="flex gap-2 pt-3 border-t border-blue-200">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="프리셋 이름 입력"
                    className="flex-1 px-3 py-2 border border-blue-300 rounded text-sm text-gray-800"
                  />
                  <button
                    onClick={saveCustomPreset}
                    disabled={presetOptions.length === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    저장
                  </button>
                </div>
              </div>

              {/* 저장된 프리셋 목록 */}
              {customPresets.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    저장된 프리셋
                  </label>
                  {customPresets.map((preset, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2 p-3">
                        <button
                          onClick={() => fireCustomPreset(preset)}
                          className="flex-1 text-left px-3 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors font-medium text-sm"
                        >
                          {preset.name} <span className="text-xs text-purple-600">({preset.options.length}개 효과)</span>
                        </button>
                        <button
                          onClick={() => setSelectedPresetForCode(selectedPresetForCode === index ? null : index)}
                          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                          title="코드 보기"
                        >
                          {selectedPresetForCode === index ? '코드 숨기기' : '코드 보기'}
                        </button>
                        <button
                          onClick={() => deleteCustomPreset(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          삭제
                        </button>
                      </div>

                      {/* 코드 미리보기 */}
                      {selectedPresetForCode === index && (
                        <div className="px-3 pb-3">
                          <div className="relative">
                            <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                              <pre className="text-xs text-green-400 font-mono">
                                <code>{`fire(${JSON.stringify(preset.options, null, 2)})`}</code>
                              </pre>
                            </div>
                            <button
                              onClick={() => copyToClipboard(`fire(${JSON.stringify(preset.options, null, 2)})`, index)}
                              className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                              title="코드 복사"
                            >
                              {copiedPresetIndex === index ? '✓ 복사됨!' : '📋 복사'}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            useConfetti 훅을 사용하여 위 코드로 "{preset.name}" 프리셋을 발사할 수 있습니다
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {customPresets.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  저장된 커스텀 프리셋이 없습니다
                </p>
              )}
            </div>
          </div>

          {/* 오른쪽: 커스텀 효과 설정 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">커스텀 효과 설정</h2>
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                title="모든 옵션을 기본값으로 되돌립니다"
              >
                🔄 기본값으로 리셋
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Particle Count */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.particleCount.label}: {particleCount}
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.particleCount})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.particleCount.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.particleCount.min}
                  max={OPTION_INFO.particleCount.max}
                  value={particleCount}
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Spread */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.spread.label}: {spread}°
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.spread})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.spread.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.spread.min}
                  max={OPTION_INFO.spread.max}
                  value={spread}
                  onChange={(e) => setSpread(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Start Velocity */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.startVelocity.label}: {startVelocity}
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.startVelocity})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.startVelocity.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.startVelocity.min}
                  max={OPTION_INFO.startVelocity.max}
                  value={startVelocity}
                  onChange={(e) => setStartVelocity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Gravity */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.gravity.label}: {gravity.toFixed(1)}
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.gravity})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.gravity.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.gravity.min}
                  max={OPTION_INFO.gravity.max}
                  step={OPTION_INFO.gravity.step}
                  value={gravity}
                  onChange={(e) => setGravity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Decay */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.decay.label}: {decay.toFixed(2)}
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.decay})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.decay.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.decay.min}
                  max={OPTION_INFO.decay.max}
                  step={OPTION_INFO.decay.step}
                  value={decay}
                  onChange={(e) => setDecay(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Ticks */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.ticks.label}: {ticks}
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.ticks})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.ticks.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.ticks.min}
                  max={OPTION_INFO.ticks.max}
                  value={ticks}
                  onChange={(e) => setTicks(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Angle */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.angle.label}: {angle}°
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.angle})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.angle.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.angle.min}
                  max={OPTION_INFO.angle.max}
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Origin X */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.originX.label}: {originX.toFixed(2)}
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.originX})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.originX.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.originX.min}
                  max={OPTION_INFO.originX.max}
                  step={OPTION_INFO.originX.step}
                  value={originX}
                  onChange={(e) => setOriginX(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Origin Y */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.originY.label}: {originY.toFixed(2)}
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.originY})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.originY.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.originY.min}
                  max={OPTION_INFO.originY.max}
                  step={OPTION_INFO.originY.step}
                  value={originY}
                  onChange={(e) => setOriginY(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Scalar */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.scalar.label}: {scalar.toFixed(1)}x
                  </label>
                  <span className="text-xs text-gray-500">(기본값: {DEFAULT_VALUES.scalar})</span>
                  <div className="group relative">
                    <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
                    <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                      {OPTION_INFO.scalar.description}
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min={OPTION_INFO.scalar.min}
                  max={OPTION_INFO.scalar.max}
                  step={OPTION_INFO.scalar.step}
                  value={scalar}
                  onChange={(e) => setScalar(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 색상 옵션 */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">커스텀 색상 사용</label>
                  <button
                    onClick={() => setUseCustomColors(!useCustomColors)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      useCustomColors ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {useCustomColors ? 'ON' : 'OFF'}
                  </button>
                </div>

                {useCustomColors && (
                  <div className="space-y-3">
                    {/* 색상 프리셋 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        색상 프리셋
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(colorPresets).map((presetName) => (
                          <button
                            key={presetName}
                            onClick={() => applyColorPreset(presetName)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-semibold transition-colors capitalize text-gray-800 hover:text-gray-900"
                          >
                            {presetName}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 현재 색상 목록 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        현재 색상
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {customColors.map((color) => (
                          <div
                            key={color}
                            className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1"
                          >
                            <div
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-gray-800 font-medium">{color}</span>
                            <button
                              onClick={() => removeColor(color)}
                              className="ml-1 text-red-500 hover:text-red-700 text-xs font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 색상 추가 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        색상 추가
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          placeholder="#ff0000"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder:text-gray-400"
                        />
                        <button
                          onClick={addColor}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 모양 옵션 */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">파티클 모양</label>
                <div className="flex gap-2">
                  {['circle', 'square', 'star'].map((shape) => (
                    <button
                      key={shape}
                      onClick={() => toggleShape(shape)}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        shapes.includes(shape)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {shape === 'circle' && '●'}
                      {shape === 'square' && '■'}
                      {shape === 'star' && '★'}
                      <span className="ml-1 capitalize">{shape}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 커스텀 실행 버튼 */}
            <button
              onClick={fireCustom}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              🎨 발사!
            </button>

            {/* 코드 미리보기 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">코드 미리보기</h3>
                <button
                  onClick={() => copyToClipboard(generateCodePreview(), 'main')}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                  title="코드 복사"
                >
                  {copiedMain ? '✓ 복사됨!' : '📋 복사'}
                </button>
              </div>
              <div className="bg-gray-900 rounded p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  <code>{generateCodePreview()}</code>
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                useConfetti 훅을 사용하여 위 코드로 confetti를 발사할 수 있습니다
              </p>
            </div>
          </div>
        </div>

        {/* 하단: 문서 링크 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">더 많은 옵션 알아보기</h2>
          <p className="text-gray-600 mb-3">
            canvas-confetti는 더 많은 커스터마이징 옵션을 제공합니다.
          </p>
          <a
            href="https://github.com/catdad/canvas-confetti"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            📚 공식 문서 보기
          </a>
        </div>
      </div>
    </div>
  )
}
