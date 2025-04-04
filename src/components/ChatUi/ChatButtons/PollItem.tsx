import { FC } from 'react';

interface PollItemProps {
  index: number;
  parsedItem: any;
  option: string;
  poll: any;
  counts: Record<string, number>;
  handlePollResponse: (option: { option: string }, parsedItem: any) => void;
  selectedOptions: any[];
}

const PollItem: FC<PollItemProps> = ({
  index,
  parsedItem,
  option,
  poll,
  counts,
  handlePollResponse,
  selectedOptions,
}) => {
  return (
    <div
      key={index}
      style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}
    >
      <input
        type="checkbox"
        id={`poll-${index}`}
        name={parsedItem.poll.pollID}
        value={option}
        checked={selectedOptions.some((item: any) => item.option === option)}
        onChange={() => handlePollResponse({ option }, poll)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <div className="flex justify-between">
          <label htmlFor={`poll-${index}`} className="font-bold">
            {option}
          </label>
          <span className="font-bold">{counts[option] || 0}</span>
        </div>
        <meter min="0" max="100" value={(counts[option] || 0) * 10} className="w-full" />
      </div>
    </div>
  );
};

export default PollItem;
