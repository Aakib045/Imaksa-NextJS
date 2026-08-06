const mongoose = require('mongoose')
require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')

async function backup() {
  await mongoose.connect(process.env.MONGODB_URI)
  const db = mongoose.connection.db

  const date = new Date().toISOString().split('T')[0]
  const backupDir = path.join(__dirname, '..', 'backups', date)
  fs.mkdirSync(backupDir, { recursive: true })

  const collections = ['properties', 'blogs', 'teams', 'enquiries', 'sellrequests', 'settings', 'subscribers', 'admins', 'jobs']

  console.log('Starting backup for', date)
  console.log('---')

  for (const colName of collections) {
    try {
      const data = await db.collection(colName).find({}).toArray()
      fs.writeFileSync(
        path.join(backupDir, colName + '.json'),
        JSON.stringify(data, null, 2)
      )
      console.log('✅', colName, '-', data.length, 'documents backed up')
    } catch (err) {
      console.log('❌', colName, '- failed:', err.message)
    }
  }

  console.log('---')
  console.log('Backup complete! Saved to:', backupDir)

  await mongoose.disconnect()
}

backup().catch(console.error)
