# Guia de Configuração do Clerk

## Ambientes: Development vs Production

### Chaves Atuais (Development)
As chaves atuais são de **teste** (começam com `pk_test_` e `sk_test_`):
- Limites de rate mais baixos
- Usuários de teste apenas
- Domínio padrão do Clerk

### Para Produção

1. **Acesse o Clerk Dashboard**: https://dashboard.clerk.com

2. **Crie uma instância de produção** ou mude o ambiente atual para Production

3. **Obtenha as chaves de produção**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx`
   - `CLERK_SECRET_KEY=sk_live_xxxxx`

4. **Configure o domínio personalizado** (opcional mas recomendado):
   - Em "Domains" no dashboard do Clerk
   - Adicione seu domínio: `universodecantores.com.br`

5. **Atualize o `.env.local`** para desenvolvimento e configure variáveis no Netlify para produção

## Configuração no Netlify (Produção)

No painel do Netlify > Site Settings > Environment Variables, adicione:

```env
# Clerk Production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/cadastro
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## Solução para Rate Limiting

O erro "Too Many Requests" acontece porque:
1. Chaves de teste têm limite menor
2. Hot reload em dev faz muitas requisições

### Soluções Implementadas:
- ✅ Cache em memória no `lib/auth.ts`
- ✅ Busca no banco de dados antes de chamar API Clerk
- ✅ Tratamento silencioso de erros de rate limit

### Se ainda tiver problemas:
1. Aguarde 1-2 minutos (rate limit reseta)
2. Reinicie o servidor de desenvolvimento
3. Use `npm run build && npm start` em vez de `npm run dev`

## Migrando Usuários de Test para Production

Usuários criados em modo teste **NÃO** são migrados automaticamente para produção. Você tem duas opções:

### Opção 1: Recriar usuários
- Usuários se cadastram novamente em produção
- Dados no seu banco (Prisma) são mantidos se o email for o mesmo

### Opção 2: Importar usuários
- Use a API do Clerk para importar usuários
- Veja: https://clerk.com/docs/users/user-import

## Checklist para Deploy em Produção

- [ ] Criar instância production no Clerk
- [ ] Obter chaves `pk_live_` e `sk_live_`
- [ ] Configurar variáveis no Netlify
- [ ] Configurar domínio personalizado no Clerk
- [ ] Testar login/cadastro em staging primeiro
- [ ] Deploy!
