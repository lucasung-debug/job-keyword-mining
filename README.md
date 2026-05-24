# 직무 키워드 분석 / Job Keyword Text Mining

현직자 인터뷰·설문 같은 **정성 텍스트**를 일관된 프레임워크로 분석해, 직무별 역량·스킬·태도 키워드를 정량적으로 추출하고 JD 개선안까지 제안하는 HR 텍스트 마이닝 데모입니다.
공개 화면은 개인정보·기업 비밀 노출을 피하기 위해 **bundled dummy data** 로 재현한 privacy-conscious HR text-mining demo 입니다.

- Live URL: https://lucasung-debug.github.io/job-keyword-mining/
- Repo URL: https://github.com/lucasung-debug/job-keyword-mining

## Demo / Data Boundary

이 저장소는 포트폴리오 검토와 공개 데모를 위한 프로젝트입니다. 화면의 모든 인터뷰 텍스트·직무명·수치는 데모 맥락을 보여주기 위한 **가상의 더미 값**이며, 실제 직원·지원자 개인정보나 기업 내부 비밀을 포함하지 않습니다.

이 프로젝트는 특정 기업의 공식 운영 시스템이 아닙니다. 실제 사내에서 수행했던 직무 키워드 분석 사례(GPT Agent 기반 텍스트 마이닝)의 흐름을 공개 가능한 형태로 재구성했습니다.

## Problem / Solution

직무 분류를 고도화하려면 인터뷰·설문 텍스트를 분석해야 하지만, 단순히 AI에 질문하면 프롬프트마다 결과가 달라져 데이터 신뢰도를 확보하기 어렵습니다.

이 데모는 다음 흐름을 한 화면에서 보여줍니다.

1. **Agent Persona 고정** — '직무 분석가' 에이전트가 역량·스킬·태도 **3축 프레임워크**로 매 분석에 동일 기준을 적용 (프롬프트 편차 제거)
2. **정성 → 정량 변환** — 텍스트에서 직무별 빈출 키워드를 추출하고 출현 빈도로 집계
3. **키워드 군집화** — 추출 키워드를 역량/스킬/태도 카테고리로 군집
4. **빈도 시각화** — 상위 키워드를 빈도 막대 차트로 표현
5. **활용** — 추출 상위 키워드 기반 JD 문구 자동 제안 + 직무 단위 분류

## Result (원 사례 기준)

- 직군이 아닌 **직무 단위** 분류 체계 수립으로 채용 JD·수당 체계 근거 표준화
- 외부 지원자 데이터 600건+ 대상 EVP(Employee Value Proposition) 발굴 분석으로 확대

## Tech

빌드가 필요 없는 단일 페이지 정적 웹앱입니다.

- HTML + CSS + Vanilla JavaScript (no build step)
- 사전 기반 키워드 매칭 + 빈도 집계 (클라이언트 사이드)
- Pretendard 웹폰트 / GitHub Pages 정적 호스팅

## Local Run

```bash
python -m http.server 8774
# http://localhost:8774/
```

## Roadmap

데모영상 제작 이후, 공개 GitHub 오픈소스(한국어 형태소 분석·임베딩 기반 군집 등)를 조사하여 실제 사용 가능한 수준으로 고도화할 예정입니다.
