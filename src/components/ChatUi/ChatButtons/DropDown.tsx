import { Dropdown } from 'react-chat-elements';
import { FaCamera } from 'react-icons/fa';
import { MdOutlinePoll } from 'react-icons/md';
import { MdKeyboardVoice } from 'react-icons/md';
import { FaPlusCircle } from 'react-icons/fa';

interface DropDownProps {
  onOptionSelect: (option: string) => void;
  onAudioClick: () => void;
  onCameraClick: () => void;
  onPollClick: () => void;
}

const DropDown = ({ onOptionSelect, onAudioClick, onCameraClick, onPollClick }: DropDownProps) => {

  const items = [
    {
      text: 'Camera',
      icon: {
        float: 'left',
        size: 15,
        component: <FaCamera />,
      },
    },
    {
      text: 'Create a poll',
      icon: {
        float: 'left',
        size: 15,
        component: <MdOutlinePoll />,
      },
    },
    {
      text: 'Send a voice clip',
      icon: {
        float: 'left',
        size: 15,
        component: <MdKeyboardVoice />,
      },
    },
  ];

  return (
    <div className="w-fit">
      <Dropdown
        {...({
          style: {},
          animationPosition:"southwest",
          className: 'dropdown-css bg-gray-100 p-2 flex items-center rounded h-full',
          onClick: () => {},
          buttonProps: {
            backgroundColor: '#F3F4F6',
            icon: {
              float: 'left',
              component: <FaPlusCircle className="bg-gray-100 text-gray-600" />,
              size: 15,
            },
          },
          onSelect: (e: any) => {
            console.log('onSelect event (index):', e);
            const selectedItem = items[e];

            if (selectedItem) {
              onOptionSelect(selectedItem.text);
              console.log('Selected Item:', selectedItem.text);

              if (selectedItem.text === 'Camera') {
                onCameraClick();
              } else if (selectedItem.text === 'Send a voice clip') {
                onAudioClick();
              } else if (selectedItem.text === 'Create a poll') {
                onPollClick();
              }
            } else {
              console.error('Selected item not found:', e);
            }
          },

          items: items,
        })}
      />
    </div>
  );
};

export default DropDown;
