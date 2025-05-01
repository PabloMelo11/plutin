import chalk from 'chalk'

export const logger = {
  info: (...args: any[]) => {
    console.info(chalk.blue(`[INFO] `), ...args)
  },

  log: (...args: any[]) => {
    console.log(chalk.green(`[LOG] `), ...args)
  },

  warn: (...args: any[]) => {
    console.warn(chalk.yellow(`[WARN] `), ...args)
  },

  error: (...args: any[]) => {
    console.error(chalk.red(`[ERROR] `), ...args)
  },
}
