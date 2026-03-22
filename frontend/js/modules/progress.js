import { progressText } from "./dom.js";

export function updateProgress(comments) {
  const total = comments.length;
  const completed = comments.filter((comment) => comment.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (progressText) {
    progressText.textContent = percent + "%";
  }
}
