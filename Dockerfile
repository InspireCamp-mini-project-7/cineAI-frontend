# Node.js를 기반으로 하는 리액트 앱 이미지
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치 및 빌드(CI)
COPY package.json package-lock.json ./
RUN npm install 
COPY . .
RUN npm run build

# Nginx를 기반으로 하는 최종 이미지
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# 빌드된 리액트 앱을 Nginx의 HTML 디렉토리로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 이미지 파일들 포함시키기
COPY src/assets usr/share/nginx/html/images


# 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]