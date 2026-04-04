import { jest } from "@jest/globals";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import vm from "vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const swSource = readFileSync(join(__dirname, "..", "sw.js"), "utf-8");

/**
 * Build a mock service worker environment, execute sw.js in it,
 * and return the captured event handlers + mock objects.
 */
function createSwEnv() {
  const handlers = {};
  const cacheStore = new Map(); // cacheName -> Map<url, response>

  const makeCache = (name) => {
    if (!cacheStore.has(name)) cacheStore.set(name, new Map());
    const store = cacheStore.get(name);
    return {
      add: jest.fn(async (url) => {
        store.set(url, { url, body: `fetched:${url}` });
      }),
      put: jest.fn(async (req, resp) => {
        const key = typeof req === "string" ? req : req.url;
        store.set(key, resp);
      }),
      match: jest.fn(async (req) => {
        const key = typeof req === "string" ? req : req.url;
        return store.get(key) || undefined;
      }),
    };
  };

  const caches = {
    open: jest.fn(async (name) => makeCache(name)),
    match: jest.fn(async (req) => {
      const key = typeof req === "string" ? req : req.url;
      for (const store of cacheStore.values()) {
        if (store.has(key)) return store.get(key);
      }
      return undefined;
    }),
    keys: jest.fn(async () => [...cacheStore.keys()]),
    delete: jest.fn(async (name) => cacheStore.delete(name)),
  };

  const self = {
    addEventListener: (event, handler) => {
      handlers[event] = handler;
    },
    skipWaiting: jest.fn(),
    clients: { claim: jest.fn() },
  };

  const context = vm.createContext({
    self,
    caches,
    fetch: globalThis.fetch, // placeholder, tests override via jest.fn
    Promise,
    URL,
    console,
  });

  vm.runInContext(swSource, context);

  return { handlers, caches, cacheStore, self, context };
}

function makeRequest(url, { mode = "navigate", method = "GET" } = {}) {
  return { url, mode, method };
}

function makeResponse(body) {
  return {
    body,
    clone() {
      return { ...this };
    },
  };
}

describe("Service Worker", () => {
  let env;

  beforeEach(() => {
    env = createSwEnv();
  });

  describe("install", () => {
    test("precaches the base path", async () => {
      const waitPromises = [];
      const event = {
        waitUntil: (p) => waitPromises.push(p),
      };
      env.handlers.install(event);

      expect(waitPromises).toHaveLength(1);
      await waitPromises[0];

      // The base path should now be in the cache
      expect(env.cacheStore.has("fretboard-v3")).toBe(true);
      const cache = env.cacheStore.get("fretboard-v3");
      expect(cache.has("/fretboard-adventures/")).toBe(true);
    });

    test("calls skipWaiting", () => {
      env.handlers.install({ waitUntil: () => {} });
      expect(env.self.skipWaiting).toHaveBeenCalled();
    });
  });

  describe("activate", () => {
    test("deletes old caches", async () => {
      // Pre-populate an old cache
      env.cacheStore.set("fretboard-v1", new Map());
      env.cacheStore.set("fretboard-v3", new Map());

      const waitPromises = [];
      env.handlers.activate({ waitUntil: (p) => waitPromises.push(p) });
      await Promise.all(waitPromises);

      expect(env.cacheStore.has("fretboard-v1")).toBe(false);
      expect(env.cacheStore.has("fretboard-v3")).toBe(true);
    });

    test("claims clients", () => {
      env.handlers.activate({ waitUntil: () => {} });
      expect(env.self.clients.claim).toHaveBeenCalled();
    });
  });

  describe("fetch — navigation requests", () => {
    test("returns cached app shell when available (offline cold start)", async () => {
      // Simulate cached index.html from a previous visit
      const cachedResponse = makeResponse("cached-html");
      env.cacheStore.set(
        "fretboard-v3",
        new Map([["/fretboard-adventures/", cachedResponse]]),
      );

      // Network is down
      env.context.fetch = jest.fn(() =>
        Promise.reject(new Error("offline")),
      );

      let respondedWith;
      const event = {
        request: makeRequest("https://example.com/fretboard-adventures/"),
        respondWith: (p) => {
          respondedWith = p;
        },
      };

      env.handlers.fetch(event);
      const response = await respondedWith;

      expect(response).toBe(cachedResponse);
    });

    test("updates cache in background when network succeeds", async () => {
      const cachedResponse = makeResponse("old-html");
      env.cacheStore.set(
        "fretboard-v3",
        new Map([["/fretboard-adventures/", cachedResponse]]),
      );

      const freshResponse = makeResponse("new-html");
      env.context.fetch = jest.fn(() => Promise.resolve(freshResponse));

      let respondedWith;
      const event = {
        request: makeRequest("https://example.com/fretboard-adventures/"),
        respondWith: (p) => {
          respondedWith = p;
        },
      };

      env.handlers.fetch(event);
      const response = await respondedWith;

      // Should return cached version immediately
      expect(response).toBe(cachedResponse);

      // Let the background fetch/cache update settle
      await new Promise((r) => setTimeout(r, 10));

      const cache = env.cacheStore.get("fretboard-v3");
      const updated = cache.get("/fretboard-adventures/");
      expect(updated.body).toBe("new-html");
    });

    test("falls back to network when nothing is cached", async () => {
      const freshResponse = makeResponse("fresh-html");
      env.context.fetch = jest.fn(() => Promise.resolve(freshResponse));

      let respondedWith;
      const event = {
        request: makeRequest("https://example.com/fretboard-adventures/"),
        respondWith: (p) => {
          respondedWith = p;
        },
      };

      env.handlers.fetch(event);
      const response = await respondedWith;

      expect(response).toBe(freshResponse);
    });
  });

  describe("fetch — static assets", () => {
    test("returns cached asset immediately (cache-first)", async () => {
      const cachedAsset = makeResponse("cached-js");
      const assetUrl = "https://example.com/fretboard-adventures/assets/index-abc.js";
      env.cacheStore.set("fretboard-v3", new Map([[assetUrl, cachedAsset]]));

      env.context.fetch = jest.fn(() =>
        Promise.resolve(makeResponse("fresh-js")),
      );

      let respondedWith;
      const event = {
        request: makeRequest(assetUrl, { mode: "cors" }),
        respondWith: (p) => {
          respondedWith = p;
        },
      };

      env.handlers.fetch(event);
      const response = await respondedWith;

      expect(response).toBe(cachedAsset);
    });

    test("fetches and caches asset on first request", async () => {
      const freshAsset = makeResponse("fresh-css");
      const assetUrl = "https://example.com/fretboard-adventures/assets/style-xyz.css";
      env.context.fetch = jest.fn(() => Promise.resolve(freshAsset));

      let respondedWith;
      const event = {
        request: makeRequest(assetUrl, { mode: "cors" }),
        respondWith: (p) => {
          respondedWith = p;
        },
      };

      env.handlers.fetch(event);
      const response = await respondedWith;

      expect(response).toBe(freshAsset);

      // Let cache write settle
      await new Promise((r) => setTimeout(r, 10));

      const cache = env.cacheStore.get("fretboard-v3");
      expect(cache.has(assetUrl)).toBe(true);
    });

    test("ignores non-GET requests", () => {
      let called = false;
      const event = {
        request: { url: "https://example.com/api", method: "POST", mode: "cors" },
        respondWith: () => {
          called = true;
        },
      };

      env.handlers.fetch(event);
      expect(called).toBe(false);
    });
  });
});
