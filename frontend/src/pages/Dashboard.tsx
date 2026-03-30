import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { keccak256, toBytes } from "viem";

const CASES_KEY = "lexcrypt_cases";
const ACTIVITY_KEY = "lexcrypt_activity";

type CaseItem = {
  id: `0x${string}`;
  title: string;
  caseType: number;
  jurisdiction: number;
  createdAt: number;
  status: string;
  lastUpdated?: number;
  lastVerdictScore?: number;
  lastWinProbability?: number;
  lastPracticeScore?: number;
  evidenceCount?: number;
};

type ActivityItem = {
  id: string;
  type: string;
  note?: string;
  timestamp: number;
  caseId?: string;
};

export default function Dashboard() {
  const [cases, setCases] = useState<CaseItem[]>(() => {
    try {
      const raw = localStorage.getItem(CASES_KEY);
      if (raw) return JSON.parse(raw);
      const now = Date.now();
      return [
        {
          id: keccak256(toBytes("demo-case-1")) as `0x${string}`,
          title: "State vs Doe",
          caseType: 2,
          jurisdiction: 5,
          createdAt: now - 1000 * 60 * 60 * 6,
          status: "In Review",
          lastUpdated: now - 1000 * 60 * 30,
          lastVerdictScore: 72,
          lastWinProbability: 64,
          lastPracticeScore: 0,
          evidenceCount: 1
        },
        {
          id: keccak256(toBytes("demo-case-2")) as `0x${string}`,
          title: "Union vs Acme Corp",
          caseType: 1,
          jurisdiction: 3,
          createdAt: now - 1000 * 60 * 60 * 12,
          status: "Open",
          lastUpdated: now - 1000 * 60 * 60,
          lastVerdictScore: 48,
          lastWinProbability: 55,
          lastPracticeScore: 82,
          evidenceCount: 2
        }
      ];
    } catch (error) {
      return [];
    }
  });

  const [activity] = useState<ActivityItem[]>(() => {
    try {
      const raw = localStorage.getItem(ACTIVITY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  });

  const [form, setForm] = useState({
    title: "",
    caseType: 1,
    jurisdiction: 1,
    status: "Open"
  });

  useEffect(() => {
    try {
      localStorage.setItem(CASES_KEY, JSON.stringify(cases));
    } catch (error) {
      // ignore storage errors in demo mode
    }
  }, [cases]);

  const createCase = () => {
    const title = form.title.trim() || `Case ${cases.length + 1}`;
    const id = keccak256(toBytes(`${title}-${Date.now()}`)) as `0x${string}`;
    const newCase: CaseItem = {
      id,
      title,
      caseType: Number(form.caseType),
      jurisdiction: Number(form.jurisdiction),
      status: form.status,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      lastVerdictScore: 0,
      lastWinProbability: 0,
      lastPracticeScore: 0,
      evidenceCount: 0
    };
    setCases((prev) => [newCase, ...prev]);
    setForm({ ...form, title: "" });
  };

  const recentActivity = useMemo(() => activity.slice(0, 8), [activity]);
  const totals = useMemo(() => {
    const open = cases.filter((item) => item.status === "Open").length;
    const review = cases.filter((item) => item.status === "In Review").length;
    const closed = cases.filter((item) => item.status === "Closed").length;
    return { total: cases.length, open, review, closed };
  }, [cases]);

  return (
    <div>
      <div className="card">
        <h2>Create Case</h2>
        <div className="grid">
          <div>
            <label>Case title</label>
            <input
              type="text"
              placeholder="e.g. State vs Doe"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label>Case type code</label>
            <input
              type="number"
              value={form.caseType}
              onChange={(e) => setForm({ ...form, caseType: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Jurisdiction code</label>
            <input
              type="number"
              value={form.jurisdiction}
              onChange={(e) => setForm({ ...form, jurisdiction: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="primary" onClick={createCase}>
            Add Case
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Cases</h2>
        <div className="row" style={{ marginBottom: 12 }}>
          <span className="muted">Total: {totals.total}</span>
          <span className="muted">Open: {totals.open}</span>
          <span className="muted">In Review: {totals.review}</span>
          <span className="muted">Closed: {totals.closed}</span>
        </div>
        {cases.length === 0 ? (
          <p className="muted">No cases yet. Create one to start the dashboard.</p>
        ) : (
          <div className="case-list">
            {cases.map((item) => (
              <div key={item.id} className="case-item">
                <div>
                  <strong>{item.title}</strong>
                  <div className="muted">
                    Type: {item.caseType} | Jurisdiction: {item.jurisdiction} | Status: {item.status}
                  </div>
                  <div className="muted">
                    Created: {new Date(item.createdAt).toLocaleString()}
                    {item.lastUpdated ? ` | Updated: ${new Date(item.lastUpdated).toLocaleString()}` : ""}
                  </div>
                  <div className="muted">
                    Verdict: {item.lastVerdictScore ?? 0} | Win: {item.lastWinProbability ?? 0}% | Practice:{" "}
                    {item.lastPracticeScore ?? 0} | Evidence: {item.evidenceCount ?? 0}
                  </div>
                </div>
                <div className="row">
                  <span className="muted">{item.id.slice(0, 10)}...</span>
                  <Link className="secondary" to={`/cases/${item.id}`}>
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="muted">No activity yet.</p>
        ) : (
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={`${item.type}-${item.id}-${item.timestamp}`} className="activity-item">
                <div>
                  <strong>{item.type}</strong>
                  {item.note ? ` - ${item.note}` : ""}
                  <div className="muted">{new Date(item.timestamp).toLocaleString()}</div>
                </div>
                <div className="muted">{item.id.slice(0, 10)}...</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
