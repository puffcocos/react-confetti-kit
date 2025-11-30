import { useState, useRef, useEffect } from 'react'
import type { Options as ConfettiOptions } from 'canvas-confetti'
import { confettiPresets } from '~/shared/confetti/presets'
import { useConfetti } from '~/shared/confetti/use-confetti'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { useSessionStorage } from '~/hooks/use-session-storage'
import { PresetSection } from './preset-section'
import { CustomPresetSection } from './custom-preset-section'
import { SettingsPanel } from './settings-panel'
import { FireButton } from './fire-button'
import { DEFAULT_VALUES } from './constants'
import type { CustomPreset, CustomColorPreset, CustomShapePreset } from './types'

/**
 * Confetti 미리보기 페이지
 */
export function PreviewPage() {
  const { fire, createShape, setConfettiCanvasRef } = useConfetti()
  const [useCustomCanvas, setUseCustomCanvas] = useState(false)

  // 활성화된 프리셋 상태
  const [activeBuiltInPreset, setActiveBuiltInPreset] = useState<string | null>(null)
  const [activeCustomPreset, setActiveCustomPreset] = useState<number | null>(null)

  // 세션 스토리지와 동기화되는 Canvas 크기 상태
  const [canvasWidth, setCanvasWidth] = useSessionStorage<number | null>(
    'confetti-canvas-width',
    null
  )
  const [canvasHeight, setCanvasHeight] = useSessionStorage<number>('confetti-canvas-height', 400)
  const [maxCanvasWidth, setMaxCanvasWidth] = useState<number>(472) // 동적 최대 너비
  const canvasContainerRef = useRef<HTMLDivElement>(null)

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
    []
  )
  const [colorPresetName, setColorPresetName] = useState('')

  // 모양 옵션
  const [shapes, setShapes] = useState<string[]>(['square', 'circle'])

  // 커스텀 프리셋 저장 (로컬 스토리지 동기화)
  const [customPresets, setCustomPresets] = useLocalStorage<CustomPreset[]>(
    'confetti-custom-presets',
    []
  )
  const [presetName, setPresetName] = useState('')
  const [presetOptions, setPresetOptions] = useState<ConfettiOptions[]>([])

  // 복사 상태 관리
  const [copiedMain, setCopiedMain] = useState(false)
  const [copiedPresetIndex, setCopiedPresetIndex] = useState<number | null>(null)

  // 프리셋 수정 모드
  const [editingPresetIndex, setEditingPresetIndex] = useState<number | null>(null)
  const [editingEffectIndex, setEditingEffectIndex] = useState<number | null>(null)

  // 색상 프리셋 수정 모드
  const [editingColorPresetIndex, setEditingColorPresetIndex] = useState<number | null>(null)

  // 커스텀 파티클 옵션
  const [useCustomShapes, setUseCustomShapes] = useState(false)
  const [customShapePath, setCustomShapePath] = useState('')
  const [customShapePresets, setCustomShapePresets] = useLocalStorage<CustomShapePreset[]>(
    'confetti-custom-shape-presets',
    []
  )
  const [selectedCustomShapes, setSelectedCustomShapes] = useState<CustomShapePreset[]>([])
  const [shapePresetName, setShapePresetName] = useState('')
  const [editingShapePresetIndex, setEditingShapePresetIndex] = useState<number | null>(null)

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
    ...(() => {
      // 커스텀 파티클과 기본 도형 결합
      const allShapes: any[] = []

      // 기본 도형 추가
      if (!useCustomShapes && shapes.length > 0) {
        allShapes.push(...shapes)
      }

      // 커스텀 파티클 추가
      if (useCustomShapes) {
        // 입력 중인 Path가 있으면 바로 사용 (저장하지 않아도 테스트 가능)
        if (customShapePath.trim()) {
          try {
            const shape = createShape({ path: customShapePath })
            allShapes.push(shape)
          } catch (error) {
            console.error('Invalid custom shape path:', error)
          }
        }

        // 선택된 저장된 파티클도 추가
        if (selectedCustomShapes.length > 0) {
          const customShapes = selectedCustomShapes.map((preset) =>
            createShape({ path: preset.path, matrix: preset.matrix })
          )
          allShapes.push(...customShapes)
        }

        // 기본 도형도 함께 사용
        if (shapes.length > 0) {
          allShapes.push(...shapes)
        }
      }

      return allShapes.length > 0 ? { shapes: allShapes } : {}
    })(),
  }

  // Canvas 최대 너비 계산 (viewport 크기에 따라 동적으로 업데이트)
  useEffect(() => {
    const updateMaxWidth = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.offsetWidth
        // 컨테이너 너비에서 Sticky Canvas 영역의 패딩과 border를 빼기
        // p-4 (16px * 2) + border-4 (4px * 2) = 40px
        const maxWidth = containerWidth - 40
        setMaxCanvasWidth(maxWidth)
        // 현재 너비가 새로운 최대값을 초과하면 조정
        if (canvasWidth !== null && canvasWidth > maxWidth) {
          setCanvasWidth(maxWidth)
        }
      }
    }

    updateMaxWidth()
    window.addEventListener('resize', updateMaxWidth)
    return () => window.removeEventListener('resize', updateMaxWidth)
  }, [canvasWidth])

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
    setUseCustomShapes(false)
    setCustomShapePath('')
    setSelectedCustomShapes([])
  }

  // 기본 프리셋 선택 및 즉시 실행
  const selectBuiltInPreset = (presetName: string) => {
    setActiveCustomPreset(null) // 커스텀 프리셋 비활성화

    // 즉시 프리셋 실행
    const preset = confettiPresets[presetName as keyof typeof confettiPresets]
    fire(preset)

    // 클릭 시 짧은 활성화 효과 (보랏빛 표시)
    setActiveBuiltInPreset(presetName)
    setTimeout(() => {
      setActiveBuiltInPreset(null)
    }, 200)
  }

  // 활성화된 프리셋 또는 커스텀 효과 실행
  const fireActivePreset = () => {
    if (activeBuiltInPreset) {
      // 기본 프리셋 실행
      const preset = confettiPresets[activeBuiltInPreset as keyof typeof confettiPresets]
      fire(preset)
    } else if (activeCustomPreset !== null) {
      // 커스텀 프리셋 실행
      const preset = customPresets[activeCustomPreset]
      fire(preset.options)
    } else {
      // 프리셋이 선택되지 않은 경우 우측 커스텀 효과 실행
      fire(currentOptions)
    }
  }

  // 커스텀 프리셋만 실행 (커스텀 프리셋 섹션의 fire! 버튼용)
  const fireCustomPreset = () => {
    if (activeCustomPreset !== null) {
      const preset = customPresets[activeCustomPreset]
      fire(preset.options)
    }
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

  // 커스텀 프리셋 선택 (활성화만 하고 실행하지 않음)
  const selectCustomPreset = (index: number) => {
    // 같은 프리셋을 다시 클릭하면 선택 해제
    if (activeCustomPreset === index) {
      setActiveCustomPreset(null)
    } else {
      setActiveCustomPreset(index)
      setActiveBuiltInPreset(null) // 기본 프리셋 비활성화
    }
  }

  // 커스텀 프리셋 삭제
  const deleteCustomPreset = (index: number) => {
    setCustomPresets(customPresets.filter((_, i) => i !== index))
  }

  // 저장된 프리셋에 효과 추가
  const addEffectToSavedPreset = (presetIndex: number) => {
    const updatedPresets = [...customPresets]
    updatedPresets[presetIndex].options = [...updatedPresets[presetIndex].options, currentOptions]
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

  // 커스텀 색상 프리셋 수정 시작
  const startEditingColorPreset = (index: number) => {
    const preset = customColorPresets[index]
    setCustomColors(preset.colors)
    setColorPresetName(preset.name)
    setEditingColorPresetIndex(index)
    setUseCustomColors(true)
  }

  // 커스텀 색상 프리셋 업데이트
  const updateCustomColorPreset = () => {
    if (editingColorPresetIndex === null) return

    if (!colorPresetName.trim()) {
      alert('색상 프리셋 이름을 입력해주세요')
      return
    }

    if (customColors.length === 0) {
      alert('최소 1개 이상의 색상을 추가해주세요')
      return
    }

    const updatedPresets = [...customColorPresets]
    updatedPresets[editingColorPresetIndex] = {
      name: colorPresetName,
      colors: [...customColors],
    }

    setCustomColorPresets(updatedPresets)
    setColorPresetName('')
    setEditingColorPresetIndex(null)
    alert('색상 프리셋이 업데이트되었습니다!')
  }

  // 색상 프리셋 수정 모드 취소
  const cancelEditingColorPreset = () => {
    setEditingColorPresetIndex(null)
    setColorPresetName('')
    setCustomColors(['#ff0000', '#00ff00', '#0000ff'])
  }

  // 커스텀 파티클 프리셋에 추가
  const addCustomShapePreset = () => {
    if (!customShapePath.trim()) {
      alert('SVG Path를 입력해주세요')
      return
    }

    if (!shapePresetName.trim()) {
      alert('파티클 프리셋 이름을 입력해주세요')
      return
    }

    try {
      // Path 유효성 검증을 위해 createShape 호출
      createShape({ path: customShapePath })

      const newPreset: CustomShapePreset = {
        name: shapePresetName,
        path: customShapePath,
        // matrix는 런타임에 createShape에서 자동 계산
      }

      setCustomShapePresets([...customShapePresets, newPreset])
      setShapePresetName('')
      setCustomShapePath('')
      alert(`"${shapePresetName}" 파티클 프리셋이 저장되었습니다!`)
    } catch (error) {
      alert('유효하지 않은 SVG Path입니다')
      console.error('Shape add error:', error)
    }
  }

  // 예시 파티클 불러오기
  const loadExampleShape = (preset: CustomShapePreset) => {
    setCustomShapePath(preset.path)
    setShapePresetName(preset.name)
  }

  // 커스텀 파티클 선택/해제 토글
  const toggleCustomShape = (preset: CustomShapePreset) => {
    const isSelected = selectedCustomShapes.some((s) => s.name === preset.name)
    if (isSelected) {
      setSelectedCustomShapes(selectedCustomShapes.filter((s) => s.name !== preset.name))
    } else {
      setSelectedCustomShapes([...selectedCustomShapes, preset])
      setUseCustomShapes(true)
    }
  }

  // 커스텀 파티클 프리셋 삭제
  const deleteCustomShapePreset = (index: number) => {
    setCustomShapePresets(customShapePresets.filter((_, i) => i !== index))
  }

  // 커스텀 파티클 프리셋 수정 시작
  const startEditingShapePreset = (index: number) => {
    const preset = customShapePresets[index]
    setCustomShapePath(preset.path)
    setShapePresetName(preset.name)
    setEditingShapePresetIndex(index)
  }

  // 커스텀 파티클 프리셋 업데이트
  const updateCustomShapePreset = () => {
    if (editingShapePresetIndex === null) return

    if (!shapePresetName.trim()) {
      alert('파티클 프리셋 이름을 입력해주세요')
      return
    }

    if (!customShapePath.trim()) {
      alert('SVG Path를 입력해주세요')
      return
    }

    const updatedPresets = [...customShapePresets]
    updatedPresets[editingShapePresetIndex] = {
      name: shapePresetName,
      path: customShapePath,
    }

    setCustomShapePresets(updatedPresets)
    setShapePresetName('')
    setCustomShapePath('')
    setEditingShapePresetIndex(null)
    alert('파티클 프리셋이 업데이트되었습니다!')
  }

  // 파티클 프리셋 수정 모드 취소
  const cancelEditingShapePreset = () => {
    setEditingShapePresetIndex(null)
    setShapePresetName('')
    setCustomShapePath('')
  }

  // 코드에서 프리셋 가져오기
  const importPresetCode = (code: string) => {
    try {
      // fire(...) 패턴에서 내용 추출
      let jsonString = code.trim()

      // fire( 로 시작하는 경우 제거
      const fireMatch = jsonString.match(/fire\s*\(\s*(\[[\s\S]*\])\s*\)/)
      if (fireMatch) {
        jsonString = fireMatch[1]
      }

      // JSON 파싱
      const parsed = JSON.parse(jsonString)

      // 배열인지 확인
      if (!Array.isArray(parsed)) {
        throw new Error('배열 형식이어야 합니다. fire([...]) 형식으로 붙여넣어주세요.')
      }

      // 각 요소가 유효한 ConfettiOptions인지 간단히 검증
      for (let i = 0; i < parsed.length; i++) {
        if (typeof parsed[i] !== 'object' || parsed[i] === null) {
          throw new Error(`효과 ${i + 1}이(가) 올바른 객체 형식이 아닙니다.`)
        }
      }

      // presetOptions에 추가
      setPresetOptions([...presetOptions, ...parsed])
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('유효하지 않은 JSON 형식입니다. 코드를 확인해주세요.')
      }
      throw error
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
            <PresetSection
              activePreset={activeBuiltInPreset}
              onSelectPreset={selectBuiltInPreset}
              onCopyPreset={copyPresetToCustom}
            />

            <CustomPresetSection
              presetOptions={presetOptions}
              presetName={presetName}
              customPresets={customPresets}
              editingPresetIndex={editingPresetIndex}
              editingEffectIndex={editingEffectIndex}
              activeCustomPreset={activeCustomPreset}
              useCustomCanvas={useCustomCanvas}
              onAddToPreset={addToPreset}
              onRemoveFromPreset={removeFromPreset}
              onPresetNameChange={setPresetName}
              onSaveCustomPreset={saveCustomPreset}
              onSelectCustomPreset={selectCustomPreset}
              onDeleteCustomPreset={deleteCustomPreset}
              onLoadEffectToSettings={loadEffectToSettings}
              onAddEffectToSavedPreset={addEffectToSavedPreset}
              onCopyToClipboard={copyToClipboard}
              onFireCustomPreset={fireCustomPreset}
              copiedPresetIndex={copiedPresetIndex}
              onImportPresetCode={importPresetCode}
            />

            {/* Canvas 바운더리 제어 */}
            <div ref={canvasContainerRef} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Canvas 바운더리</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    특정 영역에서만 confetti 효과를 렌더링합니다
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUseCustomCanvas(!useCustomCanvas)
                    if (useCustomCanvas) {
                      // Canvas 비활성화 시 null 설정
                      setConfettiCanvasRef(null)
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    useCustomCanvas
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {useCustomCanvas ? 'ON' : 'OFF'}
                </button>
              </div>

              {useCustomCanvas && (
                <>
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded text-sm text-purple-700">
                    💡 <strong>Canvas 모드</strong>: 보라색 테두리 영역에서만 confetti가 발생합니다.
                  </div>

                  {/* Canvas 크기 조절 */}
                  <div className="mt-3 space-y-4">
                    {/* 너비 조절 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Canvas 너비: {canvasWidth === null ? '100%' : `${canvasWidth}px`}
                      </label>
                      <input
                        type="range"
                        min="100"
                        max={maxCanvasWidth + 1}
                        step="1"
                        value={canvasWidth ?? maxCanvasWidth + 1}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          // 최대값+1이면 100% (null), 그 외에는 픽셀 값
                          setCanvasWidth(value > maxCanvasWidth ? null : value)
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    {/* 높이 조절 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Canvas 높이: {canvasHeight}px
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="800"
                        step="50"
                        value={canvasHeight}
                        onChange={(e) => setCanvasHeight(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                  </div>

                  {/* 실행 버튼 */}
                  <div className="mt-4">
                    <FireButton onFire={fireActivePreset} />
                  </div>
                </>
              )}
            </div>

            {/* Sticky Canvas 영역 (Canvas 모드 ON일 때만 표시) */}
            {useCustomCanvas && (
              <div className="sticky top-8 z-20">
                <div className="bg-white rounded-lg shadow-lg p-4 border-4 border-purple-400 border-dashed">
                  <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                    <div className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold">
                      Confetti Canvas 영역
                    </div>
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      {activeCustomPreset !== null
                        ? `${customPresets[activeCustomPreset].name} 프리셋`
                        : '효과'}
                    </div>
                  </div>
                  <canvas
                    ref={setConfettiCanvasRef}
                    style={{
                      ...(canvasWidth !== null && { width: `${canvasWidth}px` }),
                      height: `${canvasHeight}px`,
                    }}
                    className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded ${
                      canvasWidth === null ? 'w-full' : ''
                    }`}
                  />
                </div>
              </div>
            )}
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
            editingColorPresetIndex={editingColorPresetIndex}
            useCustomCanvas={useCustomCanvas}
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
            onStartEditingColorPreset={startEditingColorPreset}
            onUpdateCustomColorPreset={updateCustomColorPreset}
            onCancelEditingColorPreset={cancelEditingColorPreset}
            useCustomShapes={useCustomShapes}
            customShapePath={customShapePath}
            customShapePresets={customShapePresets}
            selectedCustomShapes={selectedCustomShapes}
            shapePresetName={shapePresetName}
            editingShapePresetIndex={editingShapePresetIndex}
            onUseCustomShapesChange={setUseCustomShapes}
            onCustomShapePathChange={setCustomShapePath}
            onShapePresetNameChange={setShapePresetName}
            onAddCustomShapePreset={addCustomShapePreset}
            onLoadExampleShape={loadExampleShape}
            onToggleCustomShape={toggleCustomShape}
            onDeleteCustomShapePreset={deleteCustomShapePreset}
            onStartEditingShapePreset={startEditingShapePreset}
            onUpdateCustomShapePreset={updateCustomShapePreset}
            onCancelEditingShapePreset={cancelEditingShapePreset}
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
