import express from 'express'
import path from 'path'

const staticDir = path.resolve(__dirname, '..', 'public')

export const staticProvider = express.static(staticDir)
