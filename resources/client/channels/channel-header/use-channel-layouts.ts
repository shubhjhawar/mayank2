import {useLocalStorage} from '@common/utils/hooks/local-storage';
import {Channel} from '@common/channels/channel';
import {channelContentConfig} from '@app/admin/channels/channel-content-config';

export function useChannelLayouts(channel: Channel) {
  const config = channelContentConfig.models[channel.config.contentModel];
  const availableLayouts = config?.layoutMethods
    .filter(m => channelContentConfig.userSelectableLayouts.includes(m))
    .map(method => ({
      key: method,
      label: channelContentConfig.layoutMethods[method].label,
      icon: channelContentConfig.layoutMethods[method].icon,
    }));

  const [selectedLayout, setSelectedLayout] = useLocalStorage(
    `channel-layout-${channel.config.contentModel}`,
    channel.config.layout
  );

  return {selectedLayout, setSelectedLayout, availableLayouts};
}
