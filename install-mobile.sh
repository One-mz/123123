#! /bin/bash

#should have direct access to following place

npm run build
ssh fssc@10.154.70.50@10.154.200.204 -t 'label=`date +%s` ; mv /home/weblogic/mobile /home/weblogic/mobile-$label ; mkdir /home/weblogic/mobile ;exit '

scp -rp dist/* fssc@10.154.70.50@10.154.200.204:/home/weblogic/mobile/
