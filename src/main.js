const app = document.querySelector("#app");

if (app) {
  app.innerHTML = `
    <main class="page">
      <section class="hero" aria-labelledby="brand">
        <img src="/P.svg" alt="print.fun" class="logo" />
        <h1 id="brand" class="visually-hidden">print.fun</h1>
      </section>
      <nav class="links" aria-label="Liens">
        <a href="https://x.com/printfun_" target="_blank" rel="noreferrer noopener">X</a>
        <a href="https://dexscreener.com/solana/91fpaxonom2ywwk6t4awxkj8gexh6av6tlji41hft8fb" target="_blank" rel="noreferrer noopener">DexScreener</a>
        <a href="https://print.rest" target="_blank" rel="noreferrer noopener">print.rest</a>
        <a href="https://t.me/gotoprint" target="_blank" rel="noreferrer noopener">Telegram</a>
        <a href="https://form.typeform.com/to/lDIkB7Gv" target="_blank" rel="noreferrer noopener">Waitlist</a>
      </nav>
    </main>
  `;
}
