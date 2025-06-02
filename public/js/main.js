document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form"); // Or use a more specific selector if needed
  const spinner = document.getElementById("spinner-overlay");

  if (form && spinner) {
    form.addEventListener("submit", () => {
      spinner.style.display = "flex";
    });
  }
});
