

const fs = require('fs');

if (process.env.NODE_ENV === 'development') {
  const devServerConfigPath = 'react-scripts/config/webpackDevServer.config';
  const devServerConfig = require(devServerConfigPath);
  require.cache[require.resolve(devServerConfigPath)].exports = (
    proxy,
    allowedHost
  ) => {
    const conf = devServerConfig(proxy, allowedHost);
    conf.https = {
      key: fs.readFileSync('/home/grapenut/ssl/privkey.pem'),
      cert: fs.readFileSync('/home/grapenut/ssl/cert.pem')
    };

    return conf;
  };
}

