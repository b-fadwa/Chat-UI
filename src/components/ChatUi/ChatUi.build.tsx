import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC } from 'react';
import { ChatList, MessageBox } from 'react-chat-elements';

import { IChatUiProps } from './ChatUi.config';

const ChatUi: FC<IChatUiProps> = ({ style, className, classNames = [] }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <div className="flex w-full h-full">
        <ChatList
          {...({
            dataSource: [
              {
                avatar: 'https://img.freepik.com/free-icon/user_318-804790.jpg',
                title: 'John Doe',
                subtitle: 'Hello !',
                date: new Date(),
                unread: 3,
              },
              {
                avatar: 'https://img.freepik.com/free-icon/user_318-804790.jpg',
                title: 'John Doe',
                subtitle: 'Hello !',
                date: new Date(),
                unread: 2,
              },
              {
                avatar: 'https://img.freepik.com/free-icon/user_318-804790.jpg',
                title: 'John Doe',
                subtitle: 'Hello !',
                date: new Date(),
                unread: 1,
              },
            ],
          } as any)}
          className="chat-bar-list overflow-auto"
        />
        <div className="flex items-end  justify-end w-3/4 ">
          <MessageBox
            {...({
              type: 'text',
              title: 'Message Box Title',
              text: 'Here is a text type message box',
            } as any)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatUi;
