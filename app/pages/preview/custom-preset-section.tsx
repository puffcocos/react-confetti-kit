import { useState } from 'react'
import type { Options as ConfettiOptions } from 'canvas-confetti'
import type { CustomPreset } from './types'

interface CustomPresetSectionProps {
  presetOptions: ConfettiOptions[]
  presetName: string
  customPresets: CustomPreset[]
  editingPresetIndex: number | null
  editingEffectIndex: number | null
  activeCustomPreset: number | null
  useCustomCanvas: boolean
  onAddToPreset: () => void
  onRemoveFromPreset: (index: number) => void
  onPresetNameChange: (name: string) => void
  onSaveCustomPreset: () => void
  onSelectCustomPreset: (index: number) => void
  onDeleteCustomPreset: (index: number) => void
  onLoadEffectToSettings: (presetIndex: number, effectIndex: number) => void
  onAddEffectToSavedPreset: (presetIndex: number) => void
  onCopyToClipboard: (text: string, type: 'main' | number) => Promise<void>
  onFireCustomPreset: () => void
  copiedPresetIndex: number | null
}

/**
 * 커스텀 프리셋 섹션 컴포넌트
 */
export function CustomPresetSection({
  presetOptions,
  presetName,
  customPresets,
  editingPresetIndex,
  editingEffectIndex,
  activeCustomPreset,
  useCustomCanvas,
  onAddToPreset,
  onRemoveFromPreset,
  onPresetNameChange,
  onSaveCustomPreset,
  onSelectCustomPreset,
  onDeleteCustomPreset,
  onLoadEffectToSettings,
  onAddEffectToSavedPreset,
  onCopyToClipboard,
  onFireCustomPreset,
  copiedPresetIndex,
}: CustomPresetSectionProps) {
  const [selectedPresetForCode, setSelectedPresetForCode] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">커스텀 프리셋</h2>

      {/* 프리셋 구성 중 */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-blue-900">
            프리셋 구성 ({presetOptions.length}개 효과)
          </label>
          <button
            onClick={onAddToPreset}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
          >
            + 커스텀 효과 추가
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
                  onClick={() => onRemoveFromPreset(index)}
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
            커스텀 효과 설정을 조절한 후 "+ 커스텀 효과 추가" 버튼을 눌러 프리셋에 효과를 추가하세요
          </p>
        )}

        {/* 프리셋 저장 */}
        <div className="flex gap-2 pt-3 border-t border-blue-200">
          <input
            type="text"
            value={presetName}
            onChange={(e) => onPresetNameChange(e.target.value)}
            placeholder="프리셋 이름 입력"
            className="flex-1 px-3 py-2 border border-blue-300 rounded text-sm text-gray-800"
          />
          <button
            onClick={onSaveCustomPreset}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">저장된 프리셋</label>
          {customPresets.map((preset, index) => {
            const isActive = activeCustomPreset === index

            return (
              <div key={index} className="bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2 p-3">
                  <button
                    onClick={() => onSelectCustomPreset(index)}
                    className={`flex-1 text-left px-3 py-2 rounded font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 shadow-md animate-spin-border'
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                  >
                    {preset.name}{' '}
                    <span className={isActive ? 'text-purple-600' : 'text-purple-600'}>
                      ({preset.options.length}개 효과)
                    </span>
                  </button>
                  <button
                    onClick={() => onDeleteCustomPreset(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    삭제
                  </button>
                </div>

              {/* 코드 미리보기 */}
              <div className="px-3 pb-3 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() =>
                      setSelectedPresetForCode(selectedPresetForCode === index ? null : index)
                    }
                    className="relative flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors pl-5"
                  >
                    <span
                      className={`absolute left-0 text-xs transition-transform duration-200 ${
                        selectedPresetForCode === index ? 'rotate-90' : 'rotate-0'
                      }`}
                    >
                      ▶
                    </span>
                    코드 미리보기
                  </button>
                  {selectedPresetForCode === index && (
                    <button
                      onClick={() =>
                        onCopyToClipboard(`fire(${JSON.stringify(preset.options, null, 2)})`, index)
                      }
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                      title="코드 복사"
                    >
                      {copiedPresetIndex === index ? '✓ 복사됨!' : '📋 복사'}
                    </button>
                  )}
                </div>
                {selectedPresetForCode === index && (
                  <>
                    <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                      <pre className="text-xs text-green-400 font-mono">
                        <code>{`fire(${JSON.stringify(preset.options, null, 2)})`}</code>
                      </pre>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      useConfetti 훅을 사용하여 위 코드로 "{preset.name}" 프리셋을 실행할 수 있습니다
                    </p>
                  </>
                )}
              </div>

              {/* 효과 목록 및 수정 */}
              <div className="px-3 pb-3">
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-700">
                      효과 목록 ({preset.options.length}개)
                    </label>
                    <button
                      onClick={() => onAddEffectToSavedPreset(index)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
                      title="현재 우측 설정 메뉴의 옵션을 이 프리셋에 추가합니다"
                    >
                      + {preset.name} 에 효과 추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {preset.options.map((option, effectIndex) => (
                      <div
                        key={effectIndex}
                        className={`flex items-center gap-2 p-2 rounded border transition-colors ${
                          editingPresetIndex === index && editingEffectIndex === effectIndex
                            ? 'bg-yellow-50 border-yellow-400'
                            : 'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <span className="flex-1 text-xs text-gray-700 font-mono truncate">
                          효과 {effectIndex + 1}: {option.particleCount}개 파티클, {option.spread}°
                          퍼짐
                        </span>
                        <button
                          onClick={() => onLoadEffectToSettings(index, effectIndex)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs font-medium"
                          title="이 효과를 우측 설정 메뉴로 불러와 수정합니다"
                        >
                          {editingPresetIndex === index && editingEffectIndex === effectIndex
                            ? '수정 중'
                            : '수정'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            )
          })}

          {/* Fire 버튼 */}
          {!useCustomCanvas && activeCustomPreset !== null && (
            <div className="mt-4 animate-fade-in">
              <button
                onClick={onFireCustomPreset}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                🎉 {customPresets[activeCustomPreset].name} 테스트
              </button>
            </div>
          )}
        </div>
      )}

      {customPresets.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">저장된 커스텀 프리셋이 없습니다</p>
      )}
    </div>
  )
}
