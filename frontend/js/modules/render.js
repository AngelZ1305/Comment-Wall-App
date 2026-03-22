import { msg, progressText, commentList } from "./dom.js";
import { confirmDelete } from "./deleteModal.js";
import { getCurrentUser } from "./session.js";

function normalizeIdentity(value) {
  return String(value || "").trim().toLowerCase();
}

function canDeleteComment(comment) {
  const currentUserEmail = normalizeIdentity(getCurrentUser()?.email);
  const commentOwner = normalizeIdentity(comment?.username);

  return Boolean(currentUserEmail) && currentUserEmail === commentOwner;
}

function formatDate(isoDate) {
  if (!isoDate) return "";

  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) return "";

  const now = Date.now();
  const diffMs = now - parsedDate.getTime();
  const safeDiffMs = Math.max(0, diffMs);

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (safeDiffMs < minuteMs) return "Just now";

  if (safeDiffMs < hourMs) {
    const minutes = Math.floor(safeDiffMs / minuteMs);
    return `${minutes} min ago`;
  }

  if (safeDiffMs < dayMs) {
    const hours = Math.floor(safeDiffMs / hourMs);
    return `${hours} h ago`;
  }

  const days = Math.floor(safeDiffMs / dayMs);
  return `${days} d ago`;
}

function updateCommentCounter(total) {
  if (progressText) {
    progressText.textContent = `${total} comment${total === 1 ? "" : "s"}`;
  }
}

export function render(comments, actions) {
  const safeComments = Array.isArray(comments) ? comments : [];

  commentList.innerHTML = "";
  updateCommentCounter(safeComments.length);

  if (safeComments.length === 0) {
    msg.textContent = "No comments yet. Be the first to post.";
    return;
  }

  msg.textContent = "";
  for (const comment of safeComments) {
    const li = document.createElement("li");

    const left = document.createElement("div");
    left.className = "left";

    const commentHeader = document.createElement("div");
    commentHeader.className = "comment-header";

    const username = document.createElement("span");
    username.className = "comment-user";
    username.textContent = comment.name || "User";

    const date = document.createElement("span");
    date.className = "comment-date";
    date.textContent = formatDate(comment.date) || "No date";

    commentHeader.appendChild(username);
    commentHeader.appendChild(date);

    const title = document.createElement("p");
    title.className = "title";
    title.textContent = comment.message || comment.title || "";

    left.appendChild(commentHeader);
    left.appendChild(title);

    li.appendChild(left);

    if (canDeleteComment(comment)) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.setAttribute("aria-label", "Delete comment");
      deleteButton.title = "Delete comment";
      deleteButton.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"/>
        </svg>
      `;

      deleteButton.addEventListener("click", async () => {
        const confirmed = await confirmDelete();
        if (!confirmed) return;
        await actions.deleteComment(comment.id);
      });

      li.appendChild(deleteButton);
    }

    commentList.appendChild(li);
  }
}
