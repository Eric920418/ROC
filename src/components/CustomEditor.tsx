"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  ClassicEditor,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  Emoji,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Mention,
  Paragraph,
  RemoveFormat,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
} from "ckeditor5";

import translations from "ckeditor5/translations/zh.js";
import "ckeditor5/ckeditor5.css";

interface CustomEditorProps {
  onContentChange: (value: string) => void;
  height?: string | number;
  placeholder?: string;
}

export default function CustomEditor({
  placeholder,
  onContentChange,
  height = "200px",
}: CustomEditorProps) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    return () => setIsReady(false);
  }, []);

  const editorConfig = useMemo(() => {
    if (!isReady) return {};

    return {
      toolbar: {
        items: [
          "heading",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "removeFormat",
          "|",
          "emoji",
          "horizontalLine",
          "link",
          "insertImage",
          "insertTable",
          "highlight",
          "blockQuote",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "outdent",
          "indent",
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        Alignment,
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        Base64UploadAdapter,
        BlockQuote,
        Bold,
        Emoji,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        Heading,
        Highlight,
        HorizontalLine,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        Mention,
        Paragraph,
        RemoveFormat,
        Strikethrough,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
      ],
      fontFamily: {
        supportAllValues: true,
      },
      fontSize: {
        options: [10, 12, 14, "default", 18, 20, 22],
        supportAllValues: true,
      },
      heading: {
        options: [
          {
            model: "paragraph" as const,
            title: "段落",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1" as const,
            view: "h1",
            title: "標題 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2" as const,
            view: "h2",
            title: "標題 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3" as const,
            view: "h3",
            title: "標題 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4" as const,
            view: "h4",
            title: "標題 4",
            class: "ck-heading_heading4",
          },
          {
            model: "heading5" as const,
            view: "h5",
            title: "標題 5",
            class: "ck-heading_heading5",
          },
          {
            model: "heading6" as const,
            view: "h6",
            title: "標題 6",
            class: "ck-heading_heading6",
          },
        ],
      },
      image: {
        toolbar: [
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "imageStyle:inline",
          "imageStyle:wrapText",
          "imageStyle:breakText",
          "|",
          "resizeImage",
        ],
      },
      initialData: "",
      language: "zh",
      licenseKey: "GPL",
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        decorators: {
          toggleDownloadable: {
            mode: "manual" as const,
            label: "可下載",
            attributes: {
              download: "file",
            },
          },
        },
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true,
        },
      },
      mention: {
        feeds: [
          {
            marker: "@",
            feed: [],
          },
        ],
      },
      placeholder: placeholder || "在此輸入或貼上您的內容！",
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
      translations: [translations],
    };
  }, [isReady]);

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    if (onContentChange) {
      onContentChange(data);
    }
  };

  return (
    <div className="editor-wrapper">
      <style>{`
        .ck-editor__editable_inline {
          min-height: ${typeof height === "number" ? `${height}px` : height};
          max-height: ${typeof height === "number" ? `${height}px` : height};
        }
      `}</style>
      <div className="editor-container" ref={editorContainerRef}>
        <div className="editor-container__editor" ref={editorRef}>
          {isReady && (
            <CKEditor
              editor={ClassicEditor}
              config={editorConfig}
              onChange={handleEditorChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
