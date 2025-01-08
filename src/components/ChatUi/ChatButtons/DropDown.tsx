import { Dropdown } from 'react-chat-elements';
import { FaCamera } from 'react-icons/fa';
import { MdOutlinePoll } from 'react-icons/md';
import { MdKeyboardVoice } from 'react-icons/md';
import { FaPlusCircle } from 'react-icons/fa';

const DropDown = () => {
  // Buttons
  return (
    <div className="w-fit">
      <Dropdown
        {...({
          buttonProps: {
            icon: {
              float: 'left',
              component: <FaPlusCircle />,
            },
          },
          onSelect: (e: any) => {
            console.log(e);
          },
          items: [
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
          ],
        } as any)}
      />
    </div>
  );
};

export default DropDown;
