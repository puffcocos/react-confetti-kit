interface FireButtonProps {
  onFire: () => void
  label?: string
}

/**
 * Confetti 실행 버튼 컴포넌트
 */
export function FireButton({ onFire, label = 'fire!' }: FireButtonProps) {
  return (
    <button
      onClick={onFire}
      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 active:scale-[0.98] transition-[transform,colors,shadow] duration-200 shadow-lg hover:shadow-xl will-change-transform select-none"
    >
      🎉 {label}
    </button>
  )
}
