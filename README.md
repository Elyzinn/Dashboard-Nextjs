# Pulso

Dashboard em português com login, cadastro e listagem pesquisável de usuários.
O projeto segue o trabalho da pasta `Docs/`: uma tela de login, uma tela de
dashboard e uma listagem acessível pela navegação.

## Executar

Use Node.js 24 ou superior:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000), crie uma conta e entre no
dashboard. O cadastro salva o usuário no SQLite e inicia a sessão.

## Dados

O SQLite nativo do Node armazena usuários e sessões em
`data/dashboard.sqlite`. Essa pasta é ignorada pelo Git. Para escolher outro
caminho, defina `SQLITE_DATABASE_PATH` antes de iniciar o servidor.

As senhas são armazenadas com hash scrypt, e as sessões usam cookies HttpOnly
com tokens aleatórios guardados como hash no banco. Em produção, use uma
instalação Node.js com `node:sqlite` e um volume persistente para o arquivo do
banco; o disco efêmero de algumas plataformas não preserva os cadastros entre
deploys.

## Telas

- `/`: login
- `/cadastro`: criação de conta
- `/dashboard`: indicadores e cadastros recentes
- `/usuarios`: listagem com busca por nome e e-mail
