import { addButton, commentTitle, loginButton, logoutButton } from "./dom.js";
import { setFeedback } from "./feedback.js";
import { login, logout } from "./auth.js";
import { addComment } from "./comments.js";

export function bindEvents() {
  addButton.addEventListener("click", () => {
    const title = commentTitle.value.trim();

    if (!title) {
      return setFeedback("Write a comment first.", "error");
    }

    if (title.length < 5) {
      return setFeedback("The comment must be at least 5 characters.", "error");
    }
    if (title.length > 150) {
      return setFeedback("The comment cannot exceed 150 characters.", "error");
    }

    addComment(title);
  });

  commentTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addButton.click();
  });

  loginButton.addEventListener("click", login);
  logoutButton.addEventListener("click", logout);
}
