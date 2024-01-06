import {Editor, EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {Underline} from '@tiptap/extension-underline';
import {Link as LinkExtension} from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {ReactElement, useEffect, useState} from 'react';
import {Superscript} from '@tiptap/extension-superscript';
import {Subscript} from '@tiptap/extension-subscript';
import {Color} from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';
import {TextAlign} from '@tiptap/extension-text-align';
import {CodeBlockLowlight} from '@tiptap/extension-code-block-lowlight';
import {BackgroundColor} from '@common/text-editor/extensions/background-color';
import {Indent} from '@common/text-editor/extensions/indent';
import {Embed} from '@common/text-editor/extensions/embed';
import {lowlight} from '../text-editor/lowlight';
import {InfoBlock} from '@common/text-editor/extensions/info-block';
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import FontFamily from '@tiptap/extension-font-family'

interface Props {
  initialContent?: string;
  children: (content: ReactElement, editor: Editor) => JSX.Element;
}
export default function PeopleBodyEditor({
  initialContent,
  children,
}: Props) {
  const [editorReady, setEditorReady] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      LinkExtension,
      Image,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      BackgroundColor,
      Indent,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      InfoBlock,
      Embed,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      FontFamily,
    ],
    content: initialContent,
    onCreate: () => setEditorReady(true),
  });

  // destroy editor
  useEffect(() => {
    if (editor) {
      return () => editor.destroy();
    }
  }, [editor]);

  useEffect(() => {
    if (editorReady && editor) {
      editor.commands.setContent(initialContent || '');
    }
  }, [editorReady, editor, initialContent]);

  if (!editor) {
    return null;
  }

  return children(<EditorContent editor={editor} />, editor);
}
