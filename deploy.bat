@echo off
REM Vérifie si un message de commit a été passé en argument
IF "%~1"=="" (
    echo Vous devez fournir un message de commit.
    exit /b 1
)

REM Définit le message de commit
SET COMMIT_MSG=%~1

REM Ajoute tous les fichiers
git add .

REM Effectue le commit avec le message fourni
git commit -m "%COMMIT_MSG%"

REM Pousse les changements sur la branche main
git push origin main

REM Déploie l'application
npm run deploy

echo Déploiement terminé avec succès.
