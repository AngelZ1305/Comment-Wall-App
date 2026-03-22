import { setAuthStatus } from "./modules/feedback.js";
import { bindEvents } from "./modules/events.js";
import { getComments } from "./modules/comments.js";
import { initDeleteModal } from "./modules/deleteModal.js";

async function bootstrap() {
  try {
    await initDeleteModal();
  } catch (err) {
    console.error(err);
  }

  bindEvents();
  setAuthStatus("Not authenticated", "error");
  getComments();
}

bootstrap();
