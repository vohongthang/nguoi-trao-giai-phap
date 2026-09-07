/*!
 * app.js — Logic cho trang cong-chuc-xa.html
 * Render 6 nhóm / 15 trợ lý AI từ js/ai-roles.js, quản lý API Key (LocalStorage),
 * đăng ký Service Worker + gợi ý cài đặt PWA.
 */
(function () {
  "use strict";

  // Nhóm theo cơ cấu tổ chức chính quyền địa phương 2 cấp (áp dụng từ 01/7/2025, sau khi
  // kết thúc hoạt động cấp huyện) — "note" ghi rõ lĩnh vực này nay thuộc phòng chuyên môn nào.
  var GROUPS = [
    { key: "vp-tk", label: "Văn Phòng HĐND - UBND", note: "Lĩnh vực Văn phòng" },
    { key: "dc-xd-mt", label: "Đất Đai - Xây Dựng - Môi Trường", note: "Thuộc Phòng Kinh tế, Hạ tầng và Đô thị" },
    { key: "tp-ht", label: "Tư Pháp - Hộ Tịch", note: "Thuộc Văn phòng HĐND - UBND" },
    { key: "vh-xh", label: "Văn Hóa - Xã Hội", note: "Phòng Văn Hóa - Xã Hội" },
    { key: "tc-kt", label: "Tài Chính - Kế Hoạch", note: "Thuộc Phòng Kinh tế, Hạ tầng và Đô thị" },
    { key: "qs-an", label: "Quân Sự & Trật Tự An Toàn Xã Hội", note: "Ban CHQS xã — phối hợp Công an xã" }
  ];

  function escHtml(s) {
    return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderGroupNav() {
    var nav = document.getElementById("groupNav");
    if (!nav) return;
    var html = "";
    GROUPS.forEach(function (g, i) {
      html += '<a href="#g-' + g.key + '">' + (i + 1) + ". " + escHtml(g.label) + "</a>";
    });
    nav.innerHTML = html;
  }

  function roleCardHtml(role) {
    var tag = role.outputMode === "document" ? "📄 Soạn văn bản" : "💬 Hỏi & nhận tư vấn";
    var href = "soan-thao-van-ban.html?role=" + encodeURIComponent(role.slug);
    return (
      '<div class="role-card">' +
      '<div class="ric">' + role.icon + "</div>" +
      '<span class="rtag">' + tag + "</span>" +
      "<h4>" + escHtml(role.title) + "</h4>" +
      "<p>" + escHtml(role.desc) + "</p>" +
      '<a class="btn btn-primary" href="' + href + '">🤖 Sử Dụng</a>' +
      "</div>"
    );
  }

  function renderGroups() {
    var mount = document.getElementById("roleGroups");
    if (!mount || !window.CTX_AI) return;
    var roles = window.CTX_AI.ROLES;
    var html = "";
    GROUPS.forEach(function (g, gi) {
      var groupRoles = roles.filter(function (r) { return r.group === g.key; });
      html += '<div class="role-group" id="g-' + g.key + '">';
      html += '<div class="role-group-head"><span class="gnum">' + (gi + 1) + '</span><div><h3>' + escHtml(g.label) + "</h3>" + (g.note ? '<span class="gnote">' + escHtml(g.note) + "</span>" : "") + "</div></div>";
      html += '<div class="role-grid">';
      groupRoles.forEach(function (r) { html += roleCardHtml(r); });
      html += "</div></div>";
    });
    mount.innerHTML = html;
    var countEl = document.getElementById("roleCount");
    if (countEl) countEl.textContent = roles.length;
  }

  // ---------------- API Key modal ----------------
  function refreshKeyUI() {
    var hasKey = !!(window.CTX_AI && window.CTX_AI.getApiKey());
    var pill = document.getElementById("keyPill");
    if (pill) {
      pill.classList.toggle("is-set", hasKey);
      pill.querySelector(".label").textContent = hasKey ? "Đã lưu Gemini API Key" : "Chưa nhập Gemini API Key";
    }
  }

  function openKeyModal() {
    var modal = document.getElementById("keyModal");
    if (!modal) return;
    var input = document.getElementById("keyInput");
    if (input) input.value = window.CTX_AI.getApiKey();
    modal.hidden = false;
  }
  function closeKeyModal() {
    var modal = document.getElementById("keyModal");
    if (modal) modal.hidden = true;
  }
  function saveKey() {
    var input = document.getElementById("keyInput");
    var val = input ? input.value.trim() : "";
    if (!val) {
      showToast("Vui lòng nhập API Key trước khi lưu.");
      return;
    }
    window.CTX_AI.setApiKey(val);
    refreshKeyUI();
    closeKeyModal();
    showToast("Đã lưu Gemini API Key trên máy này.");
  }
  function removeKey() {
    window.CTX_AI.clearApiKey();
    var input = document.getElementById("keyInput");
    if (input) input.value = "";
    refreshKeyUI();
    showToast("Đã xoá API Key khỏi trình duyệt này.");
  }

  // ---------------- Toast ----------------
  var toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
  }

  // ---------------- PWA install ----------------
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var banner = document.getElementById("installBanner");
    if (banner) banner.hidden = false;
  });
  window.addEventListener("appinstalled", function () {
    var banner = document.getElementById("installBanner");
    if (banner) banner.hidden = true;
    showToast("Đã cài đặt ứng dụng vào màn hình chính.");
  });

  function installApp() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      var banner = document.getElementById("installBanner");
      if (banner) banner.hidden = true;
    });
  }
  function dismissInstallBanner() {
    var banner = document.getElementById("installBanner");
    if (banner) banner.hidden = true;
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      // Đường dẫn tương đối để hoạt động đúng trên GitHub Pages (repo con-đường /nguoi-trao-giai-phap/).
      navigator.serviceWorker.register("sw.js").catch(function () {
        /* Không chặn trải nghiệm nếu SW đăng ký lỗi (vd. mở trực tiếp từ file://) */
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGroupNav();
    renderGroups();
    refreshKeyUI();
    registerServiceWorker();

    var openBtn = document.getElementById("openKeyModalBtn");
    if (openBtn) openBtn.addEventListener("click", openKeyModal);
    var pill = document.getElementById("keyPill");
    if (pill) pill.addEventListener("click", openKeyModal);
    var saveBtn = document.getElementById("saveKeyBtn");
    if (saveBtn) saveBtn.addEventListener("click", saveKey);
    var removeBtn = document.getElementById("removeKeyBtn");
    if (removeBtn) removeBtn.addEventListener("click", removeKey);
    var closeBtn = document.getElementById("closeKeyModalBtn");
    if (closeBtn) closeBtn.addEventListener("click", closeKeyModal);

    var installBtn = document.getElementById("installBtn");
    if (installBtn) installBtn.addEventListener("click", installApp);
    var dismissBtn = document.getElementById("dismissInstallBtn");
    if (dismissBtn) dismissBtn.addEventListener("click", dismissInstallBanner);
  });
})();
