"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// SSR সমস্যা এড়াতে dynamic import ব্যবহার করা হয়েছে
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

interface DriveFile {
  id: string;
  name: string;
  thumbnailLink: string;
}

export default function Home() {
  const [movies, setMovies] = useState<DriveFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const folderId = process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID;
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'video/'&key=${apiKey}&fields=files(id,name,thumbnailLink)`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data.files || []);
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <main className="p-6 md:p-12 text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black text-red-600 italic tracking-tighter uppercase">
          My Cinema
        </h1>
        <p className="text-zinc-500 mt-2">Streaming directly from your Google Drive</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-40 italic text-zinc-600">Loading library...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <div key={movie.id} className="group bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-red-600 transition-all shadow-xl">
              <div className="relative h-52">
                <img 
                  src={movie.thumbnailLink ? movie.thumbnailLink.replace('=s220', '=s600') : 'https://via.placeholder.com/600x400?text=No+Thumbnail'} 
                  alt={movie.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-5">
                <h2 className="text-sm font-semibold truncate mb-4 text-zinc-300">{movie.name}</h2>
                <button 
                  onClick={() => setSelectedVideo(movie.id)}
                  className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition-colors active:scale-95"
                >
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal (প্লেয়ার পপ-আপ) */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <button 
            onClick={() => setSelectedVideo(null)}
            className="absolute top-6 right-6 text-white bg-red-600 w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-800 transition-all font-bold text-xl"
          >
            ✕
          </button>
          
          <div className="w-full max-w-5xl aspect-video bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
            <ReactPlayer 
              url={`https://www.googleapis.com/drive/v3/files/${selectedVideo}?alt=media&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
              controls={true}
              width="100%"
              height="100%"
              playing={true}
            />
          </div>
        </div>
      )}
    </main>
  );
}