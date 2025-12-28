import { useState, useRef } from 'react'
import { confettiPresets } from '~/shared/confetti/presets'
import { useConfetti } from '~/shared/confetti/use-confetti'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { PresetSection } from './preset-section'
import { CustomPresetSection } from './custom-preset-section'
import { SettingsPanel } from './settings-panel'
import { DEFAULT_VALUES } from './constants'
import type {
  CustomPreset,
  CustomColorPreset,
  CustomShapePreset,
  EditorConfettiOptions,
} from './types'

/**
 * Confetti 미리보기 페이지
 */
export function PreviewPage() {
  const { fire, fireFrame, createShape } = useConfetti()

  // 활성화된 프리셋 상태
  const [activeBuiltInPreset, setActiveBuiltInPreset] = useState<string | null>(null)
  const [activeCustomPreset, setActiveCustomPreset] = useState<number | null>(null)


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
  const [flat, setFlat] = useState<boolean>(DEFAULT_VALUES.flat)

  // 실험적 옵션 (tilt/wobble)
  const [tiltRangeMin, setTiltRangeMin] = useState<number>(DEFAULT_VALUES.tiltRangeMin)
  const [tiltRangeMax, setTiltRangeMax] = useState<number>(DEFAULT_VALUES.tiltRangeMax)
  const [tiltSpeedMin, setTiltSpeedMin] = useState<number>(DEFAULT_VALUES.tiltSpeedMin)
  const [tiltSpeedMax, setTiltSpeedMax] = useState<number>(DEFAULT_VALUES.tiltSpeedMax)
  const [wobbleRangeMin, setWobbleRangeMin] = useState<number>(DEFAULT_VALUES.wobbleRangeMin)
  const [wobbleRangeMax, setWobbleRangeMax] = useState<number>(DEFAULT_VALUES.wobbleRangeMax)
  const [wobbleSpeedMin, setWobbleSpeedMin] = useState<number>(DEFAULT_VALUES.wobbleSpeedMin)
  const [wobbleSpeedMax, setWobbleSpeedMax] = useState<number>(DEFAULT_VALUES.wobbleSpeedMax)

  // 회전 옵션
  const [rotation, setRotation] = useLocalStorage<number>('rotation', DEFAULT_VALUES.rotation)
  const [rotationSpeedMin, setRotationSpeedMin] = useLocalStorage<number>(
    'rotationSpeedMin',
    DEFAULT_VALUES.rotationSpeedMin
  )
  const [rotationSpeedMax, setRotationSpeedMax] = useLocalStorage<number>(
    'rotationSpeedMax',
    DEFAULT_VALUES.rotationSpeedMax
  )
  const [randomRotationDirection, setRandomRotationDirection] = useLocalStorage<boolean>(
    'randomRotationDirection',
    DEFAULT_VALUES.randomRotationDirection
  )

  // 색상 옵션
  const [useCustomColors, setUseCustomColors] = useState(false)
  const [customColors, setCustomColors] = useState<string[]>([])
  const [colorInput, setColorInput] = useState('#ff0000')

  // 커스텀 색상 프리셋 (로컬 스토리지 동기화)
  const [customColorPresets, setCustomColorPresets] = useLocalStorage<CustomColorPreset[]>(
    'confetti-custom-color-presets',
    []
  )
  const [colorPresetName, setColorPresetName] = useState('')
  const [activeColorPreset, setActiveColorPreset] = useState<number | null>(null)

  // 모양 옵션
  const [shapes, setShapes] = useState<string[]>(['square', 'circle'])

  // 커스텀 프리셋 저장 (로컬 스토리지 동기화)
  const [customPresets, setCustomPresets] = useLocalStorage<CustomPreset[]>(
    'confetti-custom-presets',
    []
  )
  const [presetName, setPresetName] = useState('')
  const [presetOptions, setPresetOptions] = useState<EditorConfettiOptions[]>([])

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
  const [customShapeSvg, setCustomShapeSvg] = useState('')
  const [customShapeType, setCustomShapeType] = useState<'path' | 'svg'>('path')
  const [customShapeScalar, setCustomShapeScalar] = useState(1)
  const [customShapePresets, setCustomShapePresets] = useLocalStorage<CustomShapePreset[]>(
    'confetti-custom-shape-presets',
    []
  )
  const [selectedCustomShapes, setSelectedCustomShapes] = useState<CustomShapePreset[]>([])
  const [shapePresetName, setShapePresetName] = useState('')
  const [editingShapePresetIndex, setEditingShapePresetIndex] = useState<number | null>(null)

  // 실험적 기능 사용 여부 (분리된 토글)
  const [useTiltWobble, setUseTiltWobble] = useState(false)
  const [useRotation, setUseRotation] = useState(false)


  // Snow 효과 오버레이 상태
  const [showSnowOverlay, setShowSnowOverlay] = useState(false)

  // Frame cleanup 함수 저장용
  const frameCleanupRef = useRef<(() => void) | null>(null)


  // 현재 옵션 조합
  const currentOptions: EditorConfettiOptions = {
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
    flat,
    // 실험적 기능: 기울기 및 흔들림 (활성화 시에만 포함)
    ...(useTiltWobble
      ? {
          // tiltRange: degrees to radians
          tiltRange: [(tiltRangeMin * Math.PI) / 180, (tiltRangeMax * Math.PI) / 180],
          tiltSpeed: [tiltSpeedMin, tiltSpeedMax],
          wobbleRange: [wobbleRangeMin, wobbleRangeMax],
          wobbleSpeed: [wobbleSpeedMin, wobbleSpeedMax],
        }
      : {}),
    // 실험적 기능: 평면 회전 (활성화 시에만 포함)
    ...(useRotation
      ? {
          rotation,
          rotationSpeed: [rotationSpeedMin, rotationSpeedMax],
          randomRotationDirection,
        }
      : {}),
    ...(useCustomColors && customColors.length > 0 ? { colors: customColors } : {}),
    ...(() => {
      // 커스텀 파티클과 기본 도형 결합
      const allShapes: any[] = []

      // 기본 도형 추가 (문자열로 추가)
      if (shapes.length > 0) {
        allShapes.push(...shapes)
      }

      // 커스텀 파티클 추가 (Shape 객체로 추가)
      if (useCustomShapes) {
        // 입력 중인 Path 또는 SVG가 있으면 바로 사용 (저장하지 않아도 테스트 가능)
        if (customShapeType === 'path' && customShapePath.trim()) {
          try {
            const shape = createShape({ path: customShapePath })
            allShapes.push(shape)
          } catch (error) {
            console.error('Invalid custom shape path:', error)
          }
        } else if (customShapeType === 'svg' && customShapeSvg.trim()) {
          try {
            const shape = createShape({ svg: customShapeSvg, scalar: customShapeScalar })
            allShapes.push(shape)
          } catch (error) {
            console.error('Invalid custom shape svg:', error)
          }
        }

        // 선택된 저장된 파티클도 추가
        if (selectedCustomShapes.length > 0) {
          const customShapes = selectedCustomShapes.map((preset) => {
            if (preset.type === 'svg') {
              return createShape({ svg: preset.svg!, scalar: preset.scalar })
            }
            return createShape({ path: preset.path!, matrix: preset.matrix })
          })
          allShapes.push(...customShapes)
        }
      }

      return allShapes.length > 0 ? { shapes: allShapes } : {}
    })(),
    // 내부 메타데이터 (UI 동기화 및 코드 생성용)
    _useCustomShapes: useCustomShapes,
    _selectedCustomShapes: useCustomShapes ? [...selectedCustomShapes] : undefined,
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
    setFlat(DEFAULT_VALUES.flat)
    setTiltRangeMin(DEFAULT_VALUES.tiltRangeMin)
    setTiltRangeMax(DEFAULT_VALUES.tiltRangeMax)
    setTiltSpeedMin(DEFAULT_VALUES.tiltSpeedMin)
    setTiltSpeedMax(DEFAULT_VALUES.tiltSpeedMax)
    setWobbleRangeMin(DEFAULT_VALUES.wobbleRangeMin)
    setWobbleRangeMax(DEFAULT_VALUES.wobbleRangeMax)
    setWobbleSpeedMin(DEFAULT_VALUES.wobbleSpeedMin)
    setWobbleSpeedMax(DEFAULT_VALUES.wobbleSpeedMax)
    setRotation(DEFAULT_VALUES.rotation)
    setRotationSpeedMin(DEFAULT_VALUES.rotationSpeedMin)
    setRotationSpeedMax(DEFAULT_VALUES.rotationSpeedMax)
    setRandomRotationDirection(DEFAULT_VALUES.randomRotationDirection)
    setUseCustomColors(false)
    setCustomColors(['#ff0000', '#00ff00', '#0000ff'])
    setShapes(['square', 'circle'])
    setUseCustomShapes(false)
    setCustomShapePath('')
    setSelectedCustomShapes([])
    setUseTiltWobble(false)
    setUseRotation(false)
  }

  // 기본 프리셋 선택 및 즉시 실행
  const selectBuiltInPreset = (presetName: string) => {
    setActiveCustomPreset(null) // 커스텀 프리셋 비활성화

    // 이전 프레임 cleanup 실행
    if (frameCleanupRef.current) {
      frameCleanupRef.current()
      frameCleanupRef.current = null
    }

    // 즉시 프리셋 실행
    const preset = confettiPresets[presetName as keyof typeof confettiPresets]

    // 타입 체크: duration 속성이 있으면 ConfettiFrame 타입
    if ('duration' in preset) {
      // ConfettiFrame 타입 - fireFrame 사용
      const cleanup = fireFrame(preset)
      frameCleanupRef.current = cleanup

      setShowSnowOverlay(true)
      // duration 후 오버레이 제거
      setTimeout(() => {
        setShowSnowOverlay(false)
      }, preset.duration)
    } else {
      // 기존 배열 방식 - fire 사용
      fire(preset)

      // Snow 프리셋일 때 오버레이 활성화 (레거시 지원)
      if (presetName === 'snow') {
        setShowSnowOverlay(true)
        setTimeout(() => {
          setShowSnowOverlay(false)
        }, 15000)
      }
    }

    // 클릭 시 짧은 활성화 효과 (보랏빛 표시)
    setActiveBuiltInPreset(presetName)
    setTimeout(() => {
      setActiveBuiltInPreset(null)
    }, 200)
  }

  // 활성화된 프리셋 또는 커스텀 효과 실행
  const fireActivePreset = () => {
    // 이전 프레임 cleanup 실행
    if (frameCleanupRef.current) {
      frameCleanupRef.current()
      frameCleanupRef.current = null
    }

    if (activeBuiltInPreset) {
      // 기본 프리셋 실행
      const preset = confettiPresets[activeBuiltInPreset as keyof typeof confettiPresets]

      // 타입 체크: duration 속성이 있으면 ConfettiFrame 타입
      if ('duration' in preset) {
        // ConfettiFrame 타입 - fireFrame 사용
        const cleanup = fireFrame(preset)
        frameCleanupRef.current = cleanup

        setShowSnowOverlay(true)
        setTimeout(() => {
          setShowSnowOverlay(false)
        }, preset.duration)
      } else {
        // 기존 배열 방식 - fire 사용
        fire(preset)

        // Snow 프리셋일 때 오버레이 활성화 (레거시 지원)
        if (activeBuiltInPreset === 'snow') {
          setShowSnowOverlay(true)
          setTimeout(() => {
            setShowSnowOverlay(false)
          }, 15000)
        }
      }
    } else if (activeCustomPreset !== null) {
      // 커스텀 프리셋 실행 - fire 함수가 자동으로 Promise를 resolve
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

      // 각 효과의 _selectedCustomShapes를 사용하여 shape 생성
      // fire 함수가 자동으로 Promise를 resolve하므로 직접 전달
      const optionsWithShapes = preset.options.map((option) => {
        // 이 효과의 scalar 값
        const optionScalar = option.scalar || 1

        // 기존 옵션의 기본 파티클 보존 (문자열 shapes)
        const baseShapes: any[] = []
        if (option.shapes && Array.isArray(option.shapes)) {
          option.shapes.forEach((shape: any) => {
            // 문자열 shape (기본 파티클)만 보존
            if (typeof shape === 'string') {
              baseShapes.push(shape)
            }
          })
        }

        // _selectedCustomShapes가 있는 경우 커스텀 shape 생성
        if (option._selectedCustomShapes && option._selectedCustomShapes.length > 0) {
          const customShapes = option._selectedCustomShapes.map((shapeMeta) => {
            if (shapeMeta.type === 'svg' && shapeMeta.svg) {
              // scalar 값을 곱셈
              const finalScalar = (shapeMeta.scalar || 1) * optionScalar
              return createShape({ svg: shapeMeta.svg, scalar: finalScalar })
            } else if (shapeMeta.type === 'path' && shapeMeta.path) {
              return createShape({ path: shapeMeta.path, matrix: shapeMeta.matrix })
            }
            return null
          })

          const validShapes = customShapes.filter((s) => s !== null)
          return {
            ...option,
            shapes: [...baseShapes, ...validShapes],
          }
        }

        // _selectedCustomShapes가 없지만 placeholder가 있을 수 있음
        if (option.shapes && Array.isArray(option.shapes)) {
          const resolvedShapes = option.shapes.map((shape: any) => {
            // Placeholder인 경우 실제 Shape로 변환
            if (shape && typeof shape === 'object' && shape.__isShapePlaceholder) {
              if ('svg' in shape) {
                const finalScalar = (shape.scalar || 1) * optionScalar
                return createShape({ svg: shape.svg, scalar: finalScalar })
              }
              if ('path' in shape) {
                return createShape({ path: shape.path, matrix: shape.matrix })
              }
            }
            return shape
          })
          return { ...option, shapes: resolvedShapes }
        }

        return option
      })

      fire(optionsWithShapes)
    }
  }

  // 커스텀 옵션으로 실행
  const fireCustom = () => {
    // fire 함수가 자동으로 Promise를 resolve하므로 바로 전달
    fire(currentOptions)
  }

  // 프리셋에 현재 옵션 추가
  const addToPreset = () => {
    setPresetOptions([...presetOptions, { ...currentOptions }])
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

    // shape 메타데이터 수집 (코드 미리보기용)
    // 모든 옵션에서 커스텀 shape 메타데이터를 수집
    const shapeMeta: CustomShapePreset[] = []
    const shapeMetaSet = new Set<string>() // 중복 제거용

    presetOptions.forEach((option) => {
      // 각 옵션의 _selectedCustomShapes에서 메타데이터 수집
      if (option._selectedCustomShapes && Array.isArray(option._selectedCustomShapes)) {
        option._selectedCustomShapes.forEach((meta) => {
          const key = JSON.stringify(meta)
          if (!shapeMetaSet.has(key)) {
            shapeMetaSet.add(key)
            shapeMeta.push(meta)
          }
        })
      }
    })

    const newPreset: CustomPreset = {
      name: presetName,
      options: presetOptions.map((option) => ({
        ...option,
        _useCustomShapes: option._useCustomShapes,
        _selectedCustomShapes: option._selectedCustomShapes,
      })),
      shapeMeta: shapeMeta.length > 0 ? shapeMeta : undefined,
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

  // 저장된 프리셋에서 효과 제거
  const deleteEffectFromPreset = (presetIndex: number, effectIndex: number) => {
    const updatedPresets = [...customPresets]
    const preset = updatedPresets[presetIndex]

    // 효과가 1개만 남았으면 프리셋 전체 삭제 여부 확인
    if (preset.options.length === 1) {
      const confirmDelete = confirm(`"${preset.name}" 프리셋의 마지막 효과입니다. 프리셋을 삭제하시겠습니까?`)
      if (confirmDelete) {
        deleteCustomPreset(presetIndex)
        // 수정 모드였다면 취소
        if (editingPresetIndex === presetIndex && editingEffectIndex === effectIndex) {
          cancelEditMode()
        }
      }
      return
    }

    // 효과 제거
    preset.options = preset.options.filter((_, i) => i !== effectIndex)
    setCustomPresets(updatedPresets)

    // 수정 중이던 효과를 제거한 경우 수정 모드 취소
    if (editingPresetIndex === presetIndex && editingEffectIndex === effectIndex) {
      cancelEditMode()
    }
    // 제거된 효과 뒤의 효과를 수정 중이었다면 인덱스 조정
    else if (editingPresetIndex === presetIndex && editingEffectIndex !== null && editingEffectIndex > effectIndex) {
      setEditingEffectIndex(editingEffectIndex - 1)
    }

    alert(`효과가 제거되었습니다! (남은 효과: ${preset.options.length}개)`)
  }

  // 저장된 프리셋에 효과 추가
  // 저장된 프리셋에 효과 추가
  const addEffectToSavedPreset = (presetIndex: number) => {
    const updatedPresets = [...customPresets]
    updatedPresets[presetIndex].options = [...updatedPresets[presetIndex].options, { ...currentOptions }]

    // shapeMeta 업데이트 (커스텀 파티클 사용 시 고수준 메타데이터 보존용)
    if (useCustomShapes) {
      const existingShapeMeta = updatedPresets[presetIndex].shapeMeta || []
      const newShapeMeta: CustomShapePreset[] = []

      if (customShapeType === 'svg' && customShapeSvg.trim()) {
        newShapeMeta.push({
          name: 'custom-svg',
          type: 'svg',
          svg: customShapeSvg,
          scalar: customShapeScalar,
        })
      } else if (customShapeType === 'path' && customShapePath.trim()) {
        newShapeMeta.push({
          name: 'custom-path',
          type: 'path',
          path: customShapePath,
        })
      }

      newShapeMeta.push(...selectedCustomShapes)

      // 기존 shapeMeta와 병합 (중복 제거 로직은 단순화함)
      updatedPresets[presetIndex].shapeMeta = [...existingShapeMeta, ...newShapeMeta]
    }

    setCustomPresets(updatedPresets)
    alert(
      `"${customPresets[presetIndex].name}" 프리셋에 효과가 추가되었습니다! (총 ${updatedPresets[presetIndex].options.length}개 효과)`
    )
  }

  // 기본 프리셋 복사
  const copyPresetToCustom = (presetName: string) => {
    const preset = confettiPresets[presetName as keyof typeof confettiPresets]

    // ConfettiFrame 타입은 복사 불가
    if ('duration' in preset) {
      alert(`"${presetName}" 프리셋은 프레임 기반이라 복사할 수 없습니다.`)
      return
    }

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
    setFlat(effect.flat ?? DEFAULT_VALUES.flat)
    setRotation(effect.rotation ?? DEFAULT_VALUES.rotation)
    setRotationSpeedMin(effect.rotationSpeed?.[0] ?? DEFAULT_VALUES.rotationSpeedMin)
    setRotationSpeedMax(effect.rotationSpeed?.[1] ?? DEFAULT_VALUES.rotationSpeedMax)
    setRandomRotationDirection(effect.randomRotationDirection ?? DEFAULT_VALUES.randomRotationDirection)

    // tiltRange: radians to degrees
    const tiltRangeMinRadians = effect.tiltRange?.[0] ?? (DEFAULT_VALUES.tiltRangeMin * Math.PI) / 180
    const tiltRangeMaxRadians = effect.tiltRange?.[1] ?? (DEFAULT_VALUES.tiltRangeMax * Math.PI) / 180
    setTiltRangeMin((tiltRangeMinRadians * 180) / Math.PI)
    setTiltRangeMax((tiltRangeMaxRadians * 180) / Math.PI)

    setTiltSpeedMin(effect.tiltSpeed?.[0] ?? DEFAULT_VALUES.tiltSpeedMin)
    setTiltSpeedMax(effect.tiltSpeed?.[1] ?? DEFAULT_VALUES.tiltSpeedMax)
    setWobbleRangeMin(effect.wobbleRange?.[0] ?? DEFAULT_VALUES.wobbleRangeMin)
    setWobbleRangeMax(effect.wobbleRange?.[1] ?? DEFAULT_VALUES.wobbleRangeMax)
    setWobbleSpeedMin(effect.wobbleSpeed?.[0] ?? DEFAULT_VALUES.wobbleSpeedMin)
    setWobbleSpeedMax(effect.wobbleSpeed?.[1] ?? DEFAULT_VALUES.wobbleSpeedMax)

    setRotation(effect.rotation ?? DEFAULT_VALUES.rotation)
    setRotationSpeedMin(effect.rotationSpeed?.[0] ?? DEFAULT_VALUES.rotationSpeedMin)
    setRotationSpeedMax(effect.rotationSpeed?.[1] ?? DEFAULT_VALUES.rotationSpeedMax)
    setRandomRotationDirection(effect.randomRotationDirection ?? DEFAULT_VALUES.randomRotationDirection)

    // 실험적 옵션 사용 여부 자동 감지
    const hasTiltWobble =
      effect.tiltRange !== undefined ||
      effect.tiltSpeed !== undefined ||
      effect.wobbleRange !== undefined ||
      effect.wobbleSpeed !== undefined

    const hasRotation = effect.rotation !== undefined || effect.rotationSpeed !== undefined || effect.randomRotationDirection !== undefined

    setUseTiltWobble(hasTiltWobble)
    setUseRotation(hasRotation)

    if (effect.colors && effect.colors.length > 0) {
      setCustomColors(effect.colors)
      setUseCustomColors(true)
    } else {
      setUseCustomColors(false)
    }

    // 커스텀 파티클 복원
    const useShapes = effect._useCustomShapes ?? false
    const selShapes = effect._selectedCustomShapes ?? []
    setUseCustomShapes(useShapes)
    setSelectedCustomShapes(selShapes)

    if (effect.shapes && effect.shapes.length > 0) {
      const basicShapes = effect.shapes.filter((s) => typeof s === 'string') as string[]
      setShapes(basicShapes)
    } else if (useShapes) {
      setShapes([])
    } else {
      setShapes(['square', 'circle'])
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

  // 커스텀 색상 프리셋 적용 (토글)
  const applyCustomColorPreset = (preset: CustomColorPreset, index: number) => {
    // 같은 프리셋을 다시 클릭하면 선택 해제
    if (activeColorPreset === index) {
      setActiveColorPreset(null)
      setCustomColors([]) // 색상 초기화
      setUseCustomColors(false) // 커스텀 색상 비활성화
    } else {
      setCustomColors(preset.colors)
      setUseCustomColors(true)
      setActiveColorPreset(index)
    }
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
    setCustomColors([])
    alert('색상 프리셋이 업데이트되었습니다!')
  }

  // 색상 프리셋 수정 모드 취소
  const cancelEditingColorPreset = () => {
    setEditingColorPresetIndex(null)
    setColorPresetName('')
    setCustomColors([])
  }

  // 커스텀 파티클 프리셋에 추가
  const addCustomShapePreset = () => {
    if (customShapeType === 'path' && !customShapePath.trim()) {
      alert('SVG Path를 입력해주세요')
      return
    }

    if (customShapeType === 'svg' && !customShapeSvg.trim()) {
      alert('SVG 마크업을 입력해주세요')
      return
    }

    if (!shapePresetName.trim()) {
      alert('파티클 프리셋 이름을 입력해주세요')
      return
    }

    try {
      // Path 유효성 검증을 위해 createShape 호출 (path 타입일 때만)
      if (customShapeType === 'path') {
        createShape({ path: customShapePath })
      }

      const newPreset: CustomShapePreset = {
        name: shapePresetName,
        type: customShapeType,
        ...(customShapeType === 'path'
          ? { path: customShapePath }
          : { svg: customShapeSvg, scalar: customShapeScalar }),
        // matrix는 런타임에 createShape에서 자동 계산
      }

      setCustomShapePresets([...customShapePresets, newPreset])
      setShapePresetName('')
      setCustomShapePath('')
      setCustomShapeSvg('')
      alert(`"${shapePresetName}" 파티클 프리셋이 저장되었습니다!`)
    } catch (error) {
      alert('유효하지 않은 입력입니다')
      console.error('Shape add error:', error)
    }
  }

  // 예시 파티클 불러오기
  const loadExampleShape = (preset: CustomShapePreset) => {
    setCustomShapeType(preset.type)
    if (preset.type === 'path') {
      setCustomShapePath(preset.path || '')
      setCustomShapeSvg('')
    } else {
      setCustomShapeSvg(preset.svg || '')
      setCustomShapePath('')
      setCustomShapeScalar(preset.scalar || 1)
    }
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
    setCustomShapeType(preset.type)
    if (preset.type === 'path') {
      setCustomShapePath(preset.path || '')
      setCustomShapeSvg('')
    } else {
      setCustomShapeSvg(preset.svg || '')
      setCustomShapePath('')
      setCustomShapeScalar(preset.scalar || 1)
    }
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

    if (customShapeType === 'path' && !customShapePath.trim()) {
      alert('SVG Path를 입력해주세요')
      return
    }

    if (customShapeType === 'svg' && !customShapeSvg.trim()) {
      alert('SVG 마크업을 입력해주세요')
      return
    }

    const updatedPresets = [...customShapePresets]
    updatedPresets[editingShapePresetIndex] = {
      name: shapePresetName,
      type: customShapeType,
      ...(customShapeType === 'path'
        ? { path: customShapePath }
        : { svg: customShapeSvg, scalar: customShapeScalar }),
    }

    setCustomShapePresets(updatedPresets)
    setShapePresetName('')
    setCustomShapePath('')
    setCustomShapeSvg('')
    setEditingShapePresetIndex(null)
    alert('파티클 프리셋이 업데이트되었습니다!')
  }

  // 파티클 프리셋 수정 모드 취소
  const cancelEditingShapePreset = () => {
    setEditingShapePresetIndex(null)
    setShapePresetName('')
    setCustomShapePath('')
    setCustomShapeSvg('')
  }

  // 코드에서 프리셋 가져오기
  const importPresetCode = (code: string) => {
    try {
      // fire(...) 패턴에서 내용 추출
      let jsonString = code.trim()

      // fire( 로 시작하는 경우 제거 (배열 또는 단일 객체 모두 지원)
      const fireMatch = jsonString.match(/fire\s*\(\s*([\s\S]*)\s*\)\s*$/)
      if (fireMatch) {
        jsonString = fireMatch[1].trim()
      }

      // createShape 호출을 추적하기 위한 래퍼 함수
      const shapeCreationLog: CustomShapePreset[] = []
      const createShapeWrapper = (params: any) => {
        // 메타데이터 기록
        if ('svg' in params) {
          shapeCreationLog.push({
            name: 'imported-svg',
            type: 'svg',
            svg: params.svg,
            scalar: params.scalar || 1,
          })
        } else if ('path' in params) {
          shapeCreationLog.push({
            name: 'imported-path',
            type: 'path',
            path: params.path,
            matrix: params.matrix,
          })
        }

        // 실제 createShape 호출
        return createShape(params)
      }

      // Function 생성자를 사용하여 안전하게 JavaScript 객체 파싱
      // createShapeWrapper를 제공하여 호출 추적
      const parsed = new Function('createShape', `return ${jsonString}`)(createShapeWrapper)

      // 단일 객체를 배열로 변환
      const optionsArray = Array.isArray(parsed) ? parsed : [parsed]

      // shapes 배열을 순회하며 각 효과의 메타데이터 추출
      let shapeLogIndex = 0

      // 각 요소가 유효한 ConfettiOptions인지 간단히 검증하고 메타데이터 첨부
      for (let i = 0; i < optionsArray.length; i++) {
        if (typeof optionsArray[i] !== 'object' || optionsArray[i] === null) {
          throw new Error(`효과 ${i + 1}이(가) 올바른 객체 형식이 아닙니다.`)
        }

        // 커스텀 shape가 있는 경우 메타데이터 첨부
        if (optionsArray[i].shapes && Array.isArray(optionsArray[i].shapes)) {
          const hasCustomShapes = optionsArray[i].shapes.some((s: any) => typeof s !== 'string')
          if (hasCustomShapes) {
            // 이 효과의 shapes 배열에서 커스텀 shape 개수 세기
            const customShapeCount = optionsArray[i].shapes.filter((s: any) => typeof s !== 'string').length

            // shapeCreationLog에서 이 효과에 해당하는 메타데이터 추출
            const effectShapeMeta = shapeCreationLog.slice(shapeLogIndex, shapeLogIndex + customShapeCount)
            shapeLogIndex += customShapeCount

            if (effectShapeMeta.length > 0) {
              optionsArray[i]._useCustomShapes = true
              optionsArray[i]._selectedCustomShapes = effectShapeMeta
            }
          }
        }
      }

      // presetOptions에 추가
      setPresetOptions([...presetOptions, ...optionsArray])
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('유효하지 않은 JavaScript 형식입니다. 코드를 확인해주세요.')
      }
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 relative overflow-x-hidden">
      {/* Snow 효과용 어두운 오버레이 */}
      {showSnowOverlay && (
        <div
          className="fixed inset-0 bg-black/30 pointer-events-none z-40"
          style={{
            animation: 'fadeIn 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-gray-800">Confetti 미리보기</h1>

          {/* 코드 테스트 버튼 */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">코드 테스트</div>
              <div className="text-xs text-gray-500">복사한 코드 실행</div>
            </div>
            <a
              href="/confetti-editor/example"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              테스트
            </a>
          </div>
        </div>
        <p className="text-gray-600 mb-8">다양한 옵션을 조절하며 confetti 효과를 테스트해보세요</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
              onAddToPreset={addToPreset}
              onRemoveFromPreset={removeFromPreset}
              onPresetNameChange={setPresetName}
              onSaveCustomPreset={saveCustomPreset}
              onSelectCustomPreset={selectCustomPreset}
              onDeleteCustomPreset={deleteCustomPreset}
              onLoadEffectToSettings={loadEffectToSettings}
              onDeleteEffectFromPreset={deleteEffectFromPreset}
              onAddEffectToSavedPreset={addEffectToSavedPreset}
              onCopyToClipboard={copyToClipboard}
              onFireCustomPreset={fireCustomPreset}
              copiedPresetIndex={copiedPresetIndex}
              onImportPresetCode={importPresetCode}
            />
          </div>

          {/* 오른쪽: 커스텀 효과 설정 (sticky) */}
          <div className="sticky top-8">
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
              flat={flat}
              tiltRangeMin={tiltRangeMin}
              tiltRangeMax={tiltRangeMax}
              tiltSpeedMin={tiltSpeedMin}
              tiltSpeedMax={tiltSpeedMax}
              wobbleRangeMin={wobbleRangeMin}
              wobbleRangeMax={wobbleRangeMax}
              wobbleSpeedMin={wobbleSpeedMin}
              wobbleSpeedMax={wobbleSpeedMax}
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
              activeColorPreset={activeColorPreset}
              useTiltWobble={useTiltWobble}
              useRotation={useRotation}
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
              onFlatChange={setFlat}
              onTiltRangeMinChange={setTiltRangeMin}
              onTiltRangeMaxChange={setTiltRangeMax}
              onTiltSpeedMinChange={setTiltSpeedMin}
              onTiltSpeedMaxChange={setTiltSpeedMax}
              onWobbleRangeMinChange={setWobbleRangeMin}
              onWobbleRangeMaxChange={setWobbleRangeMax}
              onWobbleSpeedMinChange={setWobbleSpeedMin}
              onWobbleSpeedMaxChange={setWobbleSpeedMax}
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
              customShapeSvg={customShapeSvg}
              customShapeType={customShapeType}
              customShapeScalar={customShapeScalar}
              customShapePresets={customShapePresets}
              selectedCustomShapes={selectedCustomShapes}
              shapePresetName={shapePresetName}
              editingShapePresetIndex={editingShapePresetIndex}
              onUseCustomShapesChange={setUseCustomShapes}
              onCustomShapePathChange={setCustomShapePath}
              onCustomShapeSvgChange={setCustomShapeSvg}
              onCustomShapeTypeChange={setCustomShapeType}
              onCustomShapeScalarChange={setCustomShapeScalar}
              onShapePresetNameChange={setShapePresetName}
              onAddCustomShapePreset={addCustomShapePreset}
              onLoadExampleShape={loadExampleShape}
              onToggleCustomShape={toggleCustomShape}
              onDeleteCustomShapePreset={deleteCustomShapePreset}
              onStartEditingShapePreset={startEditingShapePreset}
              onUpdateCustomShapePreset={updateCustomShapePreset}
              onCancelEditingShapePreset={cancelEditingShapePreset}
              onUseTiltWobbleChange={setUseTiltWobble}
              onUseRotationChange={setUseRotation}
              rotation={rotation}
              rotationSpeedMin={rotationSpeedMin}
              rotationSpeedMax={rotationSpeedMax}
              onRotationChange={setRotation}
              onRotationSpeedMinChange={setRotationSpeedMin}
              onRotationSpeedMaxChange={setRotationSpeedMax}
              randomRotationDirection={randomRotationDirection}
              onRandomRotationDirectionChange={setRandomRotationDirection}
            />
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
