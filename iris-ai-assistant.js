(function () {
  if (window.REFIT_IRIS_AI_READY) return;
  window.REFIT_IRIS_AI_READY = true;

  const IRIS_ENDPOINT = "https://asia-southeast1-refit-digital-tools.cloudfunctions.net/irisChat";
  const STORAGE_KEY = "refit_iris_ai_history_v1";
  const MAX_HISTORY = 12;

  let isOpen = false;
  let isBusy = false;

    let selectedIrisImages = [];

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read image."));

      reader.readAsDataURL(file);
    });
  }

  async function prepareIrisImages(files) {
    const imageFiles = Array.from(files || []).slice(0, 2);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    const prepared = [];

    for (const file of imageFiles) {
      if (!allowedTypes.includes(file.type)) {
        alert("Iris can accept JPG, PNG or WEBP images only.");
        continue;
      }

      if (file.size > maxSize) {
        alert("Each image must be below 5MB.");
        continue;
      }

      const dataUrl = await fileToDataUrl(file);

      prepared.push({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl
      });
    }

    return prepared;
  }

  function updateIrisImagePreview() {
    const preview = document.querySelector(".iris-ai-image-preview");
    if (!preview) return;

    if (!selectedIrisImages.length) {
      preview.innerHTML = "";
      preview.style.display = "none";
      return;
    }

    preview.style.display = "flex";
    preview.innerHTML = selectedIrisImages
      .map((image, index) => `
        <div class="iris-ai-image-chip">
          <span>Image ${index + 1}</span>
          <button type="button" data-iris-remove-image="${index}">×</button>
        </div>
      `)
      .join("");

    preview.querySelectorAll("[data-iris-remove-image]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.getAttribute("data-iris-remove-image"));
        selectedIrisImages.splice(index, 1);
        updateIrisImagePreview();
      });
    });
  }

    let irisAudioContext = null;
  let lastKeySoundAt = 0;

  function getIrisAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      if (!irisAudioContext) {
        irisAudioContext = new AudioContextClass();
      }

      if (irisAudioContext.state === "suspended") {
        irisAudioContext.resume().catch(() => {});
      }

      return irisAudioContext;
    } catch (error) {
      return null;
    }
  }

  function unlockIrisSound() {
    getIrisAudioContext();
  }

  function playSoftKeyboardSound() {
    const now = Date.now();

    if (now - lastKeySoundAt < 60) return;
    lastKeySoundAt = now;

    try {
      const audio = getIrisAudioContext();
      if (!audio || audio.state !== "running") return;

      const oscillator = audio.createOscillator();
      const gain = audio.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(820 + Math.random() * 120, audio.currentTime);

      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.015, audio.currentTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.045);

      oscillator.connect(gain);
      gain.connect(audio.destination);

      oscillator.start(audio.currentTime);
      oscillator.stop(audio.currentTime + 0.05);
    } catch (error) {}
  }

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
      body.iris-ai-open{
        overflow:hidden;
      }
body.iris-ai-open #refitWhatsappWidget{
  opacity:0 !important;
  visibility:hidden !important;
  pointer-events:none !important;
  transform:translateY(18px) scale(.82) !important;
}

body.iris-ai-open #refitWhatsappWidget::before{
  animation:none !important;
  opacity:0 !important;
}
      .iris-ai-root{
  position:fixed;
  right:20px;
  bottom:78px;
  left:auto;
  z-index:2147483646;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}

      .iris-ai-button{
        width:52px;
        height:52px;
        border-radius:999px;
        border:1px solid rgba(255,224,128,.74);
        background:
          radial-gradient(circle at 34% 28%, rgba(255,255,255,.78), transparent 18%),
          radial-gradient(circle at 50% 50%, #fff1a8 0 12%, #f5ca49 13% 34%, #c88419 35% 58%, #421414 59% 100%);
        color:#fff;
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;
        position:relative;
        overflow:visible;
        box-shadow:
          0 0 0 1px rgba(255,227,135,.72),
          0 0 12px rgba(255,205,80,.38),
          0 0 26px rgba(255,205,80,.22),
          0 18px 46px rgba(0,0,0,.45);
        transition:transform .25s ease, box-shadow .25s ease, filter .25s ease;
      }

      .iris-ai-button:hover{
        transform:translateY(-3px) scale(1.02);
        box-shadow:
          0 0 0 1px rgba(255,227,135,.9),
          0 0 16px rgba(255,205,80,.48),
          0 0 34px rgba(255,205,80,.28),
          0 22px 56px rgba(0,0,0,.55);
        filter:brightness(1.05);
      }

      .iris-ai-mark{
        width:25px;
        height:25px;
        border-radius:999px;
        background:
          radial-gradient(circle at 50% 50%, #fff 0 13%, #ffd75c 14% 28%, #a93445 29% 48%, #18080d 49% 100%);
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.35),
          0 0 12px rgba(255,213,92,.55);
      }

      .iris-ai-label{
        position:absolute;
        left:auto;
        right:60px;
        top:50%;
        transform:translateY(-50%);
        white-space:nowrap;
        padding:7px 11px;
        border-radius:999px;
        background:rgba(12,12,16,.88);
        border:1px solid rgba(255,215,112,.45);
        color:#ffe39a;
        font-size:12px;
        font-weight:800;
        letter-spacing:.02em;
        box-shadow:0 10px 24px rgba(0,0,0,.38), 0 0 12px rgba(255,205,80,.16);
        pointer-events:none;
      }

      .iris-ai-panel{
        position:absolute;
        left:auto;
        right:0;
        bottom:88px;
        width:min(390px,calc(100vw - 34px));
        height:min(570px,calc(100vh - 126px));
        display:none;
        overflow:hidden;
        border-radius:24px;
        background:linear-gradient(180deg,rgba(22,22,26,.985),rgba(8,8,10,.985));
        border:1px solid rgba(255,255,255,.14);
        box-shadow:0 28px 80px rgba(0,0,0,.58);
      }

      .iris-ai-panel.open{
        display:flex;
        flex-direction:column;
      }

      .iris-ai-head{
        flex:0 0 auto;
        padding:18px 18px 14px;
        border-bottom:1px solid rgba(255,255,255,.1);
        background:
          radial-gradient(circle at 15% 0%, rgba(138,91,36,.36), transparent 34%),
          radial-gradient(circle at 85% 0%, rgba(122,32,55,.36), transparent 34%);
      }

      .iris-ai-title{
        display:flex;
        align-items:flex-start;
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
        line-height:1.35;
      }

      .iris-ai-close{
        border:0;
        background:rgba(255,255,255,.08);
        color:#fff;
        width:30px;
        height:30px;
        border-radius:999px;
        cursor:pointer;
        flex:0 0 auto;
      }

      .iris-ai-intro{
        margin-top:12px;
        color:rgba(255,255,255,.74);
        font-size:12.5px;
        line-height:1.55;
      }

      .iris-ai-messages{
        flex:1 1 auto;
        overflow:auto;
        padding:16px;
        scroll-behavior:smooth;
        -webkit-overflow-scrolling:touch;
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
        color:rgba(255,255,255,.88);
        background:rgba(255,255,255,.085);
        border:1px solid rgba(255,255,255,.09);
        border-bottom-left-radius:7px;
      }

      .iris-ai-msg.user .iris-ai-bubble{
        color:#23180d;
        background:linear-gradient(135deg,#f8dc78,#d9a643);
        border-bottom-right-radius:7px;
      }

      .iris-ai-suggestions{
        flex:0 0 auto;
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

      .iris-ai-small{
        flex:0 0 auto;
        padding:0 16px 10px;
        color:rgba(255,255,255,.42);
        font-size:10.5px;
        line-height:1.4;
      }

      .iris-ai-image-preview{
        flex:0 0 auto;
        display:none;
        gap:8px;
        padding:0 12px 10px;
        flex-wrap:wrap;
      }

      .iris-ai-image-chip{
        display:flex;
        align-items:center;
        gap:7px;
        padding:7px 9px;
        border-radius:999px;
        background:rgba(255,255,255,.08);
        border:1px solid rgba(255,255,255,.12);
        color:rgba(255,255,255,.78);
        font-size:11.5px;
      }

      .iris-ai-image-chip button{
        width:20px;
        height:20px;
        border:0;
        border-radius:999px;
        background:rgba(255,255,255,.12);
        color:#fff;
        cursor:pointer;
      }

      .iris-ai-attach{
        width:42px;
        border:1px solid rgba(255,255,255,.12);
        border-radius:16px;
        background:rgba(255,255,255,.06);
        color:#ffe39a;
        cursor:pointer;
        font-size:18px;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .iris-ai-file{
        display:none;
      }

      .iris-ai-form{
        flex:0 0 auto;
        display:flex;
        gap:8px;
        padding:12px;
        border-top:1px solid rgba(255,255,255,.1);
        background:rgba(0,0,0,.24);
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
        background:linear-gradient(135deg,#f6d66c,#dfae37);
        color:#201409;
        font-weight:800;
        box-shadow:0 0 0 1px rgba(255,219,120,.72), 0 0 12px rgba(255,196,77,.18);
      }

      .iris-ai-send:disabled{
        opacity:.5;
        cursor:not-allowed;
      }

      @media(max-width:640px){
        .iris-ai-root{
          left:0;
          right:0;
          bottom:0;
          z-index:99998;
        }

        .iris-ai-button{
  position:fixed;
  right:14px;
  left:auto;
  bottom:64px;
  width:42px;
  height:42px;
  z-index:2147483646;
}
        .iris-ai-label{
  left:auto;
  right:50px;
  font-size:11px;
  padding:6px 9px;
}
.iris-ai-mark{
  width:21px;
  height:21px;
}

        body.iris-ai-open .iris-ai-button{
          opacity:0;
          pointer-events:none;
        }
body.iris-ai-open #refitWhatsappWidget{
  opacity:0 !important;
  visibility:hidden !important;
  pointer-events:none !important;
  transform:translateY(18px) scale(.82) !important;
}

body.iris-ai-open #refitWhatsappWidget::before{
  animation:none !important;
  opacity:0 !important;
}
        .iris-ai-panel{
          position:fixed;
          inset:0;
          width:100vw;
          height:100dvh;
          max-width:100vw;
          max-height:100dvh;
          border-radius:0;
          border:0;
          box-shadow:none;
          background:linear-gradient(180deg,rgba(17,17,22,.992),rgba(7,7,10,.992));
        }

        .iris-ai-head{
          padding:calc(16px + env(safe-area-inset-top)) 18px 14px;
        }

        .iris-ai-title strong{
          font-size:20px;
          line-height:1.24;
        }

        .iris-ai-title span{
          font-size:15px;
          line-height:1.4;
        }

        .iris-ai-close{
          width:38px;
          height:38px;
          font-size:20px;
          background:rgba(255,255,255,.1);
        }

        .iris-ai-intro{
          font-size:15px;
          line-height:1.55;
          margin-top:14px;
        }

        .iris-ai-messages{
          padding:18px 18px 10px;
        }

        .iris-ai-bubble{
          max-width:92%;
          font-size:17px;
          line-height:1.62;
          padding:15px 16px;
          border-radius:19px;
          margin-bottom:4px;
        }

        .iris-ai-suggestions{
          flex-wrap:nowrap;
          overflow-x:auto;
          gap:10px;
          padding:0 18px 12px;
          scrollbar-width:none;
        }

        .iris-ai-suggestions::-webkit-scrollbar{
          display:none;
        }

        .iris-ai-chip{
          flex:0 0 auto;
          font-size:15px;
          padding:10px 13px;
          border-radius:999px;
        }

        .iris-ai-small{
          order:4;
          padding:0 18px 8px;
          font-size:13px;
          line-height:1.45;
        }

        .iris-ai-form{
          order:5;
          padding:10px 14px calc(12px + env(safe-area-inset-bottom));
          gap:10px;
          background:linear-gradient(180deg,rgba(8,8,12,.7),rgba(8,8,12,.98));
        }

        .iris-ai-input{
          min-height:54px;
          font-size:18px;
          line-height:1.45;
          padding:14px 15px;
          border-radius:18px;
        }

        .iris-ai-send{
          width:56px;
          height:56px;
          border-radius:18px;
          font-size:20px;
          flex:0 0 auto;
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
      const character = text.charAt(i);
      element.textContent += character;

      if (character && character.trim() && i % 3 === 0) {
        playSoftKeyboardSound();
      }

      i += 1;

      const messages = document.querySelector(".iris-ai-messages");
      if (messages) messages.scrollTop = messages.scrollHeight;

      if (i < text.length) {
        setTimeout(step, 22);
      }
    }

    step();
  }
  function showThinking() {
    return createMessage("assistant", "Iris is reading your message softly...", false);
  }

    async function sendToIris(message, images) {
    const history = loadHistory();

    const response = await fetch(IRIS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        images: images || [],
        history
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Iris could not respond.");
    }

    return data.reply || "I’m here. Could you share a little more with me?";
  }

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
if ((!message && !selectedIrisImages.length) || isBusy) return;

    isBusy = true;

    const input = document.querySelector(".iris-ai-input");
    const send = document.querySelector(".iris-ai-send");

    if (input) input.value = "";
    if (send) send.disabled = true;

    const imagesToSend = selectedIrisImages.slice();
selectedIrisImages = [];
updateIrisImagePreview();

createMessage("user", imagesToSend.length ? `${message || "Please review these images."}\n\n[${imagesToSend.length} image attached]` : message, false);
const thinking = showThinking();

    try {
      const reply = await sendToIris(message || "Please review these images.", imagesToSend);
      
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

        <div class="iris-ai-small">
          Iris gives general guidance first. For confirmed pricing, site details or urgent work, REFIT may continue by WhatsApp.
        </div>
        
        <div class="iris-ai-image-preview"></div>
        
                <form class="iris-ai-form">
          <button class="iris-ai-attach" type="button" aria-label="Attach images">＋</button>
          <input class="iris-ai-file" type="file" accept="image/jpeg,image/png,image/webp" multiple>
          <textarea class="iris-ai-input" rows="1" maxlength="700" placeholder="Talk to Iris..."></textarea>
          <button class="iris-ai-send" type="submit">➤</button>
        </form>
      </section>

      <button class="iris-ai-button" type="button" aria-label="Open Iris">
        <span class="iris-ai-mark"></span>
        <span class="iris-ai-label">Ask Iris</span>
      </button>
    `;

    document.body.appendChild(root);

    const panel = root.querySelector(".iris-ai-panel");
    const openBtn = root.querySelector(".iris-ai-button");
    const closeBtn = root.querySelector(".iris-ai-close");
    const form = root.querySelector(".iris-ai-form");
    const input = root.querySelector(".iris-ai-input");

        const attachBtn = root.querySelector(".iris-ai-attach");
    const fileInput = root.querySelector(".iris-ai-file");

    function openIris() {
      isOpen = true;
      panel.classList.add("open");
      document.body.classList.add("iris-ai-open");

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
      document.body.classList.remove("iris-ai-open");
    }

        openBtn.addEventListener("click", () => {
      unlockIrisSound();

      if (isOpen) closeIris();
      else openIris();
    });
        attachBtn.addEventListener("click", () => {
      unlockIrisSound();
      fileInput.click();
    });

    fileInput.addEventListener("change", async () => {
      const prepared = await prepareIrisImages(fileInput.files);
      selectedIrisImages = prepared.slice(0, 2);
      updateIrisImagePreview();
      fileInput.value = "";
    });
    
        form.addEventListener("submit", (event) => {
      event.preventDefault();
      unlockIrisSound();
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
        unlockIrisSound();
        openIris();
        handleSend(chip.textContent);
      });
    });
  }

  ready(init);
})();
