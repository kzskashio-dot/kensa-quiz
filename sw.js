const CACHE_NAME = 'microbio-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Tailwind CSSは外部CDNなので、ここでの指定だけでなく動的キャッシュも考慮が必要ですが
  // 簡易的にキャッシュリストに入れておきます（ブラウザのセキュリティ設定によってはcorsエラーになる場合があります）
  'https://cdn.tailwindcss.com'
];

// インストール処理：キャッシュへの保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ処理：オフライン対応（キャッシュがあればそれを返す）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークに取りに行く
        return fetch(event.request);
      })
  );
});

// 更新処理：古いキャッシュの削除
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});