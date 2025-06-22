import fs from 'fs/promises'
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import slugify from 'standard-slugify'
import os from 'os'
import dotenv from 'dotenv'
import { createInterface } from 'readline'

// Directory setup
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const caddyDir = path.join(rootDir, '.caddy')

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') })

// Configuration
const packageJsonPath = path.join(rootDir, 'package.json')
const envPath = path.join(rootDir, '.env')
const caddyfilePath = path.join(caddyDir, 'Caddyfile')

/**
 * Execute shell command
 */
const execCommand = (command, options = {}) => {
	try {
		return execSync(command, {
			stdio: options.silent ? 'ignore' : 'inherit',
			...options,
		})
	} catch (error) {
		console.error(`Error executing command: ${command}`)
		console.error(error.message)
		return false
	}
}

/**
 * Check if a command exists
 */
const commandExists = (command) => {
	try {
		execSync(process.platform === 'win32' ? `where ${command}` : `which ${command}`, {
			stdio: 'ignore',
		})
		return true
	} catch {
		return false
	}
}

/**
 * Install Caddy based on platform
 */
const installCaddy = async () => {
	const platform = os.platform()

	console.log('Caddy is not installed. Installing Caddy...')

	if (platform === 'darwin') {
		if (!commandExists('brew')) {
			console.error('Homebrew is required to install Caddy on macOS.')
			console.log('Please install Homebrew (https://brew.sh/) and try again.')
			process.exit(1)
		}
		execCommand('brew install caddy')
	} else if (platform === 'linux') {
		if (commandExists('apt-get')) {
			execCommand('sudo apt-get update')
			execCommand(
				'sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https'
			)
			execCommand(
				"curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg"
			)
			execCommand(
				"curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list"
			)
			execCommand('sudo apt-get update')
			execCommand('sudo apt-get install caddy')
		} else if (commandExists('dnf')) {
			execCommand('sudo dnf install caddy')
		} else if (commandExists('yum')) {
			execCommand('sudo yum install caddy')
		} else {
			console.error('Unsupported Linux distribution. Please install Caddy manually:')
			console.log('https://caddyserver.com/docs/install')
			process.exit(1)
		}
	} else if (platform === 'win32') {
		if (!commandExists('choco')) {
			console.error('Chocolatey is required to install Caddy on Windows.')
			console.log('Please install Chocolatey (https://chocolatey.org/install) and try again,')
			console.log('or download Caddy manually from https://caddyserver.com/download')
			process.exit(1)
		}
		execCommand('choco install caddy')
	} else {
		console.error(`Unsupported platform: ${platform}`)
		console.log('Please install Caddy manually: https://caddyserver.com/docs/install')
		process.exit(1)
	}

	if (!commandExists('caddy')) {
		console.error('Failed to install Caddy. Please install it manually:')
		console.log('https://caddyserver.com/docs/install')
		process.exit(1)
	}

	console.log('Caddy installed successfully!')
	return true
}

/**
 * Ask for user confirmation
 */
const confirm = async (question) => {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	return new Promise((resolve) => {
		rl.question(`${question} (y/n): `, (answer) => {
			rl.close()
			resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
		})
	})
}

/**
 * Get project name and create a domain
 */
const getDomainName = async () => {
	try {
		// Read package.json to get project name
		const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
		const projectName = packageJson.name

		// Read .env to get development domain pattern
		const domainPattern = process.env.DEVELOPMENT_DOMAIN || '*.dev.10xmedia.de'

		if (!domainPattern.includes('*')) {
			console.error(
				'DEVELOPMENT_DOMAIN in .env must include a "*" character to be replaced with the project name'
			)
			process.exit(1)
		}

		// Slugify project name and create domain
		const slugifiedName = slugify(projectName, { enableForce: true })
		const customDomain = domainPattern.replace('*', slugifiedName)

		console.log(`Project name: ${projectName}`)
		console.log(`Development domain: ${customDomain}`)

		return customDomain
	} catch (error) {
		console.error('Error reading configuration files:', error.message)
		process.exit(1)
	}
}

/**
 * Extract the port number from a dev script
 */
const extractPortFromDevScript = async () => {
	try {
		const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
		const devScript = packageJson.scripts?.dev || ''

		// Try to extract PORT from the script
		const portMatch = devScript.match(/PORT=(\d+)/)
		if (portMatch && portMatch[1]) {
			return parseInt(portMatch[1], 10)
		}

		// Default Next.js port
		return 3000
	} catch {
		console.log('Could not extract port from package.json, using default port 3000')
		return 3000
	}
}

/**
 * Update hosts file to point custom domain to localhost
 */
const updateHostsFile = async (domain) => {
	const platform = os.platform()
	const hostsPath =
		platform === 'win32' ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' : '/etc/hosts'

	try {
		const hostsContent = await fs.readFile(hostsPath, 'utf8')
		const hostsLines = hostsContent.split('\n')

		// Check if domain is already in hosts file
		const domainExists = hostsLines.some(
			(line) => line.includes(domain) && line.includes('127.0.0.1')
		)

		if (!domainExists) {
			console.log('Updating hosts file...')

			const newEntry = `127.0.0.1\t${domain}`

			if (platform === 'win32') {
				// On Windows, write to a temporary file and use elevated privileges
				const tempFile = path.join(os.tmpdir(), 'hosts-temp')
				await fs.writeFile(tempFile, hostsContent + '\n' + newEntry)

				console.log('Adding domain to hosts file requires administrator privileges.')
				const confirmed = await confirm('Do you want to continue?')

				if (!confirmed) {
					console.log(
						'Hosts file update canceled. You need to manually add the following line to your hosts file:'
					)
					console.log(newEntry)
					return false
				}

				execCommand(
					`powershell -Command "Start-Process -Verb RunAs -FilePath 'cmd.exe' -ArgumentList '/c copy /Y ${tempFile.replace(/\\/g, '\\\\')} ${hostsPath.replace(/\\/g, '\\\\')}'"`
				)
			} else {
				// On Unix systems
				console.log('Adding domain to hosts file requires sudo privileges.')
				const confirmed = await confirm('Do you want to continue?')

				if (!confirmed) {
					console.log(
						'Hosts file update canceled. You need to manually add the following line to your hosts file:'
					)
					console.log(newEntry)
					return false
				}

				execCommand(`echo "${newEntry}" | sudo tee -a ${hostsPath}`)
			}

			console.log(`Added ${domain} to hosts file`)
		} else {
			console.log(`Domain ${domain} already exists in hosts file`)
		}
		return true
	} catch (error) {
		console.error('Error updating hosts file:', error.message)
		console.log('Please manually add the following line to your hosts file:')
		console.log(`127.0.0.1\t${domain}`)
		return false
	}
}

/**
 * Update .env file with custom domain
 */
const updateEnvFile = async (domain) => {
	try {
		let envContent = await fs.readFile(envPath, 'utf8')

		// Update NEXT_PUBLIC_APP_URL
		const appUrlRegex = /NEXT_PUBLIC_APP_URL=.*/
		const newAppUrl = `NEXT_PUBLIC_APP_URL=https://${domain}`

		if (appUrlRegex.test(envContent)) {
			envContent = envContent.replace(appUrlRegex, newAppUrl)
		} else {
			envContent += `\n${newAppUrl}`
		}

		await fs.writeFile(envPath, envContent)
		console.log(`Updated .env file with custom domain`)
		return true
	} catch (error) {
		console.error('Error updating .env file:', error.message)
		return false
	}
}

/**
 * Update Next.js config with the domain in allowedDevOrigins
 */
const updateNextConfig = async (domain) => {
	const nextConfigPath = path.join(rootDir, 'next.config.ts')

	try {
		let nextConfigContent = await fs.readFile(nextConfigPath, 'utf8')

		// Domain without protocol
		const domainWithoutProtocol = domain

		// Check if allowedDevOrigins already exists
		const allowedOriginsRegex = /allowedDevOrigins:\s*\[(.*?)\]/s

		if (allowedOriginsRegex.test(nextConfigContent)) {
			// Extract current origins
			const match = nextConfigContent.match(allowedOriginsRegex)
			if (match && match[1]) {
				const currentOriginsRaw = match[1].split(',').map((o) => o.trim())

				// Parse and clean the origins for comparison
				const currentOrigins = currentOriginsRaw.map((origin) => ({
					raw: origin, // Keep the original string with quotes
					clean: origin.replace(/['"`]/g, '').replace(/^https?:\/\//i, ''), // Remove quotes and protocol
				}))

				// Check if domain is already in the list (without protocol)
				const domainExists = currentOrigins.some((origin) => origin.clean === domainWithoutProtocol)

				if (!domainExists) {
					// Add the new domain to the array
					// First prepare a properly formatted entry with quotes matching the existing style
					let quoteStyle = "'"
					if (currentOriginsRaw.length > 0) {
						// Detect quote style from existing entries
						const firstOrigin = currentOriginsRaw[0]
						if (firstOrigin.startsWith('"')) quoteStyle = '"'
						else if (firstOrigin.startsWith('`')) quoteStyle = '`'
					}

					// Create the new array with all existing entries plus our new one
					const newOrigins = [
						...currentOrigins.map((o) => o.raw), // Keep all existing entries
						`${quoteStyle}${domainWithoutProtocol}${quoteStyle}`, // Add the new one
					].join(', ')

					// Replace the array with our updated one
					const newConfig = nextConfigContent.replace(
						allowedOriginsRegex,
						`allowedDevOrigins: [${newOrigins}]`
					)

					await fs.writeFile(nextConfigPath, newConfig)
					console.log(
						`Added ${domainWithoutProtocol} to existing allowedDevOrigins in Next.js config`
					)
				} else {
					console.log(`Domain already exists in Next.js config (without protocol)`)
				}
			}
		} else {
			// allowedDevOrigins doesn't exist yet, add it after output: 'standalone'
			const outputRegex = /(output:\s*['"]standalone['"],?)/
			if (outputRegex.test(nextConfigContent)) {
				const newConfig = nextConfigContent.replace(
					outputRegex,
					`$1\n\tallowedDevOrigins: ['${domainWithoutProtocol}'],`
				)
				await fs.writeFile(nextConfigPath, newConfig)
				console.log(`Added domain to Next.js config: ${domainWithoutProtocol}`)
			} else {
				// If we can't find the right place, add it after the opening of NextConfig
				const configRegex = /(const\s+nextConfig\s*:\s*NextConfig\s*=\s*{)/
				if (configRegex.test(nextConfigContent)) {
					const newConfig = nextConfigContent.replace(
						configRegex,
						`$1\n\tallowedDevOrigins: ['${domainWithoutProtocol}'],`
					)
					await fs.writeFile(nextConfigPath, newConfig)
					console.log(`Added domain to Next.js config: ${domainWithoutProtocol}`)
				} else {
					console.error(
						'Could not find a suitable location to add allowedDevOrigins in Next.js config'
					)
					console.log(`Please manually add the following to your next.config.ts:`)
					console.log(`allowedDevOrigins: ['${domainWithoutProtocol}'],`)
				}
			}
		}

		return true
	} catch (error) {
		console.error('Error updating Next.js config:', error.message)
		console.log(`Please manually add the following to your next.config.ts:`)
		console.log(`allowedDevOrigins: ['${domain}'],`)
		return false
	}
}

/**
 * Create Caddyfile for the custom domain
 */
const createCaddyfile = async (domain, port) => {
	// Create directory if it doesn't exist
	if (!existsSync(caddyDir)) {
		await fs.mkdir(caddyDir, { recursive: true })
	}

	// Create basic Caddyfile content
	const caddyfileContent = `${domain} {
	reverse_proxy localhost:${port}
	tls internal
}
`

	await fs.writeFile(caddyfilePath, caddyfileContent)
	console.log(`Created Caddyfile at ${caddyfilePath}`)

	return caddyfilePath
}

/**
 * Check if we're on macOS with Touch ID capability
 */
const hasTouchId = () => {
	if (os.platform() !== 'darwin') return false

	try {
		// Check if we're on a Mac with Touch ID
		const biometricOutput = execSync('bioutil -c', {
			stdio: 'pipe',
			encoding: 'utf8',
			shell: true,
		}).toString()

		return biometricOutput.includes('Touch ID') || biometricOutput.includes('Face ID')
	} catch {
		// bioutil might not be available or working
		return false
	}
}

/**
 * Get the appropriate sudo command based on platform
 */
const getSudoCommand = () => {
	if (os.platform() !== 'darwin') return 'sudo'

	// On macOS, try to use Touch ID if available
	if (hasTouchId()) {
		// First check if sudo with Touch ID is configured
		try {
			execSync('grep -q "pam_tid.so" /etc/pam.d/sudo', { stdio: 'ignore' })
			return 'sudo' // Touch ID for sudo is configured
		} catch {
			// Not configured, use regular sudo
			return 'sudo'
		}
	}

	return 'sudo'
}

/**
 * Start Caddy with the configuration
 */
const startCaddy = async (caddyfilePath) => {
	const platform = os.platform()
	const sudoCommand = getSudoCommand()

	// Stop any running Caddy instance
	try {
		if (platform === 'win32') {
			execCommand('taskkill /IM caddy.exe /F', { silent: true })
		} else {
			execCommand(`${sudoCommand} pkill caddy`, { silent: true })
		}
	} catch {
		// Ignore errors if Caddy is not running
	}

	// Start Caddy with our configuration, running in the background
	console.log('Starting Caddy...')

	// On Unix systems, Caddy needs root to bind to port 443
	if (platform !== 'win32') {
		console.log('Caddy needs elevated privileges to bind to port 443 (HTTPS).')
		console.log(
			'\n⚠️  You will be prompted for your password. This is needed ONLY to bind to port 443.\n'
		)

		// Run a quick sudo command to trigger password prompt early with clear context
		try {
			execSync(
				`${sudoCommand} -p "[sudo] Enter password to allow Caddy to bind to port 443: " echo "Password validated"`,
				{ stdio: 'inherit' }
			)
		} catch {
			console.error('Failed to validate sudo permissions. Continuing anyway...')
		}
	}

	const caddyStartCommand = `caddy start --config ${caddyfilePath} --adapter caddyfile`

	if (platform === 'win32') {
		// On Windows, we need to spawn a new process and detach it
		const startScriptPath = path.join(caddyDir, 'start-caddy.bat')
		await fs.writeFile(startScriptPath, `@echo off\n${caddyStartCommand} > nul 2>&1\n`)

		// Make it executable and run it
		execCommand(`start ${startScriptPath}`, { detached: true, stdio: 'ignore' })
	} else {
		// On Unix, use sudo to elevate privileges and run in background, with no logs
		execCommand(`${sudoCommand} ${caddyStartCommand} > /dev/null 2>&1`, { detached: true })
	}

	console.log('Caddy started successfully!')

	// Create a stop script for convenience
	const stopScriptPath = path.join(
		caddyDir,
		platform === 'win32' ? 'stop-caddy.bat' : 'stop-caddy.sh'
	)
	const stopCommand =
		platform === 'win32'
			? '@echo off\ncaddy stop > nul 2>&1\n'
			: `#!/bin/bash\n${sudoCommand} caddy stop > /dev/null 2>&1\n`

	await fs.writeFile(stopScriptPath, stopCommand)

	if (platform !== 'win32') {
		// Make the script executable on Unix systems
		await fs.chmod(stopScriptPath, 0o755)
	}

	return true
}

/**
 * Update package.json with scripts for Caddy
 */
const updatePackageJson = async (domain, port) => {
	try {
		const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
		const platform = os.platform()
		const sudoCommand = getSudoCommand()

		// Add scripts to package.json
		packageJson.scripts = packageJson.scripts || {}

		// Regular dev without changing the original dev script
		if (!packageJson.scripts.dev) {
			packageJson.scripts['dev'] = `cross-env NODE_OPTIONS=--no-deprecation next dev --port ${port}`
		}

		// On Unix systems (macOS/Linux), Caddy needs sudo to bind to port 443
		const sudoPrefix = platform === 'win32' ? '' : `${sudoCommand} `

		// Add caddy scripts with log redirection to /dev/null
		if (platform === 'win32') {
			packageJson.scripts['caddy:start'] = `caddy start --config .caddy/Caddyfile > nul 2>&1`
			packageJson.scripts['caddy:stop'] = `caddy stop > nul 2>&1`
			packageJson.scripts['caddy:reload'] = `caddy reload --config .caddy/Caddyfile > nul 2>&1`
		} else {
			packageJson.scripts['caddy:start'] =
				`${sudoPrefix}caddy start --config .caddy/Caddyfile > /dev/null 2>&1`
			packageJson.scripts['caddy:stop'] = `${sudoPrefix}caddy stop > /dev/null 2>&1`
			packageJson.scripts['caddy:reload'] =
				`${sudoPrefix}caddy reload --config .caddy/Caddyfile > /dev/null 2>&1`
		}

		// Dev with caddy script (starts both next.js and caddy)
		// For Unix systems, we need a clearer sudo prompt
		if (platform === 'win32') {
			packageJson.scripts['dev:ssl'] = `concurrently "pnpm dev" "pnpm caddy:start"`
		} else {
			// On Unix systems, prompt for password first with a clear message, then start services
			packageJson.scripts['dev:ssl'] =
				`${sudoCommand} -p "[sudo] Enter password to allow Caddy to bind to port 443: " echo "Password validated" && concurrently "pnpm dev" "pnpm caddy:start"`
		}

		await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, '\t') + '\n')
		console.log(`Updated scripts in package.json`)
		return true
	} catch (error) {
		console.error('Error updating package.json:', error.message)
		return false
	}
}

/**
 * Install concurrently for running multiple commands
 */
const installConcurrently = async () => {
	if (!existsSync(path.join(rootDir, 'node_modules', 'concurrently'))) {
		console.log('Installing concurrently...')
		execCommand('pnpm add concurrently --save-dev')
		console.log('concurrently installed!')
	}
	return true
}

/**
 * Update .gitignore file to ignore Caddy related files
 */
const updateGitignore = async () => {
	const gitignorePath = path.join(rootDir, '.gitignore')

	try {
		// Check if .gitignore exists
		let gitignoreContent = ''
		try {
			gitignoreContent = await fs.readFile(gitignorePath, 'utf8')
		} catch {
			// Create if it doesn't exist
			console.log('.gitignore not found, creating one...')
		}

		// Entries to add
		const entriesToAdd = ['.caddy/', '*.pem', '*.log', 'certificates/']

		// Check which entries are missing
		const missingEntries = entriesToAdd.filter((entry) => !gitignoreContent.includes(entry))

		if (missingEntries.length === 0) {
			console.log('All Caddy-related entries already in .gitignore')
			return true
		}

		// Add comment and missing entries
		let newContent = gitignoreContent

		if (!gitignoreContent.includes('# Caddy files')) {
			newContent += '\n# Caddy files\n'
		}

		// Add each missing entry
		missingEntries.forEach((entry) => {
			if (!newContent.includes(entry)) {
				newContent += `${entry}\n`
			}
		})

		// Write updated content
		await fs.writeFile(gitignorePath, newContent)
		console.log(`Updated .gitignore with Caddy-related entries`)
		return true
	} catch (error) {
		console.error('Error updating .gitignore:', error.message)
		console.log('Please manually add the following to your .gitignore:')
		console.log('.caddy/\n*.pem\n*.log\ncertificates/')
		return false
	}
}

/**
 * Main function
 */
const setupDevDomain = async () => {
	console.log('Setting up Caddy for custom domain development...\n')

	// Check for Caddy and install if needed
	if (!commandExists('caddy')) {
		await installCaddy()
	} else {
		console.log('Caddy is already installed!')
	}

	// Get domain name
	const domain = await getDomainName()

	// Get Next.js dev server port
	const port = await extractPortFromDevScript()
	console.log(`Next.js development server port: ${port}`)

	// Update hosts file
	await updateHostsFile(domain)

	// Update .env file
	await updateEnvFile(domain)

	// Update Next.js config
	await updateNextConfig(domain)

	// Create Caddyfile
	const caddyfilePath = await createCaddyfile(domain, port)

	// Install concurrently
	await installConcurrently()

	// Update package.json
	await updatePackageJson(domain, port)

	// Update .gitignore
	await updateGitignore()

	// Start Caddy
	await startCaddy(caddyfilePath)

	console.log('\nCustom domain setup with Caddy complete!')
	console.log('\nYou can access your application at:')
	console.log(`HTTPS: https://${domain}`)
	console.log('\nTo start development with SSL:')
	console.log('  pnpm dev:ssl')
	console.log('\nOther available commands:')
	console.log('  pnpm caddy:start - Start Caddy')
	console.log('  pnpm caddy:stop  - Stop Caddy')
	console.log('  pnpm caddy:reload - Reload Caddy configuration')
}

setupDevDomain()
