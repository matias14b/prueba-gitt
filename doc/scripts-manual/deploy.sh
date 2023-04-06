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
CHECKOUT_TAG=false

DIR_HTML_TUENTI_FORMULARIO=/var/www/tuenti-formulario/public_html_prueba
DIR_CARPETA_TEMPORAL=/home/tuenti/formulario

VERSION=$(date +"%m-%d-%y"-"%T")
AUTOGESTION_BASE_URL=https://autogestion.tuenti.com.ar
PORTAREP_BASE_URL=https://portarep.tuenti.com.ar
WEBPUSH_PUBLIC_KEY=BGgL7I82SAQM78oyGwaJdrQFhVfZqL9h4Y18BLtgJQ-9pSGXwxqAWQudqmcv41RcWgk1ssUeItv4-8khxbhYveM=

#############################################################################################
## Definimos los parametros que se le pasa al script
#############################################################################################
while getopts "v:" OPTION
do
    case $OPTION in
        v)
            VERSION=$2
            CHECKOUT_TAG=true
            ;;
        ?)
            usage
            exit
            ;;
    esac
done

echo -e "";
echo -e "**************************************************************";
echo -e " Clonando Tuenti - Formulario";
echo -e " Version:"$VERSION;
echo -e " Public Html Tuenti:"$DIR_HTML_TUENTI_FORMULARIO;
echo -e "**************************************************************";
echo -e "";

#############################################################################################
## Eliminamos la carpeta temporal donde clonamos el proyecto
#############################################################################################
rm $DIR_CARPETA_TEMPORAL/formulabilidad-tuenti/ -rf

#############################################################################################
## Clonamos el proyecto en base al parametro si se le envia
## En el caso de que el script se corra con el parametro -b <Nombre Tag / Branch>
## Si no por defecto clona el master
#############################################################################################
if [[ $CHECKOUT_TAG == true ]]; then
    git clone -b $VERSION git@gitlab.com:somospnt/tuenti/formulabilidad-tuenti.git
fi

if [[ $CHECKOUT_TAG == false ]]; then
    git clone git@gitlab.com:somospnt/tuenti/formulabilidad-tuenti.git
fi

echo -e "";
echo -e "**************************************************************";
echo -e " Eliminando y Copiando nuevos archivos";
echo -e "**************************************************************";

#############################################################################################
## Eliminamos el contenido de la carpeta public_html
## Copiamos el contenido de la carpeta temporal a esta
## Eliminamos la carpeta temporal donde se clono el proyecto
#############################################################################################
rm $DIR_HTML_TUENTI_FORMULARIO/* -rf
cp $DIR_CARPETA_TEMPORAL/formulabilidad-tuenti/public_html/* $DIR_HTML_TUENTI_FORMULARIO/ -r
rm $DIR_CARPETA_TEMPORAL/formulabilidad-tuenti -rf

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
sed -i -e "s|<VERSION>|$VERSION|g" $DIR_HTML_TUENTI_FORMULARIO/*.html

echo -e "";
echo -e "**************************************************************";
echo -e " Tuenti - Formulario listo!!";
echo -e "**************************************************************";