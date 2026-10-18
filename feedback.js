const runtimeWindow = typeof window === "undefined" ? {} : window;
const config = runtimeWindow.CapitalOSFeedbackConfig || {};
const endpoint = typeof config.endpoint === "string" ? config.endpoint : "";
const turnstileSiteKey = typeof config.turnstileSiteKey === "string" ? config.turnstileSiteKey : "";

export function sourceFromLocation(search) {
  return new URLSearchParams(search).get("source") === "desktop" ? "desktop" : "web";
}

export function friendlyError(response) {
  if (response?.error === "rate_limited") return "Too many reports were sent from this connection. Please try again later.";
  if (response?.error === "verification_failed") return "Spam protection could not be verified. Please try again.";
  if (response?.message) return response.message;
  return "Feedback is temporarily unavailable. Please try again later.";
}

function mountTurnstile(status) {
  if (!turnstileSiteKey) {
    status.textContent = "Feedback is not configured yet. Please try again after the beta feedback service is available.";
    return false;
  }
  const render = () => {
    if (!window.turnstile) return window.setTimeout(render, 50);
    window.turnstile.render("#turnstile-container", { sitekey: turnstileSiteKey, action: "feedback", theme: "dark" });
  };
  render();
  return true;
}

function initializeFeedbackForm() {
  const form = document.querySelector("#feedback-form");
  const status = document.querySelector("#feedback-status");
  const submit = document.querySelector("#feedback-submit");
  const source = document.querySelector("#feedback-source");
  const version = document.querySelector("#feedback-version");
  if (!form || !status || !submit || !source || !version) return;
  source.value = sourceFromLocation(window.location.search);
  if (!endpoint) {
    submit.disabled = true;
    status.textContent = "Feedback is not configured yet. Please try again after the beta feedback service is available.";
    return;
  }
  if (!mountTurnstile(status)) submit.disabled = true;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    status.textContent = "Sending private feedback…";
    try {
      const response = await fetch(endpoint, { method: "POST", body: new FormData(form), mode: "cors", credentials: "omit" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw result;
      form.reset();
      source.value = sourceFromLocation(window.location.search);
      status.textContent = "Thank you. Your private feedback was received.";
      if (window.turnstile) window.turnstile.reset();
    } catch (error) {
      status.textContent = friendlyError(error);
    } finally {
      submit.disabled = false;
    }
  });
}

if (typeof document !== "undefined") initializeFeedbackForm();
