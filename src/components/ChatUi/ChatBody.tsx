import { MessageList } from 'react-chat-elements';

interface ChatBodyProps {
  data: any;
}

// ws://websocket

const ChatBody = ({ data }: ChatBodyProps) => {
  console.log({ data });
  let parsedItem: any;
  // let isSender: boolean;

  data = data.map((item: any) => {
    parsedItem = typeof item === 'string' && item !== '' ? JSON.parse(item) : item; //{ content: '' };
    // isSender = parsedItem.sender.startsWith('localhost');
    switch (typeof item) {
      case 'string':
        return {
          type: 'text',
          text: parsedItem.content,
          title: parsedItem.sender,
        };
      case 'object':
        // file object
        if (item.content.file)
          return {
            type: 'file',
            text: 'File attached:' + item.content.file.name,
            title: 'User',
            data: item.content.file,
            file: item.content.file,
            url: item.content.file,
            // position: isSender ? 'right' : 'left', //parsedItem.sender.includes('localhost') ? 'right' : 'left',
          };
        //audio object
        if (item.content.audio) {
        }
        //video object
        if (item.content.video) {
        }
        //picture object
        if (item.content.picture) {
        }
    }
  });

  return (
    <div className="chat-body">
      <MessageList {...({ dataSource: data } as any)} />
    </div>
  );
};

export default ChatBody;
