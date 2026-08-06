# Variáveis de ambiente do `portfolio_backend`

Este diretório tem **só o script**. Os valores das variáveis **não estão no
repositório** — ele é público e elas incluem `JWT_SECRET`,
`CLOUDINARY_API_SECRET` e as `DATABASE_URL_*` com credenciais.

Os valores ficam em:

- `~/backups/backend-env/` (máquina local, diretório `700`, arquivos `600`)
- `/root/backups/backend-env/` (VPS, para restaurar sem depender do laptop)

## Restaurar

```bash
./restore.sh                       # usa ~/backups/backend-env/portfolio_backend.env
./restore.sh <arquivo-especifico>  # usa um snapshot datado
```

Quando usar: depois de um "Deploy" pelo painel do EasyPanel, que apaga as
variáveis e derruba o backend em restart loop com
`P1012: Environment variable not found: DATABASE_URL_POSTGRES`.

`--env-add` faz **merge**, não substituição — variáveis presentes no serviço e
ausentes do arquivo permanecem. Para um reset limpo, remova-as antes com
`--env-rm`.

## Atualizar o snapshot

Sempre que uma variável mudar na VPS:

```bash
umask 077
cd ~/backups/backend-env
ssh root@187.127.26.89 \
  'docker service inspect portfolio_backend --format "{{range .Spec.TaskTemplate.ContainerSpec.Env}}{{println .}}{{end}}"' \
  | grep -v '^$' > portfolio_backend.env-$(date +%Y%m%d-%H%M%S)
ln -sf portfolio_backend.env-<novo> portfolio_backend.env
```

Conferir sem expor valores:

```bash
sed -E 's/=.*/=<oculto>/' ~/backups/backend-env/portfolio_backend.env
```

## Cópia de emergência

`~/backups/backend-env/restore.sh` é uma cópia deste script, mantida lá para o
diretório de backup ser autossuficiente caso o repositório não esteja à mão na
hora do incidente. **É a única duplicação intencional do `infra/`** — este aqui
é a versão canônica.

As duas diferem **de propósito** em duas coisas, e só nelas:

- o `ENV_FILE` padrão (aqui, o caminho absoluto `~/backups/...`; lá, o próprio
  diretório do script)
- os comentários do cabeçalho sobre onde ficam os valores

```bash
diff infra/backend-env/restore.sh ~/backups/backend-env/restore.sh
```

Qualquer diferença **fora** dessas duas é divergência real — a lógica de
aplicação deve ser idêntica nas duas cópias.

## Estado em 06/08/2026

11 variáveis, todas preenchidas: `FRONTEND_URL`, `DATABASE_URL_MONGO`,
`DATABASE_URL_POSTGRES`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`,
`DEPLOY_TIMESTAMP`, `GIT_SHA`.

`DEPLOY_TIMESTAMP` e `GIT_SHA` são carimbos do deploy da época — restaurá-los
recoloca valores antigos, sem efeito funcional.
