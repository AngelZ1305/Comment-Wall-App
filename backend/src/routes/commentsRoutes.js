const express = require("express");

function createCommentsRouter({ authenticateToken, commentsStore, users = [] }) {
  const router = express.Router();

  function normalizeIdentity(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getUserNameByEmail(email) {
    const normalizedEmail = normalizeIdentity(email);

    if (!normalizedEmail) return "";

    const matchedUser = users.find((user) => normalizeIdentity(user.email) === normalizedEmail);
    return String(matchedUser?.name || "").trim();
  }

  function formatCommentName(comment) {
    const storedName = String(comment?.name || "").trim();
    const username = String(comment?.username || "").trim();
    const lookedUpName = getUserNameByEmail(username);

    if (!storedName) return lookedUpName || "Usuario";
    if (storedName.includes("@")) return lookedUpName || storedName;
    return storedName;
  }

  router.use(authenticateToken);

  router.get("/", (req, res) => {
    const comments = commentsStore.getComments().map((comment) => ({
      ...comment,
      name: formatCommentName(comment)
    }));

    return res.json(comments);
  });

  router.post("/", (req, res) => {
    const { message, date } = req.body ?? {};
    const username = req.user?.email;
    const name = getUserNameByEmail(username) || req.user?.name || username;

    if (typeof username !== "string" || username.trim().length === 0) {
      return res.status(400).json({ error: "username es obligatorio y debe ser string" });
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "message es obligatorio y debe ser string" });
    }

    if (typeof date !== "string" || Number.isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: "date es obligatorio y debe ser ISO valido" });
    }

    const newComment = commentsStore.createComment({
      username,
      name,
      message,
      date
    });

    return res.status(201).json(newComment);
  });

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id invalido" });
    }

    const existingComment = commentsStore.getCommentById(id);

    if (!existingComment) {
      return res.status(404).json({ error: "comentario no encontrado" });
    }

    const authenticatedUser = normalizeIdentity(req.user?.email);
    const owner = normalizeIdentity(existingComment.username);

    if (!authenticatedUser || authenticatedUser !== owner) {
      return res.status(403).json({ error: "No puedes eliminar comentarios de otros usuarios" });
    }

    const deleted = commentsStore.deleteCommentById(id);

    if (!deleted) {
      return res.status(404).json({ error: "comentario no encontrado" });
    }

    return res.json({ message: "comentario eliminado", deleted });
  });

  return router;
}

module.exports = createCommentsRouter;
