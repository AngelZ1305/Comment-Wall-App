import { COMMENTS_API } from "./config.js";
import { addButton, emailInput, msg, commentList, commentTitle } from "./dom.js";
import { setAuthStatus, setFeedback } from "./feedback.js";
import { render } from "./render.js";
import { getCurrentUser } from "./session.js";

export async function getComments() {
  msg.textContent = "Loading comments...";

  try {
    const res = await fetch(COMMENTS_API, {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      commentList.innerHTML = "";
      msg.textContent = "Sign in to view comments.";
      setAuthStatus("Not authenticated", "error");
      render([], { deleteComment });
      return;
    }

    if (!res.ok) {
      throw new Error(data?.error || "Could not fetch comments");
    }

    const sortedComments = Array.isArray(data)
      ? [...data].sort((a, b) => {
        const dateA = new Date(a?.date || 0).getTime();
        const dateB = new Date(b?.date || 0).getTime();

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        return Number(b?.id || 0) - Number(a?.id || 0);
      })
      : [];

    setAuthStatus("Authenticated", "completed");
    render(sortedComments, { deleteComment });
  } catch (err) {
    msg.textContent = "Could not load comments.";
    setFeedback(String(err.message || err), "error");
    render([], { deleteComment });
  }
}

export async function addComment(title) {
  addButton.disabled = true;

  try {
    const date = new Date().toISOString();
    const currentUser = getCurrentUser();
    const fallbackEmail = emailInput?.value?.trim() || "";
    const fallbackName = fallbackEmail.includes("@")
      ? fallbackEmail.split("@")[0]
      : fallbackEmail;

    const res = await fetch(COMMENTS_API, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: title,
        title,
        name: currentUser?.name || fallbackName,
        username: currentUser?.email || fallbackEmail,
        date
      })
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      throw new Error("Session expired. Sign in again.");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Error publishing comment");
    }

    commentTitle.value = "";
    setFeedback("Comment posted", "completed");
    await getComments();
  } catch (err) {
    setFeedback(String(err.message || err), "error");
  } finally {
    addButton.disabled = false;
  }
}

export async function deleteComment(id) {
  try {
    const res = await fetch(`${COMMENTS_API}/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401 || res.status === 403) {
      throw new Error("Session expired. Sign in again.");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Error deleting comment");
    }

    setFeedback("Comment deleted", "completed");
    await getComments();
  } catch (err) {
    setFeedback(String(err.message || err), "error");
  }
}
