(function () {
  if (window.REFIT_IRIS_AI_READY) return;
  window.REFIT_IRIS_AI_READY = true;

  const IRIS_ENDPOINT = "https://asia-southeast1-refit-digital-tools.cloudfunctions.net/irisChat";
  const STORAGE_KEY = "refit_iris_ai_history_v1";
  const MAX_HISTORY = 12;

  let isOpen = false;
  let isBusy = false;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.slice(-MAX_HISTORY) : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
    } catch (error) {}
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .iris-ai-root{
        position:fixed;
        left:18px;
        bottom:22px;
        z-index:9998;
        font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }

      .iris-ai-button{
        width:64px;
        height:64px;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.18);
        background:
          radial-gradient(circle at 32% 24%, rgba(255,255,255,.35), transparent 26%),
          linear-gradient(145deg,#40121f,#111116 60%,#8a5b24);
        color:#fff;
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;
        box-shadow:0 18px 46px rgba(0,0,0,.45);
        transition:transform .25s ease, box-shadow .25s ease, filter .25s ease;
      }

      .iris-ai-button:hover{
        transform:translateY(-3px);
        box-shadow:0 22px 56px rgba(0,0,0,.55);
        filter:brightness(1.06);
      }

      .iris-ai-mark{
        width:38px;
        height:38px;
        border-radius:999px;
        background:
          radial-gradient(circle at 50% 48%, #fff 0 18%, #d9b46a 19% 26%, #7b2037 27% 42%, #16161b 43% 100%);
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);
      }

      .iris-ai-panel{
        position:absolute;
        left:0;
        bottom:82px;
        width:min(380px,calc(100vw - 34px));
        height:min(560px,calc(100vh - 126px));
        display:none;
        overflow:hidden;
        border-radius:24px;
        background:linear-gradient(180deg,rgba(22,22,26,.98),rgba(8,8,10,.98));
        border:1px solid rgba(255,255,255,.14);
        box-shadow:0 28px 80px rgba(0,0,0,.58);
      }

      .iris-ai-panel.open{
        display:flex;
        flex-direction:column;
      }

      .iris-ai-head{
        padding:18px 18px 14px;
        border-bottom:1px solid rgba(255,255,255,.1);
        background:
          radial-gradient(circle at 15% 0%, rgba(138,91,36,.35), transparent 34%),
          radial-gradient(circle at 85% 0%, rgba(122,32,55,.35), transparent 34%);
      }

      .iris-ai-title{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
      }

      .iris-ai-title strong{
        color:#fff;
        font-size:15px;
        letter-spacing:.02em;
      }

      .iris-ai-title span{
        display:block;
        margin-top:3px;
        color:rgba(255,255,255,.62);
        font-size:12px;
      }

      .iris-ai-close{
        border:0;
        background:rgba(255,255,255,.08);
        color:#fff;
        width:30px;
        height:30px;
        border-radius:999px;
        cursor:pointer;
      }

      .iris-ai-intro{
        margin-top:12px;
        color:rgba(255,255,255,.74);
        font-size:12.5px;
        line-height:1.55;
      }

      .iris-ai-messages{
        flex:1;
        overflow:auto;
        padding:16px;
        scroll-behavior:smooth;
      }

      .iris-ai-msg{
        display:flex;
        margin:0 0 12px;
      }

      .iris-ai-msg.user{
        justify-content:flex-end;
      }

      .iris-ai-bubble{
        max-width:86%;
        padding:11px 13px;
        border-radius:17px;
        font-size:13px;
        line-height:1.55;
        white-space:pre-wrap;
        word-break:break-word;
      }

      .iris-ai-msg.assistant .iris-ai-bubble{
        color:rgba(255,255,255,.86);
        background:rgba(255,255,255,.075);
        border:1px solid rgba(255,255,255,.08);
        border-bottom-left-radius:7px;
      }

      .iris-ai-msg.user .iris-ai-bubble{
        color:#23180d;
        background:linear-gradient(135deg,#f7d87a,#d9a643);
        border-bottom-right-radius:7px;
      }

      .iris-ai-suggestions{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        padding:0 16px 12px;
      }

      .iris-ai-chip{
        border:1px solid rgba(255,255,255,.12);
        background:rgba(255,255,255,.06);
        color:rgba(255,255,255,.76);
        border-radius:999px;
        padding:8px 10px;
        font-size:11.5px;
        cursor:pointer;
      }

      .iris-ai-form{
        display:flex;
        gap:8px;
        padding:12px;
        border-top:1px solid rgba(255,255,255,.1);
        background:rgba(0,0,0,.22);
      }

      .iris-ai-input{
        flex:1;
        min-height:42px;
        max-height:96px;
        resize:none;
        border:1px solid rgba(255,255,255,.12);
        border-radius:16px;
        background:rgba(255,255,255,.06);
        color:#fff;
        padding:11px 12px;
        outline:none;
        font:inherit;
        font-size:13px;
        line-height:1.45;
      }

      .iris-ai-input::placeholder{
        color:rgba(255,255,255,.42);
      }

      .iris-ai-send{
        width:46px;
        border:0;
        border-radius:16px;
        cursor:pointer;
        background:linear-gradient(135deg,#f4ce6b,#9b662b);
        color:#201409;
        font-weight:800;
      }

      .iris-ai-send:disabled{
        opacity:.5;
        cursor:not-allowed;
      }

      .iris-ai-small{
        padding:0 16px 12px;
        color:rgba(255,255,255,.42);
        font-size:10.5px;
        line-height:1.4;
      }

      @media(max-width:640px){
        .iris-ai-root{
          left:14px;
          bottom:16px;
        }

        .iris-ai-button{
          width:58px;
          height:58px;
        }

        .iris-ai-panel{
          bottom:74px;
          height:min(560px,calc(100vh - 108px));
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createMessage(role, text, typing) {
    const messages = document.querySelector(".iris-ai-messages");
    const row = document.createElement("div");
    row.className = "iris-ai-msg " + role;

    const bubble = document.createElement("div");
    bubble.className = "iris-ai-bubble";
    row.appendChild(bubble);
    messages.appendChild(row);

    if (typing) {
      typeText(bubble, text);
    } else {
      bubble.textContent = text;
    }

    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  function typeText(element, text) {
    let i = 0;
    element.textContent = "";

    function step() {
      element.textContent += text.charAt(i);
      i += 1;

      const messages = document.querySelector(".iris-ai-messages");
      if (messages) messages.scrollTop = messages.scrollHeight;

      if (i < text.length) {
        setTimeout(step, 18);
      }
    }

    step();
  }

  function showThinking() {
    return createMessage("assistant", "Iris is reading your message softly...", false);
  }

  async function sendToIris(message) {
    const history = loadHistory();

    const response = await fetch(IRIS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        history
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Iris could not respond.");
    }

    return data.reply || "I’m here. Could you share a little more with me?";
  }

  async function handleSend(text) {
    const message = String(text || "").trim();
    if (!message || isBusy) return;

    isBusy = true;

    const input = document.querySelector(".iris-ai-input");
    const send = document.querySelector(".iris-ai-send");

    if (input) input.value = "";
    if (send) send.disabled = true;

    createMessage("user", message, false);
    const thinking = showThinking();

    try {
      const reply = await sendToIris(message);

      thinking.remove();
      createMessage("assistant", reply, true);

      const history = loadHistory();
      history.push({ role: "user", content: message });
      history.push({ role: "assistant", content: reply });
      saveHistory(history);
    } catch (error) {
      thinking.remove();
      createMessage(
        "assistant",
        "I’m sorry, I could not respond properly just now. Please try again in a moment, or WhatsApp REFIT directly if your matter is urgent.",
        true
      );
    } finally {
      isBusy = false;
      if (send) send.disabled = false;
      if (input) input.focus();
    }
  }

  function init() {
    injectStyles();

    const root = document.createElement("div");
    root.className = "iris-ai-root";
    root.innerHTML = `
      <section class="iris-ai-panel" aria-label="Iris AI assistant">
        <div class="iris-ai-head">
          <div class="iris-ai-title">
            <div>
              <strong>Iris — REFIT’s Operations Director</strong>
              <span>Soft guidance for services, tools, pricing and next steps</span>
            </div>
            <button class="iris-ai-close" type="button" aria-label="Close Iris">×</button>
          </div>
          <div class="iris-ai-intro">
            Hi, I’m Iris. I’ll help you understand REFIT clearly — no pressure to buy, only the next step that makes sense.
          </div>
        </div>

        <div class="iris-ai-messages"></div>

        <div class="iris-ai-suggestions">
          <button class="iris-ai-chip" type="button">I feel unsure where to start.</button>
          <button class="iris-ai-chip" type="button">Explain REFIT digital tools.</button>
          <button class="iris-ai-chip" type="button">Is RM99 Check suitable for me?</button>
        </div>

        <form class="iris-ai-form">
          <textarea class="iris-ai-input" rows="1" maxlength="700" placeholder="Talk to Iris..."></textarea>
          <button class="iris-ai-send" type="submit">➤</button>
        </form>

        <div class="iris-ai-small">
          Iris gives general guidance first. For confirmed pricing, site details or urgent work, REFIT may continue by WhatsApp.
        </div>
      </section>

      <button class="iris-ai-button" type="button" aria-label="Open Iris">
        <span class="iris-ai-mark"></span>
      </button>
    `;

    document.body.appendChild(root);

    const panel = root.querySelector(".iris-ai-panel");
    const openBtn = root.querySelector(".iris-ai-button");
    const closeBtn = root.querySelector(".iris-ai-close");
    const form = root.querySelector(".iris-ai-form");
    const input = root.querySelector(".iris-ai-input");

    function openIris() {
      isOpen = true;
      panel.classList.add("open");

      if (!panel.dataset.started) {
        panel.dataset.started = "yes";
        createMessage(
          "assistant",
          "Hi, I’m Iris. Tell me what you are trying to do — renovate a space, check a project, understand REFIT tools, or simply find the safest first step.",
          true
        );
      }

      setTimeout(() => input.focus(), 120);
    }

    function closeIris() {
      isOpen = false;
      panel.classList.remove("open");
    }

    openBtn.addEventListener("click", () => {
      if (isOpen) closeIris();
      else openIris();
    });

    closeBtn.addEventListener("click", closeIris);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleSend(input.value);
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend(input.value);
      }
    });

    root.querySelectorAll(".iris-ai-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        openIris();
        handleSend(chip.textContent);
      });
    });
  }

  ready(init);
})();
