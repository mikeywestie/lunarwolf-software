import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, CircleDot, Download, Pause, Play, Sparkles } from 'lucide-react'
import './vision-studio.css'

type EffectMode = 'normal' | 'ghost' | 'portal'

export default function VisionStudioPanel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const [effect, setEffect] = useState<EffectMode>('normal')
  const [opacity, setOpacity] = useState(55)
  const [error, setError] = useState('')

  const stopCamera = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    animationRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  useEffect(() => stopCamera, [])

  useEffect(() => {
    if (!cameraOn || frozen) return

    const draw = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }

      const width = video.videoWidth || 1280
      const height = video.videoHeight || 720
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      const context = canvas.getContext('2d')
      if (!context) return

      context.clearRect(0, 0, width, height)
      context.save()
      context.translate(width, 0)
      context.scale(-1, 1)

      if (effect === 'ghost') {
        context.globalAlpha = opacity / 100
      }

      context.drawImage(video, 0, 0, width, height)
      context.restore()

      if (effect === 'portal') {
        const radius = Math.min(width, height) * 0.22
        const x = width * 0.68
        const y = height * 0.45

        context.save()
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.clip()
        context.globalAlpha = opacity / 100
        context.translate(width, 0)
        context.scale(-1, 1)
        context.drawImage(video, 0, 0, width, height)
        context.restore()

        const gradient = context.createLinearGradient(
          x - radius,
          y - radius,
          x + radius,
          y + radius,
        )
        gradient.addColorStop(0, 'rgba(128, 220, 255, 0.95)')
        gradient.addColorStop(0.5, 'rgba(179, 121, 255, 0.95)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)')
        context.strokeStyle = gradient
        context.lineWidth = Math.max(6, width * 0.008)
        context.shadowBlur = 24
        context.shadowColor = 'rgba(153, 109, 255, 0.9)'
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.stroke()
      }

      context.globalAlpha = 1
      context.fillStyle = 'rgba(5, 8, 20, 0.65)'
      context.fillRect(20, height - 58, 245, 36)
      context.fillStyle = '#ffffff'
      context.font = `${Math.max(16, width * 0.015)}px Inter, sans-serif`
      context.fillText('LunarWolf Vision Studio', 34, height - 34)

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [cameraOn, effect, frozen, opacity])

  const startCamera = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOn(true)
      setFrozen(false)
    } catch {
      setError('Camera access was not available. Check the browser permission and try again.')
    }
  }

  const saveFrame = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `lunarwolf-vision-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="vision-studio">
      <div className="vision-stage">
        <video ref={videoRef} muted playsInline className="vision-source" aria-hidden="true" />
        <canvas ref={canvasRef} aria-label="Processed LunarWolf Vision Studio camera preview" />
        {!cameraOn && (
          <div className="vision-placeholder">
            <Sparkles size={34} />
            <strong>Vision effects are ready</strong>
            <span>Your camera stays on this device while the preview is processed.</span>
          </div>
        )}
      </div>

      <div className="vision-controls">
        <div className="vision-effect-grid" role="group" aria-label="Camera effect">
          <button
            className={effect === 'normal' ? 'active' : ''}
            onClick={() => setEffect('normal')}
            type="button"
          >
            <Camera size={18} /> Normal
          </button>
          <button
            className={effect === 'ghost' ? 'active' : ''}
            onClick={() => setEffect('ghost')}
            type="button"
          >
            <Sparkles size={18} /> Ghost
          </button>
          <button
            className={effect === 'portal' ? 'active' : ''}
            onClick={() => setEffect('portal')}
            type="button"
          >
            <CircleDot size={18} /> Portal
          </button>
        </div>

        <label className="vision-opacity">
          <span>Effect opacity</span>
          <strong>{opacity}%</strong>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(event) => setOpacity(Number(event.target.value))}
          />
        </label>

        <div className="vision-actions">
          {!cameraOn ? (
            <button className="live-studio-primary" type="button" onClick={startCamera}>
              <Camera size={18} /> Start camera
            </button>
          ) : (
            <button className="live-studio-secondary" type="button" onClick={stopCamera}>
              <CameraOff size={18} /> Stop camera
            </button>
          )}
          <button
            className="live-studio-secondary"
            type="button"
            disabled={!cameraOn}
            onClick={() => setFrozen((value) => !value)}
          >
            {frozen ? <Play size={18} /> : <Pause size={18} />}
            {frozen ? 'Resume' : 'Freeze'}
          </button>
          <button
            className="live-studio-secondary"
            type="button"
            disabled={!cameraOn}
            onClick={saveFrame}
          >
            <Download size={18} /> Snapshot
          </button>
        </div>

        {error && (
          <p className="vision-error" role="alert">
            {error}
          </p>
        )}
        <p className="vision-note">
          Prototype pipeline: webcam → canvas effects → browser MediaStream-ready output. Gesture
          recognition and person segmentation are the next layer.
        </p>
      </div>
    </div>
  )
}
