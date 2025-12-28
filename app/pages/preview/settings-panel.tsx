import { useState } from 'react'
import type { ConfettiOptions } from '~/shared/confetti/types'
import type { CustomPreset, CustomColorPreset, CustomShapePreset } from './types'
import { DEFAULT_VALUES, OPTION_INFO } from './constants'
import { EXAMPLE_SHAPE_PRESETS } from './shape-presets'
import { SvgPathPreview } from '~/components/svg-path-preview'
import { FireButton } from './fire-button'
import { formatAsFireCode } from './code-formatter'

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
  flat: boolean
  tiltRangeMin: number
  tiltRangeMax: number
  tiltSpeedMin: number
  tiltSpeedMax: number
  wobbleRangeMin: number
  wobbleRangeMax: number
  wobbleSpeedMin: number
  wobbleSpeedMax: number
  rotation: number
  rotationSpeedMin: number
  rotationSpeedMax: number
  randomRotationDirection: boolean
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
  activeColorPreset: number | null

  // 커스텀 파티클
  useCustomShapes: boolean
  customShapePath: string
  customShapeSvg: string
  customShapeType: 'path' | 'svg'
  customShapeScalar: number
  customShapePresets: CustomShapePreset[]
  selectedCustomShapes: CustomShapePreset[]
  shapePresetName: string
  editingShapePresetIndex: number | null

  // Canvas 바운더리 상태
  useCustomCanvas: boolean

  // 실험적 기능 사용 여부 (분리된 토글)
  useTiltWobble: boolean
  useRotation: boolean
  onUseTiltWobbleChange: (value: boolean) => void
  onUseRotationChange: (value: boolean) => void

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
  onFlatChange: (value: boolean) => void
  onTiltRangeMinChange: (value: number) => void
  onTiltRangeMaxChange: (value: number) => void
  onTiltSpeedMinChange: (value: number) => void
  onTiltSpeedMaxChange: (value: number) => void
  onWobbleRangeMinChange: (value: number) => void
  onWobbleRangeMaxChange: (value: number) => void
  onWobbleSpeedMinChange: (value: number) => void
  onWobbleSpeedMaxChange: (value: number) => void
  onRotationChange: (value: number) => void
  onRotationSpeedMinChange: (value: number) => void
  onRotationSpeedMaxChange: (value: number) => void
  onRandomRotationDirectionChange: (value: boolean) => void
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
  onApplyCustomColorPreset: (preset: CustomColorPreset, index: number) => void
  onDeleteCustomColorPreset: (index: number) => void
  onStartEditingColorPreset: (index: number) => void
  onUpdateCustomColorPreset: () => void
  onCancelEditingColorPreset: () => void

  // 커스텀 파티클 관련
  onUseCustomShapesChange: (value: boolean) => void
  onCustomShapePathChange: (value: string) => void
  onCustomShapeSvgChange: (value: string) => void
  onCustomShapeTypeChange: (value: 'path' | 'svg') => void
  onCustomShapeScalarChange: (value: number) => void
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
  const [activeTab, setActiveTab] = useState<'design' | 'movement' | 'position'>('design')

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
    flat,
    tiltRangeMin,
    tiltRangeMax,
    tiltSpeedMin,
    tiltSpeedMax,
    wobbleRangeMin,
    wobbleRangeMax,
    wobbleSpeedMin,
    wobbleSpeedMax,
    rotation,
    rotationSpeedMin,
    rotationSpeedMax,
    randomRotationDirection,
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
    activeColorPreset,
    useCustomShapes,
    customShapePath,
    customShapeSvg,
    customShapeType,
    customShapeScalar,
    customShapePresets,
    selectedCustomShapes,
    shapePresetName,
    editingShapePresetIndex,
    useCustomCanvas,
    useTiltWobble,
    useRotation,
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
    onFlatChange,
    onTiltRangeMinChange,
    onTiltRangeMaxChange,
    onTiltSpeedMinChange,
    onTiltSpeedMaxChange,
    onWobbleRangeMinChange,
    onWobbleRangeMaxChange,
    onWobbleSpeedMinChange,
    onWobbleSpeedMaxChange,
    onRotationChange,
    onRotationSpeedMinChange,
    onRotationSpeedMaxChange,
    onRandomRotationDirectionChange,
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
    onCustomShapeSvgChange,
    onCustomShapeTypeChange,
    onCustomShapeScalarChange,
    onShapePresetNameChange,
    onAddCustomShapePreset,
    onLoadExampleShape,
    onToggleCustomShape,
    onDeleteCustomShapePreset,
    onStartEditingShapePreset,
    onUpdateCustomShapePreset,
    onCancelEditingShapePreset,
    onUseTiltWobbleChange,
    onUseRotationChange,
  } = props

  const addColor = () => {
    if (colorInput && !customColors.includes(colorInput)) {
      onCustomColorsChange([...customColors, colorInput])
    }
  }

  const removeColor = (color: string) => {
    onCustomColorsChange(customColors.filter((c) => c !== color))
  }

  const toggleShape = (shape: string) => {
    if (shapes.includes(shape)) {
      onShapesChange(shapes.filter((s) => s !== shape))
    } else {
      onShapesChange([...shapes, shape])
    }
  }

  const generateCodePreview = () => {
    const options = presetOptions.length === 0 ? [currentOptions] : presetOptions
    return formatAsFireCode(options, {
      customShapeType,
      customShapePath,
      customShapeSvg,
      customShapeScalar,
      selectedCustomShapes,
    })
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

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'design', label: '🎨 디자인', color: 'purple' },
          { id: 'movement', label: '🏃 움직임', color: 'blue' },
          { id: 'position', label: '📍 위치', color: 'green' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? `border-${tab.color}-600 text-${tab.color}-600 bg-${tab.color}-50/30`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[450px]">
        {/* 디자인 탭: 입자, 색상, 모양 */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

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
                  <label className="block text-xs font-medium text-gray-600 mb-2">색상 프리셋</label>

                  {/* 저장된 커스텀 프리셋 목록 */}
                  {customColorPresets.length > 0 && (
                    <div className="space-y-3">
                      {customColorPresets.map((preset, index) => {
                        const isActive = activeColorPreset === index
                        const isEditing = editingColorPresetIndex === index

                        return (
                          <div
                            key={index}
                            className={`bg-gray-50 rounded-lg transition-colors ${
                              isEditing ? 'border-1 border-yellow-400' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 p-3">
                              <button
                                onClick={() => {
                                  if (!isEditing) {
                                    onApplyCustomColorPreset(preset, index)
                                  }
                                }}
                                disabled={isEditing}
                                className={`flex-1 text-left px-3 py-2 rounded font-medium text-sm transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-purple-50 text-purple-700 shadow-md animate-spin-border'
                                    : isEditing
                                    ? 'bg-yellow-50 text-yellow-800 cursor-not-allowed'
                                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                }`}
                              >
                                {isActive && '✓ '}
                                {preset.name}{' '}
                                <span
                                  className={
                                    isActive
                                      ? 'text-purple-600'
                                      : isEditing
                                      ? 'text-yellow-600'
                                      : 'text-purple-600'
                                  }
                                >
                                  ({preset.colors.length}개 색상)
                                </span>
                              </button>
                              {!isEditing && (
                                <button
                                  onClick={() => onStartEditingColorPreset(index)}
                                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                                  title="이 프리셋 수정"
                                >
                                  수정
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteCustomColorPreset(index)}
                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                              >
                                삭제
                              </button>
                            </div>

                            {/* 색상 칩 미리보기 */}
                            <div className="px-3 pb-3 pt-2 border-t border-gray-200">
                              <label className="block text-xs font-medium text-gray-700 mb-2">
                                색상 ({isEditing ? customColors.length : preset.colors.length}개)
                              </label>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {(isEditing ? customColors : preset.colors).map(
                                  (color, colorIndex) => (
                                    <div
                                      key={colorIndex}
                                      className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1"
                                    >
                                      <div
                                        className="w-4 h-4 rounded border border-gray-300"
                                        style={{ backgroundColor: color }}
                                      />
                                      <span className="text-xs text-gray-800 font-medium">
                                        {color}
                                      </span>
                                      {isEditing && (
                                        <button
                                          onClick={() => removeColor(color)}
                                          className="ml-1 text-red-500 hover:text-red-700 text-xs font-bold"
                                          title="색상 제거"
                                        >
                                          ×
                                        </button>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>

                              {/* 편집 모드일 때만 색상 추가 UI 표시 */}
                              {isEditing && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
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
                                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                      추가
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* 새 프리셋 저장 */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {editingColorPresetIndex === null && (
                      <>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          새 프리셋 만들기
                        </label>

                        {/* 색상 추가 */}
                        <div className="mb-3">
                          <div className="flex gap-2 mb-3">
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

                          {/* 현재 색상 목록 */}
                          {customColors.length > 0 && (
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-2">
                                현재 색상 ({customColors.length}개)
                              </label>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {customColors.map((color, colorIndex) => (
                                  <div
                                    key={colorIndex}
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
                                      title="색상 제거"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 프리셋 이름 및 저장 */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={colorPresetName}
                            onChange={(e) => onColorPresetNameChange(e.target.value)}
                            placeholder="프리셋 이름 입력"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-800"
                          />
                          <button
                            onClick={onSaveCustomColorPreset}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            저장
                          </button>
                        </div>
                      </>
                    )}

                    {/* 편집 모드일 때는 업데이트/취소 버튼만 */}
                    {editingColorPresetIndex !== null && (
                      <div className="flex gap-2">
                        <button
                          onClick={onUpdateCustomColorPreset}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          업데이트
                        </button>
                        <button
                          onClick={onCancelEditingColorPreset}
                          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          취소
                        </button>
                      </div>
                    )}
                  </div>

                  {customColorPresets.length === 0 && (
                    <p className="text-xs text-gray-400 italic">
                      💡 색상 조합을 만들어 프리셋으로 저장하세요
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 모양 옵션 */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">기본 파티클</label>
              <div className="flex gap-2 mb-4">
                {['circle', 'square', 'star'].map((shape) => (
                  <button
                    key={shape}
                    onClick={() => toggleShape(shape)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
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

              {/* 커스텀 파티클 (shapeFromPath / shapeFromSvg) */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">커스텀 파티클</label>
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
                      <p className="font-semibold mb-2">ℹ️ 주의사항:</p>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium mb-1">공통:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                            <li>모든 path는 fill로 처리됩니다 (stroke 미지원)</li>
                            <li>파티클은 단일 색상만 지원합니다</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">SVG Path (권장):</p>
                          <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                            <li>✅ 빠른 렌더링 성능 (Path2D 사용)</li>
                            <li>성능을 위해 matrix를 미리 계산합니다</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Full SVG:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                            <li>⚠️ 상대적으로 느린 성능 (Image 객체 사용)</li>
                            <li>복잡한 그라디언트/색상이 필요할 때만 사용</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 타입 선택 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        입력 타입
                      </label>
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => onCustomShapeTypeChange('path')}
                          className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                            customShapeType === 'path'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          SVG Path (d)
                        </button>
                        <button
                          onClick={() => onCustomShapeTypeChange('svg')}
                          className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                            customShapeType === 'svg'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Full SVG
                        </button>
                      </div>

                      {/* 예시 파티클 불러오기 (이동 및 필터링) */}
                      <div className="pt-1">
                        <label className="block text-[10px] font-medium text-gray-500 mb-2 uppercase tracking-wider">
                          💡 {customShapeType === 'path' ? 'Path' : 'SVG'} 예시 불러오기
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {EXAMPLE_SHAPE_PRESETS.filter((p) => p.type === customShapeType).map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => onLoadExampleShape(preset)}
                              className="px-3 py-2 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors text-xs font-medium border border-gray-200 shadow-sm"
                              title={`${preset.name} ${
                                customShapeType === 'path' ? 'Path' : 'SVG'
                              } 불러오기`}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* SVG Path 입력 */}
                    {customShapeType === 'path' && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            SVG Path 문자열 (d 속성)
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
                      </>
                    )}

                    {/* Full SVG 입력 */}
                    {customShapeType === 'svg' && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Full SVG 마크업
                          </label>
                          <textarea
                            value={customShapeSvg}
                            onChange={(e) => onCustomShapeSvgChange(e.target.value)}
                            placeholder={'<svg viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40"/>\n</svg>'}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 font-mono resize-none"
                            rows={5}
                          />
                        </div>

                        {/* SVG 미리보기 */}
                        {customShapeSvg && (
                          <div className="p-3 bg-gray-50 border border-gray-300 rounded">
                            <label className="block text-xs font-medium text-gray-600 mb-2">미리보기</label>
                            <div className="flex items-center justify-center bg-white rounded p-4 border border-gray-200">
                              <div
                                className="max-w-full [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:w-auto"
                                dangerouslySetInnerHTML={{ __html: customShapeSvg }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* 입력 입자 크기 배율 */}
                    <div className="pt-3 border-t border-gray-100">
                      <OptionSlider
                        label="입력 입자 크기 배율"
                        value={customShapeScalar}
                        defaultValue={1}
                        description="입력한 커스텀 입자의 기본 크기(scalar)를 조절합니다."
                        min={0.1}
                        max={5}
                        step={0.1}
                        onChange={onCustomShapeScalarChange}
                        decimal={1}
                        unit="x"
                      />
                    </div>

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
                                  {preset.type === 'path' && preset.path ? (
                                    <SvgPathPreview
                                      path={preset.path}
                                      width={40}
                                      height={40}
                                      className="text-purple-600"
                                    />
                                  ) : preset.type === 'svg' && preset.svg ? (
                                    <div
                                      className="w-10 h-10 [&>svg]:w-full [&>svg]:h-full"
                                      dangerouslySetInnerHTML={{ __html: preset.svg }}
                                    />
                                  ) : null}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 움직임 탭: 물리 엔진 */}
        {activeTab === 'movement' && (
          <div className="grid grid-cols-2 gap-4">
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

            {/* Flat */}
            <div className="col-span-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {OPTION_INFO.flat.label}
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">{OPTION_INFO.flat.description}</p>
                </div>
                <button
                  onClick={() => onFlatChange(!flat)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    flat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {flat ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* 실험적 기능 */}
            <div className="col-span-2 mt-6">
              {/* 실험적 기능 1: 3D 기울기 및 흔들림 */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧪</span>
                    <h3 className="text-sm font-semibold text-amber-800">3D 기울기 및 흔들림</h3>
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      EXPERIMENTAL
                    </span>
                  </div>
                  <button
                    onClick={() => onUseTiltWobbleChange(!useTiltWobble)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      useTiltWobble
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {useTiltWobble ? 'ON' : 'OFF'}
                  </button>
                </div>

                {!useTiltWobble && (
                  <div className="text-xs text-amber-700 space-y-2 py-2">
                    <p className="font-medium">💡 활성화하면 다음 실험적 기능들을 사용할 수 있습니다:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li><strong>3D 기울기 (Tilt)</strong>: 파티클이 3D 공간에서 회전하는 효과</li>
                      <li><strong>흔들림 (Wobble)</strong>: 파티클이 좌우로 흔들리는 효과</li>
                    </ul>
                  </div>
                )}

                {useTiltWobble && (
                  <>
                    <p className="text-xs text-amber-700 mb-4">
                      파티클이 3D 공간에서 기울어지고 흔들리는 효과입니다. 일부 브라우저에서 예상과 다르게 동작할 수 있습니다.
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        {/* Tilt Range Min */}
                        <OptionSlider
                          label={OPTION_INFO.tiltRangeMin.label}
                          value={tiltRangeMin}
                          defaultValue={DEFAULT_VALUES.tiltRangeMin}
                          description={OPTION_INFO.tiltRangeMin.description}
                          min={OPTION_INFO.tiltRangeMin.min}
                          max={OPTION_INFO.tiltRangeMin.max}
                          onChange={onTiltRangeMinChange}
                          unit="°"
                        />

                        {/* Tilt Range Max */}
                        <OptionSlider
                          label={OPTION_INFO.tiltRangeMax.label}
                          value={tiltRangeMax}
                          defaultValue={DEFAULT_VALUES.tiltRangeMax}
                          description={OPTION_INFO.tiltRangeMax.description}
                          min={OPTION_INFO.tiltRangeMax.min}
                          max={OPTION_INFO.tiltRangeMax.max}
                          onChange={onTiltRangeMaxChange}
                          unit="°"
                        />

                        {/* Tilt Speed Min */}
                        <OptionSlider
                          label={OPTION_INFO.tiltSpeedMin.label}
                          value={tiltSpeedMin}
                          defaultValue={DEFAULT_VALUES.tiltSpeedMin}
                          description={OPTION_INFO.tiltSpeedMin.description}
                          min={OPTION_INFO.tiltSpeedMin.min}
                          max={OPTION_INFO.tiltSpeedMin.max}
                          step={OPTION_INFO.tiltSpeedMin.step}
                          onChange={onTiltSpeedMinChange}
                          decimal={2}
                        />

                        {/* Tilt Speed Max */}
                        <OptionSlider
                          label={OPTION_INFO.tiltSpeedMax.label}
                          value={tiltSpeedMax}
                          defaultValue={DEFAULT_VALUES.tiltSpeedMax}
                          description={OPTION_INFO.tiltSpeedMax.description}
                          min={OPTION_INFO.tiltSpeedMax.min}
                          max={OPTION_INFO.tiltSpeedMax.max}
                          step={OPTION_INFO.tiltSpeedMax.step}
                          onChange={onTiltSpeedMaxChange}
                          decimal={2}
                        />

                        {/* Wobble Range Min */}
                        <OptionSlider
                          label={OPTION_INFO.wobbleRangeMin.label}
                          value={wobbleRangeMin}
                          defaultValue={DEFAULT_VALUES.wobbleRangeMin}
                          description={OPTION_INFO.wobbleRangeMin.description}
                          min={OPTION_INFO.wobbleRangeMin.min}
                          max={OPTION_INFO.wobbleRangeMin.max}
                          onChange={onWobbleRangeMinChange}
                        />

                        {/* Wobble Range Max */}
                        <OptionSlider
                          label={OPTION_INFO.wobbleRangeMax.label}
                          value={wobbleRangeMax}
                          defaultValue={DEFAULT_VALUES.wobbleRangeMax}
                          description={OPTION_INFO.wobbleRangeMax.description}
                          min={OPTION_INFO.wobbleRangeMax.min}
                          max={OPTION_INFO.wobbleRangeMax.max}
                          onChange={onWobbleRangeMaxChange}
                        />

                        {/* Wobble Speed Min */}
                        <OptionSlider
                          label={OPTION_INFO.wobbleSpeedMin.label}
                          value={wobbleSpeedMin}
                          defaultValue={DEFAULT_VALUES.wobbleSpeedMin}
                          description={OPTION_INFO.wobbleSpeedMin.description}
                          min={OPTION_INFO.wobbleSpeedMin.min}
                          max={OPTION_INFO.wobbleSpeedMin.max}
                          step={OPTION_INFO.wobbleSpeedMin.step}
                          onChange={onWobbleSpeedMinChange}
                          decimal={2}
                        />

                        {/* Wobble Speed Max */}
                        <OptionSlider
                          label={OPTION_INFO.wobbleSpeedMax.label}
                          value={wobbleSpeedMax}
                          defaultValue={DEFAULT_VALUES.wobbleSpeedMax}
                          description={OPTION_INFO.wobbleSpeedMax.description}
                          min={OPTION_INFO.wobbleSpeedMax.min}
                          max={OPTION_INFO.wobbleSpeedMax.max}
                          step={OPTION_INFO.wobbleSpeedMax.step}
                          onChange={onWobbleSpeedMaxChange}
                          decimal={2}
                        />
                      </div>
                  </>
                )}
              </div>

              {/* 실험적 기능 2: 평면 회전 (Z축) */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧪</span>
                    <h3 className="text-sm font-semibold text-amber-800">평면 회전 (Z축)</h3>
                    <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      EXPERIMENTAL
                    </span>
                  </div>
                  <button
                    onClick={() => onUseRotationChange(!useRotation)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      useRotation
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {useRotation ? 'ON' : 'OFF'}
                  </button>
                </div>

                {!useRotation && (
                  <div className="text-xs text-amber-700 space-y-2 py-2">
                    <p className="font-medium">💡 활성화하면 다음 실험적 기능을 사용할 수 있습니다:</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                      <li><strong>평면 회전 (Z축)</strong>: 파티클이 평면 상에서 회전하는 효과</li>
                    </ul>
                  </div>
                )}

                {useRotation && (
                  <>
                    <p className="text-xs text-amber-700 mb-4">
                      파티클이 평면에서 회전하는 효과입니다. SVG를 포함한 모든 파티클 형태에 적용됩니다.
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        {/* Rotation */}
                        <OptionSlider
                          label={OPTION_INFO.rotation.label}
                          value={rotation}
                          defaultValue={DEFAULT_VALUES.rotation}
                          description={OPTION_INFO.rotation.description}
                          min={OPTION_INFO.rotation.min}
                          max={OPTION_INFO.rotation.max}
                          onChange={onRotationChange}
                          unit="°"
                        />

                        {/* Rotation Direction Random Toggle */}
                        <div className="flex flex-col justify-center gap-1.5 p-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">방향 랜덤</span>
                            <button
                              onClick={() =>
                                onRandomRotationDirectionChange(!randomRotationDirection)
                              }
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                randomRotationDirection
                                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {randomRotationDirection ? 'ON' : 'OFF'}
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-400">
                            활성화 시 각 파티클이 시계/반시계 방향으로 무작위 회전합니다.
                          </p>
                        </div>

                        {/* Rotation Speed Min */}
                        <OptionSlider
                          label={OPTION_INFO.rotationSpeedMin.label}
                          value={rotationSpeedMin}
                          defaultValue={DEFAULT_VALUES.rotationSpeedMin}
                          description={OPTION_INFO.rotationSpeedMin.description}
                          min={OPTION_INFO.rotationSpeedMin.min}
                          max={OPTION_INFO.rotationSpeedMin.max}
                          step={OPTION_INFO.rotationSpeedMin.step}
                          onChange={onRotationSpeedMinChange}
                          decimal={1}
                        />

                        {/* Rotation Speed Max */}
                        <OptionSlider
                          label={OPTION_INFO.rotationSpeedMax.label}
                          value={rotationSpeedMax}
                          defaultValue={DEFAULT_VALUES.rotationSpeedMax}
                          description={OPTION_INFO.rotationSpeedMax.description}
                          min={OPTION_INFO.rotationSpeedMax.min}
                          max={OPTION_INFO.rotationSpeedMax.max}
                          step={OPTION_INFO.rotationSpeedMax.step}
                          onChange={onRotationSpeedMaxChange}
                          decimal={1}
                        />
                      </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 위치 탭: 발사 각도 및 원점 */}
        {activeTab === 'position' && (
          <div className="grid grid-cols-2 gap-4">
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

            <div className="hidden md:block"></div>

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
          </div>
        )}

      </div>

      {/* 하단 액션 버튼 영역 (글로벌) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        {editingPresetIndex !== null && editingEffectIndex !== null ? (
          // 수정 모드
          <div className="animate-fade-in-simple space-y-2">
            {!useCustomCanvas && (
              <button
                onClick={onFireCustom}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-sm hover:from-purple-700 hover:to-blue-700 active:scale-[0.98] transition-[transform,colors,shadow] duration-200 shadow-lg hover:shadow-xl will-change-transform select-none"
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
          // 일반 모드
          !useCustomCanvas && (
            <div className="animate-fade-in-simple">
              <FireButton onFire={onFireCustom} label="효과 테스트" />
            </div>
          )
        )}
      </div>

      {/* 코드 미리보기 (글로벌) */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setIsCodePreviewExpanded(!isCodePreviewExpanded)}
            className="relative flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors pl-5 cursor-pointer"
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
          <div className="hidden group-hover:block absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
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
