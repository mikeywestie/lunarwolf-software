import { useCallback, useEffect, useRef, useState } from 'react'
import './flappy-wolf.css'

type GameState = 'idle' | 'playing' | 'game-over'

type Obstacle = {
  x: number
  gapY: number
  passed: boolean
}

const WIDTH = 720
const HEIGHT = 420
const WOLF_X = 145
const WOLF_SIZE = 34
const GRAVITY = 0.34
const FLAP_FORCE = -6.4
const PIPE_WIDTH = 74
const PIPE_GAP = 138
const PIPE_SPEED = 2.45
const PIPE_DISTANCE = 250

function FlappyWolf() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number | null>(null)
  const stateRef = useRef<GameState>('idle')
  const wolfYRef = useRef(HEIGHT / 2)
  const velocityRef = useRef(0)
  const obstaclesRef = useRef<Obstacle[]>([])
  const scoreRef = useRef(0)
  const [gameState, setGameState] = useState<GameState>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem('lunarwolf-best') || 0))

  const resetGame = useCallback(() => {
    wolfYRef.current = HEIGHT / 2
    velocityRef.current = 0
    scoreRef.current = 0
    setScore(0)
    obstaclesRef.current = [
      { x: WIDTH + 90, gapY: 150, passed: false },
      { x: WIDTH + 90 + PIPE_DISTANCE, gapY: 250, passed: false },
      { x: WIDTH + 90 + PIPE_DISTANCE * 2, gapY: 185, passed: false },
    ]
  }, [])

  const startGame = useCallback(() => {
    resetGame()
    stateRef.current = 'playing'
    setGameState('playing')
  }, [resetGame])

  const flap = useCallback(() => {
    if (stateRef.current === 'idle' || stateRef.current === 'game-over') {
      startGame()
      velocityRef.current = FLAP_FORCE
      return
    }

    velocityRef.current = FLAP_FORCE
  }, [startGame])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault()
        flap()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [flap])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const drawSky = () => {
      const sky = context.createLinearGradient(0, 0, 0, HEIGHT)
      sky.addColorStop(0, '#6dc9ff')
      sky.addColorStop(1, '#b9e7ff')
      context.fillStyle = sky
      context.fillRect(0, 0, WIDTH, HEIGHT)

      context.fillStyle = 'rgba(255,255,255,0.72)'
      for (let index = 0; index < 5; index += 1) {
        const x = ((index * 170 + performance.now() * 0.012) % (WIDTH + 220)) - 110
        const y = 55 + (index % 3) * 60
        context.beginPath()
        context.ellipse(x, y, 55, 20, 0, 0, Math.PI * 2)
        context.ellipse(x + 38, y - 10, 36, 26, 0, 0, Math.PI * 2)
        context.ellipse(x + 73, y, 49, 18, 0, 0, Math.PI * 2)
        context.fill()
      }
    }

    const drawMoon = () => {
      context.save()
      context.shadowColor = 'rgba(255,255,255,0.5)'
      context.shadowBlur = 22
      context.fillStyle = '#f7fbff'
      context.beginPath()
      context.arc(86, 78, 28, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }

    const drawWolf = () => {
      const y = wolfYRef.current
      context.save()
      context.translate(WOLF_X, y)
      context.rotate(Math.max(-0.35, Math.min(0.55, velocityRef.current * 0.05)))
      context.fillStyle = '#06111f'
      context.beginPath()
      context.moveTo(-17, 8)
      context.lineTo(-6, -9)
      context.lineTo(2, -18)
      context.lineTo(7, -6)
      context.lineTo(18, -1)
      context.lineTo(8, 9)
      context.lineTo(1, 17)
      context.lineTo(-4, 7)
      context.closePath()
      context.fill()

      context.fillStyle = '#9edcff'
      context.beginPath()
      context.arc(8, -2, 2.2, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }

    const drawObstacle = (obstacle: Obstacle) => {
      const topHeight = obstacle.gapY - PIPE_GAP / 2
      const bottomY = obstacle.gapY + PIPE_GAP / 2
      const gradient = context.createLinearGradient(obstacle.x, 0, obstacle.x + PIPE_WIDTH, 0)
      gradient.addColorStop(0, '#0f3555')
      gradient.addColorStop(0.55, '#1b5b89')
      gradient.addColorStop(1, '#0b2842')
      context.fillStyle = gradient
      context.fillRect(obstacle.x, 0, PIPE_WIDTH, topHeight)
      context.fillRect(obstacle.x, bottomY, PIPE_WIDTH, HEIGHT - bottomY)

      context.fillStyle = '#77cbff'
      context.fillRect(obstacle.x - 6, topHeight - 18, PIPE_WIDTH + 12, 18)
      context.fillRect(obstacle.x - 6, bottomY, PIPE_WIDTH + 12, 18)
    }

    const drawOverlay = () => {
      context.textAlign = 'center'
      if (stateRef.current === 'idle') {
        context.fillStyle = 'rgba(4,16,29,0.82)'
        context.font = '700 30px Inter, sans-serif'
        context.fillText('LunarWolf Break Room', WIDTH / 2, 170)
        context.font = '500 17px Inter, sans-serif'
        context.fillText('Click, tap, or press Space to fly', WIDTH / 2, 205)
      }

      if (stateRef.current === 'game-over') {
        context.fillStyle = 'rgba(4,16,29,0.86)'
        context.fillRect(WIDTH / 2 - 170, 126, 340, 150)
        context.fillStyle = '#ffffff'
        context.font = '700 28px Inter, sans-serif'
        context.fillText('Signal lost.', WIDTH / 2, 168)
        context.font = '500 16px Inter, sans-serif'
        context.fillText(`Score ${scoreRef.current} · Click to try again`, WIDTH / 2, 205)
        context.fillStyle = '#8bd4ff'
        context.fillText('Still waiting for your call, apparently.', WIDTH / 2, 239)
      }
    }

    const endGame = () => {
      stateRef.current = 'game-over'
      setGameState('game-over')
      const nextBest = Math.max(best, scoreRef.current)
      setBest(nextBest)
      localStorage.setItem('lunarwolf-best', String(nextBest))
    }

    const update = () => {
      if (stateRef.current !== 'playing') return

      velocityRef.current += GRAVITY
      wolfYRef.current += velocityRef.current

      obstaclesRef.current = obstaclesRef.current.map((obstacle) => {
        const next = { ...obstacle, x: obstacle.x - PIPE_SPEED }
        if (!next.passed && next.x + PIPE_WIDTH < WOLF_X) {
          next.passed = true
          scoreRef.current += 1
          setScore(scoreRef.current)
        }
        return next
      })

      const first = obstaclesRef.current[0]
      if (first && first.x + PIPE_WIDTH < -20) {
        obstaclesRef.current.shift()
        const last = obstaclesRef.current[obstaclesRef.current.length - 1]
        const newGap = 120 + Math.random() * 180
        obstaclesRef.current.push({
          x: last.x + PIPE_DISTANCE,
          gapY: newGap,
          passed: false,
        })
      }

      const wolfTop = wolfYRef.current - WOLF_SIZE / 2
      const wolfBottom = wolfYRef.current + WOLF_SIZE / 2
      const hitBoundary = wolfTop < 0 || wolfBottom > HEIGHT
      const hitObstacle = obstaclesRef.current.some((obstacle) => {
        const overlapsX =
          WOLF_X + WOLF_SIZE / 2 > obstacle.x && WOLF_X - WOLF_SIZE / 2 < obstacle.x + PIPE_WIDTH
        const outsideGap =
          wolfTop < obstacle.gapY - PIPE_GAP / 2 || wolfBottom > obstacle.gapY + PIPE_GAP / 2
        return overlapsX && outsideGap
      })

      if (hitBoundary || hitObstacle) endGame()
    }

    const render = () => {
      drawSky()
      drawMoon()
      update()
      obstaclesRef.current.forEach(drawObstacle)
      drawWolf()

      context.fillStyle = 'rgba(4,16,29,0.86)'
      context.font = '700 24px Inter, sans-serif'
      context.textAlign = 'left'
      context.fillText(String(scoreRef.current), 26, 38)
      drawOverlay()

      frameRef.current = requestAnimationFrame(render)
    }

    resetGame()
    render()

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [best, resetGame])

  return (
    <section className="break-room section-pad" id="break-room">
      <div className="break-room-copy">
        <p className="eyebrow">A very serious business feature</p>
        <h2>The LunarWolf Break Room.</h2>
        <p>
          We included this game so the team can stay entertained while waiting for your call. You
          are, of course, welcome to test it too.
        </p>
        <div className="break-room-meta">
          <span>Score: {score}</span>
          <span>Best: {best}</span>
          <span>{gameState === 'playing' ? 'In flight' : 'Ready when you are'}</span>
        </div>
      </div>

      <div className="game-shell">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          aria-label="LunarWolf side-scrolling flying game"
          role="img"
          onClick={flap}
          onTouchStart={(event) => {
            event.preventDefault()
            flap()
          }}
        />
        <button type="button" onClick={flap}>
          {gameState === 'playing'
            ? 'Flap'
            : gameState === 'game-over'
              ? 'Play again'
              : 'Start game'}
        </button>
      </div>
    </section>
  )
}

export default FlappyWolf
