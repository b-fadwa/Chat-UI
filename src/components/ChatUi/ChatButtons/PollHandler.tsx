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

    setPollResponses((prev) => {
      const prevVotes = prev[parsedItem.pollID] || [];
      const hasVoted = prevVotes.some((item: any) => item.option === option.option);

      let updatedVotes;

      if (parsedItem.allowMultiple) {
        // If multiple selections are allowed, toggle the selected option
        updatedVotes = [...prevVotes, option]; // Add vote
      } else {
        // If multiple selections are NOT allowed, replace previous selection with the new one
        updatedVotes = hasVoted ? [] : [option];
      }

      return {
        ...prev,
        [parsedItem.pollID]: updatedVotes,
      };
    });

    if (socket) {
      const pollData = { pollID: parsedItem.pollID, selectedOptions: option, sender: sender };
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
