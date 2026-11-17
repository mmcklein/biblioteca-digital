#!/bin/bash
source "$(dirname "$0")/variables.sh"
# FASE 3 - lo ejecutan los tres: master, nombre y test
git config --global user.name "$MI_NOMBRE"
git config --global user.email "$MI_CORREO"
git config --global core.autocrlf true
git config --global merge.tool p4merge
git config --global mergetool.p4merge.path "$P4MERGE_PATH"
git config --global mergetool.keepBackup false   # evita archivos .orig
echo; git config --global --list
