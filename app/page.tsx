"use client";
import { useEffect, useState, useCallback } from "react";

interface DriveFile {
  id: string;
  name: string;
  thumbnailLink?: string;
}

export default function Home() {
  const [movies, setMovies] = useState<DriveFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DriveFile | null>(null);

  const filtered = movies.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetch("/api/movies")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setMovies(data.files || []);
      })
      .catch(() => setError("Network error. Page reload করো।"))
      .finally(() => setLoading(false));
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
  }, [selected]);

  const thumb = (f: DriveFile) =>
    f.thumbnailLink
      ? f.thumbnailLink.replace(/=s\d+/, "=s600")
      : `https://drive.google.com/thumbnail?id=${f.id}&sz=w600`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;600&display=swap');

        .page { padding: 0 24px 60px; max-width: 1400px; margin: 0 auto; }

        header { text-align: center; padding: 52px 24px 32px; }
        header h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 10vw, 100px);
          letter-spacing: 6px; color: #e50914; line-height: 1;
          text-shadow: 0 0 60px rgba(229,9,20,.3);
        }
        header p { color: #555; font-size: 14px; margin-top: 8px; letter-spacing: 1px; }

        /* ── Search ── */
        .search-wrap {
          max-width: 520px; margin: 0 auto 28px;
          position: relative;
        }
        .search-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%); color: #555;
          font-size: 16px; pointer-events: none;
        }
        .search-input {
          width: 100%; background: #111; border: 1px solid #2a2a2a;
          border-radius: 14px; padding: 14px 44px;
          color: #fff; font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .search-input:focus {
          border-color: #e50914;
          box-shadow: 0 0 0 3px rgba(229,9,20,.12);
        }
        .search-input::placeholder { color: #444; }
        .search-clear {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: #2a2a2a; border: none; color: #888;
          width: 24px; height: 24px; border-radius: 50%;
          font-size: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s, color .2s;
        }
        .search-clear:hover { background: #e50914; color: #fff; }

        .result-count {
          text-align: center; color: #444; font-size: 13px; margin-bottom: 24px;
        }
        .result-count span { color: #e50914; font-weight: 600; }

        /* ── Loader ── */
        .loader {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; padding: 80px 24px; color: #555;
        }
        .spinner {
          width: 36px; height: 36px;
          border: 3px solid #222; border-top-color: #e50914;
          border-radius: 50%; animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-box {
          background: #1a0505; border: 1px solid #5a1010;
          border-radius: 14px; padding: 20px 24px;
          max-width: 600px; margin: 40px auto;
        }
        .error-box strong { color: #f66; display: block; margin-bottom: 6px; }
        .error-box p { color: #c88; font-size: 13px; line-height: 1.7; }

        .empty { text-align: center; padding: 80px 24px; color: #555; }
        .empty small { display: block; margin-top: 8px; font-size: 13px; color: #333; }

        .no-results { text-align: center; padding: 60px 24px; color: #555; }
        .no-results strong { display: block; font-size: 18px; color: #333; margin-bottom: 8px; }

        /* ── Grid ── */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .card {
          background: #111; border: 1px solid #1f1f1f;
          border-radius: 16px; overflow: hidden; cursor: pointer;
          transition: border-color .25s, transform .25s, box-shadow .25s;
          animation: fadeUp .4s ease both;
        }
        .card:hover {
          border-color: #e50914; transform: translateY(-5px);
          box-shadow: 0 14px 40px rgba(229,9,20,.18);
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .card img {
          width: 100%; aspect-ratio: 16/9; object-fit: cover;
          display: block; background: #1a1a1a; transition: transform .4s;
        }
        .card:hover img { transform: scale(1.05); }
        .card-body { padding: 14px; }
        .card-title {
          font-size: 13px; font-weight: 500; color: #ccc;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 12px;
        }
        .watch-btn {
          width: 100%; background: #e50914; color: #fff; border: none;
          border-radius: 10px; padding: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; letter-spacing: .5px;
          transition: background .2s, transform .1s;
        }
        .watch-btn:hover { background: #b0060f; }
        .watch-btn:active { transform: scale(.97); }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.94); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px; animation: fadeIn .2s ease;
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .modal-box {
          width: 100%; max-width: 1000px; background: #0e0e0e;
          border: 1px solid #222; border-radius: 20px; overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,.8); animation: scaleIn .2s ease;
        }
        @keyframes scaleIn { from { transform: scale(.95); } to { transform: scale(1); } }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; border-bottom: 1px solid #1a1a1a; gap: 12px;
        }
        .modal-title {
          font-size: 14px; font-weight: 600; color: #ddd;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .close-btn {
          flex-shrink: 0; width: 36px; height: 36px;
          background: #1e1e1e; border: 1px solid #333; color: #fff;
          border-radius: 50%; font-size: 16px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s, border-color .2s;
        }
        .close-btn:hover { background: #e50914; border-color: #e50914; }
        .video-wrap {
          position: relative; padding-bottom: 56.25%; height: 0; background: #000;
        }
        .video-wrap iframe {
          position: absolute; inset: 0; width: 100%; height: 100%; border: none;
        }

        footer { text-align: center; padding: 24px; color: #222; font-size: 12px; }
      `}</style>

      <header>
        <h1>My Cinema</h1>
        <p>Streaming directly from Google Drive</p>
      </header>

      <div className="page">

        {/* Search Bar — movies load হলেই দেখাবে */}
        {!loading && !error && movies.length > 0 && (
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear">✕</button>
            )}
          </div>
        )}

        {/* Result count */}
        {search && !loading && (
          <div className="result-count">
            <span>{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;
          </div>
        )}

        {loading && (
          <div className="loader">
            <div className="spinner" />
            <p>Loading your library...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <strong>⚠ Error</strong>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="empty">
            <p>কোনো ভিডিও পাওয়া যায়নি।</p>
            <small>Folder ID ঠিক আছে কিনা এবং Folder টা &quot;Anyone with the link&quot; করা আছে কিনা চেক করো।</small>
          </div>
        )}

        {/* No search results */}
        {!loading && search && filtered.length === 0 && (
          <div className="no-results">
            <strong>কোনো result নেই</strong>
            &quot;{search}&quot; নামে কোনো movie পাওয়া যায়নি।
          </div>
        )}

        {filtered.length > 0 && (
          <div className="grid">
            {filtered.map((movie, i) => (
              <div
                key={movie.id}
                className="card"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb(movie)}
                  alt={movie.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://drive.google.com/thumbnail?id=${movie.id}&sz=w600`;
                  }}
                />
                <div className="card-body">
                  <div className="card-title" title={movie.name}>{movie.name}</div>
                  <button className="watch-btn" onClick={() => setSelected(movie)}>
                    ▶ Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="modal-box">
            <div className="modal-header">
              <span className="modal-title">{selected.name}</span>
              <button className="close-btn" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <div className="video-wrap">
              <iframe
                src={`https://drive.google.com/file/d/${selected.id}/preview`}
                allow="autoplay; fullscreen"
                allowFullScreen
                title={selected.name}
              />
            </div>
          </div>
        </div>
      )}

      <footer>My Cinema — Powered by Google Drive</footer>
    </>
  );
}
