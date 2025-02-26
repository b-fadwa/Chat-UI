import { FC, useEffect, useState } from 'react';

interface ChatHeaderProps {
  selectedConveration: any;
}
const ChatHeader: FC<ChatHeaderProps> = ({ selectedConveration }) => {
  const [title, setTitle] = useState();

  // useEffect(() => {
  //   if (selectedConveration) {
  //     setTitle(selectedConveration.title);
  //   }
  // }, [selectedConveration]);

  //receiver details
  return <></>; // <div className="chat-header">{title}</div>;
};

export default ChatHeader;
