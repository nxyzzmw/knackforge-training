import users from "../data/users.json";

interface LoginPayload {
  email: string;
  password: string;
}

export const fakeLogin = ({ email, password }: LoginPayload) => {
  if (password.length < 6) {
    return null;
  }

  const user = users.find((u) => u.email === email);

  if (!user) return null;

  return user;
};
