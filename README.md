# Confetti Editor

React 기반의 인터랙티브한 confetti 효과 에디터이자 라이브러리입니다. [canvas-confetti](https://github.com/catdad/canvas-confetti)를 기반으로 한 사용하기 쉬운 React 훅과 프리셋을 제공합니다.

🎯 **[Live Demo](https://puffcocos.github.io/confetti-editor/)** | 📚 **[API 문서](./docs/api-reference.md)**

## 주요 기능

- 🎨 **인터랙티브 에디터**: 실시간으로 confetti 옵션을 테스트하고 조정
- 🎯 **사용하기 쉬운 훅**: `useConfetti` 훅으로 간편한 confetti 제어
- 🎭 **프리셋 시스템**: 8가지 미리 정의된 프리셋 제공 (celebration, fireworks, snow 등)
- 🎪 **커스텀 파티클**: SVG Path 기반 커스텀 모양 지원 (하트, 별, 호박 등)
- 🎨 **색상 커스터마이징**: 색상 프리셋 저장 및 관리
- 🎯 **Canvas 영역 제한**: 특정 영역에서만 confetti 렌더링 가능
- 💾 **프리셋 저장**: 커스텀 효과 조합을 로컬 스토리지에 저장
- ♿️ **접근성**: 애니메이션 감소 모드 자동 감지 및 대응

## 빠른 시작

### 개발 환경 설정

이 프로젝트는 **pnpm** 패키지 매니저를 사용합니다.

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:5173)
pnpm run dev

# 타입 체크
pnpm run typecheck

# 프로덕션 빌드
pnpm run build
```

### 에디터 사용

브라우저에서 [http://localhost:5173/preview](http://localhost:5173/preview)를 열어 모든 옵션을 실시간으로 테스트할 수 있습니다.

## 사용법

### 기본 사용

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function MyComponent() {
  const { fire } = useConfetti()

  return <button onClick={() => fire()}>축하하기! 🎉</button>
}
```

### 프리셋 사용

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'
import { confettiPresets } from '~/shared/confetti/presets'

function MyComponent() {
  const { fire } = useConfetti()

  return <button onClick={() => fire(confettiPresets.celebration)}>축하합니다! 🎊</button>
}
```

### 커스텀 옵션

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

function MyComponent() {
  const { fire } = useConfetti()

  const customFire = () => {
    fire({
      particleCount: 200,
      spread: 180,
      colors: ['#ff0000', '#00ff00', '#0000ff'],
    })
  }

  return <button onClick={customFire}>커스텀 효과!</button>
}
```

## 주요 API

### useConfetti 훅

`useConfetti` 훅은 confetti 효과를 제어하는 세 가지 주요 함수를 제공합니다:

```tsx
import { useConfetti } from '~/shared/confetti/use-confetti'

const { fire, createShape, setConfettiCanvasRef } = useConfetti()
```

#### 주요 함수

- **`fire(options?)`** - confetti 효과 실행

  - 단일 옵션 객체 또는 배열로 여러 효과 순차 실행 가능

- **`createShape({ path, matrix? })`** - SVG Path로 커스텀 파티클 모양 생성

- **`setConfettiCanvasRef(canvas)`** - 특정 canvas 요소에서만 confetti 렌더링

### 사용 가능한 프리셋

```tsx
import { confettiPresets } from '~/shared/confetti/presets'

// 8가지 프리셋 제공
fire(confettiPresets.celebration) // 축하
fire(confettiPresets.fireworks) // 불꽃놀이
fire(confettiPresets.snow) // 눈
fire(confettiPresets.stars) // 별
fire(confettiPresets.cannon) // 대포
fire(confettiPresets.pride) // 프라이드
fire(confettiPresets.burst) // 폭발
fire(confettiPresets.schoolPride) // 학교 프라이드
```

## 문서

자세한 사용법과 예제는 아래 문서를 참고하세요:

| 문서                                     | 설명                                      |
| ---------------------------------------- | ----------------------------------------- |
| [API 레퍼런스](./docs/api-reference.md)  | `useConfetti` 훅과 모든 옵션 상세 설명    |
| [프리셋 가이드](./docs/presets.md)       | 기본 프리셋 사용법과 커스텀 프리셋 만들기 |
| [커스텀 파티클](./docs/custom-shapes.md) | SVG Path 기반 커스텀 모양 만들기          |
| [예제 모음](./docs/examples.md)          | 실전 사용 예제 (게임, 폼, 이벤트 등)      |

## 프로젝트 구조

```
confetti-editor/
├── app/
│   ├── shared/
│   │   └── confetti/              # 💎 Confetti 라이브러리 코드
│   │       ├── use-confetti.ts    # 메인 훅 (fire, createShape, setConfettiCanvasRef)
│   │       ├── presets.ts         # 8가지 프리셋 정의
│   │       └── types.ts           # TypeScript 타입 re-export
│   ├── pages/
│   │   ├── home.tsx               # 홈 페이지
│   │   ├── preview/               # 인터랙티브 에디터 (메인 기능)
│   │   │   ├── index.tsx          # 에디터 페이지 (상태 관리)
│   │   │   ├── preset-section.tsx # 프리셋 섹션
│   │   │   └── ...
│   │   └── example/               # 사용 예제 페이지
│   └── components/                # 재사용 가능한 UI 컴포넌트
└── docs/                          # 📚 문서
    ├── api-reference.md           # API 문서
    ├── presets.md                 # 프리셋 가이드
    ├── custom-shapes.md           # 커스텀 파티클 가이드
    ├── examples.md                # 실전 예제
    └── troubleshooting.md         # 문제 해결 가이드
```

## 기술 스택

| 기술                | 용도                           | 버전    |
| ------------------- | ------------------------------ | ------- |
| **React Router v7** | SPA 라우팅 및 파일 기반 라우팅 | latest  |
| **TypeScript**      | 타입 안전성 및 개발자 경험     | latest  |
| **Tailwind CSS**    | 유틸리티 기반 스타일링         | latest  |
| **canvas-confetti** | Confetti 렌더링 엔진           | latest  |
| **Vite**            | 빌드 도구 및 개발 서버         | latest  |
| **pnpm**            | 패키지 매니저                  | 10.13.1 |

### 아키텍처 특징

- **SPA Mode**: `ssr: false` 설정으로 클라이언트 전용 애플리케이션
- **GitHub Pages 배포**: basename `/confetti-editor/` 설정
- **로컬 스토리지**: 커스텀 프리셋 및 색상 저장
- **File-based Routing**: `app/routes.ts`에서 라우트 정의

## 기여하기

프로젝트에 기여하고 싶으시다면:

1. 이슈를 먼저 확인하거나 새 이슈를 생성해주세요
2. Fork 후 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: add amazing feature'`)
4. 브랜치에 Push하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

### 코딩 컨벤션

- 파일/폴더명: `kebab-case`
- React 컴포넌트: `PascalCase`
- 변수/함수: `camelCase`
- TypeScript 엄격 모드 사용

## 라이선스

이 프로젝트는 [canvas-confetti](https://github.com/catdad/canvas-confetti) 라이브러리를 기반으로 합니다.

- **canvas-confetti**: ISC License

---

Built with ❤️ using React Router v7 and canvas-confetti
