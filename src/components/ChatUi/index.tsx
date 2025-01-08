import config, { IChatUiProps } from './ChatUi.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './ChatUi.build';
import Render from './ChatUi.render';

const ChatUi: T4DComponent<IChatUiProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

ChatUi.craft = config.craft;
ChatUi.info = config.info;
ChatUi.defaultProps = config.defaultProps;

export default ChatUi;
