import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import styles from './Painter.module.scss'

interface CanvasPosition {
  x: number
  y: number
}

const drawingHistory: string[] = []

const Painter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPaintMode, setIsPaintMode] = useState<boolean | undefined>(undefined)
  const [canvasUpdated, setCanvasUpdated] = useState(false)
  const [canvasPosition, setCanvasPosition] = useState<CanvasPosition | null>(
    null
  )
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null)
  const [currentStateIndex, setCurrentStateIndex] = useState(-1)

  const saveCanvasState = useCallback(() => {
    if (!canvasRef.current) return

    drawingHistory.splice(
      currentStateIndex + 1,
      Infinity,
      canvasRef.current.toDataURL()
    )
  }, [currentStateIndex])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    setCanvasContext(canvas.getContext('2d'))
  }, [canvasRef])

  const clearCanvas = useCallback(() => {
    if (!canvasContext || !canvasRef.current)
      throw new Error('No canvas context found')

    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
  }, [canvasContext])

  useEffect(() => {
    if (!isPaintMode && canvasContext) {
      setCanvasPosition(null)
    }
  }, [canvasContext, isPaintMode, saveCanvasState])

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
      const { x: lastX = x, y: lastY = y } = canvasPosition || {}

      canvasContext.beginPath()
      canvasContext.moveTo(lastX, lastY)
      canvasContext.lineTo(x, y)
      canvasContext.stroke()

      setCanvasPosition({ x, y })
      setCanvasUpdated(true)
    },
    [canvasContext, canvasPosition]
  )

  const drawByState = useCallback(
    (stateIndex: number) => {
      if (!canvasContext) throw new Error('No canvas context found')
      clearCanvas()
      const state = drawingHistory[stateIndex]
      if (!state) {
        clearCanvas()
      } else {
        const image = new Image()
        image.src = state
        image.onload = () => {
          canvasContext.drawImage(image, 0, 0)
        }
      }
    },
    [canvasContext, clearCanvas]
  )

  const undo = useCallback(() => {
    drawByState(currentStateIndex - 1)
    setCurrentStateIndex(currentStateIndex - 1)
  }, [currentStateIndex, drawByState])

  const redo = useCallback(() => {
    drawByState(currentStateIndex + 1)
    setCurrentStateIndex(currentStateIndex + 1)
  }, [currentStateIndex, drawByState])

  return (
    <section className={styles.painter}>
      <section className={styles.controller}>
        <button onClick={undo} disabled={currentStateIndex < 0}>
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!drawingHistory[currentStateIndex + 1]}
        >
          Redo
        </button>
      </section>

      <canvas
        ref={canvasRef}
        width="960"
        height="540"
        onMouseDown={() => {
          setIsPaintMode(true)
        }}
        onMouseUp={() => {
          if (isPaintMode && canvasUpdated) {
            setCurrentStateIndex((value) => value + 1)
            saveCanvasState()
            setCanvasUpdated(false)
          }

          setIsPaintMode(false)
        }}
        onMouseLeave={() => {
          if (isPaintMode && canvasUpdated) {
            setCurrentStateIndex((value) => value + 1)
            saveCanvasState()
            setCanvasUpdated(false)
          }

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
