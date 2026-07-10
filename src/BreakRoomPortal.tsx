import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import FlappyWolf from './FlappyWolf'

function BreakRoomPortal() {
  const [host, setHost] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const contact = document.getElementById('contact')
    if (!contact?.parentElement) return

    const mount = document.createElement('div')
    mount.dataset.breakRoomMount = 'true'
    contact.parentElement.insertBefore(mount, contact)
    setHost(mount)

    return () => mount.remove()
  }, [])

  return host ? createPortal(<FlappyWolf />, host) : null
}

export default BreakRoomPortal
