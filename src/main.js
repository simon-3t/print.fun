import "./style.css";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App container not found");
}

app.innerHTML = `
  <main class="page">
    <section class="hero">
      <img src="/P.svg" alt="print.fun logo" class="logo" width="220" height="220" />
      <div>
        <h1>print.fun</h1>
        <p>Une collection d'expériences créatives autour de l'impression et du code.</p>
      </div>
    </section>
    <nav class="links" aria-label="Liens principaux">
      <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
      <a href="https://twitter.com/" target="_blank" rel="noreferrer">Twitter</a>
      <a href="mailto:hello@print.fun">Contact</a>
    </nav>
  </main>
`;
