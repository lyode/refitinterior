
(function () {
  const phone = "60122145922";
  const message = "Hello REFIT, I would like to enquire about your design, renovation or project services.";
  const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  const oldButton = document.getElementById("refitWhatsappWidget");
  if (oldButton) oldButton.remove();

  const oldStyle = document.getElementById("refitWhatsappWidgetStyle");
  if (oldStyle) oldStyle.remove();

  const style = document.createElement("style");
  style.id = "refitWhatsappWidgetStyle";
  style.textContent = `
    #refitWhatsappWidget {
      position: fixed !important;
      right: 14px !important;
      bottom: 14px !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 38px !important;
      height: 38px !important;
      min-width: 38px !important;
      min-height: 38px !important;
      padding: 0 !important;
      border-radius: 50% !important;
      background: #25D366 !important;
      color: #ffffff !important;
      border: 1px solid rgba(255,255,255,.36) !important;
      box-shadow: 0 10px 24px rgba(37,211,102,.26), 0 8px 20px rgba(0,0,0,.22) !important;
      text-decoration: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      transform: translateY(0) scale(1) !important;
      transition: opacity .22s ease, transform .22s ease, visibility .22s ease, background .2s ease !important;
      overflow: visible !important;
    }

    #refitWhatsappWidget:hover {
      background: #20bd5a !important;
      transform: translateY(-2px) scale(1.03) !important;
    }

    #refitWhatsappWidget.refit-wa-hidden {
      opacity: 0 !important;
      visibility: hidden !important;
      transform: translateY(18px) scale(.82) !important;
      pointer-events: none !important;
    }

    #refitWhatsappWidget .refit-wa-icon {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
      height: 100% !important;
      border-radius: 50% !important;
      background: transparent !important;
      color: #ffffff !important;
      overflow: visible !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    #refitWhatsappWidget .refit-wa-icon svg {
      display: block !important;
      width: 21px !important;
      height: 21px !important;
      fill: #ffffff !important;
      color: #ffffff !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    #refitWhatsappWidget .refit-wa-text {
      display: none !important;
    }

    #refitWhatsappWidget::before {
      content: "" !important;
      position: absolute !important;
      inset: -4px !important;
      border-radius: 50% !important;
      border: 1px solid rgba(37,211,102,.20) !important;
      animation: refitWaPulse 2.6s infinite !important;
      pointer-events: none !important;
    }

    #refitWhatsappWidget.refit-wa-hidden::before {
      animation: none !important;
      opacity: 0 !important;
    }

    @keyframes refitWaPulse {
      0% { transform: scale(.94); opacity: .45; }
      70% { transform: scale(1.18); opacity: 0; }
      100% { transform: scale(1.18); opacity: 0; }
    }

    @media (min-width: 641px) {
      #refitWhatsappWidget {
        right: 20px !important;
        bottom: 20px !important;
        width: 46px !important;
        height: 46px !important;
        min-width: 46px !important;
        min-height: 46px !important;
      }

      #refitWhatsappWidget .refit-wa-icon svg {
        width: 24px !important;
        height: 24px !important;
      }
    }

    @media print {
      #refitWhatsappWidget {
        display: none !important;
      }
    }
  `;

  const link = document.createElement("a");
  link.id = "refitWhatsappWidget";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", "Contact REFIT on WhatsApp");

  link.innerHTML = `
    <div class="refit-wa-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" role="img">
        <path d="M16.02 3.2C8.98 3.2 3.25 8.86 3.25 15.82c0 2.24.6 4.43 1.74 6.36L3.14 28.8l6.83-1.78a12.9 12.9 0 0 0 6.05 1.52c7.04 0 12.77-5.66 12.77-12.62S23.06 3.2 16.02 3.2Zm0 23.22c-1.88 0-3.71-.5-5.32-1.46l-.38-.23-4.06 1.06 1.08-3.92-.26-.4a10.4 10.4 0 0 1-1.63-5.65c0-5.78 4.74-10.49 10.57-10.49 5.83 0 10.57 4.7 10.57 10.49 0 5.78-4.74 10.6-10.57 10.6Zm5.8-7.86c-.32-.16-1.9-.93-2.2-1.04-.3-.1-.51-.16-.72.16-.21.31-.83 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.49-2.57-1.56-.95-.84-1.59-1.88-1.78-2.2-.19-.31-.02-.48.14-.64.15-.14.32-.37.48-.56.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.72-1.72-.99-2.36-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.62s1.13 3.05 1.29 3.26c.16.21 2.23 3.36 5.4 4.71.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.9-.77 2.17-1.51.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"/>
      </svg>
    </div>
    <span class="refit-wa-text">WhatsApp</span>
  `;

  document.head.appendChild(style);
  document.body.appendChild(link);

  let scrollTimer = null;
  function hideWhileScrolling() {
    link.classList.add("refit-wa-hidden");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      link.classList.remove("refit-wa-hidden");
    }, 650);
  }

  window.addEventListener("scroll", hideWhileScrolling, { passive: true });
})();
