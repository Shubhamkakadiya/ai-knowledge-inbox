type LogMeta = Record<string, unknown>

// plain JSON lines so logs are easy to grep or pipe into something later
function write(level: 'info' | 'warn' | 'error', message: string, meta?: LogMeta) {
  const line = JSON.stringify({ time: new Date().toISOString(), level, message, ...meta })
  if (level === 'error') console.error(line)
  else console.log(line)
}

export const logger = {
  info: (message: string, meta?: LogMeta) => write('info', message, meta),
  warn: (message: string, meta?: LogMeta) => write('warn', message, meta),
  error: (message: string, meta?: LogMeta) => write('error', message, meta),
}
