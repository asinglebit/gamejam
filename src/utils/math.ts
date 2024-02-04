export const range = (min: number, max: number): number => {
    return Math.random() * (max - min + 1) + min
}

export const scatter = (step: number, { left, width, top, height }: { left: number, width: number, top: number, height: number }, offset: number, jitter: number, outside: boolean = true): Coordinates[] => {
    const points: Coordinates[] = []
    if (outside) {
      for (let r = top - offset; r < top + height + offset; ++r) {
        for (let c = left - offset; c < left + width + offset; ++c) {
          if (c < left || c > left + width || r < top || r > top + height) {
            const x = step / 2 + c * step + range(-jitter, jitter)
            const y = step / 2 + r * step + range(-jitter, jitter)
            points.push({ x, y })
          }
        }
      }
    } else {
      for (let r = top - offset; r < height + offset; ++r) {
        for (let c = left - offset; c < width + offset; ++c) {
          const x = step / 2 + c * step + range(-jitter, jitter)
          const y = step / 2 + r * step + range(-jitter, jitter)
          points.push({ x, y })
        }
      }
    }
    return points
}
