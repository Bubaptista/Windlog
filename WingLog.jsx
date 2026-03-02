import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;900&family=DM+Mono:wght@400;500&display=swap');
`;

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0e14;
    --bg2: #111720;
    --bg3: #1a2233;
    --teal: #00d4aa;
    --teal2: #00ffcc;
    --teal-dim: rgba(0,212,170,0.12);
    --teal-glow: rgba(0,212,170,0.3);
    --orange: #ff6b35;
    --text: #e8f0fe;
    --muted: #5a6a80;
    --border: rgba(255,255,255,0.07);
    --card: rgba(255,255,255,0.04);
    --font: 'Exo 2', sans-serif;
    --mono: 'DM Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font); }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }

  /* Top bar */
  .topbar {
    padding: 14px 20px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .topbar-logo {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: var(--teal);
    text-transform: uppercase;
  }
  .topbar-logo span { color: var(--text); }
  .topbar-sub {
    font-size: 11px;
    color: var(--muted);
    font-family: var(--mono);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* Bottom nav */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: rgba(10,14,20,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display: flex;
    z-index: 100;
  }
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 4px 14px;
    cursor: pointer;
    gap: 4px;
    transition: all 0.2s;
    background: none;
    border: none;
    color: var(--muted);
    font-family: var(--font);
  }
  .nav-item.active { color: var(--teal); }
  .nav-item svg { width: 22px; height: 22px; }
  .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  .nav-item.active .nav-label { color: var(--teal); }

  /* Content scroll area */
  .content {
    padding: 0 16px 100px;
    overflow-y: auto;
    height: calc(100vh - 57px);
  }

  /* Cards */
  .card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .card-teal {
    background: linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,212,170,0.05));
    border-color: rgba(0,212,170,0.2);
  }

  /* Section headers */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 12px;
  }
  .section-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    font-family: var(--mono);
  }

  /* Form fields */
  .field-group { margin-bottom: 16px; }
  .field-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    font-family: var(--mono);
    margin-bottom: 8px;
    display: block;
  }
  .field-input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 14px;
    color: var(--text);
    font-family: var(--font);
    font-size: 15px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }
  .field-input:focus { border-color: var(--teal); }
  .field-input option { background: #1a2233; }

  /* Stepper */
  .stepper {
    display: flex;
    align-items: center;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .stepper-btn {
    width: 52px;
    height: 48px;
    background: none;
    border: none;
    color: var(--teal);
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 300;
    transition: background 0.15s;
  }
  .stepper-btn:active { background: var(--teal-dim); }
  .stepper-val {
    flex: 1;
    text-align: center;
    font-family: var(--mono);
    font-size: 18px;
    font-weight: 500;
    color: var(--text);
  }
  .stepper-unit { font-size: 11px; color: var(--muted); display: block; }

  /* Star rating */
  .star-row { display: flex; gap: 8px; }
  .star {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 28px;
    transition: transform 0.15s;
    background: none;
    border: none;
  }
  .star:active { transform: scale(1.3); }

  /* Primary button */
  .btn-primary {
    width: 100%;
    background: var(--teal);
    color: #0a0e14;
    border: none;
    border-radius: 14px;
    padding: 16px;
    font-family: var(--font);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(0,212,170,0.3);
  }
  .btn-primary:active { transform: scale(0.98); box-shadow: none; }

  .btn-ghost {
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 10px;
    padding: 8px 14px;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-ghost:active { border-color: var(--teal); color: var(--teal); }

  .btn-teal-ghost {
    background: var(--teal-dim);
    border: 1px solid rgba(0,212,170,0.2);
    color: var(--teal);
    border-radius: 10px;
    padding: 8px 14px;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  /* Session history items */
  .session-item {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: border-color 0.15s;
    position: relative;
    overflow: hidden;
  }
  .session-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--teal);
  }
  .session-item:active { border-color: var(--teal); }
  .session-date-block {
    background: var(--bg3);
    border-radius: 10px;
    padding: 8px 10px;
    text-align: center;
    min-width: 48px;
  }
  .session-day { font-size: 20px; font-weight: 900; font-family: var(--mono); color: var(--text); line-height: 1; }
  .session-mon { font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; font-family: var(--mono); }
  .session-meta { flex: 1; }
  .session-loc { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .session-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 2px 7px;
    font-size: 11px;
    font-family: var(--mono);
    color: var(--muted);
  }
  .tag-wind { border-color: rgba(0,212,170,0.25); color: var(--teal); background: var(--teal-dim); }
  .session-rating { font-size: 12px; }

  /* Stat cards */
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .stat-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 16px;
  }
  .stat-val {
    font-size: 28px;
    font-weight: 900;
    font-family: var(--mono);
    color: var(--teal);
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label { font-size: 11px; color: var(--muted); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

  /* Mini bar chart */
  .bar-chart { display: flex; align-items: flex-end; gap: 5px; height: 60px; padding: 0 2px; }
  .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
  .bar {
    width: 100%;
    background: linear-gradient(to top, var(--teal), rgba(0,212,170,0.4));
    border-radius: 4px 4px 2px 2px;
    transition: height 0.5s ease;
    min-height: 3px;
  }
  .bar-mo { font-size: 9px; color: var(--muted); font-family: var(--mono); }

  /* Wind compass */
  .wind-vis {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px;
  }
  .wind-ring {
    width: 80px; height: 80px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: radial-gradient(circle at center, var(--teal-dim), transparent);
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .wind-num { font-size: 20px; font-weight: 900; font-family: var(--mono); color: var(--teal); }
  .wind-kn { font-size: 10px; color: var(--muted); font-family: var(--mono); }

  /* Gear inventory */
  .gear-category { margin-bottom: 20px; }
  .gear-cat-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--teal);
    font-family: var(--mono);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .gear-cat-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0,212,170,0.2);
  }
  .gear-item {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .gear-icon { font-size: 20px; width: 36px; text-align: center; }
  .gear-name { font-size: 14px; font-weight: 700; }
  .gear-size { font-size: 12px; color: var(--muted); font-family: var(--mono); }
  .gear-actions { margin-left: auto; display: flex; gap: 6px; }

  /* Success toast */
  .toast {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: var(--teal);
    color: #0a0e14;
    padding: 10px 20px;
    border-radius: 30px;
    font-weight: 800;
    font-size: 13px;
    letter-spacing: 0.5px;
    z-index: 200;
    opacity: 0;
    transition: all 0.3s;
    white-space: nowrap;
    pointer-events: none;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* Add gear modal overlay */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 150;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .modal-sheet {
    background: var(--bg2);
    border-radius: 24px 24px 0 0;
    padding: 20px;
    width: 100%;
    max-width: 430px;
    border-top: 1px solid var(--border);
  }
  .modal-handle {
    width: 40px; height: 4px;
    background: var(--muted);
    border-radius: 2px;
    margin: 0 auto 16px;
    opacity: 0.4;
  }
  .modal-title { font-size: 18px; font-weight: 800; margin-bottom: 16px; }

  /* Textarea */
  textarea.field-input { resize: none; height: 80px; }

  /* Horizontal rule */
  .hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

  /* Empty state */
  .empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
  }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; line-height: 1.6; }

  /* Trend chip */
  .trend-up { color: var(--teal); font-size: 12px; font-family: var(--mono); }
  .trend-down { color: var(--orange); font-size: 12px; font-family: var(--mono); }

  /* Date chip row */
  .date-filter-row { display: flex; gap: 8px; padding: 12px 0; overflow-x: auto; scrollbar-width: none; }
  .date-filter-row::-webkit-scrollbar { display: none; }
  .filter-chip {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    font-family: var(--font);
  }
  .filter-chip.active { background: var(--teal-dim); border-color: var(--teal); color: var(--teal); }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .screen { animation: fadeIn 0.25s ease; }
`;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconLog = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>
);
const IconHistory = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconStats = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconGear = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
  </svg>
);

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INIT_GEAR = {
  wings: [
    { id: 1, name: "Duotone Unit D/LAB", size: "5.0m" },
    { id: 2, name: "Ozone Breathe", size: "4.0m" },
  ],
  boards: [
    { id: 1, name: "Axis Bigfoot 2", size: "105L" },
    { id: 2, name: "Fanatic Sky Air", size: "85L" },
  ],
  masts: [
    { id: 1, name: "Axis SPITFIRE 1150", size: "75cm" },
    { id: 2, name: "Slingshot Hover Glide", size: "84cm" },
  ],
};

const INIT_SESSIONS = [
  { id: 1, date: "2026-02-28", location: "Barceloneta", wind: 18, duration: 90, rating: 5, wing: "Duotone Unit D/LAB 5.0m", board: "Axis Bigfoot 2 105L", mast: "Axis SPITFIRE 1150 75cm", notes: "Perfect side-on. Got 4 consecutive tacks." },
  { id: 2, date: "2026-02-25", location: "Barceloneta", wind: 22, duration: 75, rating: 4, wing: "Ozone Breathe 4.0m", board: "Fanatic Sky Air 85L", mast: "Axis SPITFIRE 1150 75cm", notes: "Choppy but powered all the way." },
  { id: 3, date: "2026-02-20", location: "El Prat", wind: 15, duration: 60, rating: 3, wing: "Duotone Unit D/LAB 5.0m", board: "Axis Bigfoot 2 105L", mast: "Slingshot Hover Glide 84cm", notes: "" },
  { id: 4, date: "2026-02-14", location: "Sitges", wind: 25, duration: 120, rating: 5, wing: "Ozone Breathe 4.0m", board: "Fanatic Sky Air 85L", mast: "Axis SPITFIRE 1150 75cm", notes: "Best session in months. Super powered on 4m." },
  { id: 5, date: "2026-02-08", location: "Barceloneta", wind: 20, duration: 80, rating: 4, wing: "Duotone Unit D/LAB 5.0m", board: "Axis Bigfoot 2 105L", mast: "Axis SPITFIRE 1150 75cm", notes: "" },
  { id: 6, date: "2026-01-30", location: "El Prat", wind: 17, duration: 50, rating: 3, wing: "Ozone Breathe 4.0m", board: "Axis Bigfoot 2 105L", mast: "Slingshot Hover Glide 84cm", notes: "" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

function fmtDate(d) {
  const [, m, day] = d.split("-");
  return { day, mon: MONTHS[parseInt(m) - 1] };
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
      } else if (data.user && !data.session) {
        setSuccessMessage("✦ Check your email to confirm your account!");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="screen" style={{ padding: "40px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div className="topbar-logo" style={{ fontSize: 32 }}>Wing<span>Log</span></div>
        <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 10 }}>Your personal wing foil journal</div>
      </div>

      {successMessage ? (
        <div className="card card-teal" style={{ textAlign: "center", padding: "30px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--teal)", marginBottom: 8 }}>Verify your Email</div>
          <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{successMessage}</div>
          <button
            className="btn-ghost"
            style={{ marginTop: 24, width: "100%" }}
            onClick={() => { setSuccessMessage(""); setIsSignUp(false); }}
          >
            Return to Sign In
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleAuth}>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                placeholder="pilot@winglog.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 10 }}>
              {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              className="btn-ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ background: "none", border: "none", color: "var(--teal)" }}
            >
              {isSignUp ? "Already have an account? Sign In" : "New here? Create an account"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function LogScreen({ gear, onSave }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    date: today, location: "", wind: 18, duration: 60, rating: 0,
    wing: "", board: "", mast: "", notes: ""
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="screen">
      <div className="section-header">
        <span className="section-title">New Session</span>
        <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>MVP · V1</span>
      </div>

      <div className="card card-teal" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 28 }}>🏄</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--teal)" }}>Ready to log?</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Fill in your session details below</div>
          </div>
        </div>
      </div>

      <div className="section-title" style={{ marginBottom: 12 }}>Session Details</div>

      <div className="field-group">
        <label className="field-label">Date</label>
        <input className="field-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
      </div>

      <div className="field-group">
        <label className="field-label">Location</label>
        <input className="field-input" type="text" placeholder="e.g. Barceloneta" value={form.location} onChange={e => set("location", e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="field-group">
          <label className="field-label">Wind Speed</label>
          <div className="stepper">
            <button className="stepper-btn" onClick={() => set("wind", Math.max(5, form.wind - 1))}>−</button>
            <div className="stepper-val">{form.wind}<span className="stepper-unit">kn</span></div>
            <button className="stepper-btn" onClick={() => set("wind", Math.min(60, form.wind + 1))}>+</button>
          </div>
        </div>
        <div className="field-group">
          <label className="field-label">Duration</label>
          <div className="stepper">
            <button className="stepper-btn" onClick={() => set("duration", Math.max(5, form.duration - 5))}>−</button>
            <div className="stepper-val">{form.duration}<span className="stepper-unit">min</span></div>
            <button className="stepper-btn" onClick={() => set("duration", form.duration + 5)}>+</button>
          </div>
        </div>
      </div>

      <hr className="hr" />
      <div className="section-title" style={{ marginBottom: 12 }}>Gear Used</div>

      <div className="field-group">
        <label className="field-label">Wing</label>
        <select className="field-input" value={form.wing} onChange={e => set("wing", e.target.value)}>
          <option value="">— Select wing —</option>
          {gear.wings.map(w => <option key={w.id}>{w.name} {w.size}</option>)}
        </select>
      </div>

      <div className="field-group">
        <label className="field-label">Board</label>
        <select className="field-input" value={form.board} onChange={e => set("board", e.target.value)}>
          <option value="">— Select board —</option>
          {gear.boards.map(b => <option key={b.id}>{b.name} {b.size}</option>)}
        </select>
      </div>

      <div className="field-group">
        <label className="field-label">Mast / Foil</label>
        <select className="field-input" value={form.mast} onChange={e => set("mast", e.target.value)}>
          <option value="">— Select mast —</option>
          {gear.masts.map(m => <option key={m.id}>{m.name} {m.size}</option>)}
        </select>
      </div>

      <hr className="hr" />
      <div className="section-title" style={{ marginBottom: 12 }}>Performance</div>

      <div className="field-group">
        <label className="field-label">Personal Rating</label>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} className="star" onClick={() => set("rating", n)}>
              <span style={{ color: n <= form.rating ? "#ffc107" : "var(--muted)" }}>{n <= form.rating ? "★" : "☆"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Notes <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span></label>
        <textarea className="field-input" placeholder="Conditions, tricks, what worked..." value={form.notes} onChange={e => set("notes", e.target.value)} maxLength={280} />
        <div style={{ textAlign: "right", fontSize: 10, color: "var(--muted)", marginTop: 4, fontFamily: "var(--mono)" }}>{form.notes.length}/280</div>
      </div>

      <button className="btn-primary" onClick={() => {
        if (!form.location) return alert("Please add a location");
        if (!form.rating) return alert("Please rate your session");
        onSave(form);
      }}>
        ✦ Log Session
      </button>
    </div>
  );
}

function HistoryScreen({ sessions }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "This Month", "Top Rated", "High Wind"];

  const filtered = sessions.filter(s => {
    if (filter === "This Month") {
      const now = new Date();
      return s.date.startsWith(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    }
    if (filter === "Top Rated") return s.rating >= 4;
    if (filter === "High Wind") return s.wind >= 20;
    return true;
  });

  return (
    <div className="screen">
      <div className="section-header">
        <span className="section-title">Session History</span>
        <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--teal)" }}>{sessions.length} total</span>
      </div>

      <div className="date-filter-row">
        {filters.map(f => (
          <button key={f} className={`filter-chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🌊</div>
          <div className="empty-text">No sessions match this filter yet.<br />Get out on the water!</div>
        </div>
      ) : filtered.map(s => {
        const { day, mon } = fmtDate(s.date);
        return (
          <div className="session-item" key={s.id}>
            <div className="session-date-block">
              <div className="session-day">{day}</div>
              <div className="session-mon">{mon}</div>
            </div>
            <div className="session-meta">
              <div className="session-loc">{s.location}</div>
              <div className="session-tags">
                <span className="tag tag-wind">🌬 {s.wind}kn</span>
                <span className="tag">⏱ {s.duration}m</span>
                {s.wing && <span className="tag">{s.wing.split(" ")[0]}</span>}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#ffc107", letterSpacing: -1 }}>{stars(s.rating)}</div>
              {s.notes && <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.notes}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatsScreen({ sessions }) {
  const total = sessions.length;
  const avgWind = total ? Math.round(sessions.reduce((a, s) => a + s.wind, 0) / total) : 0;
  const avgRating = total ? (sessions.reduce((a, s) => a + s.rating, 0) / total).toFixed(1) : 0;
  const thisMonth = sessions.filter(s => {
    const n = new Date(); return s.date.startsWith(`${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`);
  }).length;

  // Sessions by month (last 6)
  const monthlyCounts = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - 5 + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { mon: MONTHS[d.getMonth()], count: sessions.filter(s => s.date.startsWith(key)).length };
  });
  const maxCount = Math.max(...monthlyCounts.map(m => m.count), 1);

  const totalHrs = Math.floor(sessions.reduce((a, s) => a + s.duration, 0) / 60);
  const bestWind = total ? Math.max(...sessions.map(s => s.wind)) : 0;
  const longestMin = total ? Math.max(...sessions.map(s => s.duration)) : 0;

  return (
    <div className="screen">
      <div className="section-header">
        <span className="section-title">Dashboard</span>
        <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>All time</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">{total}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{thisMonth}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{avgWind}<span style={{ fontSize: 14 }}>kn</span></div>
          <div className="stat-label">Avg Wind</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: "#ffc107" }}>{avgRating}★</div>
          <div className="stat-label">Avg Rating</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 20, justifyContent: "space-around", padding: "4px 0 12px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "var(--mono)", color: "var(--teal)" }}>{totalHrs}h</div>
            <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Total Time</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "var(--mono)", color: "var(--teal)" }}>{bestWind}<span style={{ fontSize: 13 }}>kn</span></div>
            <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Best Wind</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "var(--mono)", color: "var(--teal)" }}>{longestMin}<span style={{ fontSize: 13 }}>m</span></div>
            <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Longest</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "var(--mono)", marginBottom: 12 }}>Sessions / Month</div>
        <div className="bar-chart">
          {monthlyCounts.map(m => (
            <div className="bar-wrap" key={m.mon}>
              <div className="bar" style={{ height: `${(m.count / maxCount) * 52}px` }} />
              <div className="bar-mo">{m.mon}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="section-title" style={{ marginBottom: 10 }}>Recent Activity</div>
        {sessions.slice(0, 3).map(s => {
          const { day, mon } = fmtDate(s.date);
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 20, width: 36, textAlign: "center" }}>
                {s.rating === 5 ? "🔥" : s.wind >= 22 ? "⚡" : "🌊"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s.location} · {s.wind}kn</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>{day} {mon} · {s.duration}min</div>
              </div>
              <div style={{ fontSize: 12, color: "#ffc107" }}>{stars(s.rating)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GearScreen({ gear, session, fetchData, setLoading }) {
  const [modal, setModal] = useState(null); // {type, editing}
  const [form, setForm] = useState({ name: "", size: "" });

  const openAdd = (type) => { setModal({ type, editing: null }); setForm({ name: "", size: "" }); };
  const openEdit = (type, item) => { setModal({ type, editing: item.id }); setForm({ name: item.name, size: item.size }); };

  const save = async () => {
    if (!form.name) return;
    setLoading(true);
    const itemData = {
      name: form.name,
      size: form.size,
      type: modal.type,
      user_id: session.user.id
    };

    if (modal.editing) {
      const { error } = await supabase
        .from("gear")
        .update(itemData)
        .eq("id", modal.editing);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from("gear")
        .insert([itemData]);
      if (error) alert(error.message);
    }

    await fetchData();
    setModal(null);
  };

  const remove = async (type, id) => {
    const { error } = await supabase
      .from("gear")
      .delete()
      .eq("id", id);
    if (error) alert(error.message);
    fetchData();
  };

  const cats = [
    { key: "wings", label: "Wings", icon: "🪁" },
    { key: "boards", label: "Boards", icon: "🏄" },
    { key: "masts", label: "Masts & Foils", icon: "⚡" },
  ];

  return (
    <div className="screen">
      <div className="section-header">
        <span className="section-title">Gear Inventory</span>
        <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--teal)" }}>
          {Object.values(gear).flat().length} items
        </span>
      </div>

      {cats.map(cat => (
        <div className="gear-category" key={cat.key}>
          <div className="gear-cat-title">{cat.icon} {cat.label}</div>
          {gear[cat.key].map(item => (
            <div className="gear-item" key={item.id}>
              <div className="gear-icon">{cat.icon}</div>
              <div>
                <div className="gear-name">{item.name}</div>
                <div className="gear-size">{item.size}</div>
              </div>
              <div className="gear-actions">
                <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => openEdit(cat.key, item)}>Edit</button>
                <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12, color: "var(--orange)" }} onClick={() => remove(cat.key, item.id)}>✕</button>
              </div>
            </div>
          ))}
          <button className="btn-teal-ghost" style={{ width: "100%", textAlign: "center", padding: "10px" }} onClick={() => openAdd(cat.key)}>
            + Add {cat.label.slice(0, -1)}
          </button>
        </div>
      ))}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">{modal.editing ? "Edit" : "Add"} {cats.find(c => c.key === modal.type)?.label.slice(0, -1)}</div>
            <div className="field-group">
              <label className="field-label">Name</label>
              <input className="field-input" placeholder="e.g. Duotone Unit D/LAB" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="field-group">
              <label className="field-label">Size</label>
              <input className="field-input" placeholder="e.g. 5.0m" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} />
            </div>
            <button className="btn-primary" onClick={save}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function WingLog() {
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState("log");
  const [sessions, setSessions] = useState([]);
  const [gear, setGear] = useState({ wings: [], boards: [], masts: [] });
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setLoading(true);
    const { data: sessionsData } = await supabase
      .from("sessions")
      .select("*")
      .order("date", { ascending: false });

    const { data: gearData } = await supabase
      .from("gear")
      .select("*");

    if (sessionsData) setSessions(sessionsData);
    if (gearData) {
      const organizedGear = {
        wings: gearData.filter(g => g.type === "wings"),
        boards: gearData.filter(g => g.type === "boards"),
        masts: gearData.filter(g => g.type === "masts"),
      };
      setGear(organizedGear);
    }
    setLoading(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const handleSave = async (form) => {
    setLoading(true);
    const { error } = await supabase.from("sessions").insert([{
      date: form.date,
      location: form.location,
      wind: form.wind,
      duration: form.duration,
      rating: form.rating,
      wing: form.wing,
      board: form.board,
      mast: form.mast,
      notes: form.notes,
      user_id: session.user.id
    }]);

    if (error) {
      alert(error.message);
    } else {
      showToast("✦ Session logged!");
      fetchData();
      setTab("history");
    }
  };

  const navItems = [
    { id: "log", label: "Log", icon: <IconLog /> },
    { id: "history", label: "History", icon: <IconHistory /> },
    { id: "stats", label: "Stats", icon: <IconStats /> },
    { id: "gear", label: "Gear", icon: <IconGear /> },
  ];

  if (loading && !session) return <div className="app"><div className="content" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><div className="topbar-logo">Wing<span>Log</span></div></div></div>;
  if (!session) return <><style>{FONTS}{CSS}</style><div className="app"><AuthScreen /></div></>;

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="app">
        {/* Top bar */}
        <div className="topbar">
          <div>
            <div className="topbar-logo">Wing<span>Log</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="topbar-sub">
              {sessions.length} sessions
            </div>
            <button className="btn-ghost" style={{ padding: "4px 8px", fontSize: 10 }} onClick={() => supabase.auth.signOut()}>
              Logout
            </button>
          </div>
        </div>

        {/* Toast */}
        <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>

        {/* Content */}
        <div className="content">
          {tab === "log" && <LogScreen gear={gear} onSave={handleSave} />}
          {tab === "history" && <HistoryScreen sessions={sessions} />}
          {tab === "stats" && <StatsScreen sessions={sessions} />}
          {tab === "gear" && <GearScreen gear={gear} session={session} fetchData={fetchData} setLoading={setLoading} />}
        </div>

        {/* Bottom nav */}
        <nav className="bottom-nav">
          {navItems.map(n => (
            <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              {n.icon}
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
