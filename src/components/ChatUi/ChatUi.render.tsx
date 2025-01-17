import { useRenderer } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';

import { IChatUiProps } from './ChatUi.config';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { IoIosSend } from 'react-icons/io';

const ChatUi: FC<IChatUiProps> = ({ socketAddress, style, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const [socket, setSocket] = useState<any>();
  const [message, setMessage] = useState<any>('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    console.log('socket useeffect executeeed!!!');

    if (!socketAddress && socketAddress !== '') return;
    // Create a WebSocket connection
    const socket = new WebSocket(socketAddress);
    //testing purpose only
    if (socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket is alive and open.');
    } else {
      console.log('WebSocket is not open. Current state:', socket.readyState);
    }
    //
    socket.onopen = () => {
      setConnectionStatus('Connected');
      console.log('WebSocket connection established');
      setSocket(socket);
    };
    //
    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      const datamessages = event.data.split('\n').filter((msg: any) => msg.trim() !== '');
      setMessages((prev: any) => [...prev, ...datamessages]);
    };

    socket.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log('WebSocket connection closed');
    };
    // Event listener for errors
    socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };
    //close socket
    return () => {
      if (socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
    };
  }, [socketAddress]);

  //input change
  const handleInputChange = (newMessage: string) => {
    console.log('from input', { newMessage });
    setMessage(newMessage);
    // setMessages((prevMessages: any) => [...prevMessages, { content: message }]);
  };

  //file upload
  const handleFileUpload = (file: File) => {
    const fileMessage = { text: 'File attached: ' + file.name, file };
    setUploadedFile(file);
    setMessage(fileMessage);
    setMessages((prevMessages: any) => [...prevMessages, { content: fileMessage }]);
  };

  const sendMessage = () => {
    if (message) {
      console.log('message sent!', JSON.stringify({ content: message }), socket);
      socket.send(JSON.stringify({ content: message }));
    }
  };

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <ChatHeader />
      <ChatBody key={messages} data={messages} />
      <div className="flex flex-row">
        <ChatFooter
          handleInputChange={(e: any) => handleInputChange(e)}
          handleFileUpload={(file: File) => handleFileUpload(file)}
        />
        <button className="p-4" onClick={sendMessage}>
          {/*to maybe move to the footer part*/}
          <IoIosSend className="text-xl" />
        </button>
      </div>
      {/* testinggggg */}
      {/* <div>{message}</div> */}
      <div>{message.content}</div>
      {messages.map((message: any, index: number) => (
        <div key={index}>
          {/* Render file message if available */}
          {message.file && (
            <div>
              <a
                className="text-blue-500"
                href={URL.createObjectURL(message.file)}
                download={message.file.name}
              >
                UPPPPPPPPPPP{message.file.name}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatUi;

// import { useRenderer } from '@ws-ui/webform-editor';
// import cn from 'classnames';
// import { FC, useEffect, useState } from 'react';

// import { IChatUiProps } from './ChatUi.config';
// import ChatHeader from './ChatHeader';
// import ChatBody from './ChatBody';
// import ChatFooter from './ChatFooter';
// import { IoIosSend } from 'react-icons/io';

// const ChatUi: FC<IChatUiProps> = ({
//   socketAddress,
//   position,
//   style,
//   className,
//   classNames = [],
// }) => {
//   const { connect } = useRenderer();
//   const [socket, setSocket] = useState<any>();

//   const [message, setMessage] = useState<any>('');
//   const [receivedData, setReceivedData] = useState<any>('');

//   const [uploadedFile, setUploadedFile] = useState<any>('');
//   const [connectionStatus, setConnectionStatus] = useState('Connecting...');
//   const [messages, setMessages] = useState<any>([]);

//   useEffect(() => {
//     if (!socketAddress && socketAddress !== '') return;
//     // Create a WebSocket connection
//     const socket = new WebSocket(socketAddress);
//     //testing purpose only
//     if (socket.readyState === WebSocket.OPEN) {
//       console.log('WebSocket is alive and open.');
//     } else {
//       console.log('WebSocket is not open. Current state:', socket.readyState);
//     }

//     socket.onopen = () => {
//       setConnectionStatus('Connected');
//       console.log('WebSocket connection established');
//       setSocket(socket);
//     };
//     socket.onmessage = (event) => {
//       console.log('from server', event);
//       setReceivedData((prev: any) => prev + event.data);
//     };

//     socket.onclose = () => {
//       setConnectionStatus('Disconnected');
//       console.log('WebSocket connection closed');
//     };

//     // Event listener for errors
//     socket.onerror = (error) => {
//       console.error('WebSocket error', error);
//     };

//     const getMessage = () => {
//       socket.addEventListener('message', (event) => {});
//     };

//     getMessage();

//     // Cleanup on component unmount
//     return () => {
//       socket.removeEventListener('message', getMessage);
//       socket.close();
//     };
//   }, [socketAddress]);

//   useEffect(() => {
//     setMessages(receivedData.split('\n'));
//   }, [receivedData]);

//   //input change
//   const handleInputChange = (newMessage: string) => {
//     setMessage({ content: newMessage }); // Append the new message
//     setMessages((prevMessages: any) => [...prevMessages, newMessage]); //to be oved to the send
//   };

//   //file upload
//   const handleFileUpload = (file: File) => {
//     const fileMessage = { text: 'File attached: ' + file.name, file };
//     // setUploadedFile(file);
//     setMessages((prevMessages: any) => [...prevMessages, fileMessage]); //to be oved to the send
//   };

//   console.log('from parent !!!!!!!!!!!!!!!!!!!', message.split('\n'));

//   return (
//     <div ref={connect} style={style} className={cn(className, classNames)}>
//       <ChatHeader />
//       <ChatBody key={messages} data={messages} />
//       <div className="flex flex-row">
//         <ChatFooter
//           handleInputChange={(e: any) => handleInputChange(e)}
//           handleFileUpload={(file: File) => handleFileUpload(file)}
//         />
//         <button className="p-4" onClick={() => socket.send('Hello qodly')}>
//           {/*to maybe move to the footer part*/}
//           <IoIosSend className="text-xl" />
//         </button>
//       </div>
//       {/* testinggggg */}
//       <div>{message}</div>
//       <div>{message.content}</div>
//       {messages.map((message: any, index: number) => (
//         <div key={index}>
//           {/* Render file message if available */}
//           {message.file && (
//             <div>
//               <a
//                 className="text-blue-500"
//                 href={URL.createObjectURL(message.file)}
//                 download={message.file.name}
//               >
//                 {message.file.name}
//               </a>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ChatUi;
