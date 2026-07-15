import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAuthLocalToken } from '@utils/AuthUtils';

const WS_ENDPOINT = import.meta.env.VITE_SERVER_HOST + '/ws';

const useRollcallSocket = (lessonId) => {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('WS_ENDPOINT'),
      onConnect: () => {
        client.subscribe(`/topic/rollcall/${lessonId}`, (msg) => {
          console.log('收到新碼:', msg.body);
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [lessonId]);
};
const useSocket = (targetPath, fn) => {
  const clientRef = useRef(null);
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      connectHeaders: {
        Authorization: `Bearer ${getAuthLocalToken()}`,
      },
      onConnect: () => {
        client.subscribe(targetPath, (msg) => {
          try {
            const data = JSON.parse(msg.body);
            fnRef.current(data);
          } catch (error) {
            console.error('JSON 解析失敗，原始訊息內容為:', msg.body);
          }
        });
      },
      onStompError: (frame) => {
        console.error(
          'WebSocket 授權失敗或連線錯誤:',
          frame.headers['message'],
        );
      },
    });

    clientRef.current = client;

    return () => deactivateSocket();
  }, [targetPath]);

  const activateSocket = () => {
    if (clientRef.current && !clientRef.current.active) {
      console.log('激活WebSocket連接', targetPath);
      clientRef.current.activate();
    }
  };
  const deactivateSocket = () => {
    if (clientRef.current && clientRef.current.active) {
      console.log('停用WebSocket連接', targetPath);
      clientRef.current.deactivate();
    }
  };
  return [activateSocket, deactivateSocket];
};
export { useRollcallSocket, useSocket };
