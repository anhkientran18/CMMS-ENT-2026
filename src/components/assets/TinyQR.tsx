/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function TinyQR({ seed = 0 }: { seed?: number }) {
  const dataModules: Array<[number, number]> = []
  const isFinderZone = (x: number, y: number) =>
    (x <= 7 && y <= 7) || (x >= 13 && y <= 7) || (x <= 7 && y >= 13)

  for (let y = 0; y < 21; y += 1) {
    for (let x = 0; x < 21; x += 1) {
      if (isFinderZone(x, y) || x === 6 || y === 6) continue
      const hash = (x * 13 + y * 7 + seed * 11 + ((x * y) % 17)) % 19
      if (hash < 9 || (x + y + seed) % 7 === 0) dataModules.push([x, y])
    }
  }

  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect fill="currentColor" height="7" width="7" x={x} y={y} />
      <rect fill="white" height="5" width="5" x={x + 1} y={y + 1} />
      <rect fill="currentColor" height="3" width="3" x={x + 2} y={y + 2} />
    </g>
  )

  return (
    <svg
      aria-label="Mã QR tài sản"
      className="size-[88px] shrink-0 bg-white p-1 text-slate-900"
      role="img"
      shapeRendering="crispEdges"
      viewBox="-2 -2 25 25"
    >
      <rect fill="white" height="25" width="25" x="-2" y="-2" />
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
      {[0, 2, 4].map((index) => (
        <rect
          fill="currentColor"
          height="1"
          key={`h-${index}`}
          width="1"
          x={8 + index}
          y="6"
        />
      ))}
      {[0, 2, 4].map((index) => (
        <rect
          fill="currentColor"
          height="1"
          key={`v-${index}`}
          width="1"
          x="6"
          y={8 + index}
        />
      ))}
      {dataModules.map(([x, y]) => (
        <rect
          fill="currentColor"
          height="1"
          key={`${x}-${y}`}
          width="1"
          x={x}
          y={y}
        />
      ))}
      <rect fill="currentColor" height="1" width="1" x="8" y="13" />
    </svg>
  )
}
