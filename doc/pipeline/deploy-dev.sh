#/bin/sh
#
# Deploys the application.
#
#
#fail on error (-e).
set -o errexit

DIR_APACHE_HTML_FORMULARIO=/var/www/tuenti-formulario/public_html
CAPTCHA_SITE_KEY_TEST=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

AUTOGESTION_BASE_URL=https://autogestion.tuenti.dev.somospnt.com
PORTAREP_BASE_URL=https://tuenti.dev.somospnt.com
WEBPUSH_PUBLIC_KEY=BP0ocAqM_gbFW7opq3AuykcTfQFykn8AUKp0WaQ-iDdK4S6B9On6pO1MpNxvfYpv4OVsQfJtL1ifP4EqjKKhfGI
INVITA_BASE_URL=https://invita.tuenti.dev.somospnt.com
REFERIDOS_BASE_URL=https://referidos.tuenti.dev.somospnt.com
CAMPANIAS_BASE_URL=https://adminpromociones.tuenti.dev.somospnt.com

echo -e "";
echo -e "**************************************************************";
echo -e " Eliminando y Copiando nuevos archivos";
echo -e "**************************************************************";

rm $DIR_APACHE_HTML_FORMULARIO/* -rf
cp public_html/* $DIR_APACHE_HTML_FORMULARIO/ -r

echo -e "";
echo -e "**************************************************************";
echo -e " Remplazando variables de entorno";
echo -e "**************************************************************";

sed -i -e "s|host|$PORTAREP_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/js/app/service/utils.js
sed -i -e "s|<WEBPUSH_PUBLIC_KEY>|$WEBPUSH_PUBLIC_KEY|g" $DIR_APACHE_HTML_FORMULARIO/js/app/service/notificacionesPwa.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/serviceWorkerAutogestion.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/js/app/app.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/js/app/ui/views/nuevoChip.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/js/app/ui/component/portabilidadTYP.js
sed -i -e "s|<AUTOGESTION_BASE_URL>|$AUTOGESTION_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/js/app/ui/component/nuevoFormulario/portabilidadTYP.js
sed -i -e "s|6LdODIkUAAAAAH5sEbqUIOqY3F-sstG5IR530G3p|6LeijLkUAAAAAIMA3k4XQkTL1pEiwcf1aiq6U7Df|g" $DIR_APACHE_HTML_FORMULARIO/*.html
sed -i -e "s|<VERSION>|$VERSION|g" $DIR_APACHE_HTML_FORMULARIO/*.html
sed -i -e "s|https://invita.tuenti.com.ar|https://invita.tuenti.dev.somospnt.com|g" $DIR_APACHE_HTML_FORMULARIO/infoReferidos.html
sed -i -e "s|https://referidos.tuenti.com.ar|https://referidos.tuenti.dev.somospnt.com|g" $DIR_APACHE_HTML_FORMULARIO/landingLineaNuevaReferidos.html
sed -i -e "s|https://invita.tuenti.com.ar|https://invita.tuenti.dev.somospnt.com|g" $DIR_APACHE_HTML_FORMULARIO/js/app/ui/views/infoReferidos.js
sed -i -e "s|https://referidos.tuenti.com.ar|https://referidos.tuenti.dev.somospnt.com|g" $DIR_APACHE_HTML_FORMULARIO/js/app/ui/views/landingNuevaLineaReferidos.js
sed -i -e "s|6LeijLkUAAAAAIMA3k4XQkTL1pEiwcf1aiq6U7Df|$CAPTCHA_SITE_KEY_TEST|g" $DIR_APACHE_HTML_FORMULARIO/*.html
sed -i -e "s|6LceQc4UAAAAAD-rH5p6h1Nk4TvbkqKNpIWEvekz|$CAPTCHA_SITE_KEY_TEST|g" $DIR_APACHE_HTML_FORMULARIO/*.html
sed -i -e "s|<INVITA_BASE_URL>|$INVITA_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/js/app/ui/views/infoReferidos.js
sed -i -e "s|<REFERIDOS_BASE_URL>|$REFERIDOS_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/js/app/ui/views/landingNuevaLineaReferidos.js
sed -i -e "s|<CAMPANIAS_BASE_URL>|$CAMPANIAS_BASE_URL|g" $DIR_APACHE_HTML_FORMULARIO/js/app/service/campanias.js

echo -e "";
echo -e "**************************************************************";
echo -e " Tuenti - Formulario listo!!";
echo -e "**************************************************************";