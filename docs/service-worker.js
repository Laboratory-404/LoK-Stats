const build = [
  "/_app/start-9cbc9661.js",
  "/_app/pages/__layout.svelte-9157840a.js",
  "/_app/assets/pages/__layout.svelte-7ffc0ec9.css",
  "/_app/pages/__error.svelte-7bb1a22a.js",
  "/_app/pages/index.svelte-2a9db412.js",
  "/_app/pages/land-_id_.svelte-123779d4.js",
  "/_app/chunks/vendor-145a5310.js",
  "/_app/assets/vendor-dc80082f.css",
  "/_app/chunks/stores-c4323b93.js",
  "/_app/chunks/Land-67eec38b.js",
  "/_app/assets/Land-03e9a7c2.css"
];
const files = [
  "/favicon.png",
  "/images/logos/logo-lok-192.png",
  "/images/logos/logo-lok-256.png",
  "/images/logos/logo.png",
  "/manifest.webmanifest",
  "/robots.txt"
];
const version = "1648605697223";
const ASSETS = `cache${version}`;
const to_cache = build.concat(files);
const staticAssets = new Set(to_cache);
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(ASSETS).then((cache) => cache.addAll(to_cache)).then(() => {
    self.skipWaiting();
  }));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(async (keys) => {
    for (const key of keys) {
      if (key !== ASSETS)
        await caches.delete(key);
    }
    await self.clients.claim();
  }));
});
async function fetchAndCache(request) {
  const cache = await caches.open(`offline${version}`);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (err) {
    const response = await cache.match(request);
    if (response)
      return response;
    throw err;
  }
}
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range"))
    return;
  const url = new URL(event.request.url);
  const isHttp = url.protocol.startsWith("http");
  const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port;
  const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
  const skipBecauseUncached = event.request.cache === "only-if-cached" && !isStaticAsset;
  if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
    event.respondWith((async () => {
      const cachedAsset = isStaticAsset && await caches.match(event.request);
      return cachedAsset || fetchAndCache(event.request);
    })());
  }
});
//# sourceMappingURL=service-worker.js.map
