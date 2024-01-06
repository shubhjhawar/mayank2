import React, { useState } from 'react';
import { IconButton } from '../../ui/buttons/icon-button';
import { Menu, MenuItem, MenuTrigger } from '../../ui/navigation/menu/menu-trigger';
import { DialogTrigger } from '../../ui/overlays/dialog/dialog-trigger';
import { Dialog } from '../../ui/overlays/dialog/dialog';
import { DialogHeader } from '../../ui/overlays/dialog/dialog-header';
import { DialogBody } from '../../ui/overlays/dialog/dialog-body';
import { DialogFooter } from '../../ui/overlays/dialog/dialog-footer';
import { Button } from '../../ui/buttons/button';
import { Trans } from '../../i18n/trans';
import { MenubarButtonProps } from './menubar-button-props';
import { GridOnIcon } from '@common/icons/material/GridOn';


export function TableMenuTrigger({ editor, size }: MenubarButtonProps) {
  const [dialog, setDialog] = useState(false);

  return (
    <>
      <MenuTrigger
        onItemSelected={key => {
          if (key === 'table') {
            setDialog(true);
          }
        }}
      >
        <IconButton
          variant="text"
          size={size}
          radius="rounded"
          className="flex-shrink-0"
        >
        <GridOnIcon />
          
        </IconButton>
        
        <Menu>
          <MenuItem value="table" startIcon={<GridOnIcon />}>
            <Trans message="Insert Table" />
          </MenuItem>
        </Menu>
      </MenuTrigger>

      <DialogTrigger
        type="modal"
        isOpen={dialog}
        onClose={() => setDialog(false)}
      >
        <TableDialog editor={editor} setDialog={setDialog}/>
      </DialogTrigger>
    </>
  );
}

function TableDialog({ editor, setDialog }: MenubarButtonProps & { setDialog: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  const handleInsertTable = (rows: number, columns: number) => {
    editor.commands.insertTable({ rows: rows, cols: columns, withHeaderRow: false });
    setDialog(false);
  };
  
  

  return (
    <Dialog>
  <DialogHeader className='text-xl p-10 border-b flex items-center justify-center'>
    <Trans message="Please Choose"/>
  </DialogHeader>
  <DialogBody className="grid grid-cols-2 gap-4 p-10">
    <label>
      <Trans message="Rows:" />
      <input
        type="number"
        value={rows}
        onChange={(e) => setRows(Number(e.target.value))}
        className="border p-2"
      />
    </label>
    <label>
      <Trans message="Columns:" />
      <input
        type="number"
        value={columns}
        onChange={(e) => setColumns(Number(e.target.value))}
        className="border p-2"
      />
    </label>
  </DialogBody>
  <DialogFooter className="p-10 flex justify-end">
    <Button
      onClick={() => {
        handleInsertTable(rows, columns);
        setRows(2);
        setColumns(2);
      }}
      variant="flat"
      color="primary"
    >
      <Trans message="Insert" />
    </Button>
  </DialogFooter>
</Dialog>


  );
}
