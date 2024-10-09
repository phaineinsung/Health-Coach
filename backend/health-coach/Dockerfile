# 1단계: 빌드 단계
FROM eclipse-temurin:17-jdk-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 래퍼 및 프로젝트 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Gradle 래퍼 실행 권한 설정
RUN chmod +x gradlew

# Gradle을 사용하여 빌드 수행
RUN ./gradlew build -x test

# 2단계: 실행 단계
FROM eclipse-temurin:17-jdk-alpine

# 빌드한 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar /app/health-coach.jar

# 애플리케이션 실행
CMD ["java", "-jar", "/app/health-coach.jar"]
