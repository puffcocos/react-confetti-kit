# 예제 모음

다양한 시나리오에서 confetti를 사용하는 실전 예제입니다.

## 기본 예제

### 버튼 클릭 시 발사

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function SuccessButton() {
  const { fire } = useConfetti()

  return <button onClick={() => fire()}>축하하기! 🎉</button>
}
```

---

## 이벤트 기반 예제

### 폼 제출 성공

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'
import { confettiPresets } from '~/shared/confetti/presets'

function SignupForm() {
  const { fire } = useConfetti()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitForm()
      // 성공 시 축하 효과
      fire(confettiPresets.celebration)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드들 */}
      <button type="submit" disabled={isSubmitting}>
        가입하기
      </button>
    </form>
  )
}
```

### 게임 클리어

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function Game() {
  const { fire } = useConfetti()
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    // 레벨 업 시 폭발 효과
    if (level > 1) {
      fire({
        particleCount: level * 50,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
      })
    }
  }, [level, fire])

  return (
    <div>
      <h1>레벨: {level}</h1>
      <p>점수: {score}</p>
    </div>
  )
}
```

---

## Canvas 영역 제한

### 게임 영역에서만 발사

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function GameArea() {
  const { fire, setConfettiCanvasRef } = useConfetti()

  return (
    <div className="game-container">
      <h1>게임 영역</h1>

      {/* 이 canvas에서만 confetti 발생 */}
      <canvas
        ref={setConfettiCanvasRef}
        width={800}
        height={600}
        className="border border-gray-300"
      />

      <button onClick={() => fire({ particleCount: 100 })}>승리! 🏆</button>
    </div>
  )
}
```

### Canvas 모드 ON/OFF 전환

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'
import { useState } from 'react'

function ToggleCanvasMode() {
  const { fire, setConfettiCanvasRef } = useConfetti()
  const [useCanvas, setUseCanvas] = useState(false)

  const toggleCanvas = () => {
    if (useCanvas) {
      setConfettiCanvasRef(null) // 전역 canvas로 복귀
    }
    setUseCanvas(!useCanvas)
  }

  return (
    <div>
      <button onClick={toggleCanvas}>Canvas 모드: {useCanvas ? 'ON' : 'OFF'}</button>

      {useCanvas && (
        <canvas
          ref={setConfettiCanvasRef}
          width={800}
          height={600}
          className="border-4 border-purple-400"
        />
      )}

      <button onClick={() => fire()}>발사!</button>
    </div>
  )
}
```

---

## 커스텀 파티클 예제

### 하트 효과

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function LikeButton() {
  const { fire, createShape } = useConfetti()

  const handleLike = () => {
    const heart = createShape({
      path: 'M5 2 C5 0.5 6 0 7 0 C8 0 9 1 9 2.5 C9 4 7.5 6 5 8 C2.5 6 1 4 1 2.5 C1 1 2 0 3 0 C4 0 5 0.5 5 2z',
    })

    fire({
      shapes: [heart],
      particleCount: 30,
      colors: ['#ff0000', '#ff69b4', '#ff1493'],
      origin: { x: 0.5, y: 0.8 },
    })
  }

  return <button onClick={handleLike}>❤️ 좋아요</button>
}
```

### 별점 평가

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function StarRating() {
  const { fire, createShape } = useConfetti()

  const handleRating = (stars: number) => {
    if (stars >= 4) {
      const star = createShape({
        path: 'M5 0 L6 3 L10 3 L7 5 L8 8 L5 6 L2 8 L3 5 L0 3 L4 3z',
      })

      fire({
        shapes: [star],
        particleCount: stars * 10,
        colors: ['#ffd700', '#ffed4e'],
        spread: 70,
        startVelocity: 30,
      })
    }
  }

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button key={rating} onClick={() => handleRating(rating)}>
          ⭐️
        </button>
      ))}
    </div>
  )
}
```

---

## 타이밍 제어

### 순차적 발사

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'
import { confettiPresets } from '~/shared/confetti/presets'

function SequentialConfetti() {
  const { fire } = useConfetti()

  const fireSequence = () => {
    confettiPresets.celebration.forEach((effect, index) => {
      setTimeout(() => {
        fire(effect)
      }, index * 300) // 300ms 간격
    })
  }

  return <button onClick={fireSequence}>연속 발사 🎆</button>
}
```

### 지속적인 효과

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'
import { useEffect, useRef } from 'react'

function ContinuousConfetti({ duration = 5000 }) {
  const { fire } = useConfetti()
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // 200ms마다 발사
    intervalRef.current = setInterval(() => {
      fire({
        particleCount: 10,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() },
      })
    }, 200)

    // duration 후 중지
    const timeout = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, duration)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      clearTimeout(timeout)
    }
  }, [fire, duration])

  return <div>지속적인 confetti 효과 진행 중...</div>
}
```

---

## 위치 기반 예제

### 마우스 위치에서 발사

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function MouseConfetti() {
  const { fire } = useConfetti()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight

    fire({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
    })
  }

  return (
    <div onClick={handleClick} className="w-full h-screen cursor-pointer">
      클릭하면 confetti가 발사됩니다!
    </div>
  )
}
```

### 특정 요소 위치에서 발사

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'
import { useRef } from 'react'

function ButtonConfetti() {
  const { fire } = useConfetti()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight

    fire({
      particleCount: 50,
      spread: 70,
      origin: { x, y },
    })
  }

  return (
    <button ref={buttonRef} onClick={handleClick}>
      이 버튼 위치에서 발사! 🎯
    </button>
  )
}
```

---

## 반응형 예제

### 모바일 최적화

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function ResponsiveConfetti() {
  const { fire } = useConfetti()

  const handleFire = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const particleCount = isMobile ? 50 : 150

    fire({
      particleCount,
      spread: 70,
      startVelocity: isMobile ? 30 : 45,
    })
  }

  return <button onClick={handleFire}>반응형 Confetti 🎉</button>
}
```

### 화면 크기별 조정

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'
import { useState, useEffect } from 'react'

function AdaptiveConfetti() {
  const { fire } = useConfetti()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleFire = () => {
    const particleCount = Math.min(Math.floor(windowWidth / 10), 200)

    fire({
      particleCount,
      spread: windowWidth < 768 ? 60 : 100,
    })
  }

  return <button onClick={handleFire}>화면 크기에 맞춘 Confetti</button>
}
```

---

## 접근성 고려

### 애니메이션 감소 모드 대응

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function AccessibleConfetti() {
  const { fire } = useConfetti()

  const handleFire = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      fire({ particleCount: 100, spread: 70 })
    } else {
      // 대체 효과 (예: 간단한 알림)
      alert('축하합니다! 🎉')
    }
  }

  return <button onClick={handleFire}>접근성 고려 Confetti</button>
}
```

### disableForReducedMotion 옵션 사용

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function ReducedMotionConfetti() {
  const { fire } = useConfetti()

  return (
    <button
      onClick={() =>
        fire({
          particleCount: 100,
          disableForReducedMotion: true, // 자동으로 감지
        })
      }
    >
      자동 대응 Confetti
    </button>
  )
}
```

---

## 다음 단계

- [API 레퍼런스](./api-reference.md) - 전체 옵션 설명
- [프리셋 가이드](./presets.md) - 프리셋 사용법
