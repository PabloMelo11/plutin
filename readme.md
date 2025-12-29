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
