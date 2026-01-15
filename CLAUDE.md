# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

GFX Automation Dashboard - 포커 방송용 그래픽 오버레이 자동화 시스템. Main/Sub 듀얼 대시보드 구조로 WebSocket 실시간 통신.

## 빌드/테스트 명령

```powershell
# 개발 서버 (localhost:3000)
npm run dev

# E2E 테스트 (Playwright)
npx playwright test                              # 전체
npx playwright test tests/e2e/main-dashboard.spec.ts  # 개별

# 테스트 UI 모드
npx playwright test --ui
```

## 아키텍처

### 듀얼 대시보드 구조

```
Main Dashboard (/)          WebSocket (3001)         Sub Dashboard (/sub)
┌─────────────────┐         ┌──────────┐            ┌─────────────────┐
│ Session Manager │ ──────▶ │          │ ◀──────── │ Composition Grid│
│ Hand Browser    │         │ Main ↔   │            │ Slot Mapping    │
│ Cuesheet Editor │ ◀────── │   Sub    │ ────────▶ │ Render Queue    │
│ Player Grid     │         │          │            │                 │
└─────────────────┘         └──────────┘            └─────────────────┘
```

### 주요 메시지 흐름

| Main → Sub | Sub → Main |
|------------|------------|
| `cue_item_selected` | `render_status_update` |
| `hand_updated` | `render_complete` |
| `session_changed` | `render_error` |
| `render_request` | `mapping_changed` |

### Zustand Stores (8개)

**Main Dashboard (4개)**
- `useSessionStore` - 세션/게임 상태
- `useCuesheetStore` - 큐시트 아이템
- `useRealtimeStore` - Supabase Realtime
- `useUIStore` - 탭/모달 UI 상태

**Sub Dashboard (4개)**
- `useCompositionStore` - AE 컴포지션 목록
- `useSlotMappingStore` - 필드 매핑
- `useRenderQueueStore` - 렌더 작업 큐
- `useWebSocketStore` - WS 연결 상태

### 디렉토리 구조

```
src/
├── components/
│   ├── ui/           # Button, Card, Modal 등 공통 UI
│   ├── layout/       # Header, Sidebar, TabNavigation
│   └── features/     # 기능별 컴포넌트
│       ├── player-grid/      # 9인 플레이어 그리드
│       ├── hand-browser/     # 핸드 목록/상세
│       ├── cuesheet/         # 큐시트 에디터
│       ├── composition-grid/ # AE 컴포지션 선택
│       ├── slot-mapping/     # 데이터 필드 매핑
│       └── render-queue/     # 렌더 작업 관리
├── stores/           # Zustand stores
├── types/            # TypeScript 타입 정의
└── lib/
    └── websocket/    # WS 서버/클라이언트
```

## 타입 시스템

주요 도메인 타입은 `src/types/`에 정의:

- `Session`, `Hand`, `HandPlayer` - 포커 게임 데이터
- `CueItem`, `Cuesheet` - 방송 큐시트
- `Composition`, `FieldMapping` - AE 컴포지션 매핑
- `RenderJob`, `RenderOutput` - 렌더 작업
- `MainToSubMessage`, `SubToMainMessage` - WebSocket 메시지

## WebSocket 설정

```typescript
// src/lib/websocket/config.ts
WS_CONFIG = {
  url: 'ws://localhost:3001/ws/dashboard',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000
}
```

## 테스트 컨벤션

E2E 테스트는 `data-testid` 속성 사용:

```typescript
// 컴포넌트
<div data-testid="player-grid">

// 테스트
await page.getByTestId('player-grid').toBeVisible();
```

## 주의사항

- Main/Sub 대시보드는 별도 라우트 (`/`, `/sub`)
- WebSocket 서버는 포트 3001 사용
- Playwright 테스트 시 dev 서버 자동 실행 (120초 타임아웃)
