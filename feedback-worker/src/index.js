const REPORT_TYPES = new Set(["bug", "ux", "feature", "question"]);
const PRIORITIES = new Set(["untriaged", "critical", "high", "normal", "low"]);
const TRIAGE_LABELS = {
  new: "status: new",
  unverified: "verification: unverified",
  untriaged: "priority: untriaged",
};
const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const RAW_RETENTION_DAYS = 90;

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
});

export function feedbackError(code, message, origin, status = 400) {
  return new Response(JSON.stringify({ error: code, message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

export function isAllowedOrigin(request, env) {
  return request.headers.get("Origin") === (env.ALLOWED_ORIGIN || "https://mycapitalos.com");
}

export function normalizeText(value) {
  return typeof value === "string" ? value.trim().replace(/\u0000/g, "") : "";
}

function validEmail(value) {
  return value === "" || (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254);
}

function isScreenshot(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function";
}

export function validateFeedback(values) {
  const type = normalizeText(values.type);
  const title = normalizeText(values.title);
  const message = normalizeText(values.message);
  const email = normalizeText(values.email).toLowerCase();
  const source = normalizeText(values.source) || "web";
  const appVersion = normalizeText(values.appVersion);
  const consent = values.consent === "yes";
  const screenshot = isScreenshot(values.screenshot) && values.screenshot.size === 0 ? null : values.screenshot;

  if (normalizeText(values.company)) return { ok: false, code: "spam_detected", message: "The submission could not be accepted." };
  if (!consent) return { ok: false, code: "consent_required", message: "Confirm that you understand what will be sent." };
  if (!REPORT_TYPES.has(type)) return { ok: false, code: "invalid_type", message: "Choose a feedback type." };
  if (title.length < 5 || title.length > 120) return { ok: false, code: "invalid_title", message: "Use a title between 5 and 120 characters." };
  if (message.length < 20 || message.length > 5000) return { ok: false, code: "invalid_message", message: "Use a message between 20 and 5,000 characters." };
  if (!validEmail(email)) return { ok: false, code: "invalid_email", message: "Enter a valid contact email or leave it empty." };
  if (source !== "web" && source !== "desktop") return { ok: false, code: "invalid_source", message: "The submission source is invalid." };
  if (appVersion.length > 40) return { ok: false, code: "invalid_version", message: "The app version is too long." };
  if (screenshot && !isScreenshot(screenshot)) return { ok: false, code: "invalid_screenshot", message: "The screenshot is invalid." };
  if (screenshot && (!new Set(["image/png", "image/jpeg", "image/webp"]).has(screenshot.type) || screenshot.size > MAX_SCREENSHOT_BYTES)) {
    return { ok: false, code: "invalid_screenshot", message: "Attach a PNG, JPEG, or WebP screenshot no larger than 5 MB." };
  }
  return { ok: true, value: { type, title, message, email: email || null, source, appVersion: appVersion || null, screenshot: screenshot || null } };
}

export function githubLabels(reportType, priority = "untriaged", status = "new", verification = "unverified") {
  return [`type: ${reportType}`, `priority: ${priority}`, `status: ${status}`, `verification: ${verification}`];
}

export function privateIssuePayload(submission) {
  return {
    title: `[Feedback] ${submission.report_type} — ${submission.id}`,
    body: [
      "A private beta feedback submission was received.",
      "",
      `Submission ID: \`${submission.id}\``,
      `Source: ${submission.source}`,
      `Screenshot retained privately: ${submission.screenshot_key ? "yes" : "no"}`,
      `Contact address retained privately: ${submission.contact_email ? "yes" : "no"}`,
      "",
      "Do not request or publish SQLite databases, backups, financial data, or screenshots in public repositories.",
    ].join("\n"),
    labels: githubLabels(submission.report_type, submission.priority, submission.status, submission.verification_status),
  };
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function expirationDate(now = new Date()) {
  const expires = new Date(now);
  expires.setUTCDate(expires.getUTCDate() + RAW_RETENTION_DAYS);
  return expires.toISOString();
}

function responseJson(body, origin, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) } });
}

function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function pemBytes(pem) {
  const body = pem.replace(/-----(BEGIN|END) [^-]+-----/g, "").replace(/\s/g, "");
  const binary = atob(body);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function githubInstallationToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64Url(new TextEncoder().encode(JSON.stringify({ iat: now - 60, exp: now + 540, iss: env.GITHUB_APP_ID })));
  const key = await crypto.subtle.importKey("pkcs8", pemBytes(env.GITHUB_APP_PRIVATE_KEY), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${payload}`));
  const tokenResponse = await fetch(`https://api.github.com/app/installations/${encodeURIComponent(env.GITHUB_APP_INSTALLATION_ID)}/access_tokens`, {
    method: "POST",
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${header}.${payload}.${base64Url(new Uint8Array(signature))}`, "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (!tokenResponse.ok) throw new Error(`GitHub installation token failed (${tokenResponse.status})`);
  return (await tokenResponse.json()).token;
}

async function githubRequest(env, path, init = {}) {
  const token = await githubInstallationToken(env);
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`GitHub request failed (${response.status})`);
  return response;
}

async function verifyGithubLabels(env, labels) {
  for (const label of labels) {
    await githubRequest(env, `/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPOSITORY)}/labels/${encodeURIComponent(label)}`);
  }
}

async function syncGithubIssue(env, submission) {
  const payload = privateIssuePayload(submission);
  await verifyGithubLabels(env, payload.labels);
  const response = await githubRequest(env, `/repos/${encodeURIComponent(env.GITHUB_OWNER)}/${encodeURIComponent(env.GITHUB_REPOSITORY)}/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await response.json()).number;
}

async function verifyTurnstile(token, request, env) {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("Turnstile is not configured");
  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: request.headers.get("CF-Connecting-IP") || "" }),
  });
  const verification = await result.json();
  return verification.success === true && verification.hostname === (env.TURNSTILE_EXPECTED_HOSTNAME || "mycapitalos.com") && verification.action === "feedback";
}

async function verifyScreenshotMagic(file) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return png || jpeg || webp;
}

async function enforceRateLimit(request, env) {
  const rawIp = request.headers.get("CF-Connecting-IP");
  if (!rawIp || !env.IP_HASH_PEPPER) throw new Error("Rate limiting is not configured");
  const hash = await sha256Hex(`${env.IP_HASH_PEPPER}:${rawIp}`);
  const id = env.RATE_LIMITER.idFromName(hash);
  const result = await env.RATE_LIMITER.get(id).fetch("https://rate-limiter/check", { method: "POST" });
  return { allowed: result.status === 200, retryAfter: result.headers.get("Retry-After") || "3600" };
}

async function persistSubmission(env, submission) {
  await env.FEEDBACK_DB.prepare(`INSERT INTO feedback_submissions (
    id, created_at, expires_at, source, report_type, title, message, contact_email, app_version, screenshot_key,
    status, verification_status, priority, github_sync_status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'unverified', 'untriaged', 'pending')`).bind(
    submission.id, submission.created_at, submission.expires_at, submission.source, submission.report_type,
    submission.title, submission.message, submission.contact_email, submission.app_version, submission.screenshot_key,
  ).run();
}

async function trySync(env, submission) {
  try {
    const issueNumber = await syncGithubIssue(env, submission);
    await env.FEEDBACK_DB.prepare("UPDATE feedback_submissions SET github_issue_number = ?, github_sync_status = 'synced', github_sync_error = NULL WHERE id = ?").bind(issueNumber, submission.id).run();
  } catch (error) {
    await env.FEEDBACK_DB.prepare("UPDATE feedback_submissions SET github_sync_status = 'retry_pending', github_sync_error = ? WHERE id = ?").bind(String(error.message).slice(0, 300), submission.id).run();
  }
}

export class FeedbackRateLimiter {
  constructor(state) { this.state = state; }
  async fetch() {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const stored = (await this.state.storage.get("window")) || { startedAt: now, count: 0 };
    const current = now - stored.startedAt >= hour ? { startedAt: now, count: 0 } : stored;
    if (current.count >= 3) return new Response(null, { status: 429, headers: { "Retry-After": String(Math.ceil((current.startedAt + hour - now) / 1000)) } });
    current.count += 1;
    await this.state.storage.put("window", current);
    return new Response(null, { status: 200 });
  }
}

async function handleSubmission(request, env, ctx, origin) {
  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > MAX_SCREENSHOT_BYTES + 20_000) return feedbackError("payload_too_large", "The submission is too large.", origin, 413);
  if (!request.headers.get("Content-Type")?.startsWith("multipart/form-data")) return feedbackError("invalid_request", "Use the feedback form to send a submission.", origin);
  const form = await request.formData();
  const validated = validateFeedback({
    type: form.get("type"), title: form.get("title"), message: form.get("message"), email: form.get("email"),
    source: form.get("source"), appVersion: form.get("appVersion"), consent: form.get("consent"), company: form.get("company"), screenshot: form.get("screenshot"),
  });
  if (!validated.ok) return feedbackError(validated.code, validated.message, origin);
  const turnstileToken = normalizeText(form.get("cf-turnstile-response"));
  if (!(await verifyTurnstile(turnstileToken, request, env))) return feedbackError("verification_failed", "The anti-spam verification did not complete. Please try again.", origin, 403);
  const limited = await enforceRateLimit(request, env);
  if (!limited.allowed) return feedbackError("rate_limited", "Try again later.", origin, 429);

  const value = validated.value;
  const id = crypto.randomUUID();
  let screenshotKey = null;
  if (value.screenshot) {
    if (!(await verifyScreenshotMagic(value.screenshot))) return feedbackError("invalid_screenshot", "The screenshot file type could not be verified.", origin);
    const suffix = value.screenshot.type === "image/png" ? "png" : value.screenshot.type === "image/jpeg" ? "jpg" : "webp";
    screenshotKey = `submissions/${id}/screenshot.${suffix}`;
  }
  const submission = {
    id, created_at: new Date().toISOString(), expires_at: expirationDate(), source: value.source, report_type: value.type,
    title: value.title, message: value.message, contact_email: value.email, app_version: value.appVersion, screenshot_key: screenshotKey,
    status: "new", verification_status: "unverified", priority: "untriaged",
  };
  await persistSubmission(env, submission);
  if (value.screenshot) {
    try {
      await env.FEEDBACK_SCREENSHOTS.put(screenshotKey, value.screenshot.stream(), { httpMetadata: { contentType: value.screenshot.type }, customMetadata: { submissionId: id } });
    } catch {
      await env.FEEDBACK_DB.prepare("UPDATE feedback_submissions SET screenshot_key = NULL WHERE id = ?").bind(id).run();
      submission.screenshot_key = null;
    }
  }
  ctx.waitUntil(trySync(env, submission));
  return responseJson({ id, accepted: true }, origin, 202);
}

async function retryPendingSubmissions(env) {
  const rows = await env.FEEDBACK_DB.prepare("SELECT * FROM feedback_submissions WHERE github_sync_status IN ('pending', 'retry_pending') ORDER BY created_at LIMIT 25").all();
  for (const submission of rows.results || []) await trySync(env, submission);
}

async function removeExpiredSubmissions(env) {
  const rows = await env.FEEDBACK_DB.prepare("SELECT id, screenshot_key FROM feedback_submissions WHERE expires_at <= ? LIMIT 100").bind(new Date().toISOString()).all();
  for (const row of rows.results || []) {
    if (row.screenshot_key) await env.FEEDBACK_SCREENSHOTS.delete(row.screenshot_key);
    await env.FEEDBACK_DB.prepare("DELETE FROM feedback_submissions WHERE id = ?").bind(row.id).run();
  }
}

export default {
  async fetch(request, env, ctx) {
    const origin = env.ALLOWED_ORIGIN || "https://mycapitalos.com";
    if (request.method === "OPTIONS") return isAllowedOrigin(request, env) ? new Response(null, { status: 204, headers: corsHeaders(origin) }) : new Response(null, { status: 403 });
    if (!isAllowedOrigin(request, env)) return new Response(null, { status: 403 });
    if (new URL(request.url).pathname !== "/v1/feedback" || request.method !== "POST") return feedbackError("not_found", "Not found.", origin, 404);
    try { return await handleSubmission(request, env, ctx, origin); }
    catch (error) { return feedbackError("submission_unavailable", "Feedback is temporarily unavailable. Please try again later.", origin, 503); }
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(Promise.all([retryPendingSubmissions(env), removeExpiredSubmissions(env)]));
  },
};
