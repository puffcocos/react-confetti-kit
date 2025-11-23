import { confettiPresets } from '~/components/confetti'

interface PresetSectionProps {
  selectedPreset: string
  onFirePreset: (presetName: string) => void
  onCopyPreset: (presetName: string) => void
}

/**
 * 기본 프리셋 섹션 컴포넌트
 */
export function PresetSection({ selectedPreset, onFirePreset, onCopyPreset }: PresetSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">프리셋</h2>
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(confettiPresets).map((presetName) => (
          <div key={presetName} className="relative group">
            <button
              onClick={() => onFirePreset(presetName)}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                selectedPreset === presetName
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {presetName}
            </button>
            <button
              onClick={() => onCopyPreset(presetName)}
              className="absolute top-1 right-1 p-1.5 bg-gray-700/80 text-white rounded hover:bg-gray-800/90 transition-all opacity-0 group-hover:opacity-100 text-xs backdrop-blur-sm"
              title={`"${presetName}" 프리셋을 복사하여 커스터마이징`}
            >
              📋
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
