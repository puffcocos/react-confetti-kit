import { useState } from 'react'
import type { Options as ConfettiOptions } from 'canvas-confetti'
import { confettiPresets } from '~/components/presets'
import { useConfetti } from '~/components/use-confetti'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { PresetSection } from './PresetSection'
import { CustomPresetSection } from './CustomPresetSection'
import { SettingsPanel } from './SettingsPanel'
import { DEFAULT_VALUES } from './constants'
import type { CustomPreset, CustomColorPreset } from './types'

/**
 * Confetti 미리보기 페이지
 */
export function PreviewPage() {
  const fire = useConfetti()
  const [selectedPreset, setSelectedPreset] = useState<string>('celebration')

  // 커스텀 옵션 상태
  const [particleCount, setParticleCount] = useState<number>(DEFAULT_VALUES.particleCount)
  const [spread, setSpread] = useState<number>(DEFAULT_VALUES.spread)
  const [startVelocity, setStartVelocity] = useState<number>(DEFAULT_VALUES.startVelocity)
  const [decay, setDecay] = useState<number>(DEFAULT_VALUES.decay)
  const [gravity, setGravity] = useState<number>(DEFAULT_VALUES.gravity)
  const [ticks, setTicks] = useState<number>(DEFAULT_VALUES.ticks)
  const [originX, setOriginX] = useState<number>(DEFAULT_VALUES.originX)
  const [originY, setOriginY] = useState<number>(DEFAULT_VALUES.originY)
  const [angle, setAngle] = useState<number>(DEFAULT_VALUES.angle)
  const [scalar, setScalar] = useState<number>(DEFAULT_VALUES.scalar)
  const [drift, setDrift] = useState<number>(DEFAULT_VALUES.drift)

  // 색상 옵션
  const [useCustomColors, setUseCustomColors] = useState(false)
  const [customColors, setCustomColors] = useState<string[]>(['#ff0000', '#00ff00', '#0000ff'])
  const [colorInput, setColorInput] = useState('#ff0000')

  // 커스텀 색상 프리셋 (로컬 스토리지 동기화)
  const [customColorPresets, setCustomColorPresets] = useLocalStorage<CustomColorPreset[]>(
    'confetti-custom-color-presets',
    [],
  )
  const [colorPresetName, setColorPresetName] = useState('')

  // 모양 옵션
  const [shapes, setShapes] = useState<string[]>(['square', 'circle'])

  // 커스텀 프리셋 저장 (로컬 스토리지 동기화)
  const [customPresets, setCustomPresets] = useLocalStorage<CustomPreset[]>(
    'confetti-custom-presets',
    [],
  )
  const [presetName, setPresetName] = useState('')
  const [presetOptions, setPresetOptions] = useState<ConfettiOptions[]>([])

  // 복사 상태 관리
  const [copiedMain, setCopiedMain] = useState(false)
  const [copiedPresetIndex, setCopiedPresetIndex] = useState<number | null>(null)

  // 프리셋 수정 모드
  const [editingPresetIndex, setEditingPresetIndex] = useState<number | null>(null)
  const [editingEffectIndex, setEditingEffectIndex] = useState<number | null>(null)

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
    drift,
    ...(useCustomColors && customColors.length > 0 ? { colors: customColors } : {}),
    ...(shapes.length > 0 ? { shapes: shapes as any } : {}),
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
    setDrift(DEFAULT_VALUES.drift)
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

  // 저장된 프리셋에 효과 추가
  const addEffectToSavedPreset = (presetIndex: number) => {
    const updatedPresets = [...customPresets]
    updatedPresets[presetIndex].options = [
      ...updatedPresets[presetIndex].options,
      currentOptions,
    ]
    setCustomPresets(updatedPresets)
    alert(
      `"${customPresets[presetIndex].name}" 프리셋에 효과가 추가되었습니다! (총 ${updatedPresets[presetIndex].options.length}개 효과)`
    )
  }

  // 기본 프리셋 복사
  const copyPresetToCustom = (presetName: string) => {
    const preset = confettiPresets[presetName as keyof typeof confettiPresets]
    setPresetOptions([...preset])
    setPresetName(`${presetName}_복사본`)
    alert(
      `"${presetName}" 프리셋이 복사되었습니다! (${preset.length}개 효과)\n프리셋 구성 영역에서 수정 후 저장하세요.`
    )
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

  // 효과를 우측 설정 메뉴로 로드
  const loadEffectToSettings = (presetIndex: number, effectIndex: number) => {
    const effect = customPresets[presetIndex].options[effectIndex]

    setParticleCount(effect.particleCount ?? DEFAULT_VALUES.particleCount)
    setSpread(effect.spread ?? DEFAULT_VALUES.spread)
    setStartVelocity(effect.startVelocity ?? DEFAULT_VALUES.startVelocity)
    setDecay(effect.decay ?? DEFAULT_VALUES.decay)
    setGravity(effect.gravity ?? DEFAULT_VALUES.gravity)
    setTicks(effect.ticks ?? DEFAULT_VALUES.ticks)
    setOriginX(effect.origin?.x ?? DEFAULT_VALUES.originX)
    setOriginY(effect.origin?.y ?? DEFAULT_VALUES.originY)
    setAngle(effect.angle ?? DEFAULT_VALUES.angle)
    setScalar(effect.scalar ?? DEFAULT_VALUES.scalar)
    setDrift(effect.drift ?? DEFAULT_VALUES.drift)

    if (effect.colors && effect.colors.length > 0) {
      setCustomColors(effect.colors)
      setUseCustomColors(true)
    }

    if (effect.shapes && effect.shapes.length > 0) {
      setShapes(effect.shapes as string[])
    }

    setEditingPresetIndex(presetIndex)
    setEditingEffectIndex(effectIndex)
  }

  // 현재 설정으로 효과 업데이트
  const updateEffectInPreset = () => {
    if (editingPresetIndex === null || editingEffectIndex === null) return

    const updatedPresets = [...customPresets]
    updatedPresets[editingPresetIndex].options[editingEffectIndex] = currentOptions

    setCustomPresets(updatedPresets)
    setEditingPresetIndex(null)
    setEditingEffectIndex(null)
    alert('효과가 업데이트되었습니다!')
  }

  // 수정 모드 취소
  const cancelEditMode = () => {
    setEditingPresetIndex(null)
    setEditingEffectIndex(null)
    resetToDefaults()
  }

  // 커스텀 색상 프리셋 저장
  const saveCustomColorPreset = () => {
    if (!colorPresetName.trim()) {
      alert('색상 프리셋 이름을 입력해주세요')
      return
    }

    if (customColors.length === 0) {
      alert('최소 1개 이상의 색상을 추가해주세요')
      return
    }

    const newColorPreset: CustomColorPreset = {
      name: colorPresetName,
      colors: [...customColors],
    }

    setCustomColorPresets([...customColorPresets, newColorPreset])
    setColorPresetName('')
    alert(`"${colorPresetName}" 색상 프리셋이 저장되었습니다! (${customColors.length}개 색상)`)
  }

  // 커스텀 색상 프리셋 적용
  const applyCustomColorPreset = (preset: CustomColorPreset) => {
    setCustomColors(preset.colors)
    setUseCustomColors(true)
  }

  // 커스텀 색상 프리셋 삭제
  const deleteCustomColorPreset = (index: number) => {
    setCustomColorPresets(customColorPresets.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Confetti 미리보기</h1>
        <p className="text-gray-600 mb-8">다양한 옵션을 조절하며 confetti 효과를 테스트해보세요</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 프리셋 & 특수 효과 */}
          <div className="space-y-6">
            <PresetSection
              selectedPreset={selectedPreset}
              onFirePreset={firePreset}
              onCopyPreset={copyPresetToCustom}
            />

            <CustomPresetSection
              presetOptions={presetOptions}
              presetName={presetName}
              customPresets={customPresets}
              editingPresetIndex={editingPresetIndex}
              editingEffectIndex={editingEffectIndex}
              onAddToPreset={addToPreset}
              onRemoveFromPreset={removeFromPreset}
              onPresetNameChange={setPresetName}
              onSaveCustomPreset={saveCustomPreset}
              onFireCustomPreset={fireCustomPreset}
              onDeleteCustomPreset={deleteCustomPreset}
              onLoadEffectToSettings={loadEffectToSettings}
              onAddEffectToSavedPreset={addEffectToSavedPreset}
              onCopyToClipboard={copyToClipboard}
              copiedPresetIndex={copiedPresetIndex}
            />
          </div>

          {/* 오른쪽: 커스텀 효과 설정 */}
          <SettingsPanel
            particleCount={particleCount}
            spread={spread}
            startVelocity={startVelocity}
            decay={decay}
            gravity={gravity}
            ticks={ticks}
            originX={originX}
            originY={originY}
            angle={angle}
            scalar={scalar}
            drift={drift}
            useCustomColors={useCustomColors}
            customColors={customColors}
            colorInput={colorInput}
            shapes={shapes}
            editingPresetIndex={editingPresetIndex}
            editingEffectIndex={editingEffectIndex}
            customPresets={customPresets}
            currentOptions={currentOptions}
            presetOptions={presetOptions}
            copiedMain={copiedMain}
            customColorPresets={customColorPresets}
            colorPresetName={colorPresetName}
            onParticleCountChange={setParticleCount}
            onSpreadChange={setSpread}
            onStartVelocityChange={setStartVelocity}
            onDecayChange={setDecay}
            onGravityChange={setGravity}
            onTicksChange={setTicks}
            onOriginXChange={setOriginX}
            onOriginYChange={setOriginY}
            onAngleChange={setAngle}
            onScalarChange={setScalar}
            onDriftChange={setDrift}
            onUseCustomColorsChange={setUseCustomColors}
            onCustomColorsChange={setCustomColors}
            onColorInputChange={setColorInput}
            onShapesChange={setShapes}
            onResetToDefaults={resetToDefaults}
            onUpdateEffectInPreset={updateEffectInPreset}
            onCancelEditMode={cancelEditMode}
            onFireCustom={fireCustom}
            onCopyToClipboard={copyToClipboard}
            onColorPresetNameChange={setColorPresetName}
            onSaveCustomColorPreset={saveCustomColorPreset}
            onApplyCustomColorPreset={applyCustomColorPreset}
            onDeleteCustomColorPreset={deleteCustomColorPreset}
          />
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
