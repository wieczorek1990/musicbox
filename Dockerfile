from debian:latest
run apt-get update
run apt-get install -y curl
run curl -sL https://deb.nodesource.com/setup | bash -
run apt-get install -y nodejs build-essential
copy . /
run npm install
expose 8080
cmd ["node", "/index.js"]