import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { IoIosChatboxes } from 'react-icons/io';

import ChatUiSettings, { BasicSettings } from './ChatUi.settings';

export default {
  craft: {
    displayName: 'ChatUi',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(ChatUiSettings, BasicSettings),
    },
  },
  info: {
    settings: ChatUiSettings,
    displayName: 'ChatUi',
    exposed: true,
    icon: IoIosChatboxes,
    events: [
      {
        label: 'On Click',
        value: 'onclick',
      },
      {
        label: 'On Blur',
        value: 'onblur',
      },
      {
        label: 'On Focus',
        value: 'onfocus',
      },
      {
        label: 'On MouseEnter',
        value: 'onmouseenter',
      },
      {
        label: 'On MouseLeave',
        value: 'onmouseleave',
      },
      {
        label: 'On KeyDown',
        value: 'onkeydown',
      },
      {
        label: 'On KeyUp',
        value: 'onkeyup',
      },
    ],
    datasources: {
      accept: ['string'],
    },
  },
  defaultProps: {
    style: {
      height: '400px',
    },
  },
} as T4DComponentConfig<IChatUiProps>;

export interface IChatUiProps extends webforms.ComponentProps {
  socketAddress: any;
}
