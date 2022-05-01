
if [ ! -n "$1" ];then
  echo "activete url needed!"
  exit 1
else
  echo "run curl $1/tele/setWebhook?authToken=201010&webhook=$1/tele/masteryibot"
  curl "$1/tele/setWebhook?authToken=201010&webhook=$1/tele/masteryibot"
fi
