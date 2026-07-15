
(function () {
  const phone = "60122145922";
  const message = "Hello REFIT, I would like to enquire about your design, renovation or project services.";
  const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  if (document.getElementById("refitWhatsappWidget")) return;

  const style = document.createElement("style");
  style.textContent = `
    .refit-whatsapp-widget {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 99999;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: 58px;
      padding: 0 18px 0 14px;
      border-radius: 999px;
      background: #25D366;
      color: #ffffff;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: -0.01em;
      text-decoration: none;
      box-shadow: 0 16px 42px rgba(37, 211, 102, 0.34), 0 12px 28px rgba(0, 0, 0, 0.28);
      border: 1px solid rgba(255,255,255,0.26);
      transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
    }
    .refit-whatsapp-widget:hover {
      transform: translateY(-3px);
      background: #20bd5a;
      box-shadow: 0 20px 50px rgba(37, 211, 102, 0.42), 0 14px 34px rgba(0, 0, 0, 0.34);
      color: #ffffff;
    }
    .refit-whatsapp-icon {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: rgba(255,255,255,0.18);
      flex: 0 0 auto;
    }
    .refit-whatsapp-icon svg {
      width: 22px;
      height: 22px;
      display: block;
      fill: currentColor;
    }
    .refit-whatsapp-widget::before {
      content: "";
      position: absolute;
      inset: -7px;
      border-radius: inherit;
      border: 1px solid rgba(37, 211, 102, 0.28);
      animation: refitWhatsappPulse 2.2s infinite;
      pointer-events: none;
    }
    @keyframes refitWhatsappPulse {
      0% { transform: scale(.92); opacity: .72; }
      70% { transform: scale(1.12); opacity: 0; }
      100% { transform: scale(1.12); opacity: 0; }
    }
    @media (max-width: 640px) {
      .refit-whatsapp-widget {
        right: 16px;
        bottom: 16px;
        min-height: 56px;
        width: 56px;
        padding: 0;
        justify-content: center;
      }
      .refit-whatsapp-widget span {
        display: none;
      }
      .refit-whatsapp-icon {
        background: transparent;
        width: 56px;
        height: 56px;
      }
      .refit-whatsapp-icon svg {
        width: 28px;
        height: 28px;
      }
    }
    @media print {
      .refit-whatsapp-widget {
        display: none !important;
      }
    }
  `;

  const link = document.createElement("a");
  link.id = "refitWhatsappWidget";
  link.className = "refit-whatsapp-widget";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", "Contact REFIT on WhatsApp");

  link.innerHTML = `
    <span class="refit-whatsapp-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" role="img">
        <path d="M16.02 3.2C8.98 3.2 3.25 8.86 3.25 15.82c0 2.24.6 4.43 1.74 6.36L3.14 28.8l6.83-1.78a12.9 12.9 0 0 0 6.05 1.52c7.04 0 12.77-5.66 12.77-12.62S23.06 3.2 16.02 3.2Zm0 23.22c-1.88 0-3.71-.5-5.32-1.46l-.38-.23-4.06 1.06 1.08-3.92-.26-.4a10.4 10.4 0 0 1-1.63-5.65c0-5.78 4.74-10.49 10.57-10.49 5.83 0 10.57 4.7 10.57 10.49 0 5.78-4.74 10.6-10.57 10.6Zm5.8-7.86c-.32-.16-1.9-.93-2.2-1.04-.3-.1-.51-.16-.72.16-.21.31-.83 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.49-2.57-1.56-.95-.84-1.59-1.88-1.78-2.2-.19-.31-.02-.48.14-.64.15-.14.32-.37.48-.56.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.72-1.72-.99-2.36-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.62s1.13 3.05 1.29 3.26c.16.21 2.23 3.36 5.4 4.71.75.32 1.34.51 1.8.65.76.24 1.45.21 2 .13.61-.09 1.9-.77 2.17-1.51.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z"/>
      </svg>
    </span>
    <span>WhatsApp REFIT</span>
  `;

  document.head.appendChild(style);
  document.body.appendChild(link);
})();
