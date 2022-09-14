import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from './ControllableBox.module.scss'

const CANVAS_WIDTH = 960
const CANVAS_HEIGHT = 540
const BOX_SIZE = 20
const MOVE_UNIT = 5

interface ArrowKeyMap {
  ArrowLeft: boolean
  ArrowRight: boolean
  ArrowUp: boolean
  ArrowDown: boolean
}

const INITIAL_KEY_MAP: ArrowKeyMap = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
}

type BoxPosition = { x: number; y: number }

const boxPosition: BoxPosition = {
  x: CANVAS_WIDTH / 2 - BOX_SIZE / 2,
  y: CANVAS_HEIGHT / 2 - BOX_SIZE / 2,
}

const ARROW_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']

const ControllableBox = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null)

  const pressedKeyMap = useMemo(() => INITIAL_KEY_MAP, [])

  useEffect(() => {
    if (!canvasRef.current) return
    setCanvasContext(canvasRef.current.getContext('2d'))
  }, [canvasRef])

  const clearCanvas = useCallback(() => {
    if (!canvasContext) return
    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }, [canvasContext])

  const draw = useCallback(() => {
    if (!canvasContext) return
    clearCanvas()
    if (pressedKeyMap.ArrowLeft) updateToLeft()
    if (pressedKeyMap.ArrowRight) updateToRight()
    if (pressedKeyMap.ArrowUp) updateToUp()
    if (pressedKeyMap.ArrowDown) updateToDown()

    canvasContext.fillRect(boxPosition.x, boxPosition.y, BOX_SIZE, BOX_SIZE)
    requestAnimationFrame(draw)
  }, [canvasContext, clearCanvas, pressedKeyMap])

  useEffect(() => {
    if (canvasContext) draw()
  }, [canvasContext, draw])

  const updateToLeft = () => {
    if (boxPosition.x - MOVE_UNIT <= 0) {
      boxPosition.x = 0
    } else {
      boxPosition.x -= MOVE_UNIT
    }
  }

  const updateToRight = () => {
    if (boxPosition.x + MOVE_UNIT >= CANVAS_WIDTH - BOX_SIZE) {
      boxPosition.x = CANVAS_WIDTH - BOX_SIZE
    } else {
      boxPosition.x += MOVE_UNIT
    }
  }

  const updateToUp = () => {
    if (boxPosition.y - MOVE_UNIT <= 0) {
      boxPosition.y = 0
    } else {
      boxPosition.y -= MOVE_UNIT
    }
  }

  const updateToDown = () => {
    if (boxPosition.y + MOVE_UNIT >= CANVAS_HEIGHT - BOX_SIZE) {
      boxPosition.y = CANVAS_HEIGHT - BOX_SIZE
    } else {
      boxPosition.y += MOVE_UNIT
    }
  }

  const keyDownHandler = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (ARROW_KEYS.indexOf(event.key) < 0) return

    pressedKeyMap[event.key as keyof ArrowKeyMap] = true
  }

  const keyUpHandler = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (ARROW_KEYS.indexOf(event.key) < 0) return

    pressedKeyMap[event.key as keyof ArrowKeyMap] = false
  }

  return (
    <section className={styles.controllableBox}>
      <canvas
        tabIndex={1}
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onKeyDown={keyDownHandler}
        onKeyUp={keyUpHandler}
      ></canvas>
    </section>
  )
}

export default ControllableBox
