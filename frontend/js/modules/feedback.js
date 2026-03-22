import { authStatus, errorMsg } from "./dom.js";

export function setFeedback(text, type) {
  errorMsg.className = type ? (type === "error" ? "error" : "completed") : "";
  errorMsg.textContent = text || "";

  if (text) {
    setTimeout(() => {
      errorMsg.textContent = "";
      errorMsg.className = "";
    }, 2500);
  }
}

export function setAuthStatus(text, type) {
  authStatus.className = type ? (type === "error" ? "error" : "completed") : "";
  authStatus.textContent = text || "";
}
