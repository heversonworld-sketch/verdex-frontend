/* =========================================================
   VERDEX SERVICE WORKER — GOD MODE v2
   Offline • Cache Inteligente • PWA Profissional
   Compatível com Vite (Build Hash)
   ========================================================= */

/* =========================
   CONFIGURAÇÕES GLOBAIS
   ========================= */

const APP_NAME = "verdex";
const VERSION = "v1.0.0"; // 🔁 só muda quando quiser forçar update geral

const CACHE_STATIC = `${APP_NAME}-static-${VERSION}`;
const CACHE_DYNAMIC = `${APP_NAME}-dynamic-${VERSION}`;
const CACHE_PAGES = `${APP_NAME}-pages-${VERSION}`;

// Limite de cache dinâmico (evita crescimento infinito)
const DYNAMIC_CACHE_LIMIT = 60;

/* =========================
   ASSETS ESSENCIAIS
   ========================= */

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/vite.svg",
];

/* =========================================================
   INSTALL — Pré-cache crítico
   ========================================================= */
self.addEventListener("install", (event) => {
  console.log("🟢 VERDEX SW: Install");

  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

/* =========================================================
   ACTIVATE — Limpeza inteligente
   ========================================================= */
self.addEventListener("activate", (event) => {
  console.log("🟢 VERDEX SW: Activate");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (
            ![CACHE_STATIC, CACHE_DYNAMIC, CACHE_PAGES].includes(key)
          ) {
            console.log("🧹 Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* =========================================================
   FETCH — Estratégias Profissionais
   ========================================================= */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ❌ Ignora métodos não GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // ❌ Ignora extensões não HTTP
  if (!url.protocol.startsWith("http")) return;

  // 🔥 API / Backend → Network First
  if (url.pathname.startsWith("/api")) {
    event.respondWith(networkFirst(req));
    return;
  }

  // 🧠 Assets estáticos (JS, CSS, IMG) → Cache First
  if (
    url.pathname.match(
      /\.(js|css|png|jpg|jpeg|svg|webp|woff2|ttf|ico)$/
    )
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // 🌍 Rotas SPA (React/Vite) → Network First com fallback
  event.respondWith(pageStrategy(req));
});

/* =========================================================
   ESTRATÉGIAS DE CACHE
   ========================================================= */

// 🧠 CACHE FIRST — rápido e offline
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_STATIC);
  const cached = await cache.match(request);

  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    return caches.match("/index.html");
  }
}

// 🌱 NETWORK FIRST — dados atualizados
async function networkFirst(request) {
  const cache = await caches.open(CACHE_DYNAMIC);

  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    limitCacheSize(cache, DYNAMIC_CACHE_LIMIT);
    return fresh;
  } catch (err) {
    const cached = await cache.match(request);
    return (
      cached ||
      new Response(
        JSON.stringify({ offline: true }),
        { headers: { "Content-Type": "application/json" } }
      )
    );
  }
}

// 🌍 PÁGINAS SPA — fallback seguro
async function pageStrategy(request) {
  const cache = await caches.open(CACHE_PAGES);

  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(request);
    return cached || caches.match("/index.html");
  }
}

/* =========================================================
   UTIL — Limita tamanho do cache
   ========================================================= */
async function limitCacheSize(cache, maxItems) {
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    limitCacheSize(cache, maxItems);
  }
}

/* =========================================================
   LISTENER EXTRA — Atualização silenciosa
   ========================================================= */
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
