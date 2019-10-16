import http from 'http';
import { config } from './event-builder';

export function createTest({ LISTEN_PORT = 8080 }: { LISTEN_PORT: number, API_PORT: number }) {
  const client = {
    send(data: any) {
      return new Promise((resolve, reject) => http.request({
          host: '127.0.0.1',
          port: LISTEN_PORT,
          method: 'POST',
        }, res => {
          let data = '';
          res.on('data', (chunk) => data += chunk)
            .on('end', () => {
              const dataObj = JSON.parse(data);
              resolve(dataObj);
              console.log(dataObj);
            })
            .on('error', reject);
        })
        .on('error', reject)
        .end(JSON.stringify(data))
      );
    },
    APIProxy: {
      sendPrivateMsg() {
        
      }
    },
  };
  return client;
}