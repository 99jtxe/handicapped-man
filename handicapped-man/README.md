# Handicapped Man - 발표 대본 분석 도구

React + TypeScript + Vite로 구축된 발표 대본 분석 및 개선 도구입니다.

## 기능

- 📝 발표 대본 문장 분석
- ✨ 어려운 표현을 쉬운 말로 변환
- 🎯 발표 구조 피드백 (도입, 흐름, 마무리)
- ❓ 예상 질문 생성
- 🔊 TTS(Text-to-Speech) 기능
- 📊 부적절한 콘텐츠 검사

## 개발 환경 설정

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

### 빌드 미리보기

```bash
npm run preview
```

## 배포

### Vercel 배포

1. Vercel 대시보드에서 프로젝트 import
2. Root Directory: `I-will-be-handicapped-man/handicapped-man`
3. Build Command: `npm run build`
4. Output Directory: `dist`

또는 `vercel.json` 파일이 자동으로 설정을 처리합니다.

### Netlify 배포

1. Netlify 대시보드에서 프로젝트 import
2. Build command: `npm run build`
3. Publish directory: `dist`

또는 `netlify.toml` 파일이 자동으로 설정을 처리합니다.

### 주의사항

⚠️ **빌드 명령어는 반드시 `npm run build`를 사용하세요.**
- ❌ `vite build` (직접 실행 시 오류 발생)
- ✅ `npm run build` (올바른 방법)

---

## React + TypeScript + Vite 템플릿 정보

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
