const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  const socketProxy = createProxyMiddleware("/socket.io", {
    target: `${process.env.REACT_APP_API_URL}`,
    changeOrigin: true,
    ws: true,
    logLevel: "debug",
  });
  app.use(socketProxy);
};
