let currentUser = null;

export function setCurrentUser(user) {
  currentUser = user
    ? {
      name: String(user.name || "").trim(),
      email: String(user.email || "").trim()
    }
    : null;
}

export function getCurrentUser() {
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null;
}
