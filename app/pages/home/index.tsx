import { Link } from 'react-router'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Confetti Web
          </h1>
          <p className="text-xl text-gray-600 mb-8">canvas-confetti를 활용한 React 컴포넌트</p>

          <div className="flex flex-col gap-4">
            <Link
              to="/preview"
              className="block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🎉 미리보기 페이지로 이동
            </Link>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl text-left">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">주요 기능</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">✨</span>
                  <span>8가지 프리셋 효과 (celebration, explosion, stars, snow 등)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🎨</span>
                  <span>실시간 옵션 조절 및 미리보기</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🚀</span>
                  <span>TypeScript 지원 및 TSDoc 주석</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">📦</span>
                  <span>재사용 가능한 Confetti 컴포넌트 및 useConfetti 훅</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
