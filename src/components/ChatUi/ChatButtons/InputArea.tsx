import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { MdEmojiEmotions } from 'react-icons/md';

const InputArea = ({ handleInputChange }: { handleInputChange: (message: string) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    handleInputChange(value);
  };

  console.log('from child', { inputValue });

  return (
    <div className="chat-input-area flex flex-row border-2 border-gray-100 p-2 rounded">
      <input
        type="text"
        className="focus:outline-none focus:border-0	"
        placeholder="Type your message..."
        onChange={handleChange}
        value={inputValue}
      />
      <button onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}>
        <MdEmojiEmotions className="text-xl" />
        {isEmojiPickerVisible && (
          <div className={`emoji-picker absolute z-10`}>
            <EmojiPicker onEmojiClick={(e) => setInputValue(inputValue + e.emoji)} />
          </div>
        )}
      </button>
    </div>
  );
};

export default InputArea;
