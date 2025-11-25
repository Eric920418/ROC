"use client";

import { CKEditor as CKEditorReact } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useState } from "react";

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
}

export default function CKEditor({ value, onChange }: CKEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-64 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-500">
        编辑器加载中...
      </div>
    );
  }

  return (
    <CKEditorReact
      editor={ClassicEditor}
      data={value}
      onChange={(_event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={{
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "blockQuote",
          "insertTable",
          "|",
          "undo",
          "redo",
        ],
        language: "zh-cn",
      }}
    />
  );
}
