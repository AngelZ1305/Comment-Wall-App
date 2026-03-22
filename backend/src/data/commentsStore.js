let comments = [];

let nextId = 2;

function getComments() {
  return comments;
}

function getCommentById(id) {
  return comments.find((comment) => comment.id === id) || null;
}

function createComment({ username, name, message, date }) {
  const normalizedUsername = String(username || "").trim();
  const normalizedName = String(name).trim();
  const normalizedMessage = String(message || "").trim();

  const newComment = {
    id: nextId++,
    username: normalizedUsername,
    name: normalizedName,
    message: normalizedMessage,
    date
  };

  comments.push(newComment);
  return newComment;
}

function deleteCommentById(id) {
  const index = comments.findIndex((comment) => comment.id === id);

  if (index === -1) {
    return null;
  }

  return comments.splice(index, 1)[0];
}

module.exports = {
  getComments,
  getCommentById,
  createComment,
  deleteCommentById
};
