import { FC, useCallback, useState } from 'react';
import { MessageList } from 'react-chat-elements';
import { format } from 'timeago.js';
import PollItem from './ChatButtons/PollItem';

interface ChatBodyProps {
  data: any;
  socket: WebSocket;
  pollID: number;
}

const ChatBody: FC<ChatBodyProps> = ({ data, socket }) => {
  let parsedItem: any;
  let isSender: boolean;

  const [pollResponses, setPollResponses] = useState<Record<string, any>>({});

  const handlePollResponse = useCallback(
    (option: object, parsedItem: any) => {
      if (parsedItem.pollID) {
        setPollResponses((prev) => {
          const updatedResponses = {
            ...prev,
            [parsedItem.pollID]: [...(prev[parsedItem.pollID] || []), option],
          };
          return updatedResponses;
        });
      }
      if (socket && parsedItem.pollID) {
        const pollData = { pollID: parsedItem.pollID, selectedOptions: option };
        socket.send(JSON.stringify({ poll: pollData }));
      }
    },
    [socket],
  );

  const getOptionCounts = (poll: any) => {
    const counts: Record<string, number> = {};

    poll.selectedOptions.forEach((item: any) => {
      const option = item.selectedOptions.option;
      counts[option] = (counts[option] || 0) + 1;
    });
    if (pollResponses[poll.pollID]) {
      pollResponses[poll.pollID].forEach((item: any) => {
        const option = item.option;
        counts[option] = (counts[option] || 0) + 1;
      });
    }
    return counts;
  };

  const renderPollResults = (poll: any) => {
    const counts = getOptionCounts(poll);
    return poll.options.map((option: string, i: number) => (
      <PollItem
        index={i}
        parsedItem={parsedItem}
        option={option}
        poll={poll}
        counts={counts}
        handlePollResponse={handlePollResponse}
      />
    ));
  };

  data = data.map((item: any) => {
    parsedItem = JSON.parse(item);
    isSender = parsedItem.sender && parsedItem.sender == 'Client1' ? false : true; //to be updated
    if (
      parsedItem.content == '' &&
      parsedItem.sender != '' &&
      !parsedItem.file &&
      !parsedItem.audio &&
      !parsedItem.image &&
      !parsedItem.poll
    ) {
      return null;
    }
    //text
    if (parsedItem.content) {
      return {
        type: 'text',
        text: parsedItem.content,
        title: parsedItem.sender,
        date: format(parsedItem.dateStamp),
        dateString: format(parsedItem.dateStamp),
        position: isSender ? 'left' : 'right',
      };
    }
    // file object
    if (parsedItem.file) {
      return {
        type: 'file',
        text: 'File attached',
        title: parsedItem.sender,
        date: format(parsedItem.dateStamp),
        dateString: format(parsedItem.dateStamp),
        data: {
          uri: parsedItem.file,
          status: {
            click: false,
            loading: 0,
          },
        },
        file: parsedItem.file,
        url: parsedItem.file,
        position: isSender ? 'left' : 'right',
      };
    }
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
        date: format(parsedItem.dateStamp),
        dateString: format(parsedItem.dateStamp),
        position: isSender ? 'left' : 'right',
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
        date: format(parsedItem.dateStamp),
        dateString: format(parsedItem.dateStamp),
        position: isSender ? 'left' : 'right',
      };
    }
    //poll Object
    if (parsedItem.poll) {
      if (parsedItem.poll) {
        return {
          type: 'text',
          text: (
            <div>
              <h4>{parsedItem.poll.question}</h4>
              {renderPollResults(parsedItem.poll)}
            </div>
          ),
          title: parsedItem.sender,
          position: isSender ? 'left' : 'right',
        };
      }
    }
  });

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
        className="message-list"
      />
    </div>
  );
};

export default ChatBody;
