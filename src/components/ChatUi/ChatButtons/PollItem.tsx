import { FC } from "react";

interface PollItemProps {
  index: number,
  parsedItem: any,
  option: string,
  poll: any,
  counts: Record<string, number>,
  handlePollResponse: (option: object, parsedItem: any) => void
}

const PollItem: FC<PollItemProps> = ({ index, parsedItem, option, poll, counts, handlePollResponse }) => {

  return (
    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>

      <input
        type="checkbox"
        id={`poll-${index}`}
        name={parsedItem.poll.pollID}
        value={option}
        checked={parsedItem.poll.selectedOptions.some((item: any) => item.selectedOptions.option === option)}
        onChange={() => handlePollResponse({ option }, poll)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor={`poll-${index}`} style={{ fontWeight: 'bold' }}>
            {option}
          </label>
          <span style={{ fontWeight: 'bold' }}>{counts[option] || 0}</span>
        </div>
        <meter min="0" max="100" value={(counts[option] || 0) * 10} style={{ width: '100%', }} />
      </div>
    </div>
  )
}

export default PollItem;
