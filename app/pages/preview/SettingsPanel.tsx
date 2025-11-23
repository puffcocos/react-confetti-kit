import type { Options as ConfettiOptions } from 'canvas-confetti'
import type { CustomPreset } from './types'
import { DEFAULT_VALUES, OPTION_INFO, COLOR_PRESETS } from './constants'

interface SettingsPanelProps {
  // 옵션 상태
  particleCount: number
  spread: number
  startVelocity: number
  decay: number
  gravity: number
  ticks: number
  originX: number
  originY: number
  angle: number
  scalar: number
  useCustomColors: boolean
  customColors: string[]
  colorInput: string
  shapes: string[]

  // 수정 모드
  editingPresetIndex: number | null
  editingEffectIndex: number | null
  customPresets: CustomPreset[]

  // 코드 미리보기
  currentOptions: ConfettiOptions
  presetOptions: ConfettiOptions[]
  copiedMain: boolean

  // 상태 업데이트 함수
  onParticleCountChange: (value: number) => void
  onSpreadChange: (value: number) => void
  onStartVelocityChange: (value: number) => void
  onDecayChange: (value: number) => void
  onGravityChange: (value: number) => void
  onTicksChange: (value: number) => void
  onOriginXChange: (value: number) => void
  onOriginYChange: (value: number) => void
  onAngleChange: (value: number) => void
  onScalarChange: (value: number) => void
  onUseCustomColorsChange: (value: boolean) => void
  onCustomColorsChange: (colors: string[]) => void
  onColorInputChange: (value: string) => void
  onShapesChange: (shapes: string[]) => void

  // 액션
  onResetToDefaults: () => void
  onUpdateEffectInPreset: () => void
  onCancelEditMode: () => void
  onFireCustom: () => void
  onCopyToClipboard: (text: string, type: 'main' | number) => Promise<void>
}

/**
 * 커스텀 효과 설정 패널 컴포넌트
 */
export function SettingsPanel(props: SettingsPanelProps) {
  const {
    particleCount,
    spread,
    startVelocity,
    decay,
    gravity,
    ticks,
    originX,
    originY,
    angle,
    scalar,
    useCustomColors,
    customColors,
    colorInput,
    shapes,
    editingPresetIndex,
    editingEffectIndex,
    customPresets,
    currentOptions,
    presetOptions,
    copiedMain,
    onParticleCountChange,
    onSpreadChange,
    onStartVelocityChange,
    onDecayChange,
    onGravityChange,
    onTicksChange,
    onOriginXChange,
    onOriginYChange,
    onAngleChange,
    onScalarChange,
    onUseCustomColorsChange,
    onCustomColorsChange,
    onColorInputChange,
    onShapesChange,
    onResetToDefaults,
    onUpdateEffectInPreset,
    onCancelEditMode,
    onFireCustom,
    onCopyToClipboard,
  } = props

  const addColor = () => {
    if (colorInput && !customColors.includes(colorInput)) {
      onCustomColorsChange([...customColors, colorInput])
    }
  }

  const removeColor = (color: string) => {
    onCustomColorsChange(customColors.filter((c) => c !== color))
  }

  const applyColorPreset = (presetName: keyof typeof COLOR_PRESETS) => {
    const preset = COLOR_PRESETS[presetName]
    onCustomColorsChange(preset as unknown as string[])
    onUseCustomColorsChange(true)
  }

  const toggleShape = (shape: string) => {
    if (shapes.includes(shape)) {
      onShapesChange(shapes.filter((s) => s !== shape))
    } else {
      onShapesChange([...shapes, shape])
    }
  }

  const generateCodePreview = () => {
    if (presetOptions.length === 0) {
      return `fire(${JSON.stringify(currentOptions, null, 2)})`
    }
    return `fire(${JSON.stringify(presetOptions, null, 2)})`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">커스텀 효과 설정</h2>
        <button
          onClick={onResetToDefaults}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          title="모든 옵션을 기본값으로 되돌립니다"
        >
          🔄 기본값으로 리셋
        </button>
      </div>

      {/* 수정 모드 안내 */}
      {editingPresetIndex !== null && editingEffectIndex !== null && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                🔧 수정 모드
              </h3>
              <p className="text-xs text-yellow-800">
                "{customPresets[editingPresetIndex].name}" 프리셋의 효과 {editingEffectIndex + 1}을(를) 수정하고 있습니다
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onUpdateEffectInPreset}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
            >
              ✓ 업데이트
            </button>
            <button
              onClick={onCancelEditMode}
              className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              ✕ 취소
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {/* Particle Count */}
        <OptionSlider
          label={OPTION_INFO.particleCount.label}
          value={particleCount}
          defaultValue={DEFAULT_VALUES.particleCount}
          description={OPTION_INFO.particleCount.description}
          min={OPTION_INFO.particleCount.min}
          max={OPTION_INFO.particleCount.max}
          onChange={onParticleCountChange}
        />

        {/* Spread */}
        <OptionSlider
          label={OPTION_INFO.spread.label}
          value={spread}
          defaultValue={DEFAULT_VALUES.spread}
          description={OPTION_INFO.spread.description}
          min={OPTION_INFO.spread.min}
          max={OPTION_INFO.spread.max}
          onChange={onSpreadChange}
          unit="°"
        />

        {/* Start Velocity */}
        <OptionSlider
          label={OPTION_INFO.startVelocity.label}
          value={startVelocity}
          defaultValue={DEFAULT_VALUES.startVelocity}
          description={OPTION_INFO.startVelocity.description}
          min={OPTION_INFO.startVelocity.min}
          max={OPTION_INFO.startVelocity.max}
          onChange={onStartVelocityChange}
        />

        {/* Gravity */}
        <OptionSlider
          label={OPTION_INFO.gravity.label}
          value={gravity}
          defaultValue={DEFAULT_VALUES.gravity}
          description={OPTION_INFO.gravity.description}
          min={OPTION_INFO.gravity.min}
          max={OPTION_INFO.gravity.max}
          step={OPTION_INFO.gravity.step}
          onChange={onGravityChange}
          decimal={1}
        />

        {/* Decay */}
        <OptionSlider
          label={OPTION_INFO.decay.label}
          value={decay}
          defaultValue={DEFAULT_VALUES.decay}
          description={OPTION_INFO.decay.description}
          min={OPTION_INFO.decay.min}
          max={OPTION_INFO.decay.max}
          step={OPTION_INFO.decay.step}
          onChange={onDecayChange}
          decimal={2}
        />

        {/* Ticks */}
        <OptionSlider
          label={OPTION_INFO.ticks.label}
          value={ticks}
          defaultValue={DEFAULT_VALUES.ticks}
          description={OPTION_INFO.ticks.description}
          min={OPTION_INFO.ticks.min}
          max={OPTION_INFO.ticks.max}
          onChange={onTicksChange}
        />

        {/* Angle */}
        <OptionSlider
          label={OPTION_INFO.angle.label}
          value={angle}
          defaultValue={DEFAULT_VALUES.angle}
          description={OPTION_INFO.angle.description}
          min={OPTION_INFO.angle.min}
          max={OPTION_INFO.angle.max}
          onChange={onAngleChange}
          unit="°"
        />

        {/* Origin X */}
        <OptionSlider
          label={OPTION_INFO.originX.label}
          value={originX}
          defaultValue={DEFAULT_VALUES.originX}
          description={OPTION_INFO.originX.description}
          min={OPTION_INFO.originX.min}
          max={OPTION_INFO.originX.max}
          step={OPTION_INFO.originX.step}
          onChange={onOriginXChange}
          decimal={2}
        />

        {/* Origin Y */}
        <OptionSlider
          label={OPTION_INFO.originY.label}
          value={originY}
          defaultValue={DEFAULT_VALUES.originY}
          description={OPTION_INFO.originY.description}
          min={OPTION_INFO.originY.min}
          max={OPTION_INFO.originY.max}
          step={OPTION_INFO.originY.step}
          onChange={onOriginYChange}
          decimal={2}
        />

        {/* Scalar */}
        <OptionSlider
          label={OPTION_INFO.scalar.label}
          value={scalar}
          defaultValue={DEFAULT_VALUES.scalar}
          description={OPTION_INFO.scalar.description}
          min={OPTION_INFO.scalar.min}
          max={OPTION_INFO.scalar.max}
          step={OPTION_INFO.scalar.step}
          onChange={onScalarChange}
          decimal={1}
          unit="x"
        />

        {/* 색상 옵션 */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">커스텀 색상 사용</label>
            <button
              onClick={() => onUseCustomColorsChange(!useCustomColors)}
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
                  {Object.keys(COLOR_PRESETS).map((presetName) => (
                    <button
                      key={presetName}
                      onClick={() => applyColorPreset(presetName as keyof typeof COLOR_PRESETS)}
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
                    onChange={(e) => onColorInputChange(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => onColorInputChange(e.target.value)}
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
        onClick={onFireCustom}
        className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
      >
        🎨 발사!
      </button>

      {/* 코드 미리보기 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">코드 미리보기</h3>
          <button
            onClick={() => onCopyToClipboard(generateCodePreview(), 'main')}
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
  )
}

// 옵션 슬라이더 컴포넌트
interface OptionSliderProps {
  label: string
  value: number
  defaultValue: number
  description: string
  min: number
  max: number
  step?: number
  unit?: string
  decimal?: number
  onChange: (value: number) => void
}

function OptionSlider({
  label,
  value,
  defaultValue,
  description,
  min,
  max,
  step,
  unit = '',
  decimal = 0,
  onChange,
}: OptionSliderProps) {
  const displayValue = decimal > 0 ? value.toFixed(decimal) : value

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">
          {label}: {displayValue}{unit}
        </label>
        <span className="text-xs text-gray-500">(기본값: {defaultValue})</span>
        <div className="group relative">
          <span className="cursor-help text-gray-400 hover:text-gray-600">ⓘ</span>
          <div className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
            {description}
          </div>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  )
}
