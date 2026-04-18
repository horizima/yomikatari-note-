"use client";
import { useState, useRef } from "react";

const CLASSES = [
  "1年1組","1年2組",
  "2年1組","2年2組",
  "3年1組","3年2組",
  "4年1組","4年2組",
  "5年1組","5年2組",
  "6年1組","6年2組",
  "7年1組","7年2組",
  "8年1組","8年2組",
  "9年1組","9年2組",
];

const SAMPLE_DATA = [
  { id: 1, date: "2026-04-15", reader: "田中花子", title: "はらぺこあおむし", author: "エリック・カール", classGroup: "1年1組" },
  { id: 2, date: "2026-04-15", reader: "佐藤美咲", title: "ぐりとぐら", author: "中川李枝子", classGroup: "2年1組" },
  { id: 3, date: "2026-04-10", reader: "鈴木太郎", title: "スイミー", author: "レオ・レオニ", classGroup: "3年2組" },
  { id: 4, date: "2026-04-10", reader: "山田優子", title: "おおきなかぶ", author: "A・トルストイ", classGroup: "1年2組" },
  { id: 5, date: "2026-03-18", reader: "田中花子", title: "からすのパンやさん", author: "かこさとし", classGroup: "4年1組" },
];

const formatDate = (d) => {
  const dt = new Date(d);
  return `${dt.getMonth()+1}/${dt.getDate()}`;
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [userName, setUserName] = useState("");
  const [tempName, setTempName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminFilter, setAdminFilter] = useState({ classGroup: "", dateFrom: "", dateTo: "" });
  const [records, setRecords] = useState(SAMPLE_DATA);
  const fileRef = useRef(null);

  const handleCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = () => {
    const newRecord = {
      id: records.length + 1,
      date: new Date().toISOString().split("T")[0],
      reader: userName,
      title: editTitle,
      author: editAuthor,
      classGroup: selectedClass,
    };
    setRecords([newRecord, ...records]);
    setScreen("done");
  };

  const filteredRecords = records.filter(r => {
    if (adminFilter.classGroup && r.classGroup !== adminFilter.classGroup) return false;
    if (adminFilter.dateFrom && r.date < adminFilter.dateFrom) return false;
    if (adminFilter.dateTo && r.date > adminFilter.dateTo) return false;
    return true;
  });

  const resetForNextBook = () => {
    setCapturedImage(null);
    setEditTitle("");
    setEditAuthor("");
    // selectedClass is kept!
    setScreen("home");
  };

  const resetUpload = () => {
    setCapturedImage(null);
    setEditTitle("");
    setEditAuthor("");
    setSelectedClass("");
    setScreen("home");
  };

  const downloadCSV = () => {
    const header = "日付,学年・組,著者名,タイトル,読んだ人";
    const sorted = [...filteredRecords].sort((a, b) => a.date.localeCompare(b.date));
    const rows = sorted.map(r =>
      `${r.date},${r.classGroup},${r.author},${r.title},${r.reader}`
    );
    const bom = "\uFEFF";
    const csv = bom + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `読み語りリスト_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Shared styles ──
  const theme = {
    bg: "#FAFAF7",
    card: "#FFFFFF",
    accent: "#2B6B5E",
    accentLight: "#E8F3F0",
    accentDark: "#1E4D44",
    text: "#2C2C2A",
    textSec: "#73726C",
    textTer: "#9C9A92",
    border: "#E8E6DF",
    coral: "#E8593C",
    coralLight: "#FFF0EC",
    amber: "#B87A14",
    amberLight: "#FDF5E6",
    radius: "14px",
    radiusSm: "10px",
  };

  const pageStyle = {
    minHeight: "100vh",
    background: theme.bg,
    fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
    color: theme.text,
    maxWidth: "420px",
    margin: "0 auto",
    padding: "0",
    position: "relative",
  };

  const headerStyle = {
    background: theme.accent,
    color: "#fff",
    padding: "20px 24px 18px",
    position: "relative",
  };

  const btnPrimary = {
    background: theme.accent,
    color: "#fff",
    border: "none",
    borderRadius: theme.radiusSm,
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    letterSpacing: "0.02em",
    transition: "opacity 0.2s",
  };

  const btnOutline = {
    ...btnPrimary,
    background: "transparent",
    color: theme.accent,
    border: `1.5px solid ${theme.accent}`,
  };

  const cardStyle = {
    background: theme.card,
    borderRadius: theme.radius,
    border: `1px solid ${theme.border}`,
    padding: "20px",
    marginBottom: "14px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: theme.radiusSm,
    border: `1.5px solid ${theme.border}`,
    fontSize: "15px",
    fontFamily: "inherit",
    color: theme.text,
    background: theme.card,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: theme.textSec,
    marginBottom: "6px",
    display: "block",
    letterSpacing: "0.04em",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2373726C' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "36px",
  };

  // ── HOME ──
  if (screen === "home") {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px", letterSpacing: "0.06em" }}>読み語りサークル</div>
          <div style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-0.01em" }}>よみかたりノート</div>
        </div>
        <div style={{ padding: "20px 20px 32px" }}>
          {!userName ? (
            <div style={cardStyle}>
              <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "14px" }}>はじめに名前を登録</div>
              <div style={{ marginBottom: "4px", ...labelStyle }}>お名前</div>
              <input
                style={inputStyle}
                placeholder="例: 田中花子"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
              />
              <div style={{ fontSize: "12px", color: theme.textTer, margin: "8px 0 16px" }}>
                次回以降は自動で入力されます
              </div>
              <button
                style={{ ...btnPrimary, opacity: tempName.trim() ? 1 : 0.4 }}
                disabled={!tempName.trim()}
                onClick={() => setUserName(tempName.trim())}
              >
                登録する
              </button>
            </div>
          ) : (
            <>
              <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: theme.accentLight, color: theme.accent,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", fontWeight: "700", flexShrink: 0,
                }}>
                  {userName[0]}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600" }}>{userName}</div>
                  <div style={{ fontSize: "12px", color: theme.textTer }}>ログイン中</div>
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "16px" }}>読んだ本を登録</div>
                <div style={{ marginBottom: "4px", ...labelStyle }}>学年・組</div>
                <select
                  style={selectStyle}
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                >
                  <option value="">選択してください</option>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <div style={{ marginTop: "18px", marginBottom: "4px", ...labelStyle }}>本の表紙を撮影</div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={handleCapture}
                />
                {capturedImage ? (
                  <div style={{ position: "relative", marginBottom: "4px" }}>
                    <div style={{
                      borderRadius: theme.radiusSm, overflow: "hidden",
                      border: `1.5px solid ${theme.accent}44`,
                      maxHeight: "160px", display: "flex", justifyContent: "center", background: "#f5f5f2",
                    }}>
                      <img src={capturedImage} alt="撮影した表紙" style={{ maxHeight: "160px", objectFit: "contain" }} />
                    </div>
                    <button
                      style={{
                        position: "absolute", top: "8px", right: "8px",
                        background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
                        borderRadius: "50%", width: "28px", height: "28px",
                        cursor: "pointer", fontSize: "14px", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}
                      onClick={() => { setCapturedImage(null); if(fileRef.current) fileRef.current.value = ""; }}
                    >
                      ✕
                    </button>
                    <div style={{ fontSize: "12px", color: theme.accent, marginTop: "6px", textAlign: "center" }}>
                      撮り直す場合は ✕ を押してください
                    </div>
                  </div>
                ) : (
                  <button
                    style={{
                      ...btnOutline,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    表紙を撮影・選択
                  </button>
                )}

                <div style={{ marginTop: "18px", marginBottom: "4px", ...labelStyle }}>タイトル</div>
                <input
                  style={inputStyle}
                  placeholder="例: はらぺこあおむし"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onFocus={e => e.target.style.borderColor = theme.accent}
                  onBlur={e => e.target.style.borderColor = theme.border}
                />

                <div style={{ marginTop: "14px", marginBottom: "4px", ...labelStyle }}>著者名</div>
                <input
                  style={inputStyle}
                  placeholder="例: エリック・カール"
                  value={editAuthor}
                  onChange={e => setEditAuthor(e.target.value)}
                  onFocus={e => e.target.style.borderColor = theme.accent}
                  onBlur={e => e.target.style.borderColor = theme.border}
                />

                <button
                  style={{
                    ...btnPrimary, marginTop: "20px",
                    opacity: selectedClass && capturedImage && editTitle.trim() && editAuthor.trim() ? 1 : 0.4,
                  }}
                  disabled={!selectedClass || !capturedImage || !editTitle.trim() || !editAuthor.trim()}
                  onClick={() => setScreen("confirm")}
                >
                  確認画面へ
                </button>
                {(!selectedClass || !capturedImage || !editTitle.trim() || !editAuthor.trim()) && (
                  <div style={{ fontSize: "12px", color: theme.textTer, marginTop: "8px", textAlign: "center" }}>
                    すべての項目を入力してください
                  </div>
                )}
              </div>

              <button
                style={{ ...btnOutline, marginTop: "8px" }}
                onClick={() => { setAdminLoggedIn(false); setAdminPass(""); setScreen("admin-login"); }}
              >
                係の管理画面へ
              </button>
            </>
          )}
        </div>

      </div>
    );
  }

  // ── CONFIRM ──
  if (screen === "confirm") {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px", letterSpacing: "0.06em" }}>読み語りサークル</div>
          <div style={{ fontSize: "20px", fontWeight: "700" }}>内容を確認</div>
        </div>
        <div style={{ padding: "20px" }}>
          {capturedImage && (
            <div style={{
              borderRadius: theme.radius, overflow: "hidden",
              marginBottom: "16px", border: `1px solid ${theme.border}`,
              maxHeight: "200px", display: "flex", justifyContent: "center", background: "#f5f5f2",
            }}>
              <img src={capturedImage} alt="撮影した表紙" style={{ maxHeight: "200px", objectFit: "contain" }} />
            </div>
          )}

          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "10px" }}>
              <span style={{ color: theme.textSec }}>タイトル</span>
              <span style={{ fontWeight: "600" }}>{editTitle}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "10px" }}>
              <span style={{ color: theme.textSec }}>著者名</span>
              <span style={{ fontWeight: "600" }}>{editAuthor}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "10px" }}>
              <span style={{ color: theme.textSec }}>読んだ人</span>
              <span style={{ fontWeight: "600" }}>{userName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "10px" }}>
              <span style={{ color: theme.textSec }}>学年・組</span>
              <span style={{ fontWeight: "600" }}>{selectedClass}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: theme.textSec }}>日付</span>
              <span style={{ fontWeight: "600" }}>{new Date().toLocaleDateString("ja-JP")}</span>
            </div>
          </div>

          <button
            style={{ ...btnPrimary, marginBottom: "10px", opacity: editTitle.trim() && editAuthor.trim() ? 1 : 0.4 }}
            disabled={!editTitle.trim() || !editAuthor.trim()}
            onClick={handleRegister}
          >
            この内容で登録する
          </button>
          <button style={btnOutline} onClick={resetUpload}>やり直す</button>
        </div>
      </div>
    );
  }

  // ── DONE ──
  if (screen === "done") {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px", letterSpacing: "0.06em" }}>読み語りサークル</div>
          <div style={{ fontSize: "20px", fontWeight: "700" }}>登録完了</div>
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: theme.accentLight, margin: "32px auto 20px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>登録できました</div>
          <div style={{ fontSize: "14px", color: theme.textSec, marginBottom: "32px", lineHeight: "1.6" }}>
            「{editTitle}」を<br />{selectedClass}のリストに追加しました
          </div>
          <button style={btnPrimary} onClick={resetForNextBook}>もう1冊登録する</button>
          <button style={{ ...btnOutline, marginTop: "10px" }} onClick={resetUpload}>ホームに戻る</button>
        </div>
      </div>
    );
  }

  // ── ADMIN LOGIN ──
  if (screen === "admin-login") {
    return (
      <div style={pageStyle}>
        <div style={{ ...headerStyle, background: theme.text }}>
          <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px", letterSpacing: "0.06em" }}>読み語りサークル</div>
          <div style={{ fontSize: "20px", fontWeight: "700" }}>管理者ログイン</div>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={cardStyle}>
            <div style={{ fontSize: "14px", color: theme.textSec, marginBottom: "16px", lineHeight: "1.6" }}>
              サークルの係の方専用です。<br />合言葉を入力してください。
            </div>
            <div style={{ marginBottom: "4px", ...labelStyle }}>合言葉</div>
            <input
              style={inputStyle}
              type="password"
              placeholder="合言葉を入力"
              value={adminPass}
              onChange={e => setAdminPass(e.target.value)}
              onFocus={e => e.target.style.borderColor = theme.text}
              onBlur={e => e.target.style.borderColor = theme.border}
            />
            <div style={{ fontSize: "12px", color: theme.textTer, margin: "8px 0 16px" }}>
              デモ用: 何でも入力してOKを押してください
            </div>
            <button
              style={{ ...btnPrimary, background: theme.text, opacity: adminPass ? 1 : 0.4 }}
              disabled={!adminPass}
              onClick={() => { setAdminLoggedIn(true); setScreen("admin"); }}
            >
              ログイン
            </button>
          </div>
          <button style={btnOutline} onClick={resetUpload}>戻る</button>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  if (screen === "admin") {
    return (
      <div style={pageStyle}>
        <div style={{ ...headerStyle, background: theme.text }}>
          <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px", letterSpacing: "0.06em" }}>読み語りサークル</div>
          <div style={{ fontSize: "20px", fontWeight: "700" }}>管理画面</div>
        </div>
        <div style={{ padding: "20px" }}>
          {/* stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {[
              { label: "合計", val: records.length, bg: theme.accentLight, col: theme.accentDark },
              { label: "今月", val: records.filter(r => r.date >= "2026-04-01").length, bg: theme.amberLight, col: theme.amber },
              { label: "読み手", val: [...new Set(records.map(r => r.reader))].length, bg: theme.coralLight, col: theme.coral },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg, borderRadius: theme.radiusSm,
                padding: "14px 12px", textAlign: "center",
              }}>
                <div style={{ fontSize: "22px", fontWeight: "700", color: s.col }}>{s.val}</div>
                <div style={{ fontSize: "11px", color: s.col, opacity: 0.7, marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* filters */}
          <div style={{ ...cardStyle, padding: "14px 16px" }}>
            <div style={{ marginBottom: "10px" }}>
              <div style={labelStyle}>学年・組</div>
              <select
                style={{ ...selectStyle, padding: "8px 30px 8px 10px", fontSize: "13px" }}
                value={adminFilter.classGroup}
                onChange={e => setAdminFilter(p => ({ ...p, classGroup: e.target.value }))}
              >
                <option value="">すべて</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>開始日</div>
                <input
                  type="date"
                  style={{ ...inputStyle, padding: "8px 10px", fontSize: "13px" }}
                  value={adminFilter.dateFrom}
                  onChange={e => setAdminFilter(p => ({ ...p, dateFrom: e.target.value }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={labelStyle}>終了日</div>
                <input
                  type="date"
                  style={{ ...inputStyle, padding: "8px 10px", fontSize: "13px" }}
                  value={adminFilter.dateTo}
                  onChange={e => setAdminFilter(p => ({ ...p, dateTo: e.target.value }))}
                />
              </div>
            </div>
            {(adminFilter.classGroup || adminFilter.dateFrom || adminFilter.dateTo) && (
              <button
                style={{
                  marginTop: "10px", background: "none", border: "none",
                  color: theme.coral, fontSize: "13px", cursor: "pointer",
                  padding: "4px 0", fontFamily: "inherit",
                }}
                onClick={() => setAdminFilter({ classGroup: "", dateFrom: "", dateTo: "" })}
              >
                フィルタをリセット
              </button>
            )}
          </div>

          {/* records */}
          <div style={{ fontSize: "13px", color: theme.textSec, marginBottom: "10px" }}>
            {filteredRecords.length}件の記録
          </div>
          {filteredRecords.map(r => (
            <div key={r.id} style={{
              ...cardStyle, padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start",
            }}>
              <div style={{
                background: theme.accentLight, borderRadius: "8px",
                width: "44px", height: "44px", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>{r.title}</div>
                <div style={{ fontSize: "12px", color: theme.textSec }}>{r.author}</div>
                <div style={{ display: "flex", gap: "12px", marginTop: "6px", fontSize: "11px", color: theme.textTer }}>
                  <span>{r.classGroup}</span>
                  <span>{r.reader}</span>
                  <span>{formatDate(r.date)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* download */}
          <button
            style={{ ...btnPrimary, background: theme.text, marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            onClick={downloadCSV}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            リストをCSVダウンロード
          </button>
          <button style={{ ...btnOutline, marginTop: "10px" }} onClick={resetUpload}>ホームに戻る</button>
        </div>
      </div>
    );
  }

  return null;
}
