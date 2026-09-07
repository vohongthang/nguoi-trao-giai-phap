/*!
 * sw.js — Service Worker cho "Trung Tâm Trợ Lý AI & Văn Bản Chuyên Môn Công Chức Xã"
 *
 * QUAN TRỌNG: file này nằm ở thư mục gốc của repo nên phạm vi đăng ký mặc định bao trùm
 * TOÀN BỘ site (index.html, soan-thao-van-ban.html, các trang gian hàng khác...). Để KHÔNG
 * ảnh hưởng tới các trang khác đang hoạt động tốt, Service Worker này CHỈ chủ động can thiệp
 * (cache/offline) với đúng các file thuộc "app shell" của cong-chuc-xa.html liệt kê bên dưới —
 * mọi request khác được bỏ qua hoàn toàn (không gọi respondWith), coi như SW không tồn tại.
 */
"use strict";

var CACHE_VERSION = "ctx-app-v1";
var APP_SHELL = [
  "cong-chuc-xa.html",
  "soan-thao-van-ban.html",
  "css/style.css",
  "js/app.js",
  "js/ai-roles.js",
  "manifest.json",
  "favicon-192.png",
  "favicon-180.png",
  "favicon-32.png"
];

function isAppShellRequest(url) {
  for (var i = 0; i < APP_SHELL.length; i++) {
    if (url.indexOf(APP_SHELL[i]) !== -1) return true;
  }
  return false;
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(APP_SHELL).catch(function () {
        /* Bỏ qua lỗi cache-lúc-cài (vd. offline lần đầu) — không chặn cài đặt SW */
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) { return k.indexOf("ctx-app-") === 0 && k !== CACHE_VERSION; })
          .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return; // không can thiệp POST (vd gọi Gemini API)
  if (!isAppShellRequest(req.url)) return; // để trình duyệt tự xử lý mọi trang/tài nguyên khác

  event.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req)
        .then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE_VERSION).then(function (cache) { cache.put(req, copy); });
          }
          return res;
        })
        .catch(function () { return cached; });
      return cached || network;
    })
  );
});
