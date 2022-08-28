import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import styles from './Painter.module.scss'

interface CanvasPosition {
  x: number
  y: number
}

const drawingHistory: string[] = []

const Painter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPaintMode, setIsPaintMode] = useState(false)
  const [canvasPosition, setCanvasPosition] = useState<CanvasPosition | null>(
    null
  )
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    setCanvasContext(canvas.getContext('2d'))
  }, [canvasRef])

  useEffect(() => {
    if (!isPaintMode && canvasContext) {
      setCanvasPosition(null)
    }
  }, [canvasContext, isPaintMode])

  const saveCanvasState = useCallback(() => {
    if (!canvasRef.current) return
    drawingHistory.push(canvasRef.current.toDataURL())
  }, [canvasRef])

  const restoreCanvasState = useCallback(() => {
    if (!canvasRef.current || !canvasContext) return
    const lastState = drawingHistory.pop()
    if (!lastState) return

    const image = new Image()
    image.src = lastState
    image.onload = () => {
      console.log('onload')
      canvasContext.drawImage(image, 0, 0)
    }
  }, [canvasRef, canvasContext])

  const getMousePositionOnCanvas = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) throw new Error('No canvas found')

      const canvas = canvasRef.current
      const { x, y } = canvas.getBoundingClientRect()
      return { canvasX: clientX - x, canvasY: clientY - y }
    },
    [canvasRef]
  )

  const draw = useCallback(
    (x: number, y: number) => {
      if (!canvasRef.current || !canvasContext) return
      console.log('draw')

      const { x: lastX = x, y: lastY = y } = canvasPosition || {}

      canvasContext.beginPath()
      canvasContext.moveTo(lastX, lastY)
      canvasContext.lineTo(x, y)
      canvasContext.stroke()

      setCanvasPosition({ x, y })
    },
    [canvasContext, canvasPosition]
  )

  return (
    <section className={styles.painter}>
      <button
        onClick={restoreCanvasState}
        disabled={drawingHistory.length <= 0}
      >
        Undo
      </button>
      <canvas
        ref={canvasRef}
        width="960"
        height="540"
        onMouseDown={() => {
          saveCanvasState()
          setIsPaintMode(true)
        }}
        onMouseUp={() => {
          setIsPaintMode(false)
        }}
        onMouseLeave={() => {
          setIsPaintMode(false)
        }}
        onMouseMove={(event: MouseEvent<HTMLCanvasElement>) => {
          if (isPaintMode) {
            const { canvasX, canvasY } = getMousePositionOnCanvas(
              event.clientX,
              event.clientY
            )

            draw(canvasX, canvasY)
          }
        }}
      ></canvas>
    </section>
  )
}

export default Painter
