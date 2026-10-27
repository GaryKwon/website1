# LUCKY PACK

홀로그램 카드팩을 열어 오늘의 운세를 확인하는 웹사이트입니다.

[웹사이트 열기](https://garykwon.github.io/website1/)

- 120종 운세를 무작위로 추첨합니다.
- 같은 팩도 열 때마다 다른 운세가 나옵니다.
- 색·숫자·컬렉션 없이 운세만 표시합니다.

## 로컬 실행

Node.js 18 이상에서 다음 명령을 실행합니다. 별도 설치나 빌드는 필요하지 않습니다.

```sh
cd lucky-pack
npm start
```

브라우저에서 http://127.0.0.1:4173/ 을 엽니다.

## 파일 및 배포

- `lucky-pack/dist/`: 웹사이트의 HTML, CSS, JavaScript
- `index.html`: 저장소 루트의 GitHub Pages 진입 화면
- `.nojekyll`: 브랜치 배포로 되돌릴 때 사용하는 정적 배포 설정
- `.github/workflows/pages.yml`: GitHub Pages 자동 배포

루트 화면은 `lucky-pack/dist/`의 CSS와 JavaScript를 불러옵니다.
화면 구조를 변경하면 `lucky-pack/dist/index.html`과 루트 `index.html`에 함께 반영합니다.
GitHub Pages의 Source는 **GitHub Actions**입니다.
`main` 브랜치에 변경 내용을 올리면 워크플로가 `lucky-pack/dist/`를 사이트 루트로 배포합니다.
배포는 Node.js 24를 사용하는 액션과 Ubuntu 24.04 실행 환경을 사용합니다.
