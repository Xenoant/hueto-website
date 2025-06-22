import { createHash } from 'crypto'
import { writeFile, rm } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'
import tty from 'tty'

const __dirname = dirname(fileURLToPath(import.meta.url))
const AUTH_FILE = join(__dirname, '..', '.mailpit.auth')

/**
 * Ask for user input while hiding it from terminal display.
 */
const questionHidden = (query) => {
  return new Promise((resolve) => {
    const stdin = process.stdin
    const stdout = process.stdout

    if (!stdin.isTTY) {
      throw new Error('stdin is not a TTY')
    }

    stdout.write(query)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')

    let buffer = ''
    stdin.on('data', function onData(char) {
      char = String(char)
      if (char === '\n' || char === '\r' || char === '\u0004') {
        stdin.setRawMode(false)
        stdin.pause()
        stdin.removeListener('data', onData)
        stdout.write('\n')
        resolve(buffer.trim())
      } else if (char === '\u0003') {
        stdin.setRawMode(false)
        stdin.pause()
        process.exit(1) // Handle Ctrl+C
      } else {
        buffer += char
      }
    })
  })
}

/**
 * Generate SHA-1 hash
 */
function sha1crypt(password) {
  return createHash('sha1').update(password).digest('base64')
}

/**
 * Generate authentication credentials
 */
async function generateAuth() {
  try {
    await rm(AUTH_FILE, { recursive: true, force: true }) // Remove existing auth file

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const username =
      (await new Promise((resolve) =>
        rl.question('Enter username for Mailpit UI (default: admin): ', resolve),
      )) || 'admin'
    rl.close()

    const password = await questionHidden('Enter password for Mailpit UI: ') // Fully hidden password input

    if (!password) throw new Error('Password cannot be empty')

    const hash = sha1crypt(password) // Generate SHA-1 password hash
    const authContent = `${username}:{SHA}${hash}`

    await writeFile(AUTH_FILE, authContent, { mode: 0o600 }) // Save the auth file securely

    console.log('\n✅ Mailpit authentication configured successfully!')
    console.log(`Username: ${username}`)
    console.log('Password: [hidden]')
    console.log(`Auth file created at: ${AUTH_FILE}\n`)
  } catch (error) {
    console.error('❌ Error setting up Mailpit authentication:', error.message)
    process.exit(1)
  }
}

generateAuth()
