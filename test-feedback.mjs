import assert from "node:assert/strict";
import test from "node:test";
import { friendlyError, sourceFromLocation } from "./feedback.js";

test("desktop source is opt-in through a harmless URL marker", () => {
  assert.equal(sourceFromLocation("?source=desktop"), "desktop");
  assert.equal(sourceFromLocation("?source=anything-else"), "web");
});

test("submission failures do not expose backend details", () => {
  assert.equal(friendlyError({ error: "rate_limited" }), "Too many reports were sent from this connection. Please try again later.");
  assert.equal(friendlyError({}), "Feedback is temporarily unavailable. Please try again later.");
});
