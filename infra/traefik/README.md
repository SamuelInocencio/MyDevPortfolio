# Traefik — rotas de produção

`portfolio.yaml` é a config dinâmica do Traefik que publica **samuelinocencio.cloud**.
Em produção ele vive em `/etc/easypanel/traefik/config/portfolio.yaml`
(VPS Hostinger `1609818`, `187.127.26.89`).

## Por que num arquivo separado do `main.yaml`

O EasyPanel regenera `/etc/easypanel/traefik/config/main.yaml` a partir do banco
dele. Esse banco **não tem registro do domínio** — o formulário de domínios do
painel não persiste. Resultado: toda regeneração produz um `main.yaml` sem as
rotas, e o site cai em 404.

Foi exatamente isso que derrubou o site em 06/08/2026: as rotas tinham sido
escritas à mão dentro do `main.yaml` em 05/08 e foram apagadas na primeira
regeneração.

O Traefik roda com `TRAEFIK_PROVIDERS_FILE_DIRECTORY=/data/config` e
`WATCH=true` — lê o diretório inteiro —, e o EasyPanel só reescreve o
`main.yaml`. Por isso um arquivo próprio sobrevive.

**Não mova estas rotas para o `main.yaml`.**

## Deploy

```bash
scp infra/traefik/portfolio.yaml \
    root@187.127.26.89:/etc/easypanel/traefik/config/portfolio.yaml
ssh root@187.127.26.89 'touch /etc/easypanel/traefik/config/portfolio.yaml'
```

Use `scp`, **não** heredoc por SSH: os backticks das regras `Host(...)` são
escapados no caminho e o Traefik rejeita o YAML. O `touch` força o reload — o
watcher chega a ler o arquivo pela metade durante a transferência e loga um erro
que se resolve sozinho.

Verificar:

```bash
curl -o /dev/null -w '%{http_code}\n' https://samuelinocencio.cloud/
curl -o /dev/null -w '%{http_code}\n' https://samuelinocencio.cloud/api/v1/projects
ssh root@187.127.26.89 'docker service logs easypanel-traefik --since 2m | grep -i error'
```

Esperado: `200` nos dois, sem erros no log.

## Notas de roteamento

- O backend escuta na **3333** e serve `/api/v1/*` nativamente, sem strip de
  prefixo (`/health` fica na raiz). O frontend chama `/api/v1` relativo.
- O router da API tem prioridade maior (200) que o do site (100), senão o
  catch-all do frontend engoliria `/api`.
- O Traefik alcança `portfolio_frontend` e `portfolio_backend` porque ambos
  estão também na rede `easypanel`, não só na `easypanel-portfolio`.

## Atenção

Este arquivo não é aplicado por nenhum pipeline — o deploy é o `scp` acima.
Se alguém editar direto na VPS, a cópia daqui fica desatualizada sem aviso.
Antes de reimplantar, compare:

```bash
ssh root@187.127.26.89 'sha256sum /etc/easypanel/traefik/config/portfolio.yaml'
sha256sum infra/traefik/portfolio.yaml
```
