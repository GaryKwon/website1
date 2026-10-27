# LUCKY PACK

홀로그램 팩을 열면 운세가 나오는 정적 웹사이트입니다.
120종 운세를 무작위로 뽑으며, 한 묶음을 모두 뽑기 전에는 중복되지 않습니다.
색·숫자·컬렉션 없이 운세만 표시합니다.

## 로컬 실행

Node.js 18 이상이 필요합니다. 별도 라이브러리 설치나 빌드는 필요하지 않습니다.
압축을 푼 뒤 이 README가 있는 폴더에서 실행하세요.

```sh
npm start
```

브라우저에서 <http://127.0.0.1:4173/>을 여세요.
다른 포트는 `npm start -- 4174`처럼 지정할 수 있습니다.
ES 모듈을 사용하므로 `index.html`을 직접 여는 대신 서버로 실행해야 합니다.

문법 확인:

```sh
npm run check
```

## GitHub 업로드

ZIP 파일 자체가 아니라, 압축을 푼 `lucky-pack` 폴더의 **내용 전체**를 저장소 루트에 올리세요.
`.github` 같은 숨김 폴더도 포함해야 합니다. Git을 사용하면 함께 업로드됩니다.

```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

`YOUR_REPOSITORY_URL`은 새로 만든 GitHub 저장소 주소로 바꾸세요.

## GitHub Pages 배포

1. 저장소의 **Settings → Pages → Source**를 **GitHub Actions**로 설정합니다.
2. `main` 또는 `master` 브랜치에 푸시합니다.
3. **Actions**에서 배포가 완료되면 **Settings → Pages**의 사이트 주소로 접속합니다.

배포 설정은 `.github/workflows/pages.yml`에 있으며, 웹사이트 폴더인 `dist`만 배포합니다.
다른 기본 브랜치를 사용한다면 워크플로의 `branches`를 수정하세요.
[GitHub 공식 워크플로 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)를 참고했습니다.

## 파일 구조

- `dist/index.html`: 화면 구조
- `dist/app.js`: 팩 선택·개봉·운세 표시·복사
- `dist/fortunes.js`: 운세 120종
- `dist/draw.js`: 무작위 추첨·중복 방지
- `dist/hover.js`: 마우스 반응
- `dist/*.css`: 레이아웃·홀로그램·입체·그라디에이션 효과
- `scripts/serve.mjs`: 로컬 서버
- `.github/workflows/pages.yml`: GitHub Pages 배포

운세 내용은 `dist/fortunes.js`에서 수정할 수 있습니다.
Google Fonts를 불러오며, 인터넷 연결이 없으면 기본 글꼴을 사용합니다.
개인 계정의 배포 식별자·인증 정보·Git 이력·작업 임시 파일은 포함하지 않았습니다.
