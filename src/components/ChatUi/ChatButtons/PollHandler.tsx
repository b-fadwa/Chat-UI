import { FC, useCallback, useState } from "react";
import PollItem from "./PollItem";

interface PollProps {
    poll: any;
    socket?: WebSocket;
}

const PollHandler: FC<PollProps> = ({ poll, socket }) => {
    const [pollResponses, setPollResponses] = useState<Record<string, any>>({});

    const handlePollResponse = useCallback(
        (option: object, parsedItem: any) => {
            if (parsedItem.pollID) {
                setPollResponses((prev) => ({
                    ...prev,
                    [parsedItem.pollID]: [...(prev[parsedItem.pollID] || []), option],
                }));
            }

            if (socket && parsedItem.pollID) {
                const pollData = { pollID: parsedItem.pollID, selectedOptions: option };
                socket.send(JSON.stringify({ poll: pollData }));
            }
        },
        [socket]
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
                />
            ))}
        </div>
    );
};

export default PollHandler;