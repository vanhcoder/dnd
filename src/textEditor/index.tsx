import { EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Suggestion from "@tiptap/suggestion";
import suggetion from "./suggetion";

export default function TextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Extension.create({
        name: "commands",
        addOptions() {
          return {
            suggestion: {
              char: "/",
              command: ({ editor, range, props }) => {
                props.command({ editor, range });
              },
            },
          };
        },
        addProseMirrorPlugins() {
          return [
            Suggestion({
              editor: this.editor,
              ...this.options.suggestion,
            }),
          ];
        },
      }).configure(suggetion),
    ],
    content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
  });

  return <EditorContent editor={editor} />;
}
