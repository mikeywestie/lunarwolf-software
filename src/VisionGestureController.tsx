import { useEffect, useRef, useState } from 'react'
import { Hand, LoaderCircle, ToggleLeft, ToggleRight } from 'lucide-react'
import './vision-gestures.css'

type Landmark = { x: number; y: number; z: number }
type HandResult = { landmarks?: Landmark[][] }
type HandLandmarkerInstance = {
  detectForVideo: (video: HTMLVideoElement, timestampMs: number) => HandResult
  close: () => void
}
type VisionModule = {
  FilesetResolver: { forVisionTasks: (wasmPath: string) => Promise<unknown> }
  HandLandmarker: {
    createFromOptions: (
      vision: unknown,
      options: {
        baseOptions: { modelAssetPath: string; delegate: 'GPU' | 'CPU' }
        runningMode: 'VIDEO'
        numHands: number
        minHandDetectionConfidence: number
        minHandPresenceConfidence: number
        minTrackingConfidence: number
      },
    ) => Promise<HandLandmarkerInstance>
  }
}

const moduleUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm'
const wasmUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm'
const modelUrl =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task'

const distance = (a: Landmark, b: Landmark) => Math.hypot(a.x - b.x, a.y - b.y)

function setOpacity(value: number) {
  const slider = document.querySelector<HTMLInputElement>('.vision-opacity input[type="range"]')
  if (!slider) return

  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
  descriptor?.set?.call(slider, String(value))
  slider.dispatchEvent(new Event('input', { bubbles: true }))
}

function clickButton(label: string) {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.vision-studio button'))
  buttons.find((button) => button.textContent?.trim().includes(label))?.click()
}

export default function VisionGestureController() {
  const landmarkerRef = useRef<HandLandmarkerInstance | null>(null)
  const frameRef = useRef<number | null>(null)
  const lastInferenceRef = useRef(0)
  const openPalmStartedRef = useRef<number | null>(null)
  const fistStartedRef = useRef<number | null>(null)
  const cooldownRef = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [gesture, setGesture] = useState('Gesture control is off')

  const toggleGestureControl = () => {
    const nextEnabled = !enabled
    setEnabled(nextEnabled)
    setStatus(nextEnabled ? 'loading' : 'idle')
    setGesture(nextEnabled ? 'Preparing hand tracking…' : 'Gesture control is off')
  }

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    const load = async () => {
      try {
        const visionModule = (await import(/* @vite-ignore */ moduleUrl)) as VisionModule
        const vision = await visionModule.FilesetResolver.forVisionTasks(wasmUrl)
        const landmarker = await visionModule.HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: modelUrl, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.55,
          minHandPresenceConfidence: 0.55,
          minTrackingConfidence: 0.5,
        })

        if (cancelled) {
          landmarker.close()
          return
        }

        landmarkerRef.current = landmarker
        setStatus('ready')
        setGesture('No hand detected')
      } catch {
        if (cancelled) return
        setStatus('error')
        setGesture('Hand tracking could not load')
      }
    }

    void load()

    return () => {
      cancelled = true
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      landmarkerRef.current?.close()
      landmarkerRef.current = null
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || status !== 'ready') return

    const loop = (timestamp: number) => {
      const video = document.querySelector<HTMLVideoElement>('.vision-source')
      if (!video || video.readyState < 2 || !landmarkerRef.current) {
        frameRef.current = requestAnimationFrame(loop)
        return
      }

      if (timestamp - lastInferenceRef.current < 85) {
        frameRef.current = requestAnimationFrame(loop)
        return
      }

      lastInferenceRef.current = timestamp

      const landmarks = landmarkerRef.current.detectForVideo(video, timestamp).landmarks?.[0]
      if (!landmarks) {
        setGesture('No hand detected')
        openPalmStartedRef.current = null
        fistStartedRef.current = null
        frameRef.current = requestAnimationFrame(loop)
        return
      }

      const thumbTip = landmarks[4]
      const indexTip = landmarks[8]
      const wrist = landmarks[0]
      const middleMcp = landmarks[9]
      const palmScale = Math.max(distance(wrist, middleMcp), 0.04)
      const pinchRatio = distance(thumbTip, indexTip) / palmScale
      const extended = [8, 12, 16, 20].filter(
        (tip) => landmarks[tip].y < landmarks[tip - 2].y - 0.018,
      ).length
      const folded = [8, 12, 16, 20].filter(
        (tip) => landmarks[tip].y > landmarks[tip - 2].y + 0.012,
      ).length
      const now = performance.now()

      if (pinchRatio < 1.45) {
        const opacity = Math.round(
          Math.min(100, Math.max(10, 10 + (pinchRatio / 1.45) * 90)),
        )
        setOpacity(opacity)
        setGesture(`Pinch · opacity ${opacity}%`)
        openPalmStartedRef.current = null
        fistStartedRef.current = null
      } else if (extended >= 4) {
        setGesture('Open palm · hold to freeze')
        fistStartedRef.current = null
        openPalmStartedRef.current ??= now

        if (now - openPalmStartedRef.current > 850 && now > cooldownRef.current) {
          const resumeVisible = Array.from(
            document.querySelectorAll<HTMLButtonElement>('.vision-actions button'),
          ).some((button) => button.textContent?.includes('Resume'))

          clickButton(resumeVisible ? 'Resume' : 'Freeze')
          cooldownRef.current = now + 1500
          openPalmStartedRef.current = null
        }
      } else if (folded >= 4) {
        setGesture('Closed fist · hold for invisibility')
        openPalmStartedRef.current = null
        fistStartedRef.current ??= now

        if (now - fistStartedRef.current > 950 && now > cooldownRef.current) {
          const cutoutActive = document
            .querySelector<HTMLButtonElement>('.vision-effect-grid button.active')
            ?.textContent?.includes('Cutout')

          clickButton(cutoutActive ? 'Normal' : 'Cutout')
          cooldownRef.current = now + 1700
          fistStartedRef.current = null
        }
      } else {
        setGesture('Hand detected · ready')
        openPalmStartedRef.current = null
        fistStartedRef.current = null
      }

      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [enabled, status])

  return (
    <section className="vision-gesture-card" aria-label="Vision Studio gesture controls">
      <div className="vision-gesture-heading">
        <span>
          <Hand size={18} /> Gesture control
        </span>
        <button
          type="button"
          className={enabled ? 'enabled' : ''}
          onClick={toggleGestureControl}
          aria-pressed={enabled}
        >
          {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          {enabled ? 'On' : 'Off'}
        </button>
      </div>

      <div className="vision-gesture-status" role="status">
        {status === 'loading' && <LoaderCircle className="vision-gesture-spinner" size={17} />}
        <strong>{status === 'loading' ? 'Loading hand tracking…' : gesture}</strong>
      </div>

      <div className="vision-gesture-help">
        <span>Pinch: opacity</span>
        <span>Open palm: freeze/resume</span>
        <span>Closed fist: cutout/normal</span>
      </div>
    </section>
  )
}
