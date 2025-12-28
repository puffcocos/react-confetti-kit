import { useState } from 'react'
import { useConfetti } from '~/shared/confetti/use-confetti'

export function ExamplePage() {
  const { fire, createShape } = useConfetti()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleMyOwn = async () => {
    // fire 함수가 자동으로 Promise를 resolve하므로 await만 추가
    await fire({
      particleCount: 39,
      spread: 70,
      startVelocity: 45,
      decay: 0.9,
      gravity: 1,
      ticks: 200,
      origin: {
        x: 0.5,
        y: 0.6,
      },
      angle: 90,
      scalar: 1,
      drift: 0,
      flat: false,
      shapes: [
        createShape({
          svg: `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M47.985 18.9109L10.5249 15.2009L8.6449 15.0008C6.3549 14.7608 4.36499 16.5508 4.36499 18.8608V75.6408C4.36499 77.5108 5.63496 79.1508 7.45496 79.6108L46.095 89.3409C47.335 89.6509 48.6349 89.6509 49.8849 89.3409L88.5249 79.6108C90.3449 79.1508 91.615 77.5208 91.615 75.6408V18.8608C91.615 16.5608 89.625 14.7608 87.335 15.0008L85.455 15.2009L47.9949 18.9109H47.985Z" fill="#296BE5"/><path d="M47.9847 18.9109L21.9347 12.0609L15.3846 10.3409C12.9246 9.69095 10.5247 11.5509 10.5247 14.0909V69.1709C10.5247 70.9909 11.7546 72.5909 13.5146 73.0509L47.9847 82.1209V18.9209V18.9109Z" fill="#85B7FF"/><path d="M47.9846 82.1108L82.4546 73.0409C84.2146 72.5809 85.4446 70.9809 85.4446 69.1609V14.0809C85.4446 11.5409 83.0346 9.68094 80.5846 10.3309L74.0345 12.0509L47.9846 18.9009V82.1008V82.1108Z" fill="#85B7FF"/><path d="M47.9846 18.9109L27.7745 7.11082C25.1845 5.60082 21.9446 7.47092 21.9446 10.4609V64.6008C21.9446 66.0308 22.7046 67.3509 23.9346 68.0709L47.9945 82.1208V18.9209L47.9846 18.9109Z" fill="#CDDEF5"/><path d="M68.1946 7.11082L47.9846 18.9109V82.1108L72.0446 68.0609C73.2746 67.3409 74.0345 66.0209 74.0345 64.5909V10.4509C74.0345 7.46091 70.7846 5.59081 68.2046 7.10081L68.1946 7.11082Z" fill="#D7E7FF"/></svg>`,
          scalar: 1,
        }),
      ],
    })
  }

  const handleTest = async () => {
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
      // fire 함수가 자동으로 Promise를 resolve하므로 단순하게 실행 가능
      // eslint-disable-next-line no-new-func
      const executeCode = new Function('fire', 'createShape', `
        return fire(${cleanedCode});
      `)

      await executeCode(fire, createShape)
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

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleMyOwn}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 active:scale-[0.98] transition-[transform,colors,shadow] duration-200 shadow-lg hover:shadow-xl"
            >
              🎉 테스트 실행
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 active:scale-[0.98] transition-[transform,colors] duration-200"
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
              <li>3. "테스트 실행" 버튼을 클릭합니다</li>
              <li>4. <code className="bg-gray-800 px-1 rounded">fire()</code> 감싸는 부분은 자동으로 제거됩니다</li>
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
