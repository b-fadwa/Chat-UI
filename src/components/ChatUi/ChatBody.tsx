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

  const renderPollResults = (item: any) => {
    const counts = getOptionCounts(item.poll);
    return item.poll.options.map((option: string, i: number) => (
      <PollItem
        index={i}
        parsedItem={item}
        option={option}
        poll={item.poll}
        counts={counts}
        handlePollResponse={handlePollResponse}
      />
    ));
  };
  data = data.map((item: any) => {
    let firstSender: any = data.length > 0 ? data[0].sender.firstName : null;
    let isSender: any = item.sender.firstName === firstSender ? false : true;
    if (
      item.content == '' &&
      item.sender.firstName != '' &&
      !item.file &&
      !item.audio &&
      !item.image &&
      !item.poll
    ) {
      return null;
    }
    //text
    if (item.content) {
      return {
        type: 'text',
        text: item.content,
        title: item.sender.firstName,
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        position: isSender ? 'left' : 'right',
        avatar: item.sender.avatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
    // file object
    if (item.file) {
      return {
        type: 'file',
        text: 'File attached',
        title: item.sender.firstName,
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        data: {
          uri: item.file,
          status: {
            click: false,
            loading: 0,
          },
        },
        file: item.file,
        url: item.file,
        position: isSender ? 'left' : 'right',
        avatar: item.sender.avatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
    //audio object
    if (item.audio) {
      return {
        type: 'audio',
        title: item.sender.firstName,
        data: {
          audioURL: item.audio,
          status: {
            click: false,
            loading: 0,
          },
        },
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        position: isSender ? 'left' : 'right',
        avatar: item.sender.avatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
    //picture object
    if (item.image) {
      return {
        type: 'photo',
        title: item.sender.firstName,
        data: {
          uri: item.image,
          status: {
            click: false,
            loading: 0,
          },
        },
        date: format(item.dateStamp),
        dateString: format(item.dateStamp),
        position: isSender ? 'left' : 'right',
        avatar: item.sender.avatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
    }
    //poll Object
    if (item.poll) {
      return {
        type: 'text',
        text: (
          <div>
            <h4>{item.poll.question}</h4>
            {renderPollResults(item)}
          </div>
        ),
        title: item.sender.firstName,
        position: isSender ? 'left' : 'right',
        avatar: item.sender.avatar || 'https://img.freepik.com/free-icon/user_318-804790.jpg',
      };
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
    <div className="chat-body flex-grow h-3/4 overflow-y-scroll">
      {data.length === 0 ? (
        <p className="text-gray-500 text-center">Select a conversation or start a new one!</p>
      ) : (
        <MessageList
          {...({ dataSource: data } as any)}
          onDownload={(message: any) => {
            handleDownload(message);
          }}
          className="message-list"
        />
      )}
    </div>
  );
};

export default ChatBody;
