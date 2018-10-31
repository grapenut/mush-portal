

const fs = require('fs');

if (process.env.NODE_ENV === 'development') {
  const devServerConfigPath = 'react-scripts/config/webpackDevServer.config';
  const devServerConfig = require(devServerConfigPath);
  require.cache[require.resolve(devServerConfigPath)].exports = (
    proxy,
    allowedHost
  ) => {
    const conf = devServerConfig(proxy, allowedHost);
//    conf.https = {
//      key: fs.readFileSync('privkey.pem'),
//      cert: fs.readFileSync('cert.pem')
//    };
    return conf;
  };
}

