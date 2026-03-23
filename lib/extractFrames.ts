'use client'

/**
 * Extracts N frames from a video File at evenly spaced timestamps.
 * Returns array of base64-encoded JPEG strings.
 */
export async function extractFrames(file: File, numFrames = 5): Promise<string[]> {
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
      canvas.width = 480
      canvas.height = Math.round(480 * (video.videoHeight / Math.max(video.videoWidth, 1))) || 270

      // Positions: hook, early, mid, late, cta
      const positions = [0.04, 0.20, 0.45, 0.70, 0.88]
      const times = positions.slice(0, numFrames).map(p => p * duration)

      const frames: string[] = []
      let idx = 0

      function seekNext() {
        if (idx >= times.length) {
          URL.revokeObjectURL(url)
          resolve(frames)
          return
        }
        video.currentTime = times[idx]
      }

      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const b64 = canvas.toDataURL('image/jpeg', 0.72).split(',')[1]
          frames.push(b64)
        } catch (_) {}
        idx++
        seekNext()
      }

      video.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(frames)
      }

      seekNext()
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      resolve([])
    }
  })
}
