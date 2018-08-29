#!/usr/bin/env node

const moment = require('moment')
const service = require('../serviceHandler')()
const Table = require('cli-table')

async function getIssueWorklogs (issueId) {
  const { status, data } = await service.get(`issue/${issueId}`)
  const cmdResponse = status === 200
    ? { exitCode: 0, message: '' }
    : { exitCode: 127, message: 'There was an error while retrieving your worklogs.' }
  let worklogs = data.fields.worklog.worklogs || []
  const table = new Table({
    head: ['Created by', 'Updated by', 'Registered at', 'Work log'],
    colWidths: [24, 24, 32, 12]
  })

  worklogs = worklogs.map(entry => {
    return [
      entry.author.displayName,
      entry.updateAuthor.displayName,
      moment(entry.started).format('DD/MM/YYYY [@] HH:mm:ss'),
      entry.timeSpent
    ]
  })

  table.push(...worklogs)
  process.stdout.write(`${table.toString()}\n`)

  if (cmdResponse.exitCode > 0) process.stdout.write(`${cmdResponse.message}\n`)
  process.exit(cmdResponse.exitCode)
}

module.exports = async options => {
  await getIssueWorklogs(options.issue)
}