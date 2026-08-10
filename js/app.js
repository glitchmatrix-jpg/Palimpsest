document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      window.alert(
        action === "read"
          ? "Reading mode will be built next."
          : "Learning mode will be built next."
      );
    });
  });
});
