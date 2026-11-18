const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_TRACKED_IPS = 10000;
const attemptsByIp = new Map();

const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of attemptsByIp) {
    if (entry.resetAt <= now) attemptsByIp.delete(ip);
  }
}, WINDOW_MS);
cleanupInterval.unref();

function authRateLimit(req, res, next) {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  let entry = attemptsByIp.get(ip);

  if (!entry || entry.resetAt <= now) {
    if (attemptsByIp.size >= MAX_TRACKED_IPS) {
      for (const [trackedIp, trackedEntry] of attemptsByIp) {
        if (trackedEntry.resetAt <= now) attemptsByIp.delete(trackedIp);
      }
      if (attemptsByIp.size >= MAX_TRACKED_IPS) {
        attemptsByIp.delete(attemptsByIp.keys().next().value);
      }
    }
    entry = { count: 0, resetAt: now + WINDOW_MS };
    attemptsByIp.set(ip, entry);
  }

  if (entry.count >= MAX_ATTEMPTS) {
    res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
    return res.status(429).json({ message: "Too many authentication attempts" });
  }

  // Count every attempt, including successful registrations and logins.
  // Otherwise an attacker can create unlimited accounts with valid requests.
  entry.count += 1;

  return next();
}

module.exports = authRateLimit;
