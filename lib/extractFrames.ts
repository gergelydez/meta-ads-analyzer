'use client'

export async function extractFrames(file: File, numFrames = 3): Promise<string[]> {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const url = URL.createObjectURL(file)
    video.src = url
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    video.load()
    video.onloadedmetadata = () => {
      const duration = video.duration
      canvas.width = 320
      canvas.height = Math.round(320 * (video.videoHeight / Math.max(video.videoWidth, 1))) || 180
      const positions = [0.05, 0.50, 0.88]
      const times = positions.slice(0, numFrames).map(p => p * duration)
      const frames: string[] = []
      let idx = 0
      function seekNext() {
        if (idx >= times.length) { URL.revokeObjectURL(url); resolve(frames); return }
        video.currentTime = times[idx]
      }
      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          frames.push(canvas.toDataURL('image/jpeg', 0.55).split(',')[1])
        } catch (_) {}
        idx++; seekNext()
      }
      video.onerror = () => { URL.revokeObjectURL(url); resolve(frames) }
      seekNext()
    }
    video.onerror = () => { URL.revokeObjectURL(url); resolve([]) }
  })
}
