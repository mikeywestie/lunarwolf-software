import { useEffect, useRef, useState } from 'react'
import { Camera, Eye, Mic, Radio, ShieldCheck, Video, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import './live-studio.css'

type StudioMode = 'menu' | 'watch' | 'join'

export default function LiveStudioPortal() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<StudioMode>('menu')
  const [permissionMessage, setPermissionMessage] = useState('Camera and microphone are off.')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopPreview = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setPermissionMessage('Camera and microphone are off.')
  }

  const closeStudio = () => {
    stopPreview()
    setMode('menu')
    setOpen(false)
  }

  const enablePreview = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionMessage('Camera preview is not supported in this browser.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setPermissionMessage('Private preview enabled. You are not live.')
    } catch {
      setPermissionMessage('Permission was not granted. You can still watch without camera or microphone.')
    }
  }

  useEffect(() => () => stopPreview(), [])

  return (
    <>
      <button className="live-studio-trigger" type="button" onClick={() => setOpen(true)}>
        <span className="live-studio-trigger-dot" />
        Live Studio
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="live-studio-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeStudio()
            }}
          >
            <motion.section
              className="live-studio-panel"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="live-studio-title"
            >
              <button className="live-studio-close" type="button" onClick={closeStudio} aria-label="Close Live Studio">
                <X size={20} />
              </button>

              <div className="live-studio-status">
                <span><Radio size={15} /> Studio preview</span>
                <small>No live broadcast is active yet</small>
              </div>

              {mode === 'menu' && (
                <div className="live-studio-content">
                  <p className="eyebrow">Live at LunarWolf</p>
                  <h2 id="live-studio-title">Step inside the studio.</h2>
                  <p>
                    Watch future live coding sessions, product walkthroughs, and Q&amp;As—or request to join the waiting room.
                  </p>

                  <div className="live-studio-options">
                    <button type="button" onClick={() => setMode('watch')}>
                      <span><Eye size={22} /></span>
                      <strong>Watch only</strong>
                      <small>No camera or microphone access required.</small>
                    </button>
                    <button type="button" onClick={() => setMode('join')}>
                      <span><Video size={22} /></span>
                      <strong>Request to join</strong>
                      <small>Preview first, then wait for host approval.</small>
                    </button>
                  </div>

                  <div className="live-studio-privacy">
                    <ShieldCheck size={18} />
                    <span>Nothing is recorded or shared without a separate, clear consent step.</span>
                  </div>
                </div>
              )}

              {mode === 'watch' && (
                <div className="live-studio-content">
                  <p className="eyebrow">Viewer mode</p>
                  <h2 id="live-studio-title">You will join as a viewer.</h2>
                  <div className="live-studio-stage">
                    <Radio size={34} />
                    <strong>The studio is currently offline.</strong>
                    <p>When LunarWolf goes live, this area will become the stream player.</p>
                  </div>
                  <button className="live-studio-secondary" type="button" onClick={() => setMode('menu')}>
                    Back to options
                  </button>
                </div>
              )}

              {mode === 'join' && (
                <div className="live-studio-content">
                  <p className="eyebrow">Waiting room</p>
                  <h2 id="live-studio-title">Preview before you request access.</h2>
                  <p>Your camera and microphone remain off until you explicitly enable them.</p>

                  <div className="live-studio-preview">
                    <video ref={videoRef} muted playsInline aria-label="Private camera preview" />
                    {!streamRef.current && (
                      <div>
                        <Camera size={30} />
                        <span>Private preview</span>
                      </div>
                    )}
                  </div>

                  <div className="live-studio-device-status">
                    <span><Camera size={16} /> Camera</span>
                    <span><Mic size={16} /> Microphone</span>
                    <small>{permissionMessage}</small>
                  </div>

                  <div className="live-studio-actions">
                    <button className="live-studio-primary" type="button" onClick={enablePreview}>
                      Enable private preview
                    </button>
                    <button className="live-studio-secondary" type="button" onClick={() => { stopPreview(); setMode('menu') }}>
                      Back
                    </button>
                  </div>

                  <p className="live-studio-footnote">
                    Host approval and real broadcasting will be connected in a later backend milestone.
                  </p>
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
