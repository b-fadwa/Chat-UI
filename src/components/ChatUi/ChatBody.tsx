import { MessageBox } from 'react-chat-elements';
import { MessageList } from 'react-chat-elements';

interface ChatBodyProps {
  position: string;
  data: any;
}

// ws://192.168.225.12

const ChatBody = ({ position, data }: ChatBodyProps) => {
  data=[data]

  console.log({ data }, { position });

  return (
    <div className="chat-body">
      <MessageList {...({ dataSource: data } as any)} />
      <MessageBox
        {...({
          position: { position },
          type: 'text',
          title: 'Message Box Title',
          text: 'Here is a text type message box',
        } as any)}
      />
    </div>
  );
};

export default ChatBody;
