import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './MovingBox.module.scss'

type BoxPosition = { x: number; y: number }
const CANVAS_WIDTH = 960
const CANVAS_HEIGHT = 540
const BOX_SIZE = 10
const boxPosition: BoxPosition = {
  x: 0,
  y: 0,
}
let HORIZONTAL_DIRECTION: 'left' | 'right' = 'right'
let VERTICAL_DIRECTION: 'up' | 'down' = 'down'
const MOVE_UNIT = 5

const MovingBox = () => {
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    setCanvasContext(canvasRef.current.getContext('2d'))
  }, [canvasRef])

  const clear = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH)
  }

  const updateVertical = () => {
    const positionY =
      boxPosition.y + (VERTICAL_DIRECTION === 'down' ? MOVE_UNIT : -MOVE_UNIT)

    if (VERTICAL_DIRECTION === 'down') {
      if (positionY > CANVAS_HEIGHT - BOX_SIZE) {
        VERTICAL_DIRECTION = 'up'
        boxPosition.y -= MOVE_UNIT
      } else {
        boxPosition.y += MOVE_UNIT
      }
    } else {
      if (positionY < 0) {
        VERTICAL_DIRECTION = 'down'
        boxPosition.y += MOVE_UNIT
      } else {
        boxPosition.y -= MOVE_UNIT
      }
    }
  }

  const update = useCallback(() => {
    const positionX =
      boxPosition.x +
      (HORIZONTAL_DIRECTION === 'right' ? MOVE_UNIT : -MOVE_UNIT)

    if (
      HORIZONTAL_DIRECTION === 'right' &&
      positionX > CANVAS_WIDTH - BOX_SIZE
    ) {
      HORIZONTAL_DIRECTION = 'left'
      updateVertical()
    } else if (HORIZONTAL_DIRECTION === 'left' && positionX < 0) {
      HORIZONTAL_DIRECTION = 'right'
      updateVertical()
    } else {
      boxPosition.x = positionX
    }
  }, [])

  const draw = (context: CanvasRenderingContext2D) => {
    const { x, y } = boxPosition
    context.fillRect(x, y, BOX_SIZE, BOX_SIZE)
  }

  const move = useCallback(() => {
    if (!canvasContext) return
    clear(canvasContext)
    update()
    draw(canvasContext)
    requestAnimationFrame(move)
  }, [canvasContext, update])

  useEffect(() => {
    if (!canvasContext) return

    requestAnimationFrame(move)
  }, [canvasContext, move])

  return (
    <section className={styles.movingBox}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      ></canvas>
    </section>
  )
}

export default MovingBox
