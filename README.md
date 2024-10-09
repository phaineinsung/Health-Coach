# health-coach

## 커밋 메시지 규칙

| 타입       | 설명                                                                 |
|------------|----------------------------------------------------------------------|
| `feat`     | 어떤 특정 어플리케이션에 더할 새로운 feature                         |
| `fix`      | 어떤 오류 해결 (fix)                                                 |
| `style`    | 스타일과 연관된 feature나 업데이트들 (포맷팅, 세미콜론 추가 등)        |
| `refactor` | 코드 베이스의 특정 부분을 재정렬 (refactoring) (기능 변경 없음)        |
| `test`     | 테스트와 관련된 모든 것 (테스트 추가, 테스트 리팩터 등)               |
| `docs`     | 문서화에 관한 모든 것 (README 수정, 주석 추가 등)                    |
| `chore`    | 정규 코드 유지보수 (빌드 태스크, 패키지 매니저 설정 등)               |

---

## branch 규칙

- `main` branch:
  - 최종 배포 파일이 완성되었을 때만 main 브랜치로 merge

- `develop` branch:
  - 모든 개발은 `develop` 브랜치에서 수행한다.
  - `develop` 브랜치는 `main` 브랜치로 병합되기 전에 테스트 및 통합을 위한 브랜치

- `backend` branch:
  - 백엔드 개발 작업은 `backend` 브랜치에서 수행한다.
  - 백엔드 작업이 완료되면 `develop` 브랜치로 merge

- `frontend` branch:
  - 프론트엔드 개발 작업은 `frontend` 브랜치에서 수행한다.
  - 프론트엔드 작업이 완료되면 `develop` 브랜치로 merge
