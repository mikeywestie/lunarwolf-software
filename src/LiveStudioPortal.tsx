import { useState } from 'react'
import { ExternalLink, Eye, Radio, ShieldCheck, Users, Video, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import './live-studio.css'
import './live-studio-room.css'

type StudioMode = 'menu' | 'watch' | 'join'

const configuredRoomUrl = import.meta.env.VITE_LIVE_STUDIO_ROOM_URL as string | undefined
const roomUrl =
  configuredRoomUrl?.trim() ||
  'https://meet.jit.si/LunarWolfSoftwareLiveStudio#config.startWithAudioMuted=true&config.startWithVideoMuted=true&config.prejoinPageEnabled=true'

export default function LiveStudioPortal() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<StudioMode>('menu')
  const [roomOpen, setRoomOpen] = useState(false)

  const closeStudio = () => {
    setRoomOpen(false)
    setMode('menu')
    setOpen(false)
  }

  const chooseMode = (nextMode: Exclude<StudioMode, 'menu'>) => {
    setRoomOpen(false)
    setMode(nextMode)
  }

  const returnToMenu = () => {
    setRoomOpen(false)
    setMode('menu')
  }

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
              className={`live-studio-panel${roomOpen ? ' live-studio-panel-room' : ''}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="live-studio-title"
            >
              <button
                className="live-studio-close"
                type="button"
                onClick={closeStudio}
                aria-label="Close Live Studio"
              >
                <X size={20} />
              </button>

              <div className="live-studio-status">
                <span>
                  <Radio size={15} /> Live WebRTC studio
                </span>
                <small>Camera and microphone start muted</small>
              </div>

              {mode === 'menu' && (
                <div className="live-studio-content">
                  <p className="eyebrow">Live at LunarWolf</p>
                  <h2 id="live-studio-title">Step inside the studio.</h2>
                  <p>
                    Join real live coding sessions, product walkthroughs, and Q&amp;As directly from
                    the LunarWolf website.
                  </p>

                  <div className="live-studio-options">
                    <button type="button" onClick={() => chooseMode('watch')}>
                      <span>
                        <Eye size={22} />
                      </span>
                      <strong>Watch muted</strong>
                      <small>Enter with your camera and microphone switched off.</small>
                    </button>
                    <button type="button" onClick={() => chooseMode('join')}>
                      <span>
                        <Video size={22} />
                      </span>
                      <strong>Join the studio</strong>
                      <small>
                        Enter the same live room and choose when to enable your devices.
                      </small>
                    </button>
                  </div>

                  <div className="live-studio-privacy">
                    <ShieldCheck size={18} />
                    <span>
                      Entering the room is always your choice. Browser permission is requested only
                      when you enable a camera or microphone inside the studio.
                    </span>
                  </div>
                </div>
              )}

              {mode !== 'menu' && !roomOpen && (
                <div className="live-studio-content">
                  <p className="eyebrow">
                    {mode === 'watch' ? 'Muted viewer entry' : 'Live participant entry'}
                  </p>
                  <h2 id="live-studio-title">
                    {mode === 'watch'
                      ? 'Enter quietly and watch live.'
                      : 'Join the LunarWolf room.'}
                  </h2>
                  <p>
                    Your camera and microphone start muted. Jitsi will show its own device controls
                    before you choose to enable anything.
                  </p>

                  <div className="live-studio-consent-card">
                    {mode === 'watch' ? <Eye size={30} /> : <Users size={30} />}
                    <strong>
                      {mode === 'watch'
                        ? 'I consent to opening the live room in muted mode.'
                        : 'I consent to opening the live room and understand I control my devices.'}
                    </strong>
                    <p>
                      This opens a real WebRTC meeting. Other people in the room may be able to see
                      your chosen display name and anything you intentionally share.
                    </p>
                  </div>

                  <div className="live-studio-actions">
                    <button
                      className="live-studio-primary"
                      type="button"
                      onClick={() => setRoomOpen(true)}
                    >
                      Enter live room
                    </button>
                    <button className="live-studio-secondary" type="button" onClick={returnToMenu}>
                      Back
                    </button>
                  </div>
                </div>
              )}

              {mode !== 'menu' && roomOpen && (
                <div className="live-studio-room">
                  <div className="live-studio-room-header">
                    <div>
                      <p className="eyebrow">Connected studio</p>
                      <strong>{mode === 'watch' ? 'Muted viewer mode' : 'Participant mode'}</strong>
                    </div>
                    <a href={roomUrl} target="_blank" rel="noopener noreferrer">
                      Open separately <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  </div>
                  <iframe
                    title="LunarWolf Live Studio"
                    src={roomUrl}
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                  <div className="live-studio-room-footer">
                    <span>
                      Use the red hang-up button inside the room before closing this window.
                    </span>
                    <button className="live-studio-secondary" type="button" onClick={returnToMenu}>
                      Leave studio
                    </button>
                  </div>
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
