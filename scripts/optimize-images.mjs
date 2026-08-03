import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const root = 'public'
const MAX_W = 1920
const JPG_Q = 82
const PNG_Q = 80

const convertToJpg = [
  'portfolio/Mockup.png',
  'portfolio/NEW_OKTAGON.png',
  'portfolio/SET-1920x1080.png',
  'portfolio/SceneBedtime-stories.png',
]

const compressKeep = [
  'thumbnail.jpg',
  'portfolio/Semin.jpg',
  'portfolio/Fight-arena.jpg',
  'portfolio/PROFIFIX.jpg',
  'portfolio/Profile.jpg',
  'portfolio/mistytea-mockup-min-1920x1280.jpg',
  'portfolio/casopis.jpg',
  'portfolio/me-about.jpg',
  'portfolio/LENNER.jpg',
  'portfolio/misty-tea.jpg',
  'portfolio/landing-page.jpg',
  'portfolio/Vaschovatel.jpg',
  'portfolio/Svet_prumyslu_web.jpg',
  'portfolio/Frame-2-1920x1383.png',
  'portfolio/Frame-3-1920x1272.png',
  'portfolio/Searching-a-product-1920x943.png',
  'portfolio/me.png',
  'portfolio/Computer-Screen-Mockup-e1643478087856.png',
  'portfolio/portfolio5.png',
]

function abs(relPath) {
  return path.join(root, ...relPath.split('/'))
}

async function optimizeKeep(relPath) {
  const file = abs(relPath)
  if (!fs.existsSync(file)) return null
  const before = fs.statSync(file).size
  const ext = path.extname(file).toLowerCase()
  const tmp = `${file}.opt.tmp`
  let pipeline = sharp(file).rotate().resize({ width: MAX_W, withoutEnlargement: true })
  if (ext === '.png') {
    await pipeline.png({ quality: PNG_Q, compressionLevel: 9, effort: 10 }).toFile(tmp)
  } else {
    await pipeline.jpeg({ quality: JPG_Q, mozjpeg: true }).toFile(tmp)
  }
  const after = fs.statSync(tmp).size
  if (after < before) {
    fs.renameSync(tmp, file)
    return { file: relPath, before, after, action: 'compress' }
  }
  fs.unlinkSync(tmp)
  return { file: relPath, before, after: before, action: 'skip' }
}

async function convertJpg(relPath) {
  const file = abs(relPath)
  if (!fs.existsSync(file)) return null
  const before = fs.statSync(file).size
  const out = file.replace(/\.png$/i, '.jpg')
  const tmp = `${out}.opt.tmp`
  await sharp(file)
    .rotate()
    .resize({ width: MAX_W, withoutEnlargement: true })
    .flatten({ background: '#1a1a1a' })
    .jpeg({ quality: JPG_Q, mozjpeg: true })
    .toFile(tmp)
  fs.renameSync(tmp, out)
  const after = fs.statSync(out).size
  if (path.resolve(out) !== path.resolve(file) && fs.existsSync(file)) {
    fs.unlinkSync(file)
  }
  const outRel = relPath.replace(/\.png$/i, '.jpg')
  return { file: `${relPath} → ${outRel}`, before, after, action: 'png→jpg' }
}

const results = []
for (const p of convertToJpg) results.push(await convertJpg(p))
for (const p of compressKeep) results.push(await optimizeKeep(p))

for (const r of results.filter(Boolean)) {
  const saved = ((1 - r.after / r.before) * 100).toFixed(0)
  console.log(
    r.action.padEnd(10),
    r.file.padEnd(70),
    `${(r.before / 1024).toFixed(0)}KB → ${(r.after / 1024).toFixed(0)}KB (${saved}%)`,
  )
}
const b = results.filter(Boolean).reduce((s, r) => s + r.before, 0)
const a = results.filter(Boolean).reduce((s, r) => s + r.after, 0)
console.log(
  'TOTAL',
  `${(b / 1024 / 1024).toFixed(2)}MB → ${(a / 1024 / 1024).toFixed(2)}MB (${((1 - a / b) * 100).toFixed(0)}% saved)`,
)
