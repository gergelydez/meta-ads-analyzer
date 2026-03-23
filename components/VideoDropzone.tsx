'use client'
import { useRef, useState } from 'react'
import { VideoFile } from '@/lib/types'

interface Props {
  videos: VideoFile[]
  onAdd: (files: File[]) => void
  onRemove: (id: string) => void
  onTranscriptChange: (id: string, val: string) => void
}

export default function VideoDropzone({ videos, onAdd, onRemove, onTranscriptChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('video/'))
    onAdd(files)
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
          ${dragging
            ? 'border-lav/60 bg-lav/8 scale-[1.003]'
            : 'border-lav/25 bg-lav/[0.02] hover:border-lav/50 hover:bg-lav/5'}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*"
          className="hidden"
          onChange={e => onAdd(Array.from(e.target.files || []))}
        />
        <div className="text-5xl mb-4">🎥</div>
        <div className="text-lg font-bold mb-1.5">
          Drag & Drop sau{' '}
          <span className="text-lav">Browse</span>
        </div>
        <div className="text-xs text-dim font-mono mb-4">
          Până la 8 clipuri — AI analizează vizual + audio + text
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          {['MP4', 'MOV', 'WEBM', 'AVI', 'MKV'].map(f => (
            <span key={f} className="px-2.5 py-1 rounded bg-white/4 border border-white/10 text-[10px] text-dim font-mono tracking-wide">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Video cards */}
      {videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {videos.map((v, i) => (
            <div key={v.id} className="bg-ink3 border border-white/7 rounded-2xl overflow-hidden">
              {/* Thumbnail */}
              <div className="relative">
                <video
                  src={v.objectUrl}
                  muted
                  preload="metadata"
                  className="w-full aspect-video object-cover bg-ink4"
                />
                <button
                  onClick={() => onRemove(v.id)}
                  className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/70 flex items-center justify-center text-dim hover:bg-red-500 hover:text-white transition-all text-sm"
                >✕</button>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-neon tracking-wide">
                  READY
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="text-xs font-semibold truncate">{v.name}</div>
                <div className="text-[10px] text-dim font-mono mt-1">{(v.size / 1024 / 1024).toFixed(1)} MB</div>
              </div>

              {/* Transcript */}
              <div className="px-3 pb-3">
                <div className="text-[10px] font-mono tracking-widest text-lav mb-1.5 uppercase">
                  🎙 Voiceover + Captions + Text din clip
                </div>
                <textarea
                  value={v.transcript}
                  onChange={e => onTranscriptChange(v.id, e.target.value)}
                  placeholder={`Scrie ce se aude și ce apare scris:\nex: "Dacă ai pete pe față..." + text overlay: "REZULTATE ÎN 14 ZILE" + CTA: "Link în bio"`}
                  rows={3}
                  className="w-full bg-ink border border-white/10 rounded-lg text-[11px] font-mono text-white/80 p-2.5 outline-none resize-none focus:border-neon/30 transition-colors placeholder:text-dim2/60"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
