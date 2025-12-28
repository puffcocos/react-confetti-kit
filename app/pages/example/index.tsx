import { useState } from 'react'
import { useConfetti } from '~/shared/confetti/use-confetti'

export function ExamplePage() {
  const { fire, createShape, setConfettiCanvasRef } = useConfetti()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [useCustomCanvas, setUseCustomCanvas] = useState(false)


  const handleTest = () => {
    setError('')

    if (!code.trim()) {
      setError('코드를 입력해주세요')
      return
    }

    try {
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
    } catch (err) {
      console.error('Code execution error:', err)
      setError(err instanceof Error ? err.message : '코드 실행 중 오류가 발생했습니다')
    }
  }

  const handleClear = () => {
    setCode('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">코드 테스트</h1>
          <p className="text-gray-300">
            복사한 <code className="bg-gray-800 px-2 py-1 rounded text-sm">fire()</code> 코드를 붙여넣고 테스트해보세요
          </p>
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
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-4 border-blue-500/50">
              <canvas
                ref={setConfettiCanvasRef}
                className="w-full h-96 block"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <p className="text-gray-500 text-sm font-medium">Confetti 효과 영역</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
          {/* Code Input */}
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Confetti 코드
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`fire({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
})

또는

fire([
  { particleCount: 50, angle: 60 },
  { particleCount: 50, angle: 120 }
])`}
              className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>

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
            <ul className="text-gray-300 text-sm space-y-1">
              <li>1. 프리셋 페이지에서 코드를 복사합니다</li>
              <li>2. 위의 텍스트 영역에 붙여넣습니다</li>
              <li>3. (선택) 커스텀 Canvas를 활성화하여 특정 영역에서만 효과를 실행할 수 있습니다</li>
              <li>4. "테스트 실행" 버튼을 클릭합니다</li>
              <li>5. <code className="bg-gray-800 px-1 rounded">fire()</code> 감싸는 부분은 자동으로 제거됩니다</li>
            </ul>
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
