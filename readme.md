### Fluxo completo (Publicação Automática):

- Mudanças no código.
- Atualiza a versão no `package.json`.
- Comita e faz push para `master` ou `main`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin master
```

O CI detecta automaticamente a nova versão e:

- ✅ Executa os testes
- ✅ Faz o build do projeto
- ✅ Publica no NPM (se a versão ainda não existir)
- ✅ Cria uma tag Git automaticamente (ex: `v1.2.0`)

**Nota:** O workflow também funciona com tags manuais (`git push origin v1.2.0`).

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

### Configuração do NPM Token (GitHub Actions)

Para que a publicação automática funcione, você precisa configurar um token do NPM no GitHub:

1. **Criar um token no NPM:**

   - Acesse: https://www.npmjs.com/settings/[seu-usuario]/tokens
   - Clique em "Generate New Token"
   - Escolha "Granular Access Token" (recomendado)
   - Configure as permissões: **Read & Write** para o pacote `plutin`
   - Copie o token gerado

2. **Adicionar o token no GitHub:**
   - Vá para: `Settings` > `Secrets and variables` > `Actions` no seu repositório
   - Clique em "New repository secret"
   - Nome: `NPM_TOKEN`
   - Valor: Cole o token copiado do NPM
   - Salve

**Importante:** Tokens granulares têm validade de 90 dias e exigem 2FA. Atualize o token antes de expirar.

### Padrões

Body - camelCase - snake_case
Query - camelCase - snake_case
Path (URLs) - kebab-case - snake_case
Headers - kebab-case (lowercase)
