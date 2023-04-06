#!/bin/bash
#############################################################################################
## Script de Deploy del Formulario de portabilidad
#############################################################################################

#############################################################################################
## Configuracion de Script
##
## fail on error (-e).
#############################################################################################
set -o errexit

#############################################################################################
## Variables de entorno
#############################################################################################
DIR_HTML_TUENTI_FORMULARIO=/var/www/tuenti-formulario/public_html

AUTOGESTION_BASE_URL=https://autogestion.tuenti.com.ar
PORTAREP_BASE_URL=https://portarep.tuenti.com.ar
WEBPUSH_PUBLIC_KEY=BJ8Ambm-eDHiCm0X2EbC7ZpW9p5KZZQgzSXFA_JSAe6H3W9HLhm36keYWEsL6uM2ahq7DND9Fqhoea-ucv9IfcQ
INVITA_BASE_URL=https://invita.tuenti.com.ar 
REFERIDOS_BASE_URL=https://referidos.tuenti.com.ar
CAMPANIAS_BASE_URL=https://adminpromociones.tuenti.com.ar

#############################################################################################
## Eliminamos el contenido de la carpeta public_html
## Copiamos el contenido de la carpeta temporal a esta
## Eliminamos la carpeta temporal donde se clono el proyecto
#############################################################################################
rm $DIR_HTML_TUENTI_FORMULARIO/* -rf
cp public_html/* $DIR_HTML_TUENTI_FORMULARIO/ -r

echo -e "";
echo -e "**************************************************************";
echo -e " Remplazando variables de entorno";
echo -e "**************************************************************";

#############################################################################################
## Remplazamos la direccion de la api 'host' en determinado archivo
## Remplazamos la clave pública de la api WebPush en determinado archivo
## Remplazamos la URL base de autogestión en el service worker
## Remplazamos la URL base de autogestión en app.js
## Remplazamos la version de todos los archivos para que el navegador no cachee los scripts
#############################################################################################
sed -i -e "s|host|$PORTAREP_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/service/utils.js
sed -i -e "s|<WEBPUSH_PUBLIC_KEY>|$WEBPUSH_PUBLIC_KEY|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/service/notificacionesPwa.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/serviceWorkerAutogestion.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/app.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/ui/views/nuevoChip.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/ui/component/portabilidadTYP.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/ui/component/nuevoFormulario/portabilidadTYP.js
sed -i -e "s|<VERSION>|$1|g" $DIR_HTML_TUENTI_FORMULARIO/*.html
sed -i -e "s|<INVITA_BASE_URL>|$INVITA_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/ui/views/infoReferidos.js
sed -i -e "s|<INVITA_BASE_URL>|$INVITA_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/ui/views/infoReferidosClaro.js
sed -i -e "s|<REFERIDOS_BASE_URL>|$REFERIDOS_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/ui/views/landingNuevaLineaReferidos.js
sed -i -e "s|<CAMPANIAS_BASE_URL>|$CAMPANIAS_BASE_URL|g" $DIR_HTML_TUENTI_FORMULARIO/js/app/service/campanias.js

echo -e "";
echo -e "**************************************************************";
echo -e " Tuenti - Formulario listo!!";
echo -e "**************************************************************";