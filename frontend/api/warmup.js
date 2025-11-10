export default async function handler(req, res) {
  try {
    await fetch("https://explicasurf-backend.onrender.com/health");
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
