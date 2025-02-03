import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
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
  const [pickerStyle, setPickerStyle] = useState<React.CSSProperties | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible((prev) => {
      if (!prev && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const pickerWidth = 320; // Approximate picker width
        const pickerHeight = 400; // Approximate picker height
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        // Default to position below the button
        let top = buttonRect.bottom + window.scrollY;
        let left = buttonRect.left + window.scrollX;
        // If there's no space below, position above the button
        if (top + pickerHeight > viewportHeight + window.scrollY) {
          top = buttonRect.top + window.scrollY - pickerHeight;
        }
        // Adjust if the picker overflows to the right
        if (left + pickerWidth > viewportWidth + window.scrollX) {
          left = viewportWidth - pickerWidth + window.scrollX;
        }
        // Ensure the picker doesn't go off-screen on the left
        if (left < 0) {
          left = 0;
        }
        setPickerStyle({
          top: top,
          left: left,
        });
      }
      return !prev;
    });
  };

  return (
    <div className="chat-input-area flex flex-row border-2 border-gray-100 p-2 rounded">
      <input
        type="text"
        className="focus:outline-none flex-grow"
        placeholder="Type your message..."
        onChange={handleChange}
        value={inputValue}
      />
      <button type="button" onClick={toggleEmojiPicker} ref={buttonRef} className="relative">
        <MdEmojiEmotions className="text-xl" />
      </button>
      {isEmojiPickerVisible && pickerStyle && (
        <div
          className="emoji-picker fixed"
          style={{ top: pickerStyle.top, left: pickerStyle.left }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default InputArea;
