@echo off
chcp 65001
setlocal enabledelayedexpansion

echo ********************************************
echo DÉBUT DU SCRIPT DE DÉPLOIEMENT
echo ********************************************
echo.

REM -- Configuration du projet et des images --
set "PROJECT_ID=displayhome"
REM Utilisez la région où se trouve votre instance Cloud SQL.
set "REGION=europe-west9"

REM On ne déploie plus MariaDB, on déploie uniquement backend et frontend
set "BACKEND_IMAGE=gcr.io/%PROJECT_ID%/backend"
set "FRONTEND_IMAGE=gcr.io/%PROJECT_ID%/frontend"

echo [DEBUG] Configuration du projet GCP vers %PROJECT_ID%...
call gcloud config set project %PROJECT_ID%
if errorlevel 1 (
    echo ERREUR : Problème lors de la configuration du projet GCP.
    pause
    exit /b 1
)
echo [DEBUG] Configuration terminée.
echo.

echo ********************************************
echo Début du build Docker Compose
echo ********************************************
echo [DEBUG] Exécution de : docker-compose build
docker-compose build
if errorlevel 1 (
    echo ERREUR : Une erreur s'est produite lors du build.
    pause
    exit /b 1
)
echo [DEBUG] Build Docker Compose terminé.
echo.

echo ********************************************
echo Début de la poussée des images vers GCR
echo ********************************************
echo [DEBUG] Poussée de l'image backend...
docker push %BACKEND_IMAGE%
if errorlevel 1 (
    echo ERREUR : Une erreur s'est produite lors du push de l'image backend.
    pause
    exit /b 1
)
echo [DEBUG] Poussée de l'image backend terminée.
echo.

echo [DEBUG] Poussée de l'image frontend...
docker push %FRONTEND_IMAGE%
if errorlevel 1 (
    echo ERREUR : Une erreur s'est produite lors du push de l'image frontend.
    pause
    exit /b 1
)
echo [DEBUG] Poussée de l'image frontend terminée.
echo.

echo ********************************************
set /p CONFIRM="Les images ont été poussées sur GCR. Voulez-vous déployer les services sur Cloud Run ? (y/n) : "
if /I not "%CONFIRM%"=="y" (
    echo Déploiement annulé.
    pause
    exit /b 0
)
echo.

echo ********************************************
echo Déploiement du service backend sur Cloud Run (avec Cloud SQL et timeout augmenté)
echo ********************************************
call gcloud run deploy backend-service ^
  --image gcr.io/displayhome/backend ^
  --region %REGION% ^
  --platform managed ^
  --allow-unauthenticated ^
  --port 3000 ^
  --set-env-vars DB_HOST=/cloudsql/displayhome:europe-west9:displayhome,DB_USER=myuser,DB_PASSWORD=mypassword,DB_NAME=db1,JWT_SECRET=mySuperSecretKey,DEFAULT_ADMIN_NAME=admin,DEFAULT_ADMIN_PASSWORD=password ^
  --add-cloudsql-instances=displayhome:europe-west9:displayhome ^
  --timeout=300s
if errorlevel 1 (
    echo ERREUR : Une erreur s'est produite lors du déploiement du service backend.
    pause
    exit /b 1
)
echo [DEBUG] Service backend déployé.
echo.

echo ********************************************
echo Déploiement du service frontend sur Cloud Run
echo ********************************************
call gcloud run deploy frontend-service ^
  --image gcr.io/displayhome/frontend ^
  --region %REGION% ^
  --platform managed ^
  --allow-unauthenticated ^
  --port 80 ^
  --quiet
if errorlevel 1 (
    echo ERREUR : Une erreur s'est produite lors du déploiement du service frontend.
    pause
    exit /b 1
)
echo [DEBUG] Service frontend déployé.
echo.

echo ********************************************
echo DÉPLOIEMENT COMPLET !
echo Pour consulter les services déployés, exécutez : call gcloud run services list
echo ********************************************
pause
