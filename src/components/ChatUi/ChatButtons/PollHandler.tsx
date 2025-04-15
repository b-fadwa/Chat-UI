import { FC, useState } from 'react';
import PollItem from './PollItem';

interface PollProps {
  poll: any;
  socket?: WebSocket;
  sender: any;
}

const PollHandler: FC<PollProps> = ({ poll, socket, sender }) => {
  const [pollResponses, setPollResponses] = useState<Record<string, any>>({});

  const handlePollResponse = (option: { option: string }, parsedItem: any) => {
    if (!parsedItem.pollID) return;
    const currentVotes = pollResponses[parsedItem.pollID] || [];
    const hasVoted = currentVotes.some((item: any) => item.option === option.option);

    setPollResponses((prev) => {
      const prevVotes = prev[parsedItem.pollID] || [];
      let updatedVotes;

      if (parsedItem.allowMultiple) {
        if (hasVoted) {
          updatedVotes = prevVotes.filter((item: any) => item.option !== option.option);
        } else {
          updatedVotes = [...prevVotes, option];
        }
      } else {
        updatedVotes = hasVoted ? [] : [option];
      }

      return {
        ...prev,
        [parsedItem.pollID]: updatedVotes,
      };
    });

    if (socket) {
      const pollData = {
        pollID: parsedItem.pollID,
        selectedOptions: option,
        sender: sender,
        action: hasVoted ? 'remove' : 'add',
      };
      socket.send(JSON.stringify({ poll: pollData }));
    }
  };

  const getOptionCounts = (poll: any) => {
    const counts: Record<string, number> = {};

    if (!poll.selectedOptions) return counts;

    poll.selectedOptions.forEach((item: any) => {
      const optionText = item.selectedOptions?.option || item.option;
      if (optionText) {
        counts[optionText] = (counts[optionText] || 0) + 1;
      }
    });

    if (pollResponses[poll.pollID]) {
      pollResponses[poll.pollID].forEach((item: any) => {
        counts[item.option] = (counts[item.option] || 0) + 1;
      });
    }

    return counts;
  };

  const counts = getOptionCounts(poll);

  return (
    <div>
      <h4>{poll.question}</h4>
      {poll.options.map((option: string, i: number) => (
        <PollItem
          key={i}
          index={i}
          parsedItem={{ poll }}
          option={option}
          poll={poll}
          counts={counts}
          handlePollResponse={handlePollResponse}
          selectedOptions={pollResponses[poll.pollID] || []}
        />
      ))}
    </div>
  );
};

export default PollHandler;
