import { bold } from 'kleur'

export const logger = {
  info: (...args: any[]) => {
    console.info(bold().blue(`[INFO] `), ...args)
  },

  log: (...args: any[]) => {
    console.log(bold().grey(`[LOG] `), ...args)
  },

  warn: (...args: any[]) => {
    console.warn(bold().yellow(`[WARN] `), ...args)
  },

  error: (...args: any[]) => {
    console.error(bold().red(`[ERROR] `), ...args)
  },
}
