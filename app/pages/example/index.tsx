import { useState, useRef } from 'react'
import { useConfetti } from '~/shared/confetti/use-confetti'

type EffectMode = 'fire' | 'fireFrame'

interface DevicePreset {
  name: string
  width: number
  height: number
}

const DEVICE_PRESETS: DevicePreset[] = [
  { name: 'Galaxy Fold', width: 280, height: 653 },
  { name: 'Galaxy Fold (펼침)', width: 717, height: 512 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12/13', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro 11"', width: 834, height: 1194 },
  { name: 'Custom', width: 0, height: 0 }, // Custom 옵션
]

export function ExamplePage() {
  const { fire, fireFrame, createShape, setConfettiCanvasRef } = useConfetti()
  const [mode, setMode] = useState<EffectMode>('fire')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [useCustomCanvas, setUseCustomCanvas] = useState(false)
  const [duration, setDuration] = useState(3000)
  const cleanupRef = useRef<(() => void) | null>(null)

  // Canvas 크기 프리셋
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(2) // iPhone 12/13 기본값
  const [customWidth, setCustomWidth] = useState(390)
  const [customHeight, setCustomHeight] = useState(844)


  const handleTest = () => {
    setError('')

    // 이전 프레임 효과가 실행 중이면 정리
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    if (!code.trim()) {
      setError('코드를 입력해주세요')
      return
    }

    try {
      if (mode === 'fire') {
        // fire( 로 시작하는 경우 괄호 안의 내용만 추출
        let cleanedCode = code.trim()
        const fireMatch = cleanedCode.match(/fire\(([\s\S]*)\)/)
        if (fireMatch) {
          cleanedCode = fireMatch[1]
        }

        // createShape 함수를 사용할 수 있도록 컨텍스트 제공
        // fire 함수가 자동으로 Promise를 resolve하므로 await 불필요
        // eslint-disable-next-line no-new-func
        const executeCode = new Function('fire', 'createShape', `
          fire(${cleanedCode});
        `)

        executeCode(fire, createShape)
      } else {
        // fireFrame 모드: 자동 생성된 코드 실행
        const generatedCode = generateFireFrameCode(code, duration)
        const fireFrameMatch = generatedCode.match(/fireFrame\(([\s\S]*)\)/)
        if (!fireFrameMatch) {
          setError('코드 생성에 실패했습니다')
          return
        }

        // eslint-disable-next-line no-new-func
        const executeCode = new Function('fireFrame', 'fire', 'createShape', `
          return fireFrame(${fireFrameMatch[1]});
        `)

        const cleanup = executeCode(fireFrame, fire, createShape)
        cleanupRef.current = cleanup
      }
    } catch (err) {
      console.error('Code execution error:', err)
      setError(err instanceof Error ? err.message : '코드 실행 중 오류가 발생했습니다')
    }
  }

  const handleClear = () => {
    setCode('')
    setError('')
    // 프레임 효과 정리
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
  }

  const handleStop = () => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
  }

  // fireFrame 모드에서 fire 코드를 fireFrame 형태로 변환
  const generateFireFrameCode = (fireCode: string, duration: number): string => {
    // fire( 감싸는 부분 제거
    let cleanedCode = fireCode.trim()
    const fireMatch = cleanedCode.match(/fire\(([\s\S]*)\)/)
    if (fireMatch) {
      cleanedCode = fireMatch[1]
    }

    // fireFrame 형태로 래핑
    return `fireFrame({
  execute: (fire) => {
    fire(${cleanedCode})
  },
  duration: ${duration}
})`
  }

  // fireFrame 모드일 때 보여줄 실제 코드
  const displayCode = mode === 'fireFrame' && code.trim()
    ? generateFireFrameCode(code, duration)
    : code

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">코드 테스트</h1>
          <p className="text-gray-300">
            복사한 <code className="bg-gray-800 px-2 py-1 rounded text-sm">fire()</code> 또는{' '}
            <code className="bg-gray-800 px-2 py-1 rounded text-sm">fireFrame()</code> 코드를 붙여넣고 테스트해보세요
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setMode('fire')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'fire'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            일반 효과 (fire)
          </button>
          <button
            onClick={() => setMode('fireFrame')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              mode === 'fireFrame'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            프레임 효과 (fireFrame)
          </button>
        </div>

        {/* Custom Canvas Preview Area */}
        {useCustomCanvas && (
          <div className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">커스텀 Canvas 미리보기</h2>
              <button
                onClick={handleTest}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 active:scale-[0.98] transition-[transform,colors] duration-200"
              >
                🎉 테스트 실행
              </button>
            </div>

            {/* 기기 프리셋 선택 */}
            <div className="mb-4">
              <label className="block text-white text-sm font-semibold mb-2">
                기기 프리셋
              </label>
              <div className="flex flex-wrap gap-2">
                {DEVICE_PRESETS.map((device, index) => (
                  <button
                    key={device.name}
                    onClick={() => {
                      setSelectedDeviceIndex(index)
                      if (index === DEVICE_PRESETS.length - 1) {
                        // Custom 선택 시 현재 값 유지
                        return
                      }
                      setCustomWidth(device.width)
                      setCustomHeight(device.height)
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDeviceIndex === index
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {device.name}
                    {index !== DEVICE_PRESETS.length - 1 && (
                      <span className="ml-1 text-xs opacity-70">
                        ({device.width}×{device.height})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom 크기 입력 */}
            {selectedDeviceIndex === DEVICE_PRESETS.length - 1 && (
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    너비 (px)
                  </label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    min={100}
                    max={1200}
                    step={10}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    높이 (px)
                  </label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    min={100}
                    max={1400}
                    step={10}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-4 border-blue-500/50 mx-auto"
              style={{
                width: `${customWidth}px`,
                height: `${customHeight}px`,
                maxWidth: '100%',
              }}
            >
              <canvas
                ref={setConfettiCanvasRef}
                className="w-full h-full block"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <p className="text-gray-500 text-sm font-medium">
                  {customWidth}×{customHeight}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
          {mode === 'fireFrame' && (
            <div className="mb-4">
              <label className="block text-white text-sm font-semibold mb-2">
                실행 시간 (밀리초)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={100}
                max={60000}
                step={100}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Code Input */}
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              {mode === 'fire' ? 'Confetti 코드' : 'fire() 코드 (자동으로 fireFrame으로 변환됩니다)'}
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={
                mode === 'fire'
                  ? `fire({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
})

또는

fire([
  { particleCount: 50, angle: 60 },
  { particleCount: 50, angle: 120 }
])`
                  : `{
  particleCount: 3,
  spread: 180,
  origin: { y: -0.1 }
}

또는

fire({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
})`
              }
              className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {/* fireFrame 미리보기 */}
          {mode === 'fireFrame' && code.trim() && (
            <div className="mb-4">
              <label className="block text-white text-sm font-semibold mb-2">
                생성될 코드 미리보기
              </label>
              <pre className="w-full bg-gray-900 text-blue-400 font-mono text-sm p-4 rounded-lg border border-gray-700 overflow-x-auto">
                {displayCode}
              </pre>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Canvas Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomCanvas}
                onChange={(e) => setUseCustomCanvas(e.target.checked)}
                className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-white font-medium">
                커스텀 Canvas 영역 사용 (특정 영역에서만 효과 실행)
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!useCustomCanvas && (
              <button
                onClick={handleTest}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 active:scale-[0.98] transition-[transform,colors,shadow] duration-200 shadow-lg hover:shadow-xl"
              >
                🎉 테스트 실행
              </button>
            )}
            {mode === 'fireFrame' && cleanupRef.current && (
              <button
                onClick={handleStop}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 active:scale-[0.98] transition-[transform,colors] duration-200"
              >
                ⏹ 중지
              </button>
            )}
            <button
              onClick={handleClear}
              className={`px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 active:scale-[0.98] transition-[transform,colors] duration-200 ${
                useCustomCanvas ? 'flex-1' : ''
              }`}
            >
              지우기
            </button>
          </div>

          {/* Usage Guide */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <h3 className="text-white font-semibold mb-2">사용 방법</h3>
            {mode === 'fire' ? (
              <ul className="text-gray-300 text-sm space-y-1">
                <li>1. 프리셋 페이지에서 코드를 복사합니다</li>
                <li>2. 위의 텍스트 영역에 붙여넣습니다</li>
                <li>3. (선택) 커스텀 Canvas를 활성화하여 특정 영역에서만 효과를 실행할 수 있습니다</li>
                <li>4. "테스트 실행" 버튼을 클릭합니다</li>
                <li>
                  5. <code className="bg-gray-800 px-1 rounded">fire()</code> 감싸는 부분은 자동으로
                  제거됩니다
                </li>
              </ul>
            ) : (
              <ul className="text-gray-300 text-sm space-y-1">
                <li>1. 실행 시간을 밀리초 단위로 입력합니다 (예: 3000 = 3초)</li>
                <li>2. 프리셋 페이지에서 <code className="bg-gray-800 px-1 rounded">fire()</code> 코드를 복사하여 붙여넣습니다</li>
                <li>
                  3. 자동으로 <code className="bg-gray-800 px-1 rounded">fireFrame()</code> 형태로 변환되어 미리보기에 표시됩니다
                </li>
                <li>4. "테스트 실행" 버튼을 클릭하여 프레임 효과를 시작합니다</li>
                <li>5. "중지" 버튼으로 언제든지 효과를 멈출 수 있습니다</li>
              </ul>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-300 hover:text-blue-200 underline transition-colors"
          >
            ← 에디터로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
