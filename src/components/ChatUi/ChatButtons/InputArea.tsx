import EmojiPicker from 'emoji-picker-react';
import { useEffect, useState } from 'react';
import { MdEmojiEmotions } from 'react-icons/md';

const InputArea = ({
  handleInputChange,
  resetTrigger,
}: {
  handleInputChange: (message: string) => void;
  resetTrigger: boolean;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    handleInputChange(value);
  };

  const handleEmojiClick = (e: any) => {
    if (e.emoji) {
      setInputValue(inputValue + e.emoji);
      setIsEmojiPickerVisible(false);
      handleInputChange(inputValue + e.emoji);
    }
  };

  useEffect(() => {
    // Reset input when parent indicates
    setInputValue('');
    handleInputChange('');
  }, [resetTrigger]);

  return (
    <div className="chat-input-area flex flex-row border-2 border-gray-100 p-2 rounded">
      <input
        type="text"
        className="focus:outline-none focus:border-0"
        placeholder="Type your message..."
        onChange={handleChange}
        value={inputValue}
      />
      <button
        type="button"
        className="relative"
        onClick={() => setIsEmojiPickerVisible(true)}
      >
        <MdEmojiEmotions className="text-xl" />
        {isEmojiPickerVisible && (
          <div className="emoji-picker absolute z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </button>
    </div>
  );
};

export default InputArea;
