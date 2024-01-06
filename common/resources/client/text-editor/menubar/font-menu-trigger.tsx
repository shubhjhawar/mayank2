import React from 'react';
import clsx from 'clsx';
import { Button } from '../../ui/buttons/button';
import { KeyboardArrowDownIcon } from '../../icons/material/KeyboardArrowDown';
import { Keyboard } from '../../ui/keyboard/keyboard';
import { MenubarButtonProps } from './menubar-button-props';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '../../ui/navigation/menu/menu-trigger';
import { Trans } from '../../i18n/trans';

const fontOptions = [
    'Default',
    'Inter',
    'Comic Sans',
    'Serif',
    'Monospace',
    'Cursive',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Roboto',
    'Open Sans',
    'Verdana',
    'Georgia',
    'Impact',
    'Trebuchet MS',
    'Lato',
    'Montserrat',
    'Raleway',
  ];

export function FontMenuTrigger({ editor, size }: MenubarButtonProps) {
  return (
    <MenuTrigger
      floatingMinWidth="w-256 h-500"
      onItemSelected={(selectedFont) => {
        editor.commands.focus();
        if (selectedFont === 'Default') {
        editor.commands.unsetFontFamily();
        } else if (selectedFont === 'Inter') {
        editor.commands.setFontFamily('Inter');
        } else if (selectedFont === 'Comic Sans') {
        editor.commands.setFontFamily('Comic Sans MS');
        } else if (selectedFont === 'Serif') {
        editor.commands.setFontFamily('Serif');
        } else if (selectedFont === 'Monospace') {
        editor.commands.setFontFamily('Monospace');
        } else if (selectedFont === 'Cursive') {
        editor.commands.setFontFamily('Cursive');
        } else if (selectedFont === 'Arial') {
        editor.commands.setFontFamily('Arial, sans-serif');
        } else if (selectedFont === 'Helvetica') {
        editor.commands.setFontFamily('Helvetica, sans-serif');
        } else if (selectedFont === 'Times New Roman') {
        editor.commands.setFontFamily('Times New Roman, serif');
        } else if (selectedFont === 'Courier New') {
        editor.commands.setFontFamily('Courier New, monospace');
        } else if (selectedFont === 'Roboto') {
        editor.commands.setFontFamily('Roboto, sans-serif');
        } else if (selectedFont === 'Open Sans') {
        editor.commands.setFontFamily('Open Sans, sans-serif');
        } else if (selectedFont === 'Verdana') {
        editor.commands.setFontFamily('Verdana, sans-serif');
        } else if (selectedFont === 'Georgia') {
        editor.commands.setFontFamily('Georgia, serif');
        } else if (selectedFont === 'Impact') {
        editor.commands.setFontFamily('Impact, sans-serif');
        } else if (selectedFont === 'Trebuchet MS') {
        editor.commands.setFontFamily('Trebuchet MS, sans-serif');
        } else if (selectedFont === 'Lato') {
        editor.commands.setFontFamily('Lato, sans-serif');
        } else if (selectedFont === 'Montserrat') {
        editor.commands.setFontFamily('Montserrat, sans-serif');
        } else if (selectedFont === 'Raleway') {
        editor.commands.setFontFamily('Raleway, sans-serif');
        }
      }}
    >
      <Button
        className={clsx('flex-shrink-0')}
        variant="text"
        size={size}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <Trans message="Font" />
      </Button>
      <Menu>
        {fontOptions.map((font, index) => (
          <MenuItem key={index} value={font}>
            <Trans message={font} />
          </MenuItem>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
