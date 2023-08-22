self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open("tictactoe");
    await cache.addAll([
      "//cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css",
      "//unpkg.com/react@16.3.1/umd/react.production.min.js",
      "//unpkg.com/react-dom@16.3.1/umd/react-dom.production.min.js",
      "./",
      "./icon.png",
      "./icon.svg",
      "./index.css",
      "./index.js",
      "./manifest.webmanifest",
    ]);
  })());
});
self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    const {request} = event;
    const cache = await caches.open("tictactoe");
    const response = (await cache.match(request)) ?? (await fetch(request));
    return response;
  })());
});
