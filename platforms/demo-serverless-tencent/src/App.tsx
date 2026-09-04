import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronRight,
  CircleCheck,
  Database,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import {
  getUserInfo,
  updateUserInfo,
  type UserRecord,
} from "./services/userApi";

interface DraftValues {
  userName: string;
  age: string;
}

function formatSyncTime(value: Date | null): string {
  if (!value) {
    return "Waiting for first sync";
  }

  return value.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function App() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftValues>({ userName: "", age: "" });
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const records = await getUserInfo();
      setUsers(records);
      setLastSynced(new Date());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load user information.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) =>
      [String(user.userId), user.userName, String(user.age)].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [search, users]);

  const averageAge = useMemo(() => {
    if (users.length === 0) {
      return "--";
    }

    return Math.round(
      users.reduce((total, user) => total + user.age, 0) / users.length,
    );
  }, [users]);

  function startEditing(user: UserRecord) {
    setError(null);
    setStatus(null);
    setEditingId(user.userId);
    setDraft({
      userName: user.userName,
      age: String(user.age),
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setDraft({ userName: "", age: "" });
  }

  async function saveUser(user: UserRecord) {
    const userName = draft.userName.trim();
    const age = Number(draft.age);

    if (!userName) {
      setError("User name cannot be empty.");
      return;
    }

    if (!Number.isInteger(age) || age < 0 || age > 150) {
      setError("Age must be a whole number between 0 and 150.");
      return;
    }

    setSavingId(user.userId);
    setError(null);
    setStatus(null);

    try {
      await updateUserInfo({
        userId: user.userId,
        userName,
        age,
      });

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.userId === user.userId
            ? {
                ...currentUser,
                userName,
                age,
                updatedAt: new Date().toISOString(),
              }
            : currentUser,
        ),
      );
      setLastSynced(new Date());
      setStatus(`User ${user.userId} updated`);
      cancelEditing();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update this user.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark" aria-label="User Registry">
          UR
        </div>
        <div className="side-rail">
          <button className="rail-button rail-button-active" title="Users">
            <Users size={18} strokeWidth={1.8} />
          </button>
          <button className="rail-button" title="Data source">
            <Database size={18} strokeWidth={1.8} />
          </button>
          <button className="rail-button" title="Controls">
            <SlidersHorizontal size={18} strokeWidth={1.8} />
          </button>
        </div>
        <div className="side-footer">
          <ShieldCheck size={16} />
          <span>PG / RLS</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>User information</strong>
          </div>
          <div className="environment-badge">
            <span className="status-dot" />
            web-test
          </div>
        </header>

        <section className="content">
          <div className="intro-block">
            <div>
              <p className="eyebrow">Directory / 01</p>
              <h1>User registry</h1>
              <p className="intro-copy">
                Maintain names and ages directly against the shared user
                directory.
              </p>
            </div>
            <button
              className="sync-button"
              onClick={() => void loadUsers()}
              disabled={loading}
              title="Refresh users"
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              <span>{loading ? "Syncing" : "Refresh"}</span>
            </button>
          </div>

          <div className="summary-strip">
            <div className="summary-item summary-item-primary">
              <span className="summary-label">Total users</span>
              <strong>{users.length.toString().padStart(2, "0")}</strong>
              <span className="summary-note">records</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average age</span>
              <strong>{averageAge}</strong>
              <span className="summary-note">years</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Last sync</span>
              <strong className="summary-time">{formatSyncTime(lastSynced)}</strong>
              <span className="summary-note">local time</span>
            </div>
            <div className="summary-meta">
              <span className="live-pulse" />
              <span>Live data source</span>
            </div>
          </div>

          <div className="table-toolbar">
            <div className="table-heading">
              <span className="table-kicker">Records</span>
              <span className="table-count">
                {filteredUsers.length} visible
              </span>
            </div>
            <label className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID, name, age"
                aria-label="Search users"
              />
            </label>
          </div>

          {error ? (
            <div className="feedback feedback-error" role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          ) : null}
          {status ? (
            <div className="feedback feedback-success" role="status">
              <CircleCheck size={18} />
              <span>{status}</span>
            </div>
          ) : null}

          <div className="table-frame">
            <table>
              <thead>
                <tr>
                  <th className="id-column">User ID</th>
                  <th>User name</th>
                  <th>Age</th>
                  <th>Record status</th>
                  <th className="action-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="table-message">
                      <span className="loading-line" />
                      Loading user registry...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="table-message">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isEditing = editingId === user.userId;
                    const isSaving = savingId === user.userId;

                    return (
                      <tr key={user.userId} className={isEditing ? "row-editing" : ""}>
                        <td className="id-cell">
                          <span className="id-badge">#{user.userId}</span>
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              className="inline-input name-input"
                              value={draft.userName}
                              onChange={(event) =>
                                setDraft((currentDraft) => ({
                                  ...currentDraft,
                                  userName: event.target.value,
                                }))
                              }
                              autoFocus
                              aria-label={`Edit user ${user.userId} name`}
                            />
                          ) : (
                            <span className="user-name">{user.userName}</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              className="inline-input age-input"
                              value={draft.age}
                              onChange={(event) =>
                                setDraft((currentDraft) => ({
                                  ...currentDraft,
                                  age: event.target.value,
                                }))
                              }
                              inputMode="numeric"
                              aria-label={`Edit user ${user.userId} age`}
                            />
                          ) : (
                            <span className="age-value">{user.age}</span>
                          )}
                        </td>
                        <td>
                          <span className="record-state">
                            <span className="state-check">
                              <Check size={12} strokeWidth={2.5} />
                            </span>
                            Active
                          </span>
                        </td>
                        <td className="action-cell">
                          {isEditing ? (
                            <div className="edit-actions">
                              <button
                                className="icon-button icon-button-save"
                                onClick={() => void saveUser(user)}
                                disabled={isSaving}
                                title="Save changes"
                                aria-label={`Save user ${user.userId}`}
                              >
                                <Check size={16} />
                              </button>
                              <button
                                className="icon-button icon-button-cancel"
                                onClick={cancelEditing}
                                disabled={isSaving}
                                title="Cancel edit"
                                aria-label={`Cancel editing user ${user.userId}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="edit-button"
                              onClick={() => startEditing(user)}
                              title="Edit user"
                            >
                              <Pencil size={15} />
                              <span>Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <footer className="page-footer">
            <span>Endpoint contract</span>
            <code>/getUserInfo</code>
            <span className="footer-divider">/</span>
            <code>/updateUserInfo</code>
            <span className="footer-spacer" />
            <span>Updated rows persist in CloudBase PG</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
