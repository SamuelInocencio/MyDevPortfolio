#!/usr/bin/env bash
# Reaplica as variaveis de ambiente do portfolio_backend no servico Swarm.
#
# Use depois de um "Deploy" pelo painel do EasyPanel, que reescreve a spec do
# servico e apaga as variaveis -- o backend entra em restart loop com
# "P1012: Environment variable not found: DATABASE_URL_POSTGRES".
#
#   ./restore.sh              # usa ~/backups/backend-env/portfolio_backend.env
#   ./restore.sh <arquivo>    # usa um snapshot especifico
#
# Os VALORES das variaveis nao estao neste repositorio (que e publico) -- eles
# ficam em ~/backups/backend-env/, modo 600. Este script so sabe aplica-los.
#
# O arquivo e enviado para a VPS e lido la dentro, em vez de virar argumentos de
# `ssh`. Isso e essencial: `ssh` junta os argumentos numa unica string e o shell
# remoto os reinterpreta -- as DATABASE_URL_* tem metacaracteres (`&`, `?`) que
# truncariam ou deturpariam o comando.
set -euo pipefail

HOST="${HOST:-root@187.127.26.89}"
SERVICE="${SERVICE:-portfolio_backend}"
ENV_FILE="${1:-$HOME/backups/backend-env/portfolio_backend.env}"

[ -r "$ENV_FILE" ] || { echo "arquivo nao encontrado: $ENV_FILE" >&2; exit 1; }

COUNT=$(grep -cE '^[A-Za-z_][A-Za-z0-9_]*=' "$ENV_FILE")
[ "$COUNT" -gt 0 ] || { echo "arquivo sem variaveis validas: $ENV_FILE" >&2; exit 1; }
echo "Reaplicando $COUNT variaveis em $SERVICE (host: $HOST)..."

REMOTE_FILE="/root/.restore-env.$$"

cleanup() { ssh "$HOST" "rm -f '$REMOTE_FILE'" 2>/dev/null || true; }
trap cleanup EXIT

# umask 077 no destino: o arquivo tem segredos.
ssh "$HOST" "umask 077; cat > '$REMOTE_FILE'" < "$ENV_FILE"

# --env-add faz merge, nao substitui: variaveis atuais que nao estejam no
# arquivo permanecem. Para um reset limpo, remova-as antes com --env-rm.
ssh "$HOST" bash -s -- "$REMOTE_FILE" "$SERVICE" <<'REMOTE'
set -euo pipefail
file="$1"; service="$2"
args=()
while IFS= read -r line; do
  [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]] || continue
  args+=(--env-add "$line")
done < "$file"
docker service update --quiet "${args[@]}" "$service" >/dev/null
REMOTE

echo "Aguardando convergir..."
ssh "$HOST" "docker service ps '$SERVICE' --format '  {{.Name}} {{.CurrentState}}' | head -3"

echo "Verificacao:"
ssh "$HOST" "docker service inspect '$SERVICE' \
  --format '{{range .Spec.TaskTemplate.ContainerSpec.Env}}{{println .}}{{end}}' \
  | grep -cE '^[A-Za-z_][A-Za-z0-9_]*='" | xargs -I{} echo "  variaveis no servico: {}"
curl -sS -o /dev/null -w "  https://samuelinocencio.cloud/api/v1/projects -> %{http_code}\n" \
  -m 30 https://samuelinocencio.cloud/api/v1/projects
