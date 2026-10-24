import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSiteUrl } from "../lib/site-url.ts";

test("site URLs normalize to an origin without paths, queries or fragments", () => {
  for (const input of ["strategyexperts.in", " https://strategyexperts.in/about?q=1#top ", "//strategyexperts.in"]) {
    assert.equal(normalizeSiteUrl(input), "https://strategyexperts.in");
  }
  assert.equal(normalizeSiteUrl("http://localhost:3000/contact"), "http://localhost:3000");
  assert.equal(normalizeSiteUrl("localhost:3000"), "https://localhost:3000");
});

test("empty, malformed, credential-bearing and non-HTTP URLs use the safe fallback", () => {
  const fallback = normalizeSiteUrl(undefined);
  for (const input of ["", "   ", "https://", "not a host", "javascript:alert(1)", "ftp://example.com", "https://user:password@example.com"]) {
    assert.equal(normalizeSiteUrl(input), fallback, input);
  }
});
