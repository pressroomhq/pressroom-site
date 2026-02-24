/**
 * Syncs markdown docs from the pressroom-docs repo into src/content/docs/
 * with Astro-compatible frontmatter injected.
 *
 * Usage: node scripts/sync-docs.js [path-to-docs-repo]
 * Default: ../pressroom-docs (sibling directory)
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, statSync, existsSync } from 'fs'
import { join, basename, relative } from 'path'

const DOCS_REPO = process.argv[2] || join(import.meta.dirname, '../../pressroom-docs')
const OUT_DIR = join(import.meta.dirname, '../src/content/docs')

const SECTION_MAP = {
  guides: 'Guides',
  api: 'Reference',
  mcp: 'MCP',
}

// Explicit ordering for root-level files
const ROOT_FILES = {
  'getting-started.md': { section: 'Getting Started', order: 1 },
  'architecture.md': { section: 'Concepts', order: 1 },
}

// Manual description overrides for files without a good prose intro
const DESC_OVERRIDES = {
  'getting-started.md': 'Prerequisites, local setup, environment configuration, and first run instructions for Pressroom HQ.',
}

// Order within guide sections (by filename)
const GUIDE_ORDER = [
  'scout-and-signals.md',
  'content-pipeline.md',
  'story-workbench.md',
  'voice-and-skills.md',
  'seo-and-audits.md',
  'ai-visibility.md',
  'integrations.md',
]

const MCP_ORDER = ['setup.md', 'tools.md']

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : 'Untitled'
}

function extractDescription(content) {
  // Find first prose paragraph after the h1 heading, skipping lists, code blocks, tables
  const lines = content.split('\n')
  let pastHeading = false
  let inCodeBlock = false
  let desc = []

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      if (desc.length > 0) break
      continue
    }
    if (inCodeBlock) continue

    if (line.startsWith('# ') && !pastHeading) {
      pastHeading = true
      continue
    }
    if (!pastHeading) continue
    if (line.trim() === '') {
      if (desc.length > 0) break
      continue
    }
    // Skip non-prose: headings, tables, blockquotes, lists
    if (line.startsWith('#') || line.startsWith('|') || line.startsWith('>') || line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
      if (desc.length > 0) break
      continue
    }
    desc.push(line.trim())
  }

  const text = desc.join(' ')
  return text.length > 160 ? text.slice(0, 157) + '...' : text
}

function getSlug(folder, filename) {
  if (folder) return `${folder}-${basename(filename, '.md')}`
  return basename(filename, '.md')
}

function getOrder(folder, filename) {
  if (!folder) return ROOT_FILES[filename]?.order || 99
  if (folder === 'guides') {
    const idx = GUIDE_ORDER.indexOf(filename)
    return idx >= 0 ? idx + 1 : 99
  }
  if (folder === 'mcp') {
    const idx = MCP_ORDER.indexOf(filename)
    return idx >= 0 ? idx + 1 : 99
  }
  if (folder === 'api') return 1
  return 99
}

function collectFiles(dir, folder = '') {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory() && !entry.startsWith('.')) {
      files.push(...collectFiles(full, entry))
    } else if (entry.endsWith('.md') && entry !== 'README.md') {
      files.push({ path: full, folder, filename: entry })
    }
  }
  return files
}

// Main
if (!existsSync(DOCS_REPO)) {
  console.error(`Docs repo not found at ${DOCS_REPO}`)
  console.error('Usage: node scripts/sync-docs.js [path-to-docs-repo]')
  process.exit(1)
}

// Clean and recreate output dir
if (existsSync(OUT_DIR)) {
  for (const f of readdirSync(OUT_DIR)) {
    if (f.endsWith('.md')) rmSync(join(OUT_DIR, f))
  }
} else {
  mkdirSync(OUT_DIR, { recursive: true })
}

const files = collectFiles(DOCS_REPO)
let count = 0

for (const { path, folder, filename } of files) {
  const content = readFileSync(path, 'utf-8')
  const title = extractTitle(content)
  const description = DESC_OVERRIDES[filename] || extractDescription(content) || title
  const section = folder ? (SECTION_MAP[folder] || folder) : (ROOT_FILES[filename]?.section || 'General')
  const order = getOrder(folder, filename)
  const slug = getSlug(folder, filename)

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
section: "${section}"
order: ${order}
---

`

  writeFileSync(join(OUT_DIR, `${slug}.md`), frontmatter + content)
  count++
  console.log(`  ${slug}.md  [${section} / ${order}]`)
}

console.log(`\nSynced ${count} docs from ${DOCS_REPO}`)
