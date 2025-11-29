import { useState } from 'react'
import type { Options as ConfettiOptions } from 'canvas-confetti'
import type { CustomPreset, CustomColorPreset, CustomShapePreset } from './types'
import { DEFAULT_VALUES, OPTION_INFO, COLOR_PRESETS } from './constants'
import { EXAMPLE_SHAPE_PRESETS } from './shape-presets'
import { SvgPathPreview } from '~/components/svg-path-preview'
import { FireButton } from './fire-button'

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
  drift: number
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

  // 커스텀 색상 프리셋
  customColorPresets: CustomColorPreset[]
  colorPresetName: string
  editingColorPresetIndex: number | null

  // 커스텀 파티클
  useCustomShapes: boolean
  customShapePath: string
  customShapePresets: CustomShapePreset[]
  selectedCustomShapes: CustomShapePreset[]
  shapePresetName: string
  editingShapePresetIndex: number | null

  // Canvas 바운더리 상태
  useCustomCanvas: boolean

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
  onDriftChange: (value: number) => void
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
  onColorPresetNameChange: (value: string) => void
  onSaveCustomColorPreset: () => void
  onApplyCustomColorPreset: (preset: CustomColorPreset) => void
  onDeleteCustomColorPreset: (index: number) => void
  onStartEditingColorPreset: (index: number) => void
  onUpdateCustomColorPreset: () => void
  onCancelEditingColorPreset: () => void

  // 커스텀 파티클 관련
  onUseCustomShapesChange: (value: boolean) => void
  onCustomShapePathChange: (value: string) => void
  onShapePresetNameChange: (value: string) => void
  onAddCustomShapePreset: () => void
  onLoadExampleShape: (preset: CustomShapePreset) => void
  onToggleCustomShape: (preset: CustomShapePreset) => void
  onDeleteCustomShapePreset: (index: number) => void
  onStartEditingShapePreset: (index: number) => void
  onUpdateCustomShapePreset: () => void
  onCancelEditingShapePreset: () => void
}

/**
 * 커스텀 효과 설정 패널 컴포넌트
 */
export function SettingsPanel(props: SettingsPanelProps) {
  const [isCodePreviewExpanded, setIsCodePreviewExpanded] = useState(false)

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
    drift,
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
    customColorPresets,
    colorPresetName,
    editingColorPresetIndex,
    useCustomShapes,
    customShapePath,
    customShapePresets,
    selectedCustomShapes,
    shapePresetName,
    editingShapePresetIndex,
    useCustomCanvas,
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
    onDriftChange,
    onUseCustomColorsChange,
    onCustomColorsChange,
    onColorInputChange,
    onShapesChange,
    onResetToDefaults,
    onUpdateEffectInPreset,
    onCancelEditMode,
    onFireCustom,
    onCopyToClipboard,
    onColorPresetNameChange,
    onSaveCustomColorPreset,
    onApplyCustomColorPreset,
    onDeleteCustomColorPreset,
    onStartEditingColorPreset,
    onUpdateCustomColorPreset,
    onCancelEditingColorPreset,
    onUseCustomShapesChange,
    onCustomShapePathChange,
    onShapePresetNameChange,
    onAddCustomShapePreset,
    onLoadExampleShape,
    onToggleCustomShape,
    onDeleteCustomShapePreset,
    onStartEditingShapePreset,
    onUpdateCustomShapePreset,
    onCancelEditingShapePreset,
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
    <div
      className={`bg-white rounded-lg shadow-md p-6 transition-all ${
        editingPresetIndex !== null && editingEffectIndex !== null ? 'ring-1 ring-yellow-400' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">효과 설정</h2>
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
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-400 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">🔧 수정 모드</h3>
          <p className="text-xs text-yellow-700">
            "{customPresets[editingPresetIndex].name}" 프리셋의 효과 {editingEffectIndex + 1}
            을(를) 수정하고 있습니다
          </p>
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

        {/* Drift */}
        <OptionSlider
          label={OPTION_INFO.drift.label}
          value={drift}
          defaultValue={DEFAULT_VALUES.drift}
          description={OPTION_INFO.drift.description}
          min={OPTION_INFO.drift.min}
          max={OPTION_INFO.drift.max}
          step={OPTION_INFO.drift.step}
          onChange={onDriftChange}
          decimal={1}
        />

        {/* 색상 옵션 */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">커스텀 색상 사용</label>
            <button
              onClick={() => onUseCustomColorsChange(!useCustomColors)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                useCustomColors ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {useCustomColors ? 'ON' : 'OFF'}
            </button>
          </div>

          {useCustomColors && (
            <div className="space-y-3">
              {/* 기본 색상 프리셋 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  기본 색상 프리셋
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

              {/* 커스텀 색상 프리셋 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  커스텀 색상 프리셋
                </label>

                {/* 프리셋 저장/업데이트 */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={colorPresetName}
                    onChange={(e) => onColorPresetNameChange(e.target.value)}
                    placeholder="프리셋 이름"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs text-gray-800"
                  />
                  {editingColorPresetIndex !== null ? (
                    <>
                      <button
                        onClick={onUpdateCustomColorPreset}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
                      >
                        업데이트
                      </button>
                      <button
                        onClick={onCancelEditingColorPreset}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onSaveCustomColorPreset}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
                    >
                      저장
                    </button>
                  )}
                </div>

                {/* 저장된 커스텀 프리셋 목록 */}
                {customColorPresets.length > 0 && (
                  <div className="space-y-1">
                    {customColorPresets.map((preset, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded border transition-colors ${
                          editingColorPresetIndex === index
                            ? 'bg-yellow-50 border-yellow-400'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => onApplyCustomColorPreset(preset)}
                          className="flex-1 text-left text-xs font-semibold text-gray-800 hover:text-gray-900"
                        >
                          {preset.name}
                          <span className="ml-1 text-gray-600">({preset.colors.length}개)</span>
                        </button>
                        <button
                          onClick={() => onStartEditingColorPreset(index)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                          title="이 프리셋 수정"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => onDeleteCustomColorPreset(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {customColorPresets.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    현재 색상 조합을 저장하여 나중에 재사용하세요
                  </p>
                )}
              </div>

              {/* 현재 색상 목록 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">현재 색상</label>
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
                <label className="block text-xs font-medium text-gray-600 mb-2">색상 추가</label>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
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
                    ? 'bg-blue-600 text-white'
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

        {/* 커스텀 파티클 (shapeFromPath) */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">커스텀 파티클 (SVG Path)</label>
            <button
              onClick={() => onUseCustomShapesChange(!useCustomShapes)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                useCustomShapes
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {useCustomShapes ? 'ON' : 'OFF'}
            </button>
          </div>

          {useCustomShapes && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
              {/* 주의사항 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-gray-700">
                <p className="font-semibold mb-1">ℹ️ 주의사항:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>모든 path는 fill로 처리됩니다 (stroke 미지원)</li>
                  <li>파티클은 단일 색상만 지원합니다</li>
                  <li>성능을 위해 matrix를 미리 계산합니다</li>
                </ul>
              </div>

              {/* SVG Path 입력 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  SVG Path 문자열
                </label>
                <textarea
                  value={customShapePath}
                  onChange={(e) => onCustomShapePathChange(e.target.value)}
                  placeholder="예: M0 10 L5 0 L10 10z"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 font-mono resize-none"
                  rows={3}
                />
              </div>

              {/* SVG 미리보기 */}
              {customShapePath && (
                <div className="p-3 bg-gray-50 border border-gray-300 rounded">
                  <label className="block text-xs font-medium text-gray-600 mb-2">미리보기</label>
                  <div className="flex items-center justify-center bg-white rounded p-4 border border-gray-200">
                    <SvgPathPreview
                      path={customShapePath}
                      width={100}
                      height={100}
                      className="text-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* 커스텀 파티클 저장 */}
              <div className="pt-3 border-t border-gray-300">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  커스텀 파티클 이름
                </label>
                <input
                  type="text"
                  value={shapePresetName}
                  onChange={(e) => onShapePresetNameChange(e.target.value)}
                  placeholder="예: 하트, 삼각형"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 mb-2"
                />
                <div className="flex gap-2">
                  {editingShapePresetIndex !== null ? (
                    <>
                      <button
                        onClick={onUpdateCustomShapePreset}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
                      >
                        업데이트
                      </button>
                      <button
                        onClick={onCancelEditingShapePreset}
                        className="flex-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onAddCustomShapePreset}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
                    >
                      저장
                    </button>
                  )}
                </div>
              </div>

              {/* 저장된 커스텀 파티클 목록 */}
              {customShapePresets.length > 0 && (
                <div className="pt-3 border-t border-gray-300">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    저장된 커스텀 파티클
                  </label>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {customShapePresets.map((preset, index) => {
                      const isSelected = selectedCustomShapes.some((s) => s.name === preset.name)
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded border transition-colors ${
                            editingShapePresetIndex === index
                              ? 'bg-yellow-50 border-yellow-400'
                              : isSelected
                              ? 'bg-blue-50 border-blue-400'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {/* 상단: 이름 및 버튼 */}
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => onToggleCustomShape(preset)}
                              className={`flex-1 text-left text-xs font-semibold transition-colors cursor-pointer ${
                                isSelected ? 'text-blue-700' : 'text-gray-800 hover:text-gray-900'
                              }`}
                              title={isSelected ? '선택 해제' : '선택하여 사용'}
                            >
                              {isSelected && '✓ '}
                              {preset.name}
                            </button>
                            <button
                              onClick={() => onStartEditingShapePreset(index)}
                              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                              title="수정"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => onDeleteCustomShapePreset(index)}
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                            >
                              삭제
                            </button>
                          </div>

                          {/* 하단: 미리보기 */}
                          <div className="flex items-center justify-center bg-gray-50 rounded p-2 border border-gray-200">
                            <SvgPathPreview
                              path={preset.path}
                              width={40}
                              height={40}
                              className="text-purple-600"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 예시 파티클 */}
              <div className="pt-3 border-t border-gray-300">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  💡 예시 파티클 불러오기
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EXAMPLE_SHAPE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => onLoadExampleShape(preset)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs font-medium border border-gray-300"
                      title={`${preset.name} Path 불러오기`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 액션 버튼 영역 */}
      {editingPresetIndex !== null && editingEffectIndex !== null ? (
        // 수정 모드: 항상 표시 (업데이트/취소는 항상, 테스트는 Canvas OFF일 때만)
        <div className="animate-fade-in space-y-2">
          {!useCustomCanvas && (
            <button
              onClick={onFireCustom}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-sm hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              🎉 {customPresets[editingPresetIndex].name} 효과 {editingEffectIndex + 1} 테스트
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={onUpdateEffectInPreset}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              ✓ 업데이트
            </button>
            <button
              onClick={onCancelEditMode}
              className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg font-bold text-sm hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
            >
              ✕ 취소
            </button>
          </div>
        </div>
      ) : (
        // 일반 모드: Canvas OFF일 때만 fire 버튼
        !useCustomCanvas && (
          <div className="animate-fade-in">
            <FireButton onFire={onFireCustom} label="효과 테스트" />
          </div>
        )
      )}

      {/* 코드 미리보기 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setIsCodePreviewExpanded(!isCodePreviewExpanded)}
            className="relative flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors pl-5"
          >
            <span
              className={`absolute left-0 text-xs transition-transform duration-200 ${
                isCodePreviewExpanded ? 'rotate-90' : 'rotate-0'
              }`}
            >
              ▶
            </span>
            코드 미리보기
          </button>
          {isCodePreviewExpanded && (
            <button
              onClick={() => onCopyToClipboard(generateCodePreview(), 'main')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
              title="코드 복사"
            >
              {copiedMain ? '✓ 복사됨!' : '📋 복사'}
            </button>
          )}
        </div>
        {isCodePreviewExpanded && (
          <>
            <div className="bg-gray-900 rounded p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
                <code>{generateCodePreview()}</code>
              </pre>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              useConfetti 훅을 사용하여 위 코드로 confetti를 실행할 수 있습니다
            </p>
          </>
        )}
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
          {label}: {displayValue}
          {unit}
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
