require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const http = require('http');
const app = require('./app');
const { initSocket } = require('./config/socket');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Convora server running on port ${PORT}`);
  });
});
