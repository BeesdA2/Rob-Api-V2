echo "parameter 1" $1
echo "parameter 2" $2
echo "parameter 3" $3
echo "parameter 4" $4
echo "parameter 5" $5
echo "parameter 6" $6
echo "parameter 7" $7
echo "parameter 8" $8

export PATH=/QOpenSys/pkgs/lib/nodejs10/bin:$PATH;  
export LIBPATH=/QOpenSys/pkgs/lib/nodejs10/bin:$LIBPATH;
export NODE_PATH=/QOpenSys/pkgs/lib/nodejs10/node_modules:$NODE_PATH;
node -v;

node /Beesda2/NodeJS/Productie/Rob-Api-v2/js/cancelServiceRequestLine.js $1 $2 $3 $4 $5 $6 $7 $8;
