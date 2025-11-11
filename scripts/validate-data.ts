import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { hotspotDataFileSchema } from '../src/schemas/hotspot-schema'

type ParsedData = {
  fileName: string
  language: string
  hotspots: ReturnType<typeof hotspotDataFileSchema.parse>['hotspots']
}

const getDataDirectory = () => path.resolve(process.cwd(), 'public', 'data')

const listHotspotFiles = async () => {
  const dataDir = getDataDirectory()
  const files = await readdir(dataDir)
  return files
    .filter(file => /^hotspots\.[a-z]{2}\.json$/i.test(file))
    .map(fileName => ({ fileName, filePath: path.join(dataDir, fileName) }))
}

const parseFile = async (filePath: string, fileName: string) => {
  const raw = await readFile(filePath, 'utf-8')
  const json = JSON.parse(raw)
  const parsed = hotspotDataFileSchema.parse(json)
  const hotspotIds = parsed.hotspots.map(h => h.id)
  const duplicatedIds = hotspotIds.filter((id, index) => hotspotIds.indexOf(id) !== index)

  if (duplicatedIds.length > 0) {
    throw new Error(
      `File "${fileName}" has duplicated hotspot ids: ${duplicatedIds.join(', ')}`,
    )
  }

  return {
    fileName,
    language: parsed.language,
    hotspots: parsed.hotspots,
  } satisfies ParsedData
}

const assertConsistentStructure = (entries: ParsedData[]) => {
  if (entries.length === 0) {
    throw new Error('No hotspot data files were found')
  }

  const [baseline, ...rest] = entries
  const baselineIds = baseline.hotspots.map(h => h.id)

  for (const entry of rest) {
    const targetIds = entry.hotspots.map(h => h.id)
    if (targetIds.length !== baselineIds.length) {
      throw new Error(
        `File "${entry.fileName}" contains ${targetIds.length} hotspots, expected ${baselineIds.length}`,
      )
    }

    baselineIds.forEach((id, index) => {
      const otherId = targetIds[index]
      if (id !== otherId) {
        throw new Error(
          `File "${entry.fileName}" hotspot order mismatch at position ${index}: expected "${id}", received "${otherId}"`,
        )
      }

      const baselineHotspot = baseline.hotspots[index]
      const otherHotspot = entry.hotspots[index]

      if (
        JSON.stringify(baselineHotspot.coords) !== JSON.stringify(otherHotspot.coords)
      ) {
        throw new Error(
          `Hotspot "${id}" has inconsistent coordinates between languages (${baseline.fileName} vs ${entry.fileName})`,
        )
      }

      if (JSON.stringify(baselineHotspot.shape) !== JSON.stringify(otherHotspot.shape)) {
        throw new Error(
          `Hotspot "${id}" has inconsistent shape between languages (${baseline.fileName} vs ${entry.fileName})`,
        )
      }
    })
  }
}

const run = async () => {
  try {
    const fileDescriptors = await listHotspotFiles()
    if (fileDescriptors.length === 0) {
      throw new Error('No hotspot data files found in public/data')
    }

    const parsedEntries = []
    for (const descriptor of fileDescriptors) {
      parsedEntries.push(await parseFile(descriptor.filePath, descriptor.fileName))
    }

    assertConsistentStructure(parsedEntries)
    console.log(
      `✅ Hotspot data validation succeeded for ${parsedEntries.length} language file(s)`,
    )
  } catch (error) {
    console.error('❌ Hotspot data validation failed.')
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    process.exitCode = 1
  }
}

run()
