/* ══════════════════════════════════════════
   RankNoir — Modal Onboarding Flow
   Vanilla JS · Fully isolated · No framework
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── State ─────────────────────────────── */
  const state = {
    activeOverlay: null,
  };

  /* ── Helpers ────────────────────────────── */
  function openModal(overlayId) {
    // Close any open modal first
    closeAllModals();

    const overlay = document.getElementById(overlayId);
    if (!overlay) return;

    overlay.classList.add('rn-active');
    document.body.style.overflow = 'hidden';
    state.activeOverlay = overlayId;

    // Trap focus inside modal
    const focusable = overlay.querySelectorAll(
      'button, input, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }

  function closeModal(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;
    overlay.classList.remove('rn-active');
    document.body.style.overflow = '';
    state.activeOverlay = null;
  }

  function closeAllModals() {
    document.querySelectorAll('.rn-overlay.rn-active').forEach(function (el) {
      el.classList.remove('rn-active');
    });
    document.body.style.overflow = '';
    state.activeOverlay = null;
  }

  function showSuccessPopup(message, callback) {
    const popup = document.getElementById('rnSuccessPopup');
    if (!popup) return;
    popup.textContent = '';
    // Re-add checkmark via CSS ::before — just set text
    popup.setAttribute('data-msg', message);
    popup.innerHTML = message;
    popup.classList.add('rn-show');

    setTimeout(function () {
      popup.classList.remove('rn-show');
      if (typeof callback === 'function') {
        setTimeout(callback, 300);
      }
    }, 1200);
  }

  /* ── Modal 1 — Connect GitHub ───────────── */
  function openModal1() {
    openModal('rnOverlay1');
  }

  function onConnectGitHub() {
    openModal('rnOverlay2');
  }

  /* ── Modal 2 — Repo Config ──────────────── */
  async function onConnect() {
  try {
    const data = {
      apiKey: document.getElementById("rnApiKey").value,
      repoPath: document.getElementById("rnRepoPath").value,
      filePath: document.getElementById("rnFilePath").value,
      siteUrl: document.getElementById("rnSiteUrl").value
    };

    const res = await fetch("/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    console.log("Response:", json);

    if (json.status === "connected") {
      rnCloseModal("rnOverlay2");
      rnOpenModal("rnOverlay3");
    }

  } catch (err) {
    console.error("Connect error:", err);
  }
}



  /* ── Modal 3 — Launch Agent ─────────────── */
  async function onLaunchAgent() {
  try {
    const st = document.getElementById("start");
    st.classList.add("hidden");
    startPolling();
    const keyword = document.getElementById("rnTargetKeyword").value;

    

    if (!keyword) return;

    const res = await fetch("/launch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ keyword })
    });

    const json = await res.json();
    console.log("Launch response:", json);

    // ✅ CLOSE MODAL IMMEDIATELY
    rnCloseModal("rnOverlay3");

    // ✅ SWITCH HERO
    const initial = document.getElementById("heroInitial");
    const demo = document.getElementById("heroDemo");

    if (initial && demo) {
      initial.classList.add("hidden");
      setTimeout(() => {
        demo.classList.add("active");
      }, 300);
    }

    // ✅ START STREAM POLLING
    pollStream();

  } catch (err) {
    console.error("Launch error:", err);
  }
}

  /* ── Hook Buttons ───────────────────────── */
  function hookLoginButtons() {
    // Nav CTA anchor
    const navCta = document.querySelector('.nav-item--cta');
    if (navCta) {
      navCta.addEventListener('click', function (e) {
        e.preventDefault();
        openModal1();
      });
    }

    // Hero "Login/Signup" btn-primary
    const heroCta = document.querySelector('.hero-cta-row .btn-primary');
    if (heroCta) {
      heroCta.addEventListener('click', function (e) {
        e.preventDefault();
        openModal1();
      });
    }

    // Final CTA "Login/Signup" button
    const finalCta = document.querySelector('.cta-main-btn');
    if (finalCta) {
      finalCta.addEventListener('click', function (e) {
        e.preventDefault();
        openModal1();
      });
    }

    // Mobile menu CTA
    const mobileCta = document.querySelector('.mobile-cta');
    if (mobileCta) {
      mobileCta.addEventListener('click', function (e) {
        e.preventDefault();
        openModal1();
      });
    }
  }

  /* ── Close on overlay click / Esc key ───── */
  function hookDismiss() {
    document.querySelectorAll('.rn-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeAllModals();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllModals();
    });
  }

  /* ── Expose click handlers for inline HTML ── */
  window.rnOpenModal = openModal;
  window.rnOpenModal1 = openModal1;
  window.rnOnConnectGitHub = onConnectGitHub;
  window.rnOnConnect = onConnect;
  window.rnOnLaunchAgent = onLaunchAgent;
  window.rnCloseModal = closeModal;
  window.rnCloseAllModals = closeAllModals;

  /* ── Init ────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    hookLoginButtons();
    hookDismiss();
  });
})();



let lastId = 0;
let pollInterval = null;

function startPolling() {
  if (pollInterval) return;

  pollInterval = setInterval(fetchResult, 2000);
}

async function fetchResult() {
  try {
    const res = await fetch(`/get-result?last_id=${lastId}`);
    const data = await res.json();

    if (data.status === "waiting") {
      return;
    }

    if (data.status === "new") {
      lastId = data.id;

      showResult(data.id);
    }

  } catch (err) {
    console.error(err);
  }
}

function showResult(id) {
  const container = document.getElementById(`result_container_${id}`);
  if (!container) return;


  container.classList.remove("hidden");

  setTimeout(() => {
    container.classList.add("show");
  }, 50);

  if(id==4){
    const container = document.getElementById(`result_container_${id}`);
    container.classList.remove("show");
    container.classList.remove("hidden");
    const demo = document.getElementById("heroDemo");
    demo.classList.remove("active");
    demo.classList.add("hidden");
    const re = document.getElementById("refresh");
    re.classList.remove("hidden");
    re.classList.add("active");
  }
  

  pollStream();
}

document.getElementById("launchAgentPreviewBtn").addEventListener("click", () => {
  const url = document.getElementById("rnSiteUrl").value;

  if (!url) {
    alert("Please enter a URL");
    return;
  }

  // add https if missing
  const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

  window.open(formattedUrl, "_blank"); // opens in new tab
});


const btn = document.getElementById("refreshBtn");

btn.addEventListener("click", async () => {
  btn.innerText = "⟳ Refreshing...";
  btn.disabled = true;

  location.reload();

  btn.innerText = "⟳ New Optimization";
  btn.disabled = false;
});