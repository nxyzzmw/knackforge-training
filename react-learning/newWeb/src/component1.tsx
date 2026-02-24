import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "./store/useStore";
import UserCard from "./components/UserCard";

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

  const [showUsers, setShowUsers] = useState(false);
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const tokenPreview = useMemo(
    () => ({
      access: accessToken ? `${accessToken.slice(0, 25)}...` : "-",
      refresh: refreshToken ? `${refreshToken.slice(0, 25)}...` : "-",
    }),
    [accessToken, refreshToken]
  );

  const authHeaders = useMemo<HeadersInit | undefined>(
    () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    [accessToken]
  );

  const login = useCallback(async () => {
    setAuthError("");
    setAuthLoading(true);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const nextAccessToken = data.accessToken ?? data.token;
      const nextRefreshToken = data.refreshToken ?? "";

      if (!nextAccessToken) {
        throw new Error("No access token returned");
      }

      setTokens(nextAccessToken, nextRefreshToken);
    } catch {
      setAuthError("Invalid credentials or auth server error.");
    } finally {
      setAuthLoading(false);
    }
  }, [password, setTokens, username]);

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

      if (!response.ok) {
        throw new Error("Refresh failed");
      }

      const data = await response.json();
      const nextAccessToken = data.accessToken ?? data.token;
      const nextRefreshToken = data.refreshToken ?? refreshToken;

      if (!nextAccessToken) {
        throw new Error("No access token returned");
      }

      setTokens(nextAccessToken, nextRefreshToken);
    } catch {
      setAuthError("Could not refresh token. Please login again.");
      clearAuth();
    } finally {
      setRefreshLoading(false);
    }
  }, [clearAuth, refreshToken, setTokens]);

  const fetchPosts = useCallback(async (): Promise<Post[]> => {
    const res = await fetch("https://dummyjson.com/users", {
      headers: authHeaders,
    });

    if (!res.ok) throw new Error("error");

    const data = await res.json();

    return data.users;
  }, [authHeaders]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["posts", Boolean(accessToken)],
    queryFn: fetchPosts,
    enabled: false,
  });

  const handleGetUsers = useCallback(() => {
    setShowUsers(true);
    refetch();
  }, [refetch]);

  const handleSelectUser = useCallback((id: number) => {
    setSelectedUserId(id);
  }, []);

  const handleIncrease = useCallback(() => {
    increase();
  }, [increase]);

  const handleDecrease = useCallback(() => {
    decrease();
  }, [decrease]);

  const userStats = useMemo(() => {
    if (!data?.length) {
      return { total: 0, avgAge: 0 };
    }

    const totalAge = data.reduce((sum, user) => sum + user.age, 0);

    return {
      total: data.length,
      avgAge: Math.round(totalAge / data.length),
    };
  }, [data]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{pageTitle}</h1>

      {!isAuthenticated && (
        <div style={styles.authBox}>
          <input
            style={styles.input}
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.button} onClick={login} disabled={authLoading}>
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      )}

      {isAuthenticated && (
        <>
          <div style={styles.authBox}>
            <p style={styles.tokenText}>Access Token: {tokenPreview.access}</p>
            <p style={styles.tokenText}>Refresh Token: {tokenPreview.refresh}</p>
            <div>
              <button
                style={styles.button}
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
            <p style={styles.stats}>
              Total Users: {userStats.total} | Average Age: {userStats.avgAge}
            </p>
          )}

          <div style={styles.cardContainer}>
            {showUsers &&
              data?.map((post) => (
                <UserCard
                  key={post.id}
                  id={post.id}
                  firstName={post.firstName}
                  lastName={post.lastName}
                  gender={post.gender}
                  age={post.age}
                  image={post.image}
                  onSelect={handleSelectUser}
                />
              ))}
          </div>

          <p style={styles.selectedUser}>Selected User Id: {selectedUserId ?? "None"}</p>

          <h1 style={styles.counter}>{count}</h1>
          <button style={styles.button} onClick={handleIncrease}>
            Increase
          </button>
          <button style={styles.button} onClick={handleDecrease}>
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

  fetchButton: {
    padding: "10px 20px",
    marginBottom: "20px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
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
};
