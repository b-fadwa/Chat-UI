import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC } from 'react';
import { MessageBox } from 'react-chat-elements';

import { IChatUiProps } from './ChatUi.config';

const ChatUi: FC<IChatUiProps> = ({ position, style, className, classNames = [] }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <MessageBox
        {...({
          position: { position },
          type: 'text',
          title: 'Message Box Title',
          text: 'Here is a text type message box',
        } as any)}
      />
    </div>
  );
};

export default ChatUi;
