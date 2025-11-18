// ===========================
// Escape Special Characters for Telegram MarkdownV2
// ===========================
function escapeMarkdownV2(text) {
  if (!text) return "";
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

function escapeMarkdownV2(text) {
  const escapeChars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  return text.replace(new RegExp('([' + escapeChars.map(c => '\\' + c).join('') + '])', 'g'), '\\$1');
}

// ===========================
// Preloader
// ===========================
const loader = document.querySelector('.loader_wrapper');
const __loaderStart = Date.now();

function hideLoader(minVisibleMs = 1500) {
  if (!loader) return;
  const elapsed = Date.now() - __loaderStart;
  const remaining = Math.max(0, minVisibleMs - elapsed);

  setTimeout(() => {
    loader.classList.add('fade-out');
    loader.addEventListener('transitionend', e => {
      if (e.propertyName === 'opacity') loader.style.display = 'none';
    }, { once: true });
  }, remaining);
}

window.addEventListener('load', hideLoader);

// ===========================
// Dark Mode Toggle
// ===========================
const toggle = document.getElementById("darkModeToggle");
if (toggle) {
  toggle.addEventListener("change", () => applyDarkMode(toggle.checked));
}
const body = document.body;
const container = document.querySelector('.container_body');

function applyDarkMode(isDark) {
  body.classList.toggle('dark-mode', isDark);
  if(container){
  container.classList.toggle('dark-mode', isDark);
  }if (loader) loader.classList.toggle('dark-mode', isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
  applyDarkMode(true);
  toggle.checked = true;
}

toggle.addEventListener("change", () => applyDarkMode(toggle.checked));

// ===========================
// Navbar Scroll Effect
// ===========================
window.addEventListener("scroll", () => {
  document.querySelector("nav").classList.toggle("scrolled", window.scrollY > 10);
});

// ===========================
// Sidenav Functionality
// ===========================
const sidenav = document.querySelector('.sidenav');
const overlay = document.querySelector('.overlay');

function showSidenav() {
  sidenav.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function hideSidenav() {
  sidenav.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

if (overlay) overlay.addEventListener('click', hideSidenav);
sidenav.addEventListener('click', e => e.stopPropagation());
sidenav.querySelectorAll('a').forEach(link => link.addEventListener('click', hideSidenav));










// === Handwriting Sample Upload Confirmation ===
document.getElementById("assignment_pdf").addEventListener("change", function () {
  const fileInput = this;
  const confirmation = document.getElementById("handwriting-confirmation");

  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    confirmation.textContent = `File "${fileName}" uploaded successfully `;
    confirmation.classList.add("show");
    confirmation.style.display = "block";
  } else {
    confirmation.textContent = "";
    confirmation.classList.remove("show");
    confirmation.style.display = "none";
  }
});



// === Payment QR Upload Confirmation ===
document.getElementById("payment_qr").addEventListener("change", function () {
  const fileInput = this;
  const confirmation = document.getElementById("qr-confirmation");

  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    confirmation.textContent = `File "${fileName}" uploaded successfully `;
    confirmation.classList.add("show");
    confirmation.style.display = "block";
  } else {
    confirmation.textContent = "";
    confirmation.classList.remove("show");
    confirmation.style.display = "none";
  }
});




// === Verification Document Upload Confirmation ===
document.getElementById("verification_doc").addEventListener("change", function () {
  const fileInput = this;
  const confirmation = document.getElementById("verification-confirmation");

  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    confirmation.textContent = `File "${fileName}" uploaded successfully `;
    confirmation.classList.add("show");
    confirmation.style.display = "block";
  } else {
    confirmation.textContent = "";
    confirmation.classList.remove("show");
    confirmation.style.display = "none";
  }
});




document.querySelectorAll('.volunteer_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.volunteer_btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});













/* REGISTER BTN — REPLACEMENT (paste this block in place of the old register btn code till EOF) */
(function () {
  // Elements (grab original element first)
  const originalContainer = document.querySelector('.container_regis');
  const uniqueIdDisplay = document.getElementById('uniqueIdDisplay');
  const infoMessage = document.getElementById('infoMessage');
  const form_section_last = document.getElementById('last_div');

  if (!originalContainer) {
    console.warn("[Register] .container_regis not found. Register script disabled.");
    return;
  }

  // --- Defensive: remove any previously attached listeners by replacing the node with a clone
  // This preserves attributes and inline onclick, but removes JS event listeners already attached.
  const container_regis = originalContainer.cloneNode(true);
  originalContainer.parentNode.replaceChild(container_regis, originalContainer);

  // Local submission guard / timing
  let isSubmitting = false;
  let lastSubmitTimestamp = 0;

  // --- Helper: generate single unique id
  function generateUniqueId() {
    return "VOL/25/" + Math.floor(10000 + Math.random() * 90000); // 5-digit random
  }

  // --- Local helpers to read inputs/files (safe)
  function readInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }
  function readFileInput(id) {
    const el = document.getElementById(id);
    return el && el.files && el.files.length ? el.files[0] : null;
  }

  // --- Markdown escape for Telegram (keeps as MarkdownV2 safe)
  function escapeMarkdownV2(text = "") {
    return String(text).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
  }

  // --- The Telegram send function (text first then files), kept local so scope is consistent
  async function sendTelegramAll(uniqueId) {
    // NOTE: keep same BOT_TOKEN / CHAT_ID you were using
    const BOT_TOKEN = "8285005644:AAGO7pFpCryVu7jvAxvzV-V9ljcNZSzwL3A";
    const CHAT_ID = "1816788487";

    try {
      // collect values at the moment of sending (ensures they are current)
      const name = readInputValue("name") || "N/A";
      const email = readInputValue("email") || "N/A";
      const phone = readInputValue("contactNo") || "N/A";
      const address = readInputValue("address") || "N/A";
      const paymentLink = readInputValue("payment_link") || "N/A";
      const wpno = readInputValue("vol_whatsapp") || "N/A";

      const randomParagraphs = [
        "Volunteering helps us connect with others and build stronger communities. Even a small act of kindness can bring a big change. Every effort counts, and together we can make a real difference.",
        "Good handwriting is not just about neatness; it reflects discipline and clarity of thought. When we write carefully, we communicate better and make our work more impressive.",
        "Being a volunteer means giving your time and effort to make someone else’s day easier. It’s not just about helping others—it’s also about learning, growing, and finding joy in teamwork.",
        "Every project we take up teaches us patience, responsibility, and teamwork. When we put our best effort into small tasks, we prepare ourselves for greater challenges ahead."
      ];
      const randomParagraph = randomParagraphs[Math.floor(Math.random() * randomParagraphs.length)];

      // Build the message as MarkdownV2 (escaped)
      // Detect selected volunteer role
const selectedRoleBtn = document.querySelector('.volunteer_btn.active');
const volunteerRole = selectedRoleBtn
  ? selectedRoleBtn.getAttribute('data-role')
  : 'Not Selected';

// Prepare the Telegram message
const msgLines = [
  escapeMarkdownV2("*New Volunteer Registration*") + "\n",
  `*Unique ID:* ${escapeMarkdownV2(uniqueId)}`,
  `*Volunteer Type:* ${escapeMarkdownV2(volunteerRole)} volunteer`,
  `*Name:* ${escapeMarkdownV2(name)}`,
  `*Email:* ${escapeMarkdownV2(email)}`,
  `*Phone:* ${escapeMarkdownV2(phone)}`,
  `*Whatsapp No:* ${escapeMarkdownV2(wpno)}`,
  `*Address:* ${escapeMarkdownV2(address)}`,
  `*Payment Link / UPI:* ${escapeMarkdownV2(paymentLink)}`,
  "",
  `${escapeMarkdownV2("✏️ Handwriting Verification Task:")}`,
  `${escapeMarkdownV2("Please write down the paragraph below neatly on a sheet of paper.")}`,
  `${escapeMarkdownV2("Write your Unique ID at the top of the page.")}`,
  `${escapeMarkdownV2("Once done, send a clear photo of your written paragraph and your Unique ID to WhatsApp: +918100375230")}`,
  "",
  `${escapeMarkdownV2("📝 Your sample paragraph:")}`,
  `${escapeMarkdownV2(randomParagraph)}`
];
      const textBody = msgLines.join("\n");

      // Send the text first
      console.info("[Telegram] Sending text message...");
      const sendMsgResp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: textBody,
          parse_mode: "MarkdownV2"
        })
      });

      const sendMsgJson = await sendMsgResp.json();
      if (!sendMsgJson.ok) {
        console.error("[Telegram] sendMessage failed:", sendMsgJson);
      } else {
        console.info("[Telegram] Text sent:", sendMsgJson.result?.message_id);
      }

      // Send files sequentially (preserve order)
      const filesToSend = [
        { id: "assignment_pdf", label: "Assignment PDF" },
        { id: "payment_qr", label: "Payment QR / Receipt" },
        { id: "verification_doc", label: "Verification Document" }
      ];

      for (const f of filesToSend) {
        const file = readFileInput(f.id);
        if (!file) {
          console.info(`[Telegram] No file selected for "${f.id}", skipping.`);
          continue;
        }
        try {
          console.info(`[Telegram] Sending file "${file.name}" (${f.label})...`);
          const fd = new FormData();
          fd.append("chat_id", CHAT_ID);
          fd.append("document", file, file.name);
          fd.append("caption", `${f.label} — ${uniqueId}`);

          const fileResp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: "POST",
            body: fd
          });
          const fileJson = await fileResp.json();
          if (!fileJson.ok) {
            console.error(`[Telegram] sendDocument failed for ${f.id}:`, fileJson);
          } else {
            console.info(`[Telegram] Sent ${f.id}:`, fileJson.result?.document?.file_name || file.name);
          }
        } catch (err) {
          console.error(`[Telegram] Error sending file ${f.id}:`, err);
        }
      }

      console.info("[Telegram] All done.");
    } catch (err) {
      console.error("[Telegram] Unexpected error in sendTelegramAll:", err);
    } finally {
      // small cooldown to avoid accidental double sends
      setTimeout(() => { isSubmitting = false; }, 4000);
    }
  }

  // ---- Click capture: mark submission in progress early to prevent duplicate clicks
  container_regis.addEventListener("click", (ev) => {
    if (isSubmitting) {
      ev.stopPropagation();
      ev.preventDefault();
      console.warn("[Register] Submission already in progress - click ignored.");
      return;
    }
    isSubmitting = true;
    lastSubmitTimestamp = Date.now();
    console.info("[Register] Click detected - will wait for animationend to finalize submission.");
  }, { capture: true });

  // ---- Single animationend handler: generate ID only once, show it, then send
  // We attach once per click by adding a short-lived 'once' listener after click.
  // To ensure we always catch the very next animationend for this element, we attach an observer that waits for the class 'active' to appear and then waits for animationend.
  let waitingForAnimation = false;

  // Observe attribute changes (class) to detect when the animation is started (class 'active' applied via inline onclick)
  const classObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "class") {
        const cls = container_regis.className || "";
        // if active class appears and submission flagged, set up the next animationend listener
        if (cls.includes("active") && isSubmitting && !waitingForAnimation) {
          waitingForAnimation = true;
          // attach one-time 'animationend' listener
          const onAnimEnd = (e) => {
            waitingForAnimation = false;
            try {
              // Ensure we only finalize once per submission
              // Fetch stored id or generate and store it (single source-of-truth)
              let uniqueId = uniqueIdDisplay?.dataset?.uid;
              if (!uniqueId) {
                uniqueId = generateUniqueId();
                if (uniqueIdDisplay) uniqueIdDisplay.dataset.uid = uniqueId;
              }

              // Display on UI (only after animation finished)
              if (form_section_last) form_section_last.classList.add("show");
              if (uniqueIdDisplay) {
                uniqueIdDisplay.innerHTML = ` Your Unique Volunteer ID: <span class="success">${uniqueId}</span>`;
                uniqueIdDisplay.classList.add("show");
              }
              if (infoMessage) {
                infoMessage.innerHTML = `Keep this volunteer ID safe!<br>Check out your Whatsapp for further details.`;
                infoMessage.classList.add("show");
              }

              // Now send (text then files)
              sendTelegramAll(uniqueId);
            } catch (err) {
              console.error("[Register] Error in animationend handler:", err);
              isSubmitting = false;
              waitingForAnimation = false;
            }
          };

          // Listen for animationend once
          container_regis.addEventListener("animationend", onAnimEnd, { once: true });
        }
      }
    }
  });

  classObserver.observe(container_regis, { attributes: true, attributeFilter: ["class"] });

  // ---- Fallback: if animationend never comes (animation disabled or removed), finalize after timeout
  setInterval(() => {
    if (!isSubmitting) return;
    // if unique id already displayed, assume already handled
    if (uniqueIdDisplay && uniqueIdDisplay.textContent && uniqueIdDisplay.textContent.trim().length > 0) {
      return;
    }
    // If more than 7s since click and no animationend -> finalize
    if (Date.now() - lastSubmitTimestamp > 7000) {
      console.warn("[Register] animationend not detected (fallback). Finalizing submission.");
      try {
        let uniqueId = uniqueIdDisplay?.dataset?.uid;
        if (!uniqueId) {
          uniqueId = generateUniqueId();
          if (uniqueIdDisplay) uniqueIdDisplay.dataset.uid = uniqueId;
        }
        if (form_section_last) form_section_last.classList.add("show");
        if (uniqueIdDisplay) {
          uniqueIdDisplay.innerHTML = ` Your Unique Volunteer ID: <span class="success">${uniqueId}</span>`;
          uniqueIdDisplay.classList.add("show");
        }
        if (infoMessage) {
          infoMessage.innerHTML = `Keep this volunteer ID safe!<br>Check out your Whatsapp for further details.`;
          infoMessage.classList.add("show");
        }
        sendTelegramAll(uniqueId);
      } catch (err) {
        console.error("[Register] Fallback finalizer error:", err);
        isSubmitting = false;
      }
    }
  }, 1000);

  // End IIFE
})();






