let resolver = null;

export async function initDeleteModal() {
  if (document.getElementById("deleteModal")) return;

  const res = await fetch("../modal/delete-modal.html");
  if (!res.ok) {
    throw new Error("Could not load delete modal");
  }

  const html = await res.text();
  document.body.insertAdjacentHTML("beforeend", html);

  const backdrop = document.getElementById("deleteModal");
  const cancelButton = document.getElementById("cancelDeleteButton");
  const confirmButton = document.getElementById("confirmDeleteButton");

  const closeWith = (value) => {
    backdrop.classList.add("hidden");
    if (resolver) {
      resolver(value);
      resolver = null;
    }
  };

  cancelButton.addEventListener("click", () => closeWith(false));
  confirmButton.addEventListener("click", () => closeWith(true));
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeWith(false);
  });
}

export function confirmDelete() {
  const backdrop = document.getElementById("deleteModal");
  if (!backdrop) return Promise.resolve(false);

  backdrop.classList.remove("hidden");
  return new Promise((resolve) => {
    resolver = resolve;
  });
}
