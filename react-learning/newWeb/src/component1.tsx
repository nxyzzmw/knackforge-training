import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "./store/useStore";
import UserCard from "./components/UserCard";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

type Post = {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  image: string;
};

type Component1Props = {
  pageTitle: string;
};

type ThemeMode = "light" | "dark";
type ListMode = "pagination" | "infinite";

type AuthFormState = {
  username: string;
  password: string;
};

type AuthFormErrors = {
  username?: string;
  password?: string;
};

type AuthFormAction =
  | { type: "setUsername"; payload: string }
  | { type: "setPassword"; payload: string }
  | { type: "reset" };

const initialAuthFormState: AuthFormState = {
  username: "emilys",
  password: "emilyspass",
};

const authFormReducer = (
  state: AuthFormState,
  action: AuthFormAction
): AuthFormState => {
  switch (action.type) {
    case "setUsername":
      return { ...state, username: action.payload };
    case "setPassword":
      return { ...state, password: action.payload };
    case "reset":
      return initialAuthFormState;
    default:
      return state;
  }
};

const Component1: React.FC<Component1Props> = ({ pageTitle }) => {
  const {
    count,
    increase,
    decrease,
    accessToken,
    refreshToken,
    isAuthenticated,
    setTokens,
    clearAuth,
  } = useStore();

  const isOnline = useOnlineStatus();
  const usernameId = useId();
  const passwordId = useId();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [showUsers, setShowUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listMode, setListMode] = useState<ListMode>("pagination");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const storedTheme = localStorage.getItem("theme-mode");
    return storedTheme === "dark" ? "dark" : "light";
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<AuthFormErrors>({});
  const [authForm, dispatchAuthForm] = useReducer(
    authFormReducer,
    initialAuthFormState
  );

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const itemsPerPage = 6;
  const isDarkTheme = theme === "dark";

  const themeStyles = useMemo(
    () => ({
      pageBg: isDarkTheme ? "#101827" : "#f8fafc",
      panelBg: isDarkTheme ? "#1f2937" : "#ffffff",
      text: isDarkTheme ? "#e5e7eb" : "#0f172a",
      mutedText: isDarkTheme ? "#cbd5e1" : "#334155",
      border: isDarkTheme ? "#334155" : "#d1d5db",
      inputBg: isDarkTheme ? "#111827" : "#ffffff",
      inputText: isDarkTheme ? "#f3f4f6" : "#111827",
      primaryButtonBg: isDarkTheme ? "#0ea5e9" : "#2563eb",
      primaryButtonText: "#ffffff",
      toggleButtonBg: isDarkTheme ? "#fde047" : "#1e293b",
      toggleButtonText: isDarkTheme ? "#111827" : "#f8fafc",
      modeButtonBg: isDarkTheme ? "#334155" : "#e2e8f0",
      modeButtonActiveBg: isDarkTheme ? "#0ea5e9" : "#2563eb",
      modeButtonText: isDarkTheme ? "#f8fafc" : "#0f172a",
      skeletonBg: isDarkTheme ? "#374151" : "#e5e7eb",
    }),
    [isDarkTheme]
  );

  useEffect(() => {
    localStorage.setItem("theme-mode", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const validateAuthForm = useCallback((form: AuthFormState) => {
    const nextErrors: AuthFormErrors = {};

    if (!form.username.trim()) {
      nextErrors.username = "Username is required.";
    } else if (form.username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, []);

  const login = useCallback(async () => {
    setAuthError("");
    if (!validateAuthForm(authForm)) return;
    setAuthLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: authForm.username,
          password: authForm.password,
          expiresInMins: 30,
        }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      const nextAccessToken = data.accessToken ?? data.token;
      const nextRefreshToken = data.refreshToken ?? "";

      if (!nextAccessToken) throw new Error("No access token returned");

      setTokens(nextAccessToken, nextRefreshToken);
      dispatchAuthForm({ type: "reset" });
      setFormErrors({});
    } catch {
      setAuthError("Invalid credentials or auth server error.");
    } finally {
      setAuthLoading(false);
    }
  }, [authForm, setTokens, validateAuthForm]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      setAuthError("No refresh token available.");
      return;
    }

    setAuthError("");
    setRefreshLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken,
          expiresInMins: 30,
        }),
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      const nextAccessToken = data.accessToken ?? data.token;
      const nextRefreshToken = data.refreshToken ?? refreshToken;

      if (!nextAccessToken) throw new Error("No access token returned");

      setTokens(nextAccessToken, nextRefreshToken);
    } catch {
      setAuthError("Could not refresh token. Please login again.");
      clearAuth();
    } finally {
      setRefreshLoading(false);
    }
  }, [clearAuth, refreshToken, setTokens]);

  const authHeaders = useMemo<HeadersInit | undefined>(
    () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    [accessToken]
  );

  const fetchUsers = useCallback(async (): Promise<Post[]> => {
    const res = await fetch("https://dummyjson.com/users", {
      headers: authHeaders,
    });

    if (!res.ok) throw new Error("error");

    const usersResponse = await res.json();
    return usersResponse.users;
  }, [authHeaders]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", Boolean(accessToken)],
    queryFn: fetchUsers,
    enabled: false,
  });

  const handleGetUsers = useCallback(() => {
    setShowUsers(true);
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  const tokenPreview = useMemo(
    () => ({
      access: accessToken ? `${accessToken.slice(0, 25)}...` : "-",
      refresh: refreshToken ? `${refreshToken.slice(0, 25)}...` : "-",
    }),
    [accessToken, refreshToken]
  );

  const filteredUsers = useMemo(() => {
    if (!data) return [];

    const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) return data;

    return data.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(normalizedSearch) ||
        user.gender.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [data, deferredSearchTerm]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage)),
    [filteredUsers.length]
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredUsers.slice(start, end);
  }, [currentPage, filteredUsers]);

  const visibleCount = useMemo(() => currentPage * itemsPerPage, [currentPage]);
  const infiniteUsers = useMemo(
    () => filteredUsers.slice(0, visibleCount),
    [filteredUsers, visibleCount]
  );

  const displayedUsers = listMode === "pagination" ? paginatedUsers : infiniteUsers;
  const hasMoreUsers = listMode === "infinite" && infiniteUsers.length < filteredUsers.length;

  useEffect(() => {
    if (selectedUserId === null) return;
    if (!filteredUsers.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(null);
    }
  }, [filteredUsers, selectedUserId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchTerm, listMode]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!showUsers || listMode !== "infinite" || isLoading || !hasMoreUsers || !target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "120px", threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [showUsers, listMode, isLoading, hasMoreUsers]);

  const userStats = useMemo(() => {
    if (!filteredUsers.length) {
      return { total: 0, avgAge: 0 };
    }

    const totalAge = filteredUsers.reduce((sum, user) => sum + user.age, 0);
    return {
      total: filteredUsers.length,
      avgAge: Math.round(totalAge / filteredUsers.length),
    };
  }, [filteredUsers]);

  const showingText =
    listMode === "pagination"
      ? `${Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)}-${Math.min(
          currentPage * itemsPerPage,
          filteredUsers.length
        )}`
      : `1-${Math.min(infiniteUsers.length, filteredUsers.length)}`;

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: themeStyles.pageBg,
        color: themeStyles.text,
      }}
    >
      <button
        style={{
          ...styles.themeToggle,
          backgroundColor: themeStyles.toggleButtonBg,
          color: themeStyles.toggleButtonText,
        }}
        onClick={toggleTheme}
      >
        Switch to {isDarkTheme ? "Light" : "Dark"} Theme
      </button>

      <h1 style={styles.title}>{pageTitle}</h1>

      <p
        style={{
          ...styles.onlineBadge,
          backgroundColor: isOnline ? "#e8f5e9" : "#ffebee",
          color: isOnline ? "#1b5e20" : "#b71c1c",
        }}
      >
        Network Status: {isOnline ? "Online" : "Offline"}
      </p>

      {!isAuthenticated && (
        <div
          style={{
            ...styles.authBox,
            borderColor: themeStyles.border,
            backgroundColor: themeStyles.panelBg,
          }}
        >
          <label style={styles.label} htmlFor={usernameId}>
            Username
          </label>
          <input
            id={usernameId}
            style={{
              ...styles.input,
              borderColor: themeStyles.border,
              backgroundColor: themeStyles.inputBg,
              color: themeStyles.inputText,
            }}
            placeholder="username"
            value={authForm.username}
            onChange={(e) =>
              dispatchAuthForm({ type: "setUsername", payload: e.target.value })
            }
          />
          {formErrors.username && <p style={styles.fieldError}>{formErrors.username}</p>}

          <label style={styles.label} htmlFor={passwordId}>
            Password
          </label>
          <input
            id={passwordId}
            style={{
              ...styles.input,
              borderColor: themeStyles.border,
              backgroundColor: themeStyles.inputBg,
              color: themeStyles.inputText,
            }}
            type="password"
            placeholder="password"
            value={authForm.password}
            onChange={(e) =>
              dispatchAuthForm({ type: "setPassword", payload: e.target.value })
            }
          />
          {formErrors.password && <p style={styles.fieldError}>{formErrors.password}</p>}

          <button
            style={{
              ...styles.button,
              backgroundColor: themeStyles.primaryButtonBg,
              color: themeStyles.primaryButtonText,
            }}
            onClick={login}
            disabled={authLoading}
          >
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      )}

      {isAuthenticated && (
        <>
          <div
            style={{
              ...styles.authBox,
              borderColor: themeStyles.border,
              backgroundColor: themeStyles.panelBg,
            }}
          >
            <p style={{ ...styles.tokenText, color: themeStyles.mutedText }}>
              Access Token: {tokenPreview.access}
            </p>
            <p style={{ ...styles.tokenText, color: themeStyles.mutedText }}>
              Refresh Token: {tokenPreview.refresh}
            </p>
            <div>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: themeStyles.primaryButtonBg,
                  color: themeStyles.primaryButtonText,
                }}
                onClick={refreshAccessToken}
                disabled={refreshLoading}
              >
                {refreshLoading ? "Refreshing..." : "Refresh Access Token"}
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "#b00020", color: "#fff" }}
                onClick={clearAuth}
              >
                Logout
              </button>
            </div>
          </div>

          <h2 style={styles.title}>Users List</h2>
          <button style={styles.fetchButton} onClick={handleGetUsers}>
            Get Users
          </button>

          {isLoading && <h2>Loading...</h2>}
          {error && <h2>Error occurred</h2>}

          {showUsers && (
            <>
              <div style={styles.modeSwitchWrap}>
                <button
                  style={{
                    ...styles.modeButton,
                    backgroundColor:
                      listMode === "pagination"
                        ? themeStyles.modeButtonActiveBg
                        : themeStyles.modeButtonBg,
                    color:
                      listMode === "pagination"
                        ? "#fff"
                        : themeStyles.modeButtonText,
                  }}
                  onClick={() => setListMode("pagination")}
                >
                  Pagination
                </button>
                <button
                  style={{
                    ...styles.modeButton,
                    backgroundColor:
                      listMode === "infinite"
                        ? themeStyles.modeButtonActiveBg
                        : themeStyles.modeButtonBg,
                    color:
                      listMode === "infinite" ? "#fff" : themeStyles.modeButtonText,
                  }}
                  onClick={() => setListMode("infinite")}
                >
                  Infinite Scroll
                </button>
              </div>

              <input
                style={{
                  ...styles.searchInput,
                  borderColor: themeStyles.border,
                  backgroundColor: themeStyles.inputBg,
                  color: themeStyles.inputText,
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or gender"
              />
              <p style={styles.stats}>
                Visible Users: {userStats.total} | Average Age: {userStats.avgAge}
              </p>
              <p style={styles.stats}>
                Showing {filteredUsers.length ? showingText : "0"} of {filteredUsers.length}
              </p>
            </>
          )}

          <div style={styles.cardContainer}>
            {showUsers && isLoading && (
              <>
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div key={index} style={styles.skeletonCard}>
                    <div
                      style={{
                        ...styles.skeletonAvatar,
                        backgroundColor: themeStyles.skeletonBg,
                      }}
                    />
                    <div
                      style={{
                        ...styles.skeletonLineLong,
                        backgroundColor: themeStyles.skeletonBg,
                      }}
                    />
                    <div
                      style={{
                        ...styles.skeletonLine,
                        backgroundColor: themeStyles.skeletonBg,
                      }}
                    />
                    <div
                      style={{
                        ...styles.skeletonLine,
                        backgroundColor: themeStyles.skeletonBg,
                      }}
                    />
                    <div
                      style={{
                        ...styles.skeletonButton,
                        backgroundColor: themeStyles.skeletonBg,
                      }}
                    />
                  </div>
                ))}
              </>
            )}

            {showUsers &&
              !isLoading &&
              displayedUsers.map((post) => (
                <UserCard
                  key={post.id}
                  id={post.id}
                  firstName={post.firstName}
                  lastName={post.lastName}
                  gender={post.gender}
                  age={post.age}
                  image={post.image}
                  onSelect={setSelectedUserId}
                  isDarkTheme={isDarkTheme}
                />
              ))}
          </div>

          {showUsers && !isLoading && listMode === "pagination" && filteredUsers.length > 0 && (
            <div style={styles.pagination}>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: themeStyles.primaryButtonBg,
                  color: themeStyles.primaryButtonText,
                }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span style={styles.pageLabel}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: themeStyles.primaryButtonBg,
                  color: themeStyles.primaryButtonText,
                }}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {showUsers && !isLoading && listMode === "infinite" && hasMoreUsers && (
            <div ref={loadMoreRef} style={styles.loadMoreTrigger}>
              Loading more users...
            </div>
          )}

          {showUsers && !isLoading && !hasMoreUsers && filteredUsers.length > 0 && (
            <p style={styles.endMessage}>You have reached the end of the list.</p>
          )}

          <p style={styles.selectedUser}>Selected User Id: {selectedUserId ?? "None"}</p>

          <h1 style={styles.counter}>{count}</h1>
          <button style={styles.button} onClick={increase}>
            Increase
          </button>
          <button style={styles.button} onClick={decrease}>
            Decrease
          </button>
        </>
      )}

      {authError && <p style={styles.error}>{authError}</p>}
    </div>
  );
};

export default Component1;

const styles = {
  container: {
    padding: "20px",
    textAlign: "center" as const,
    minHeight: "100vh",
  },

  title: {
    marginBottom: "20px",
  },

  authBox: {
    margin: "0 auto 20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    maxWidth: "420px",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  label: {
    fontSize: "14px",
    textAlign: "left" as const,
    fontWeight: 600,
  },

  fieldError: {
    margin: 0,
    color: "#b00020",
    textAlign: "left" as const,
    fontSize: "13px",
  },

  fetchButton: {
    padding: "10px 20px",
    marginBottom: "20px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
  },

  cardContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "20px",
    justifyContent: "center" as const,
  },

  counter: {
    marginTop: "30px",
  },

  button: {
    padding: "10px",
    margin: "10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },

  tokenText: {
    textAlign: "left" as const,
    fontSize: "14px",
    margin: 0,
    overflowWrap: "anywhere" as const,
  },

  error: {
    color: "#b00020",
    marginTop: "10px",
  },

  stats: {
    fontWeight: "bold",
    marginBottom: "10px",
  },

  selectedUser: {
    marginTop: "16px",
    fontWeight: "bold",
  },

  searchInput: {
    width: "100%",
    maxWidth: "420px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "12px",
  },

  onlineBadge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  pagination: {
    marginTop: "16px",
    display: "flex",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: "8px",
  },

  pageLabel: {
    fontWeight: "bold",
  },

  skeletonCard: {
    width: "220px",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #ececec",
    backgroundColor: "#fafafa",
  },

  skeletonAvatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    margin: "0 auto 12px",
    backgroundColor: "#e5e7eb",
  },

  skeletonLineLong: {
    height: "14px",
    borderRadius: "8px",
    backgroundColor: "#e5e7eb",
    marginBottom: "10px",
  },

  skeletonLine: {
    height: "12px",
    borderRadius: "8px",
    backgroundColor: "#e5e7eb",
    marginBottom: "8px",
  },

  skeletonButton: {
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "#d1d5db",
    marginTop: "12px",
  },

  loadMoreTrigger: {
    marginTop: "16px",
    fontWeight: "bold",
    opacity: 0.8,
  },

  endMessage: {
    marginTop: "16px",
    fontWeight: "bold",
    opacity: 0.8,
  },

  themeToggle: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "12px",
  },

  modeSwitchWrap: {
    display: "flex",
    justifyContent: "center" as const,
    gap: "8px",
    marginBottom: "12px",
  },

  modeButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },
};
