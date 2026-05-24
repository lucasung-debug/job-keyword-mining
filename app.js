/* 직무 키워드 분석 — 텍스트 마이닝 재현 데모 (더미 데이터)
   위험 DOM 패턴 없이 createElement 기반으로 구성. */
"use strict";

function el(tag, attrs, kids) {
  var n = document.createElement(tag);
  if (attrs) {
    for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
  }
  if (kids) kids.forEach(function (c) {
    n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return n;
}
function $(id) { return document.getElementById(id); }
function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
function countOccur(text, word) { return text.split(word).length - 1; }

/* ---------- dummy presets ---------- */
var JOBS = [
  { id: "prod", name: "생산기술",
    text: "현장에서는 공정관리 능력이 가장 중요합니다. 설비 이상을 빠르게 잡아내는 문제해결 역량과, 생산 데이터를 다루는 데이터분석 및 품질관리 경험이 핵심입니다. 안전의식을 갖추고 꼼꼼하게 기록하는 성실한 자세가 필요합니다. 엑셀과 ERP로 생산 실적을 관리하며, 동료와의 협업과 커뮤니케이션도 중시됩니다. 개선을 주도적으로 제안하는 적극성과 주도성을 높이 평가합니다. 공정관리 데이터를 분석력 있게 해석하고 품질관리로 연결하는 책임감이 중요합니다." },
  { id: "sales", name: "영업관리",
    text: "고객을 설득하는 협상력과 커뮤니케이션 역량이 가장 중요합니다. 시장을 읽는 분석력과 목표를 설계하는 기획력이 요구됩니다. 영업 데이터를 엑셀로 관리하고 SQL로 조회하며, 데이터분석으로 전략을 세웁니다. 고객지향적인 태도와 책임감, 적극성을 갖춘 분을 선호합니다. 협업으로 팀 목표를 달성하려는 주도성과 학습의지, 그리고 의사결정 능력도 중요합니다. 꾸준한 영업 활동에는 성실함이 뒷받침되어야 합니다." },
  { id: "hr", name: "인사·HR",
    text: "채용과 노무 실무 지식이 기반이 됩니다. 제도를 설계하는 기획력과, 데이터분석을 통한 의사결정 역량이 중요합니다. 구성원과의 커뮤니케이션과 협업이 핵심이며, 리더십도 요구됩니다. 엑셀과 ERP를 활용한 인사 데이터 관리, 반복 업무를 줄이는 자동화 경험이 도움이 됩니다. 꼼꼼함과 책임감, 학습의지를 갖춘 성실한 태도를 높이 평가합니다. 채용 데이터를 분석력 있게 다루는 역량도 중시됩니다." }
];

/* ---------- keyword dictionary ---------- */
var DICT = {
  comp: { name: "역량 (Competency)", cls: "", dot: "var(--brand)",
    items: [{ w: "문제해결" }, { w: "분석력" }, { w: "기획력" }, { w: "의사결정" }, { w: "리더십" }, { w: "협업" }, { w: "커뮤니케이션" }, { w: "협상력" }] },
  skill: { name: "스킬 (Skill)", cls: "c-skill", dot: "var(--violet)",
    items: [{ w: "공정관리" }, { w: "품질관리" }, { w: "데이터분석" }, { w: "엑셀" }, { w: "SQL" }, { w: "ERP" }, { w: "자동화" }, { w: "영업" }, { w: "채용" }, { w: "노무" }] },
  att: { name: "태도 (Attitude)", cls: "c-att", dot: "var(--amber)",
    items: [{ w: "안전의식" }, { w: "꼼꼼", label: "꼼꼼함" }, { w: "성실", label: "성실성" }, { w: "적극성" }, { w: "주도성" }, { w: "학습의지" }, { w: "고객지향" }, { w: "책임감" }] } };

var CATS = ["comp", "skill", "att"];
var currentJobName = "";

/* ---------- KPI ---------- */
function renderKPIs() {
  var row = $("kpiRow");
  clear(row);
  var data = [
    { num: "3", unit: "축", lab: "역량·스킬·태도 프레임워크", indigo: true },
    { num: "0", unit: "%", lab: "프롬프트 편차 (Agent 일관성)", indigo: true },
    { num: "—", unit: "", lab: "추출 키워드", id: "kpiKw" },
    { num: "600", unit: "건+", lab: "누적 EVP 분석 (원 사례)" }
  ];
  data.forEach(function (d) {
    var num = el("div", { class: "num" }, [d.num, d.unit ? el("small", { text: d.unit }) : document.createTextNode("")]);
    if (d.id) num.setAttribute("data-k", d.id);
    row.appendChild(el("div", { class: "kpi" + (d.indigo ? " indigo" : "") }, [num, el("div", { class: "lab", text: d.lab })]));
  });
}
function setKpiKw(n) {
  var node = document.querySelector('[data-k="kpiKw"]');
  if (node) { clear(node); node.appendChild(document.createTextNode(String(n))); node.appendChild(el("small", { text: "개" })); }
}

/* ---------- presets ---------- */
function renderPresets() {
  var box = $("jobPresets");
  clear(box);
  JOBS.forEach(function (j) {
    var b = el("button", { class: "job-chip", type: "button", "data-id": j.id, text: j.name });
    b.addEventListener("click", function () {
      document.querySelectorAll(".job-chip").forEach(function (c) { c.className = "job-chip"; });
      b.className = "job-chip active";
      $("inText").value = j.text;
      currentJobName = j.name;
    });
    box.appendChild(b);
  });
}

/* ---------- analysis ---------- */
function analyze(text) {
  var byCat = {};
  var total = [];
  CATS.forEach(function (cat) {
    var arr = DICT[cat].items.map(function (it) {
      return { w: it.w, label: it.label || it.w, count: countOccur(text, it.w), cat: cat };
    }).filter(function (x) { return x.count > 0; }).sort(function (a, b) { return b.count - a.count; });
    byCat[cat] = arr;
    arr.forEach(function (x) { total.push(x); });
  });
  var bars = total.slice().sort(function (a, b) { return b.count - a.count; }).slice(0, 8);
  return { byCat: byCat, total: total, bars: bars };
}

function renderClusters(byCat) {
  var box = $("clusters");
  clear(box);
  CATS.forEach(function (cat) {
    var arr = byCat[cat];
    if (!arr.length) return;
    var sum = arr.reduce(function (s, x) { return s + x.count; }, 0);
    var head = el("div", { class: "cluster-h" }, [
      el("span", { class: "dot" }), document.createTextNode(DICT[cat].name),
      el("span", { class: "cnt", text: arr.length + "종 · " + sum + "회" })
    ]);
    head.querySelector(".dot").style.background = DICT[cat].dot;
    var chips = el("div", { class: "kw-chips" });
    arr.forEach(function (x) {
      chips.appendChild(el("span", { class: "kw " + DICT[cat].cls }, [x.label + " ", el("b", { text: String(x.count) })]));
    });
    box.appendChild(el("div", { class: "cluster" }, [head, chips]));
  });
}

function renderBars(bars) {
  var box = $("bars");
  clear(box);
  if (!bars.length) return;
  var max = bars[0].count;
  var fills = [];
  bars.forEach(function (x) {
    var fill = el("div", { class: "bar-fill" });
    fills.push([fill, Math.round(x.count / max * 100)]);
    box.appendChild(el("div", { class: "bar-row" }, [
      el("div", { class: "bl", text: x.label }),
      el("div", { class: "bar-track" }, [fill]),
      el("div", { class: "bv", text: String(x.count) })
    ]));
  });
  requestAnimationFrame(function () {
    fills.forEach(function (f) { f[0].style.width = f[1] + "%"; });
  });
}

function renderJD(byCat) {
  var box = $("jdBox");
  clear(box);
  var comp = byCat.comp, skill = byCat.skill, att = byCat.att;
  var parts = [];
  parts.push(document.createTextNode("이런 분을 찾습니다 — "));
  if (comp[0]) parts.push(el("span", { class: "em", text: comp[0].label }));
  if (comp[1]) { parts.push(document.createTextNode("·")); parts.push(el("span", { class: "em", text: comp[1].label })); }
  parts.push(document.createTextNode(" 역량을 갖추고, "));
  if (skill[0]) parts.push(el("span", { class: "em", text: skill[0].label }));
  if (skill[1]) { parts.push(document.createTextNode("·")); parts.push(el("span", { class: "em", text: skill[1].label })); }
  parts.push(document.createTextNode(" 실무 경험과 "));
  if (att[0]) parts.push(el("span", { class: "em", text: att[0].label }));
  parts.push(document.createTextNode(" 태도로 함께 성장할 동료를 모십니다."));
  box.appendChild(el("p", {}, parts));
}

function setLoading(on) {
  var panel = $("resultBody").parentNode;
  var ex = $("loadingBox");
  if (on) {
    $("resultEmpty").hidden = true;
    $("resultBody").hidden = true;
    if (!ex) {
      var box = el("div", { class: "loading", id: "loadingBox" }, [el("span", { class: "spinner" }), "직무 분석가 Agent가 텍스트를 마이닝하는 중…"]);
      panel.appendChild(box);
    }
  } else if (ex) {
    ex.parentNode.removeChild(ex);
  }
}

function toast(msg, em) {
  var t = $("toast");
  clear(t);
  t.appendChild(document.createTextNode(msg + " "));
  if (em) t.appendChild(el("span", { class: "em", text: em }));
  t.hidden = false;
  requestAnimationFrame(function () { t.className = "toast show"; });
  setTimeout(function () { t.className = "toast"; }, 3000);
}

function run() {
  var text = $("inText").value.trim();
  if (!text) { toast("분석할 인터뷰 텍스트를 입력하세요", ""); return; }
  var btn = $("btnRun");
  btn.disabled = true;
  setLoading(true);
  setTimeout(function () {
    var a = analyze(text);
    setLoading(false);
    $("resultEmpty").hidden = true;
    $("resultBody").hidden = false;
    var pill = $("jobPill");
    clear(pill);
    pill.appendChild(document.createTextNode(currentJobName || "사용자 입력"));
    renderClusters(a.byCat);
    renderBars(a.bars);
    renderJD(a.byCat);
    $("applyPanel").hidden = false;
    $("classResult").textContent = currentJobName ? currentJobName + " 직무" : "사용자 입력 텍스트";
    $("evpCount").textContent = a.total.length + "개";
    setKpiKw(a.total.length);
    btn.disabled = false;
    toast("텍스트 마이닝 완료 · 키워드 " + a.total.length + "종 추출", "정량화");
    $("resultBody").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 850);
}

function init() {
  renderKPIs();
  renderPresets();
  $("btnRun").addEventListener("click", run);
}
document.addEventListener("DOMContentLoaded", init);
