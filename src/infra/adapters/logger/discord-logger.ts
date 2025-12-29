import { MessageBuilder, Webhook } from 'discord-webhook-node'

import { Inject } from '../../../core/decorators/dependency-container'
import { getContext } from '../observability/node-context/context'

import type { ILogger, LogParams } from './logger'
import { PinoLogger } from './pino-logger'

type DiscordOptions = {
  url: string
  env: string
}

export class DiscordLogger implements ILogger {
  private webhook: Webhook
  private pinoLogger: PinoLogger

  constructor(
    @Inject('DiscordConfig') private readonly options: DiscordOptions
  ) {
    this.webhook = new Webhook(this.options.url)
    this.pinoLogger = new PinoLogger()
  }

  private async buildStructuredLog(
    embed: MessageBuilder,
    { msg, data, error }: LogParams
  ) {
    const traceId = getContext().traceId

    embed
      .addField('timestamp:', `\`\`\`${new Date().toISOString()}\`\`\``)
      .addField('traceId:', `\`\`\`${traceId}\`\`\``)
      .addField('Message:', `\`\`\`${msg}\`\`\``)
      .addField('Data:', '```json\n' + JSON.stringify(data, null, 2) + '\n```')

    if (error) {
      const structed = {
        type: error.name,
        message: error.message,
        code: (error as any).code,
        stack: error.stack,
      }

      embed.addField(
        'error:',
        '```json\n' + JSON.stringify(structed, null, 2) + '\n```'
      )
    }

    await this.webhook.send(embed)
  }

  info(params: LogParams): void {
    this.pinoLogger.info(params)

    const embed = new MessageBuilder()
      .setTitle(`ℹ️ Info - ${process.env.ENVIRONMENT}`)
      .setColor(0x3498db)

    this.buildStructuredLog(embed, params).catch(() =>
      this.pinoLogger.info({ msg: 'Error to send log to Discord' })
    )
  }

  error(params: LogParams): void {
    this.pinoLogger.error(params)

    const embed = new MessageBuilder()
      .setTitle(`⛔ Error - ${process.env.ENVIRONMENT}`)
      .setColor(0xe74c3c)

    this.buildStructuredLog(embed, params).catch(() =>
      this.pinoLogger.info({ msg: 'Error to send log to Discord' })
    )
  }

  debug(params: LogParams): void {
    this.pinoLogger.debug(params)

    const embed = new MessageBuilder()
      .setTitle(`🐛 Degub - ${process.env.ENVIRONMENT}`)
      .setColor(0x9b59b6)

    this.buildStructuredLog(embed, params).catch(() =>
      this.pinoLogger.info({ msg: 'Error to send log to Discord' })
    )
  }

  fatal(params: LogParams): void {
    this.pinoLogger.fatal(params)

    const embed = new MessageBuilder()
      .setTitle(`💀 Fatal - ${process.env.ENVIRONMENT}`)
      .setColor(0xc0392b)

    this.buildStructuredLog(embed, params).catch(() =>
      this.pinoLogger.info({ msg: 'Error to send log to Discord' })
    )
  }

  warn(params: LogParams): void {
    this.pinoLogger.warn(params)

    const embed = new MessageBuilder()
      .setTitle(`⚠️ Warn - ${process.env.ENVIRONMENT}`)
      .setColor(0xf1c40f)

    this.buildStructuredLog(embed, params).catch(() =>
      this.pinoLogger.info({ msg: 'Error to send log to Discord' })
    )
  }
}
