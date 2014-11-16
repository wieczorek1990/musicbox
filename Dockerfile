from debian:latest
run apt-get update
run apt-get install -y curl
run curl -sL https://deb.nodesource.com/setup | bash -
run apt-get install -y nodejs build-essential git sox libsox-fmt-all
copy . /
run npm install
expose 80
cmd ["node", "/index.js"]