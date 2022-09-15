import { runInThisContext } from 'vm'

class Car {
  private canvasWidth: number
  private canvasHeight: number
  private ctx: CanvasRenderingContext2D

  private CAR_X_PADDING = 30
  private CAR_BODY_WIDTH = 40
  private CAR_BODY_HEIGHT = 20

  private WHEEL_BODY_SPACE = 3
  private WHEEL_WIDTH = 15
  private WHEEL_HEIGHT = 5

  private WALL_HEIGHT = 100

  private translateX = 0
  private velocity = 0

  private accAnimationFrame: number | null = null
  private brakeAnimationFrame: number | null = null

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.canvasWidth = this.ctx.canvas.width
    this.canvasHeight = this.ctx.canvas.height
  }

  accelerate() {
    if (this.brakeAnimationFrame) {
      cancelAnimationFrame(this.brakeAnimationFrame)
      this.brakeAnimationFrame = null
    }

    if (this.velocity < 20) this.velocity += 0.1
    this.translateX =
      Math.floor(this.translateX + this.velocity) % this.canvasWidth
    this.clearCanvas()
    this.draw()

    this.accAnimationFrame = requestAnimationFrame(() => this.accelerate())
  }

  brake() {
    if (this.accAnimationFrame) {
      cancelAnimationFrame(this.accAnimationFrame)
      this.accAnimationFrame = null
    }

    if (this.velocity <= 0) return

    this.velocity -= 0.1
    this.translateX =
      Math.floor(this.translateX + this.velocity) % this.canvasWidth
    this.clearCanvas()
    this.draw()

    this.brakeAnimationFrame = requestAnimationFrame(() => this.brake())
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  draw() {
    this.drawWall()
    this.drawBoundingLines()
    this.drawCenterLine()
    this.drawBody()
    this.drawWheels()
  }

  private drawWall() {
    this.ctx.save()
    this.ctx.fillStyle = '#333'
    this.ctx.fillRect(0, 0, this.canvasWidth, this.WALL_HEIGHT)
    this.ctx.fillRect(
      0,
      this.canvasHeight - this.WALL_HEIGHT,
      this.canvasWidth,
      this.WALL_HEIGHT
    )
    this.ctx.restore()
  }

  private drawBoundingLines() {
    const lineGap = 10
    const lineWidth = 5

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'orange'
    this.ctx.lineWidth = lineWidth
    this.ctx.moveTo(0, this.WALL_HEIGHT + lineGap)
    this.ctx.lineTo(this.canvasWidth, this.WALL_HEIGHT + lineGap)
    this.ctx.moveTo(0, this.canvasHeight - (this.WALL_HEIGHT + lineGap))
    this.ctx.lineTo(
      this.canvasWidth,
      this.canvasHeight - (this.WALL_HEIGHT + lineGap)
    )
    this.ctx.stroke()
    this.ctx.restore()
  }

  private drawCenterLine() {
    const lineWidth = 5

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'orange'
    this.ctx.translate(-this.translateX, 0)
    this.ctx.moveTo(0, this.canvasHeight / 2)
    this.ctx.lineTo(this.canvasWidth * 2, this.canvasHeight / 2)
    this.ctx.lineWidth = lineWidth
    this.ctx.setLineDash([15, 20])
    this.ctx.stroke()
    this.ctx.restore()
  }

  drawDuplicatedLine(distance: number) {
    const lineWidth = 5

    this.ctx.clearRect(0, 250, this.canvasWidth, 100)
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'orange'
    this.ctx.translate(-distance, 0)
    this.ctx.moveTo(0, this.canvasHeight / 1.5)
    this.ctx.lineTo(this.canvasWidth * 2, this.canvasHeight / 1.5)
    this.ctx.lineWidth = lineWidth
    this.ctx.setLineDash([15, 20])
    this.ctx.stroke()
    this.ctx.restore()
  }

  private drawWheels() {
    this.ctx.save()
    this.ctx.fillStyle = 'gray'

    this.ctx.fillRect(
      this.CAR_X_PADDING,
      this.canvasHeight / 2 -
        this.CAR_BODY_HEIGHT / 2 -
        (this.WHEEL_BODY_SPACE + this.WHEEL_HEIGHT),
      this.WHEEL_WIDTH,
      this.WHEEL_HEIGHT
    )

    this.ctx.fillRect(
      this.CAR_X_PADDING,
      this.canvasHeight / 2 + this.CAR_BODY_HEIGHT / 2 + this.WHEEL_BODY_SPACE,
      this.WHEEL_WIDTH,
      this.WHEEL_HEIGHT
    )

    this.ctx.fillRect(
      this.CAR_X_PADDING + this.CAR_BODY_WIDTH - this.WHEEL_WIDTH,
      this.canvasHeight / 2 -
        this.CAR_BODY_HEIGHT / 2 -
        (this.WHEEL_BODY_SPACE + this.WHEEL_HEIGHT),
      this.WHEEL_WIDTH,
      this.WHEEL_HEIGHT
    )

    this.ctx.fillRect(
      this.CAR_X_PADDING + this.CAR_BODY_WIDTH - this.WHEEL_WIDTH,
      this.canvasHeight / 2 + this.CAR_BODY_HEIGHT / 2 + this.WHEEL_BODY_SPACE,
      this.WHEEL_WIDTH,
      this.WHEEL_HEIGHT
    )

    this.ctx.restore()
  }

  private drawBody() {
    this.ctx.fillRect(
      this.CAR_X_PADDING,
      this.canvasHeight / 2 - this.CAR_BODY_HEIGHT / 2,
      this.CAR_BODY_WIDTH,
      this.CAR_BODY_HEIGHT
    )
  }
}

export default Car
