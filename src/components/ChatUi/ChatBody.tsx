import { FC, useState } from 'react';
import { MessageList } from 'react-chat-elements';

interface ChatBodyProps {
  data: any;
}

// ws://websocket

const ChatBody: FC<ChatBodyProps> = ({ data }) => {
  let parsedItem: any;
  let isSender: boolean;

  const [pollResponses, setPollResponses] = useState<Record<string, string | null>>({});

  const handlePollResponse = (pollId: string, option: string) => {
    setPollResponses((prev) => ({
      ...prev,
      [pollId]: option,
    }));
    console.log(`Poll ID: ${pollId}, Selected Option: ${option}`);
  };

  data = data.map((item: any, index: number) => {
    parsedItem = JSON.parse(item);
    isSender = parsedItem.sender ? parsedItem.sender.startsWith('localhost') : true; //to be updated

    console.log(parsedItem.poll)

    if (
      (parsedItem.content == '') &&
      (parsedItem.sender != '') &&
      !parsedItem.file &&
      !parsedItem.audio &&
      !parsedItem.image &&
      !parsedItem.poll
    ) {
      return null;
    }
    //text
    if (parsedItem.content)
      return {
        type: 'text',
        text: parsedItem.content,
        title: parsedItem.sender,
        position: isSender ? 'left' : 'right',
      };
    // file object
    if (parsedItem.file)
      return {
        type: 'file',
        text: 'File attached',
        title: parsedItem.sender,
        data: {
          uri: parsedItem.file,
          status: {
            click: false,
            loading: 0,
          },
        },
        file: parsedItem.file,
        url: parsedItem.file,
        position: isSender ? 'right' : 'left',
      };
    //audio object
    if (parsedItem.audio) {
      return {
        type: 'audio',
        title: parsedItem.sender,
        data: {
          audioURL: parsedItem.audio,
          status: {
            click: false,
            loading: 0,
          },
        },
        position: isSender ? 'right' : 'left',
      };
    }
    //picture object
    if (parsedItem.image) {
      return {
        type: 'photo',
        title: parsedItem.sender,
        data: {
          uri: parsedItem.image,
          status: {
            click: false,
            loading: 0,
          },
        },
        position: isSender ? 'right' : 'left',
      };
    }
    //poll Object
    if (parsedItem.poll) {
      let pollData;

      if (typeof (parsedItem.poll) == "object") {

        return {
          type: 'text',
          text: (
            <div>
              <h4>{parsedItem.poll.question}</h4>
              {parsedItem.poll.options.map((option: string, i: number) => (
                <div key={i}>
                  <input
                    type="radio"
                    id={`poll-${index}-option-${i}`}
                    name={`poll-${index}`}
                    value={option}
                    checked={pollResponses[`poll-${index}`] === option}
                    onChange={() => handlePollResponse(`poll-${index}`, option)}
                  />
                  <label htmlFor={`poll-${index}-option-${i}`} style={{ marginLeft: '8px' }}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ),
          title: parsedItem.sender,
          position: isSender ? 'left' : 'right',
        };
      }
      else {
        try {
          pollData = JSON.parse(parsedItem.poll);
        } catch (error) {
          console.error("Failed to parse poll data:", error, parsedItem.poll);
          return null;
        }

        if (!pollData || !pollData.question || !pollData.options) {
          console.warn("Invalid poll data:", pollData);
          return null;
        }

        return {
          type: 'text',
          text: (
            <div>
              <h4>{pollData.question}</h4>
              {pollData.options.map((option: string, i: number) => (
                <div key={i}>
                  <input
                    type="radio"
                    id={`poll-${index}-option-${i}`}
                    name={`poll-${index}`}
                    value={option}
                    checked={pollResponses[`poll-${index}`] === option}
                    onChange={() => handlePollResponse(`poll-${index}`, option)}
                  />
                  <label htmlFor={`poll-${index}-option-${i}`} style={{ marginLeft: '8px' }}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ),
          title: parsedItem.sender,
          position: isSender ? 'left' : 'right',
        };
      }

    }


  })
    ;

  const handleDownload = (message: any) => {
    const fileUrl = message.data?.uri || message.data?.audioURL || message.data.url;
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = message.type;
      link.click();
    }
  };

  return (
    <div className="chat-body">
      <MessageList
        {...({ dataSource: data } as any)}
        onDownload={(message: any) => {
          handleDownload(message);
        }}
        className="message-list bg-red-200"
      />
    </div>
  );
};

export default ChatBody;
