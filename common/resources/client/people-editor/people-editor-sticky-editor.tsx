import React, { Fragment, useEffect } from 'react';
import { Button } from '@common/ui/buttons/button';
import { Link } from 'react-router-dom';
import { ArrowBackIcon } from '@common/icons/material/ArrowBack';
import { Trans } from '@common/i18n/trans';
import { HistoryButtons } from '@common/text-editor/menubar/history-buttons';
import { ModeButton } from '@common/text-editor/menubar/mode-button';
import { PeopleBodyEditorMenubar } from './people-body-editor-menubar';
import { Editor } from '@tiptap/react';
import { UseFormReturn } from 'react-hook-form';
import { CreatePersonPayload } from '@app/admin/people/requests/use-create-person';
import { toast } from '@common/ui/toast/toast';
import { message } from '@common/i18n/message';

interface StickyHeaderProps {
  editor: Editor;
  form: UseFormReturn<CreatePersonPayload>;
  onSave: (editorContent: string) => void;

}

export function PeopleEditorStickyHeader({
  editor,
  onSave,
  form,
  
}: StickyHeaderProps) {
  useEffect(() => {
    const handleContentChange = () => {
      const editorData = editor.getHTML();
      console.log(editorData);
      form.setValue('body', editorData);
    };

    handleContentChange();

    editor.on('update', handleContentChange);

    return () => {
      editor.off('update', handleContentChange);
    };
  }, [editor, form]);

  return (
    <Fragment>
      <div className="mb-20 shadow">
        <p>Body</p>
        <div className="px-20 py-10 flex justify-between items-center max-sm:justify-start gap-20 border-b text-muted">
            {editor && <HistoryButtons editor={editor} />}            
            <ModeButton editor={editor} /> 
            {/* <SaveButton onSave={() => {
              onSave(editor.getHTML())
              toast(message('Body saved!'));
              }} form={form}/> */}
        </div>
        <PeopleBodyEditorMenubar editor={editor} size="sm" />
        </div>
    </Fragment>
  );
}

// interface SaveButtonProps {
//   onSave: () => void;
//   form: UseFormReturn<CreatePersonPayload>;
// }

// function SaveButton({ onSave, form }: SaveButtonProps) {
//     const body = form?.watch('body');

//   return (
//     <Button
//       variant="flat"
//       size="sm"
//       color="primary"
//       className="min-w-90"
//     //   disabled={!body}
//       onClick={() => onSave()}
//     >
//       <Trans message="Save" />
//     </Button>
//   );
// }
