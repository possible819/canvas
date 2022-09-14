import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Transforming.module.scss'

const CANVAS_WIDTH = 960
const CANVAS_HEIGHT = 540
const CIRCLE_RADIUS = 30

const Transforming = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    setCtx(canvasRef.current.getContext('2d'))
  }, [canvasRef])

  const clearCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }, [])

  const drawCircle = useCallback(
    (ctx: CanvasRenderingContext2D, angle: number) => {
      ctx.save()
      ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.arc(100, 0, CIRCLE_RADIUS, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    },
    []
  )

  const angle = useRef(0)

  const draw = useCallback(() => {
    if (!ctx) return
    clearCanvas(ctx)
    drawCircle(ctx, angle.current)

    requestAnimationFrame(() => {
      draw()
      angle.current += 0.05
    })
  }, [clearCanvas, ctx, drawCircle])

  useEffect(draw, [draw])

  return (
    <section className={styles.transforming}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      ></canvas>
    </section>
  )
}

export default Transforming
