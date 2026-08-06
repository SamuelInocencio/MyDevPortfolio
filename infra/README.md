# infra — configuração de produção

Produção roda na VPS Hostinger `1609818` (`187.127.26.89`), sobre EasyPanel +
Docker Swarm, servindo **samuelinocencio.cloud**.

Duas configurações essenciais **vivem fora do painel do EasyPanel** e não
aparecem na interface dele. Este diretório existe por causa disso.

| Config | Onde vive em produção | Aqui no repo |
|---|---|---|
| Rotas do Traefik | `/etc/easypanel/traefik/config/portfolio.yaml` | [`traefik/`](traefik/) — arquivo completo |
| Variáveis do backend | spec do serviço Swarm `portfolio_backend` | [`backend-env/`](backend-env/) — só o script; **valores fora do repo** |

## Por que fora do painel

O painel do EasyPanel **não persiste formulários** — variáveis de ambiente e
domínios são submetidos, a interface não acusa erro, e nada é salvo. As duas
configs acima foram aplicadas direto no servidor e o painel não sabe que existem.

Isso tem duas consequências que já derrubaram o site:

1. **Clicar em "Deploy" no `portfolio_backend`** reescreve a spec do serviço e
   apaga as variáveis. O backend entra em restart loop com
   `P1012: Environment variable not found: DATABASE_URL_POSTGRES`.
2. **O EasyPanel regenera o `main.yaml` do Traefik** a partir do banco dele, que
   não tem registro do domínio. Toda regeneração produz uma config sem as rotas
   e o site cai em 404 — foi o que aconteceu em 06/08/2026.

Em nenhum dos dois casos a interface mostra erro: ela continua verde.

**Não reimplante o backend pelo painel.** Se o fizer, rode
[`backend-env/restore.sh`](backend-env/restore.sh) em seguida.

## Segredos

`SamuelInocencio/MyDevPortfolio` é **público**. As variáveis do backend incluem
`JWT_SECRET`, `CLOUDINARY_API_SECRET` e as `DATABASE_URL_*` com credenciais —
elas **nunca** entram aqui. Ficam em `~/backups/backend-env/` (modo 600) e em
`/root/backups/backend-env/` na VPS.

O que é versionado é o *procedimento*: o script que as aplica, sem os valores.
As rotas do Traefik não têm segredo e vão completas.

## Restaurar as variáveis do backend

```bash
infra/backend-env/restore.sh                       # snapshot mais recente
infra/backend-env/restore.sh <arquivo-especifico>
```

Testado em produção em 06/08/2026: 9,6s de ponta a ponta, hash das variáveis
idêntico antes e depois, e **110/110 requisições `200`** durante a janela — zero
downtime, porque o serviço está com `update_config: start-first` (o Swarm sobe a
task nova antes de derrubar a antiga).

`--env-add` faz **merge**, não substituição: variáveis presentes no serviço e
ausentes do arquivo permanecem. Para um reset limpo, remova-as antes com
`--env-rm`.

## Uma lição que vale além daqui

A primeira versão do `restore.sh` passava as variáveis como argumentos de `ssh`.
O `ssh` junta os argumentos numa única string e o shell **remoto** os
reinterpreta — e as `DATABASE_URL_*` contêm `&` e `?`. Um `&` truncaria o
comando no meio, gravando variáveis pela metade justamente na emergência em que
o script seria usado.

A correção é enviar o arquivo e lê-lo do outro lado, nunca interpolar valor com
metacaractere numa linha de comando remota. Vale para qualquer script deste
repositório que fale com a VPS.

## Nenhum destes arquivos é aplicado automaticamente

Não há pipeline. O deploy de cada um é manual e está documentado no README do
respectivo diretório. O repositório é a referência, **não** a fonte de verdade —
se algo for editado direto na VPS, a cópia daqui envelhece em silêncio. Cada
README traz o comando de comparação para conferir antes de reimplantar.
