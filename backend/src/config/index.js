const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "";

function normalizeOrigin(origin) {
  const value = String(origin || "").trim().replace(/\/+$/, "");

  if (!value) return "";

  try {
    const parsed = new URL(value);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return value.toLowerCase();
  }
}

const CORS_ORIGIN = Array.from(
  new Set(
    (process.env.CORS_ORIGIN || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
      .flatMap((origin) => {
        if (/^https?:\/\//i.test(origin)) {
          return [normalizeOrigin(origin)];
        }

        return [
          normalizeOrigin(`https://${origin}`),
          normalizeOrigin(`http://${origin}`)
        ];
      })
      .filter(Boolean)
  )
);
const IS_PRODUCTION = process.env.NODE_ENV === "production";

module.exports = {
  PORT,
  JWT_SECRET,
  CORS_ORIGIN,
  IS_PRODUCTION,
  normalizeOrigin
};
