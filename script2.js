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

// ===========================
// Assignment Type Section Switcher
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const assignmentRadios = document.querySelectorAll('input[name="assignment_type"]');
  const sections = {
    see_write: document.getElementById('seeSection'),
    research_write: document.getElementById('researchSection'),
    custom: document.getElementById('customSection')
  };

  assignmentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      Object.values(sections).forEach(section => section.style.display = 'none');

      const selectedSection = sections[radio.value];
      if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('fade-in');
        setTimeout(() => selectedSection.classList.remove('fade-in'), 400);
      }
    });
  });
});
// ===========================
// Payment Calculator
// ===========================
const urgencySelect = document.getElementById("urgency");
const pagesInput = document.getElementById("pages");
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const totalAmountDisplay = document.getElementById("total_amount");
const installmentInfo = document.getElementById("installment_info");
const qrAmount = document.getElementById("qr_amount");
const deliveryFee = 50;

// NEW urgency rates (per page)
const urgencyRates = {
  "1": 22,
  "2-3": 18,
  "4-7": 13,
  "8-14": 12,
  "within_month": 8
};

// NEW page-based adjustment function
function adjustRate(baseRate, pages) {
  if (pages >= 1 && pages <= 5) {
    return baseRate * 1.10;          // +10%
  } 
  if (pages > 5 && pages <= 10) {
    return baseRate * 1.07;          // +7%
  }
  if (pages > 10 && pages <= 50) {
    return baseRate;                 // no change
  }
  if (pages > 50) {
    return baseRate * 0.90;          // -10%
  }
  return baseRate;
}

function calculateTotal() {
  const urgency = urgencySelect.value;
  const pages = parseInt(pagesInput.value) || 0;
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

  if (!urgency || !paymentMethod || pages === 0) {
    totalAmountDisplay.textContent = "₹0";
    installmentInfo.style.display = "none";
    installmentInfo.textContent = "";
    qrAmount.textContent = "";
    return;
  }

  // Step 1: base rate from urgency
  const baseRate = urgencyRates[urgency];

  // Step 2: apply page slab adjustment
  const finalRate = adjustRate(baseRate, pages);

  // Step 3: total
  let total = Math.round(finalRate * pages) + deliveryFee;

  // Step 4: payment method processing
  if (paymentMethod === "full") {
    const discounted = Math.round(total * 0.8); // 20% off

    totalAmountDisplay.innerHTML = `
  <div class="calc_line">(₹${Math.round(finalRate * pages)} + ₹${deliveryFee} Delivery) =</div>
  <span class="original_price">₹${total}</span>
  <span class="discount_price">₹${discounted}</span>
`;

    installmentInfo.style.display = "none";
    installmentInfo.textContent = "";
    qrAmount.textContent = `Total payable amount: ₹${discounted}`;

  } else if (paymentMethod === "installments") {
    const halfNow = Math.round(total / 2);

    totalAmountDisplay.innerHTML = `
  <div class="calc_line">(₹${Math.round(finalRate * pages)} + ₹${deliveryFee} Delivery) =</div>
  ₹${total}
`;

    installmentInfo.style.display = "block";
    installmentInfo.textContent = `Pay ₹${halfNow} now and ₹${halfNow} on delivery.`;
    qrAmount.textContent = `Amount to pay now: ₹${halfNow}`;

  } else {
    // fallback (should never be needed)
    installmentInfo.style.display = "none";
    installmentInfo.textContent = "";
    qrAmount.textContent = `Total payable amount: ₹${total}`;
  }

  // Animation highlight (your existing behavior)
  totalAmountDisplay.classList.add("updated");
  setTimeout(() => totalAmountDisplay.classList.remove("updated"), 300);
}

// Event Listeners for Payment Calculator
urgencySelect.addEventListener("change", calculateTotal);
pagesInput.addEventListener("input", calculateTotal);
paymentRadios.forEach(radio => radio.addEventListener("change", calculateTotal));

// ===========================
// Sending Details via Telegram & WhatsApp
// ===========================
const telegramBtn = document.querySelector(".telegram_btn");
const whatsappBtn = document.querySelector(".whatsapp_btn");

const TELEGRAM_TOKEN = "8357811622:AAHV369vBc2bHiE1TQzrbinlG9U7qsnIcGE";
const TELEGRAM_CHAT_ID = "1816788487";
const WHATSAPP_NUMBER = "+918100375230";

// -------------------- Collect Form Data --------------------
function collectFormData() {
  const formData = {};
  formData.name = document.getElementById("name").value || "";
  formData.email = document.getElementById("email").value || "";
  formData.college = document.getElementById("college").value || "";
  formData.collegeID = document.getElementById("collegeID").value || "";
  formData.contactNo = document.getElementById("contactNo").value || "";
  formData.address = document.getElementById("address").value || "";
  
  const handwriting = document.querySelector('input[name="handwriting"]:checked');
  formData.handwriting = handwriting ? handwriting.value : "";

  const assignmentType = document.querySelector('input[name="assignment_type"]:checked');
  formData.assignment_type = assignmentType ? assignmentType.value : "";
  
  formData.urgency = document.getElementById("urgency").value || "";
  formData.pages = document.getElementById("pages").value || "";

  const paymentMethod = document.querySelector('input[name="payment"]:checked');
  formData.payment_method = paymentMethod ? paymentMethod.value : "";

  formData.total_amount = document.getElementById("total_amount").textContent || "";
  formData.installment_info = document.getElementById("installment_info").textContent || "";

  formData.assignment_file = document.getElementById("assignment_pdf").files[0] || null;
  formData.receipt_file = document.getElementById("receipt_uplo").files[0] || null;

  return formData;
}

// -------------------- Telegram Sending --------------------
// -------------------- Telegram Sending (with PDF/Receipt) --------------------
async function sendToTelegram() {
  const btn = document.querySelector(".telegram_btn");
  const confirmDiv = document.getElementById("telegram-confirmation");

  setButtonLoading(btn, "loading");
  confirmDiv.innerHTML = '';

  try {
    const data = collectFormData();

    // First send text details
    let text = `🧾 See & Write Submission. \n\nName: ${data.name}\nEmail: ${data.email}\nCollege / School : ${data.college}\nCollege / School ID: ${data.collegeID}\nContact No. : ${data.contactNo}\nDelivery Address :${data.address}\nHandwriting: ${data.handwriting|| 'Not selected'}\nUrgency: ${data.urgency} days \nPages: ${data.pages}\nPayment Method: ${data.payment_method}\nTotal Amount: ${data.total_amount}\n${data.installment_info ? 'Installment Info: ' + data.installment_info + '\n' : ''}`;
    text = escapeMarkdownV2(text);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text, parse_mode: "MarkdownV2" })
    });

    // Then send assignment PDF
    if (data.assignment_file) {
      const formData = new FormData();
      formData.append("chat_id", TELEGRAM_CHAT_ID);
      formData.append("document", data.assignment_file, data.assignment_file.name);

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
        method: "POST",
        body: formData
      });
    }

    // Then send receipt (if exists)
    if (data.receipt_file) {
      const formData = new FormData();
      formData.append("chat_id", TELEGRAM_CHAT_ID);
      formData.append("document", data.receipt_file, data.receipt_file.name);

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
        method: "POST",
        body: formData
      });
    }

    confirmDiv.textContent = '✅ Details and files sent successfully!';
    confirmDiv.classList.remove('error');
    setButtonLoading(btn, "success");
  } catch (err) {
    console.error(err);
    confirmDiv.textContent = '❌ Failed to send details!';
    confirmDiv.classList.add('error');
    setButtonLoading(btn, null);
  }
}


// -------------------- WhatsApp Sending (continued) --------------------
function sendToWhatsApp() {
  const btn = document.querySelector(".whatsapp_btn");
  const confirmDiv = document.getElementById("whatsapp-confirmation");

  setButtonLoading(btn, "loading");
  confirmDiv.textContent = '';

  // Force the "Sending..." state for at least 1 second
  setTimeout(() => {
    try {
      const data = collectFormData();

      let msg = `🧾 See & Write Submission.\n\nName: ${data.name}\nEmail: ${data.email}\nCollege / School: ${data.college}\nCollege / School ID: ${data.collegeID}\nContact No. : ${data.contactNo}\nDelivery Address :${data.address}\nHandwriting: ${data.handwriting|| 'Not selected'}\nUrgency: ${data.urgency} days \nPages: ${data.pages}\nPayment Method: ${data.payment_method}\nTotal Amount: ${data.total_amount}\n${data.installment_info ? 'Installment Info: ' + data.installment_info + '\n' : ''}\n\nPlease send your assignment PDF and payment receipt manually in this chat.`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+','')}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank").focus();

      // No success message for WhatsApp since it's manual
      setButtonLoading(btn, null);
    } catch (err) {
      console.error(err);
      confirmDiv.textContent = '❌ Failed to open WhatsApp!';
      confirmDiv.classList.add('error');
      setButtonLoading(btn, null);
    }
  }, 1000);
}

// -------------------- Event Listeners for Buttons --------------------
telegramBtn.addEventListener("click", sendToTelegram);
whatsappBtn.addEventListener("click", sendToWhatsApp);

// ===========================
// File Upload Confirmation
// ===========================
function setupConfirmation(inputId, confirmationId) {
  const input = document.getElementById(inputId);
  const confirmation = document.getElementById(confirmationId);

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) {
      confirmation.innerHTML = `  ${file.name}`;
    } else {
      confirmation.innerHTML = '';
    }
  });
}

// Apply confirmation to both inputs
setupConfirmation('assignment_pdf', 'pdf-confirmation');
setupConfirmation('receipt_uplo', 'receipt-confirmation');

// Additional confirmation for styling purposes
document.getElementById('assignment_pdf').addEventListener('change', function() {
  const confirmation = document.getElementById('pdf-confirmation');
  if (this.files.length > 0) {
    confirmation.textContent = this.files[0].name;
    confirmation.classList.add('show');
  } else {
    confirmation.textContent = '';
    confirmation.classList.remove('show');
  }
});

document.getElementById('receipt_uplo').addEventListener('change', function() {
  const confirmation = document.getElementById('receipt-confirmation');
  if (this.files.length > 0) {
    confirmation.textContent = this.files[0].name;
    confirmation.classList.add('show');
  } else {
    confirmation.textContent = '';
    confirmation.classList.remove('show');
  }
});

// ===========================
// Button Loader States
// ===========================
function setButtonLoading(btn, state) {
  if (state === "loading") {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = 'Sending<span class="button-spinner"></span>';
  } else if (state === "success") {
    btn.innerHTML = '✅ Sent!';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || 'Send';
    }, 1500);
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || 'Send';
  }
}












// ===========================
// Research & Write — Payment Calculator
// ===========================
const resUrgencySelect = document.getElementById("res_urgency");
const resPagesInput = document.getElementById("res_pages");
const resPaymentRadios = document.querySelectorAll('input[name="res_payment"]');
const resTotalAmountDisplay = document.getElementById("res_total_amount");
const resInstallmentInfo = document.getElementById("res_installment_info");
const resQrAmount = document.getElementById("res_qr_amount");
const resdeliveryFee = 50;

// NEW urgency rates (per page) for Research & Write
const resUrgencyRates = {
  "1": 24,
  "2-3": 20,
  "4-7": 14,
  "8-14": 13,
  "15-30": 10
};


function resAdjustRate(baseRate, pages) {
  if (pages >= 1 && pages <= 5) {
    return baseRate * 1.10;
  }
  if (pages > 5 && pages <= 10) {
    return baseRate * 1.07;
  }
  if (pages > 10 && pages <= 50) {
    return baseRate;
  }
  if (pages > 50) {
    return baseRate * 0.90;
  }
  return baseRate;
}

function resCalculateTotal() {
  const urgency = resUrgencySelect.value;
  const pages = parseInt(resPagesInput.value) || 0;
  const paymentMethod = document.querySelector('input[name="res_payment"]:checked')?.value;

  if (!urgency || !paymentMethod || pages === 0) {
    resTotalAmountDisplay.textContent = "₹0";
    resInstallmentInfo.style.display = "none";
    resInstallmentInfo.textContent = "";
    resQrAmount.textContent = "";
    return;
  }

  // Step 1: base rate based on urgency
  const baseRate = resUrgencyRates[urgency];

  // Step 2: apply page slab adjustment
  const finalRate = resAdjustRate(baseRate, pages);

  // Step 3: calculate total with delivery
  let total = Math.round(finalRate * pages) + resdeliveryFee;

  // Step 4: Apply payment method logic
  if (paymentMethod === "res_full") {
    const discounted = Math.round(total * 0.8);

    resTotalAmountDisplay.innerHTML = `
      <div class="calc_line">(₹${Math.round(finalRate * pages)} + ₹${resdeliveryFee} Delivery) =</div>
      <span class="original_price">₹${total}</span>
      <span class="discount_price">₹${discounted}</span>
    `;

    resInstallmentInfo.style.display = "none";
    resInstallmentInfo.textContent = "";
    resQrAmount.textContent = `Total payable amount: ₹${discounted}`;

  } else if (paymentMethod === "res_installments") {
    const halfNow = Math.round(total / 2);

    resTotalAmountDisplay.innerHTML = `
      <div class="calc_line">(₹${Math.round(finalRate * pages)} + ₹${resdeliveryFee} Delivery) =</div>
      ₹${total}
    `;

    resInstallmentInfo.style.display = "block";
    resInstallmentInfo.textContent = `Pay ₹${halfNow} now and ₹${halfNow} on delivery.`;
    resQrAmount.textContent = `Amount to pay now: ₹${halfNow}`;

  } else {
    // fallback
    resInstallmentInfo.style.display = "none";
    resInstallmentInfo.textContent = "";
    resQrAmount.textContent = `Total payable amount: ₹${total}`;
  }

  // Animation highlight
  resTotalAmountDisplay.classList.add("updated");
  setTimeout(() => resTotalAmountDisplay.classList.remove("updated"), 300);
}

resUrgencySelect.addEventListener("change", resCalculateTotal);
resPagesInput.addEventListener("input", resCalculateTotal);
resPaymentRadios.forEach(radio => radio.addEventListener("change", resCalculateTotal));

// ===========================
// Research & Write — File Upload Confirmation
// ===========================
// ===========================
// Research & Write — File Upload Confirmation (robust)
// ===========================
function setupResConfirmationDynamic(inputId, confirmationId) {
  // Use a MutationObserver in case the section is added later or hidden initially
  function attachListener() {
    const input = document.getElementById(inputId);
    const confirmation = document.getElementById(confirmationId);

    if (!input || !confirmation) return false; // wait until DOM has these elements

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file) {
        confirmation.innerHTML = ` ${file.name}`;
        confirmation.classList.add('show');
      } else {
        confirmation.innerHTML = '';
        confirmation.classList.remove('show');
      }
    });
    return true;
  }

  // Try immediately
  if (attachListener()) return;

  // If not found, observe DOM until they exist
  const observer = new MutationObserver(() => {
    if (attachListener()) observer.disconnect();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Call for both inputs
setupResConfirmationDynamic('res_assignment_pdf', 'res_pdf-confirmation');
setupResConfirmationDynamic('res_receipt_uplo', 'res_receipt-confirmation');

// ===========================
// Research & Write — Telegram Sending
// ===========================
const resTelegramBtn = document.querySelector(".res_telegram_btn");
const resWhatsappBtn = document.querySelector(".res_whatsapp_btn");
const RES_TELEGRAM_TOKEN = "8357811622:AAHV369vBc2bHiE1TQzrbinlG9U7qsnIcGE";
const RES_TELEGRAM_CHAT_ID = "1816788487";
const RES_WHATSAPP_NUMBER = "+918100375230";

function collectResFormData() {
  const data = {};
  data.name = document.getElementById("name").value || "";
  data.email = document.getElementById("email").value || "";
  data.college = document.getElementById("college").value || "";
  data.collegeID = document.getElementById("collegeID").value || "";
  data.contactNo = document.getElementById("contactNo").value || "";
  data.address = document.getElementById("address").value || "";
  
  const handwriting = document.querySelector('input[name="handwriting"]:checked');
  data.handwriting = handwriting ? handwriting.value : "";

  data.urgency = document.getElementById("res_urgency").value || "";
  data.pages = document.getElementById("res_pages").value || "";

  const paymentMethod = document.querySelector('input[name="res_payment"]:checked');
  data.payment_method = paymentMethod ? paymentMethod.value : "";

  data.total_amount = document.getElementById("res_total_amount").textContent || "";
  data.installment_info = document.getElementById("res_installment_info").textContent || "";

  data.assignment_file = document.getElementById("res_assignment_pdf").files[0] || null;
  data.receipt_file = document.getElementById("res_receipt_uplo").files[0] || null;

  return data;
}

// Escape for MarkdownV2
function resEscapeMarkdownV2(text) {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

// ===========================
// Research & Write — Telegram Sending (Updated Behavior)
// ===========================
async function sendResToTelegram() {
  const btn = document.querySelector(".res_telegram_btn");
  const confirmDiv = document.getElementById("res_telegram-confirmation");

  setButtonLoading(btn, "loading");
  confirmDiv.innerHTML = '';

  try {
    const data = collectResFormData();

    // Send main details
    let text = `🧾 Research & Write Submission. \n\nName: ${data.name}\nEmail: ${data.email}\nCollege / School : ${data.college}\nCollege / School ID: ${data.collegeID}\nContact No. : ${data.contactNo}\nDelivery Address :${data.address}\nHandwriting: ${data.handwriting || 'Not selected'}\nUrgency: ${data.urgency} days \nPages: ${data.pages}\nPayment Method: ${data.payment_method}\nTotal Amount: ${data.total_amount}\n${data.installment_info ? 'Installment Info: ' + data.installment_info + '\n' : ''}`;
    text = resEscapeMarkdownV2(text);

    await fetch(`https://api.telegram.org/bot${RES_TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: RES_TELEGRAM_CHAT_ID, text, parse_mode: "MarkdownV2" })
    });

    // Send assignment PDF (if uploaded)
    if (data.assignment_file) {
      const formData = new FormData();
      formData.append("chat_id", RES_TELEGRAM_CHAT_ID);
      formData.append("document", data.assignment_file, data.assignment_file.name);
      await fetch(`https://api.telegram.org/bot${RES_TELEGRAM_TOKEN}/sendDocument`, { method: "POST", body: formData });
    }

    // Send payment receipt (if uploaded)
    if (data.receipt_file) {
      const formData = new FormData();
      formData.append("chat_id", RES_TELEGRAM_CHAT_ID);
      formData.append("document", data.receipt_file, data.receipt_file.name);
      await fetch(`https://api.telegram.org/bot${RES_TELEGRAM_TOKEN}/sendDocument`, { method: "POST", body: formData });
    }

    confirmDiv.textContent = '✅ Details and files sent successfully!';
    confirmDiv.classList.remove('error');
    setButtonLoading(btn, "success");
  } catch (err) {
    console.error(err);
    confirmDiv.textContent = '❌ Failed to send details!';
    confirmDiv.classList.add('error');
    setButtonLoading(btn, null);
  }
}

// ===========================
// Research & Write — WhatsApp Sending (Updated Behavior)
// ===========================
function sendResToWhatsApp() {
  const btn = document.querySelector(".res_whatsapp_btn");
  const confirmDiv = document.getElementById("res_whatsapp-confirmation");

  setButtonLoading(btn, "loading");
  confirmDiv.textContent = '';

  // Force “Sending…” state for at least 1 second
  setTimeout(() => {
    try {
      const data = collectResFormData();
      let msg = `🧾 Research & Write Submission. \n\nName: ${data.name}\nEmail: ${data.email}\nCollege / School: ${data.college}\nCollege / School ID: ${data.collegeID}\nContact No. : ${data.contactNo}\nDelivery Address :${data.address}\nHandwriting: ${data.handwriting|| 'Not selected'}\nUrgency: ${data.urgency} days \nPages: ${data.pages}\nPayment Method: ${data.payment_method}\nTotal Amount: ${data.total_amount}\n${data.installment_info ? 'Installment Info: ' + data.installment_info + '\n' : ''}\n\nPlease send your assignment PDF and payment receipt manually in this chat.`;

      const waUrl = `https://wa.me/${RES_WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank").focus();

      // No “Sent” confirmation for WhatsApp (manual)
      setButtonLoading(btn, null);
    } catch (err) {
      console.error(err);
      confirmDiv.textContent = '❌ Failed to open WhatsApp!';
      confirmDiv.classList.add('error');
      setButtonLoading(btn, null);
    }
  }, 1000);
}

// ===========================
// Event Listeners
// ===========================
resTelegramBtn.addEventListener("click", sendResToTelegram);
resWhatsappBtn.addEventListener("click", sendResToWhatsApp);

// ===========================
// Button Loader States
// ===========================
function setButtonLoading(btn, state) {
  if (state === "loading") {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = 'Sending<span class="button-spinner"></span>';
  } else if (state === "success") {
    btn.innerHTML = '✅ Sent!';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || 'Send';
    }, 1500);
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || 'Send';
  }
}





// ================= CUSTOM ASSIGNMENT WHATSAPP LOGIC =================
document.getElementById("custom_whatsappBtn").addEventListener("click", function () {
  const message = document.getElementById("custom_message").value.trim();

  if (message === "") {
    alert("Please enter your assignment details before sending.");
    return;
  }

  const sendingMsg = document.getElementById("custom_sendingMessage");
  sendingMsg.style.display = "block";

  // Show "Sending..." for at least 1 second before redirecting
  setTimeout(() => {
    sendingMsg.style.display = "none";

    const encodedMessage = encodeURIComponent(
      `Hello! I’d like to discuss a *Custom Assignment*.\n\n` +
      `📄 *Assignment Details:*\n ${message}\n\n` +
      `Please note: I’ll manually send my assignment PDF and payment receipt here.`
    );

    
    const whatsappNumber = "+918100375230"; 
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  }, 1000);
});
