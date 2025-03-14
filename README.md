# CineAI: 인공지능 영화 추천 서비스 🎬

인공지능 기반 개인화 영화 추천 및 정보 제공 플랫폼

---

## 📌 프로젝트 소개
CineAI는 사용자의 영화 취향을 분석하여 개인화된 추천을 제공하는 서비스입니다. 한국 영화 데이터베이스(KMDB)와 인공지능(Groq) 알고리즘을 결합하여 사용자가 좋아할 만한 영화를 발견할 수 있도록 도와줍니다.

- **핵심 가치**: 사용자 맞춤형 추천, 직관적 UI/UX, 풍부한 영화 정보
- **타겟 사용자**: 새로운 영화 발견을 원하는 영화 애호가, 영화 정보 탐색자

---

## ✨ 주요 기능

### 🔐 인증 시스템
- **카카오 소셜 로그인** - 간편한 회원가입 및 로그인
- **관리자 계정** - 콘텐츠 관리를 위한 전용 계정

### 🏠 홈 화면
- **맞춤형 영화 추천** - 사용자가 찜한 영화를 분석한 AI 추천 시스템
- **최신 영화 섹션** - 관리자가 등록한 최신 영화 정보
- **새로고침 기능** - 실시간으로 추천 목록 업데이트

### 🔍 검색 기능
- **통합 검색** - 영화 제목, 감독, 배우 등 키워드 검색
- **페이지 상태 유지** - 세션 스토리지를 활용한 검색 결과 캐싱
- **더보기 기능** - 페이지네이션을 통한 추가 결과 로딩

### 🎞️ 영화 상세 정보
- **영화 메타데이터** - 제목, 장르, 감독, 출연진, 개봉일, 줄거리
- **찜하기 기능** - 관심 영화 저장 및 추천 알고리즘에 반영
- **포스터 다운로드** - 고품질 영화 포스터 저장 기능

### 👤 마이페이지
- **프로필 관리** - 닉네임 변경 기능
- **찜한 영화 목록** - 저장한 영화 관리 및 삭제
- **회원 탈퇴** - 계정 삭제 기능

### 👨‍💼 관리자 페이지
- **최신 영화 관리** - 새로운 영화 등록 및 관리
- **영화 데이터 편집** - 기존 영화 정보 수정

---

## 🛠 기술 스택

### Frontend
| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18 |
| 라우팅 | React Router 6 |
| HTTP 클라이언트 | Axios |
| 상태 관리 | Context API, Session Storage |
| 스타일링 | CSS3, 미디어 쿼리 |
| UI 컴포넌트 | SweetAlert2, react-icons |
| 소셜 로그인 | 카카오 SDK |

---

## 📱 반응형 디자인
모든 페이지는 반응형으로 설계되어 데스크톱, 태블릿, 모바일 등 다양한 디바이스에서 최적의 사용자 경험을 제공합니다.


---

## 🚀 설치 및 실행 방법

### 로컬 개발 환경

```bash
# 저장소 복제
git clone https://github.com/your-username/cineAI.git
cd cineAI/Frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수 설정 (.env)
```
VITE_KAKAO_CLIENT_ID=your_kakao_key
VITE_API_BASE_URL=http://localhost:8080
VITE_IMAGE_PATH=/assets/images/
```

### Docker로 실행하기
```bash
# 도커 이미지 빌드 및 실행
docker-compose up --build
```

---

## 🔧 트러블슈팅

### 흔히 발생하는 문제
- **카카오 로그인이 되지 않을 때**: 개발자 콘솔에서 네트워크 탭을 확인하여 API 요청 형식이 올바른지 확인하세요.
- **영화 이미지가 로드되지 않을 때**: 기본 이미지로 자동 대체됩니다. 네트워크 연결을 확인하세요.
- **검색 결과가 유지되지 않을 때**: 브라우저의 세션 스토리지가 활성화되어 있는지 확인하세요.

---

## 📘 폴더 구조
```
/Frontend
├── src/
│   ├── components/    # 재사용 가능한 UI 컴포넌트
│   ├── pages/         # 주요 페이지 컴포넌트
│   ├── utils/         # 유틸리티 함수
│   ├── hooks/         # 커스텀 훅
│   ├── assets/        # 이미지, 폰트 등 정적 리소스
│   └── App.jsx        # 앱 진입점
├── public/            # 정적 파일
├── .env               # 환경 변수
└── vite.config.js     # Vite 설정
```

---

## 👥 팀 정보
- 프론트엔드: 김지수, 류동현
- 백엔드: 오태양, 이상훈, 조수빈

---

## 🙏 감사의 말
- 한국영화데이터베이스(KMDB)에서 제공하는 영화 데이터를 활용했습니다.
- 모든 이미지와 콘텐츠에 대한 권리는 해당 소유자에게 있습니다.
