#!/usr/bin/env bash
set -euo pipefail
pnpm install
pushd apps/api
    pnpm prisma migrate deploy
popd
echo "Bootstrap complete"