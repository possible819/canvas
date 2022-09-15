import { useEffect, useRef, useState } from 'react'
import Car from './Car'
import styles from './RacingCar.module.scss'

let car: Car

const RacingCar = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (!canvasRef.current || ctx) return
    setCtx(canvasRef.current.getContext('2d'))
  }, [ctx])

  useEffect(() => {
    if (ctx) {
      car = new Car(ctx)
      car.draw()
    }
  }, [ctx])

  return (
    <section className={styles.racingCar}>
      <canvas
        ref={canvasRef}
        width="800"
        height="400"
        onMouseDown={() => {
          if (!car) return
          car.accelerate()
        }}
        onMouseUp={() => {
          if (!car) return
          car.brake()
        }}
      ></canvas>
    </section>
  )
}

export default RacingCar
