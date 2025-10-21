#!/usr/bin/env bash
set -euo pipefail

pnpm install

pushd apps/api
    pnpm install
    pnpm prisma migrate deploy
popd

pushd apps/web
    pnpm install
popd

echo "Bootstrap complete"
echo "Run 'pnpm dev:api' and 'pnpm dev:web' to start the dev servers."