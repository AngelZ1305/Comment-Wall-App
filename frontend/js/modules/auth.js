import { LOGIN_API, LOGOUT_API } from "./config.js";
import { msg, passwordInput, commentList, emailInput } from "./dom.js";
import { setAuthStatus, setFeedback } from "./feedback.js";
import { getComments } from "./comments.js";
import { clearCurrentUser, setCurrentUser } from "./session.js";

export async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    return setFeedback("Enter email and password", "error");
  }

  try {
    const res = await fetch(LOGIN_API, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "Login failed");
    }

    const user = data?.user;
    if (!user?.email) {
      throw new Error("Login response is missing user data");
    }

    setCurrentUser({
      name: user?.name,
      email: user?.email
    });
    setAuthStatus(`Signed in: ${user.email}`, "completed");
    setFeedback("Login successful", "completed");
    passwordInput.value = "";

    await getComments();
  } catch (err) {
    clearCurrentUser();
    setAuthStatus("Not authenticated", "error");
    setFeedback(String(err.message || err), "error");
  }
}

export async function logout() {
  try {
    const res = await fetch(LOGOUT_API, {
      method: "POST",
      credentials: "include"
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Logout failed");
    }

    commentList.innerHTML = "";
    msg.textContent = "Signed out";
    clearCurrentUser();
    setAuthStatus("Not authenticated", "error");
    setFeedback("Logout successful", "completed");
  } catch (err) {
    setFeedback(String(err.message || err), "error");
  }
}
