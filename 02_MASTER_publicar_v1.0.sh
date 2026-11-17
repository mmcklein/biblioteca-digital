#!/bin/bash
source "$(dirname "$0")/variables.sh"
# FASE 4 - Responsable: master
set -e
cd "$MASTER_DIR"
git init
git add .
git commit -m "v1.0: estructura base y requisitos del comedor"
git branch -M main
git remote add origin "$REMOTO"
git push -u origin main
git tag -a v1.0 -m "Version 1.0 - estructura base"
git push origin v1.0
echo "OK: v1.0 publicada. Toma la captura 01 en GitHub."
