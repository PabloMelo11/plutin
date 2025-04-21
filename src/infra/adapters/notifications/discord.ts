import { Inject } from 'core/decorators/dependency-container'
import { MessageBuilder, Webhook } from 'discord-webhook-node'

import type { ContextError } from '../../../core/http/controller'
import type IErrorNotifier from '../../../core/http/error-notifier'

type DiscordOptions = {
  url: string
  env: string
}

export default class DiscordNotifier implements IErrorNotifier {
  private webhook: Webhook

  constructor(
    @Inject('DiscordConfig') private readonly options: DiscordOptions
  ) {
    this.webhook = new Webhook(this.options.url)
  }

  async notify(error: Error, context: ContextError): Promise<void> {
    const embed = new MessageBuilder()
      .setTitle('🚨 Error')
      .addField('Message', `\`\`\`${error.message.slice(0, 300)}\`\`\``)
      .addField(
        'Route:',
        `\`[${context?.request?.method}] ${context?.request?.url}\``,
        true
      )
      .addField(
        'Params:',
        '```json\n' +
          JSON.stringify(context?.request?.params, null, 2) +
          '\n```',
        true
      )
      .addField(
        'Query:',
        '```json\n' +
          JSON.stringify(context?.request?.query, null, 2) +
          '\n```',
        true
      )
      .addField(
        'Headers:',
        '```json\n' +
          JSON.stringify(context?.request?.headers, null, 2) +
          '\n```',
        true
      )
      .addField(
        'Body:',
        '```json\n' + JSON.stringify(context?.request?.body, null, 2) + '\n```'
      )
      .addField(
        'Stack Trace:',
        '```' + (error.stack || 'No stack provided').slice(0, 900) + '```'
      )
      .setFooter(`Env: ${this.options.env || 'development'}`)
      .setTimestamp()

    await this.webhook.send(embed)
  }
}
