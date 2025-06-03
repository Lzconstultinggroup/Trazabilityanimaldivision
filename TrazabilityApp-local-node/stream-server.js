import WebSocket, { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import http from 'http';
import url from 'url';

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });

const streams = {};

function startStream(streamKey, rtspUrl) {
  if (streams[streamKey]) return;

  const ffmpeg = spawn('ffmpeg', [
    '-rtsp_transport', 'tcp',
    '-i', rtspUrl,
    '-f', 'mpegts',
    '-codec:v', 'mpeg1video',
    '-s', '640x480',
    '-b:v', '1000k',
    '-r', '30',
    '-an',
    '-'
  ]);

  streams[streamKey] = { ffmpeg, clients: new Set() };

  ffmpeg.stdout.on('data', (data) => {
    for (const client of streams[streamKey].clients) {
      if (client.readyState === WebSocket.OPEN) client.send(data);
    }
  });

  ffmpeg.on('close', () => {
    delete streams[streamKey];
    console.log(`[FFMPEG] Stream ${streamKey} finalizado`);
  });
}

server.on('upgrade', (req, socket, head) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const streamKey = pathname.split('/').pop();
  const ip = searchParams.get('ip');
  const user = searchParams.get('user');
  const pass = searchParams.get('pass');

  const rtspUrl = `rtsp://${user}:${pass}@${ip}/Streaming/Channels/101/`;

  startStream(streamKey, rtspUrl);

  wss.handleUpgrade(req, socket, head, (ws) => {
    streams[streamKey].clients.add(ws);

    ws.on('close', () => {
      streams[streamKey].clients.delete(ws);
      if (streams[streamKey].clients.size === 0) {
        streams[streamKey].ffmpeg.kill('SIGINT');
        delete streams[streamKey];
      }
    });

    wss.emit('connection', ws, req);
  });
});

server.listen(9999, () => {
  console.log(`🟢 WS dinámico escuchando en ws://localhost:9999`);
});
