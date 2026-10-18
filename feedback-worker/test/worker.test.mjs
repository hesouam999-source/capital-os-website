import assert from "node:assert/strict";
import test from "node:test";
import worker, { githubLabels, isAllowedOrigin, privateIssuePayload, validateFeedback } from "../src/index.js";

const valid = {
  type: "bug",
  title: "Saving a value does not refresh",
  message: "After saving a value, the object list does not refresh until I change sections.",
  email: "tester@example.com",
  source: "desktop",
  appVersion: "0.0.69",
  consent: "yes",
  company: "",
};

test("accepts a minimal consented private feedback submission", () => {
  const result = validateFeedback(valid);
  assert.equal(result.ok, true);
  assert.equal(result.value.source, "desktop");
});

test("rejects submissions without explicit consent", () => {
  const result = validateFeedback({ ...valid, consent: "" });
  assert.deepEqual({ ok: result.ok, code: result.code }, { ok: false, code: "consent_required" });
});

test("rejects a filled anti-spam honeypot", () => {
  const result = validateFeedback({ ...valid, company: "robot corporation" });
  assert.deepEqual({ ok: result.ok, code: result.code }, { ok: false, code: "spam_detected" });
});

test("only accepts requests originating from the production site", () => {
  const environment = { ALLOWED_ORIGIN: "https://mycapitalos.com" };
  assert.equal(isAllowedOrigin(new Request("https://capital-os-feedback.hesouam999.workers.dev/v1/feedback", { headers: { Origin: "https://mycapitalos.com" } }), environment), true);
  assert.equal(isAllowedOrigin(new Request("https://capital-os-feedback.hesouam999.workers.dev/v1/feedback", { headers: { Origin: "https://evil.example" } }), environment), false);
});

test("rejects a cross-origin request before it can reach storage or GitHub", async () => {
  const response = await worker.fetch(
    new Request("https://capital-os-feedback.hesouam999.workers.dev/v1/feedback", { method: "POST", headers: { Origin: "https://evil.example" } }),
    { ALLOWED_ORIGIN: "https://mycapitalos.com" },
    { waitUntil() {} },
  );
  assert.equal(response.status, 403);
});

test("rejects a non-image or oversized attachment before storage", () => {
  const result = validateFeedback({ ...valid, screenshot: { type: "application/pdf", size: 20, arrayBuffer: async () => new ArrayBuffer(0) } });
  assert.deepEqual({ ok: result.ok, code: result.code }, { ok: false, code: "invalid_screenshot" });
});

test("creates a private GitHub card without report text, email, or attachment URL", () => {
  const payload = privateIssuePayload({
    id: "submission-123", report_type: "bug", source: "web", screenshot_key: "submissions/secret.png",
    contact_email: "tester@example.com", title: "My private account title", message: "My private feedback message",
    priority: "untriaged", status: "new", verification_status: "unverified",
  });
  assert.deepEqual(payload.labels, ["type: bug", "priority: untriaged", "status: new", "verification: unverified"]);
  assert.match(payload.title, /submission-123/);
  assert.doesNotMatch(`${payload.title}\n${payload.body}`, /tester@example\.com|secret\.png|My private account title|My private feedback message/);
});

test("all new reports receive New and Unverified labels", () => {
  assert.deepEqual(githubLabels("question"), ["type: question", "priority: untriaged", "status: new", "verification: unverified"]);
});
