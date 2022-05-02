KOA_PORT="9998"
docker run -d --name telebot \
--env HTTPS_PROXY="" \
--env KOA_PORT=$KOA_PORT \
-p $KOA_PORT:$KOA_PORT \
conanskyforce/telebot
