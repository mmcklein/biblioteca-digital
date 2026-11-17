#!/bin/bash
source "$(dirname "$0")/variables.sh"
# FASE 5 - Responsables: nombre y test (cada uno en su PC)
set -e
mkdir -p "$KIT/clon"
cd "$KIT/clon"
git clone "$REMOTO" comedor-universitario
cd comedor-universitario
git log --oneline --decorate
