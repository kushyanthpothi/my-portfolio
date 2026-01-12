const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrkushyanthportfolio = onRequest({"region":"asia-south1"}, (req, res) => server.then(it => it.handle(req, res)));
  