import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { plateImage, platePath } from '../navPlate'

const numbers = (d: string) => (d.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number)

describe('platePath', () => {
  it('is the exported plate at 390, fill and rim', () => {
    const svg = readFileSync(join(process.cwd(), 'public/images/nav/nav-bar-plate.svg'), 'utf8')
    const paths = (text: string) => [...text.matchAll(/<path d="([^"]+)"/g)].map((m) => numbers(m[1])).slice(0, 2)
    expect(paths(decodeURIComponent(plateImage(390)))).toEqual(paths(svg))
  })

  it('keeps the notch shape and moves it with the button at 480', () => {
    const at390 = numbers(platePath(390))
    const at480 = numbers(platePath(480))
    // Index 29 is `H148.809`, where the notch starts; 50 is `226.88`, where it ends.
    expect(at390[29]).toBe(148.809)
    expect(at390[50]).toBe(226.88)
    expect(at480[50] - at480[29]).toBeCloseTo(78.071, 3)
    // The button's left edge is calc(48.169% - 31.859px): 90px more frame moves it 43.352.
    expect(at480[29] - at390[29]).toBeCloseTo(0.48169 * 90, 3)
    expect(at480[0] - at390[0]).toBe(90)
  })
})
