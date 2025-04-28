### Fluxo completo:

- Mudanças no código.
- Atualiza a versão no package.json.
- Comita com o novo código.
- Cria e envia uma tag:

```
  git tag v1.2.0
  git push origin v1.2.0
```

O CI entra em ação e publica a versão 1.2.0 no NPM.

### Commits

- feat: nova funcionalidade
- fix: correção de bug
- docs: mudanças na documentação
- test: adição ou ajuste de testes
- chore: mudanças internas (ex: configs)
- refactor: melhorias sem alteração funcional

### Semantic Versioning

1 command: npm version ?
2 command: git push origin master --follow-tags

Formato: MAJOR.MINOR.PATCH

Quando usar

- 1.0.0: Primeira versão estável
- 1.1.0: Adicionou funcionalidades sem quebrar nada
- 1.1.1: Corrigiu bugs sem mudar funcionalidade
- 2.0.0: Mudança que quebra compatibilidade

### Padrões

Body - camelCase - snake_case
Query - camelCase - snake_case
Path (URLs) - kebab-case - snake_case
Headers - kebab-case (lowercase)

### Steps

[x] publish in npm (automatic)
[x] adapters (express, fastify)
[x] controller decorator
[x] create validator (sync)
[TEMPLATE] Unit of Work (repositories)
[TEMPLATE] config to test e2e
[TEMPLATE] import paths with '@/'
[x] controller receive error agente (sentry)
[x] controller receive error agente (discord)
[ ] create doc via DTO (zod?)
[x] execute middlewares. Pass in decorator Http?
[ ] remove dependencies to start server unnecessary (ts-node, ts-node-dev, vite-node)
[ ] 100% coverage tests
