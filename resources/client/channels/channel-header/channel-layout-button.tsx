import {Channel} from '@common/channels/channel';
import {SortIcon} from '@common/icons/material/Sort';
import {Trans} from '@common/i18n/trans';
import React from 'react';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '@common/ui/navigation/menu/menu-trigger';
import {useChannelLayouts} from '@app/channels/channel-header/use-channel-layouts';
import {Button} from '@common/ui/buttons/button';

interface Props {
  channel: Channel;
}
export function ChannelLayoutButton({channel}: Props) {
  const {selectedLayout, setSelectedLayout, availableLayouts} =
    useChannelLayouts(channel);

  if (availableLayouts?.length < 2) {
    return null;
  }

  const layoutConfig = availableLayouts?.find(
    method => method.key === selectedLayout
  );

  return (
    <MenuTrigger
      selectionMode="single"
      showCheckmark
      selectedValue={selectedLayout}
      onSelectionChange={newValue => setSelectedLayout(newValue as string)}
    >
      <Button startIcon={layoutConfig?.icon || <SortIcon />}>
        {layoutConfig?.label ? (
          <Trans {...layoutConfig.label} />
        ) : (
          <Trans message="Popularity" />
        )}
      </Button>
      <Menu>
        {availableLayouts?.map(method => (
          <MenuItem key={method.key} value={method.key}>
            <Trans {...method.label} />
          </MenuItem>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
