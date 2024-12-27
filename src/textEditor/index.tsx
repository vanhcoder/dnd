import {
  EditorContent,
  Extension,
  ReactRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./style.module.css";
import Suggestion from "@tiptap/suggestion";
import { CommandList } from "./CommandList";
import tippy from "tippy.js";

const commands = [
  {
    title: "Heading 1",
    command: ({ editor }) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    command: ({ editor }) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Bullet List",
    command: ({ editor }) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Ordered List",
    command: ({ editor }) => editor.chain().focus().toggleOrderedList().run(),
  },
];

export default function TextEditor() {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: styles.formulaEditor,
      },
    },
    extensions: [
      StarterKit,
      Extension.create({
        name: "customSuggestion",
        addOptions() {
          return {
            suggestion: {
              char: "/",
              startOfLine: false,
              command: ({ editor, range, props }) => {
                props.command({ editor, range, props });
              },
              items: ({ query }) => {
                return commands
                  .filter((item) =>
                    item.title.toLowerCase().startsWith(query.toLowerCase())
                  )
                  .slice(0, 5); // Giới hạn 5 kết quả
              },
              render: () => {
                let reactRenderer: ReactRenderer;
                let popup;
                return {
                  onStart: (props) => {
                    if (!props.clientRect) {
                      return;
                    }
                    reactRenderer = new ReactRenderer(CommandList, {
                      props,
                      editor: props.editor,
                    });
                    popup = tippy("body", {
                      getReferenceClientRect: props.clientRect,
                      appendTo: () => document.body,
                      content: reactRenderer.element,
                      showOnCreate: true,
                      interactive: true,
                      trigger: "manual",
                      placement: "bottom-start",
                    });
                  },
                  onUpdate: (props) => {
                    reactRenderer.updateProps(props);
                    if (!props.clientRect) {
                      return;
                    }
                    reactRenderer = new ReactRenderer(CommandList, {
                      props,
                      editor: props.editor,
                    });
                  },
                  onKeyDown: (props) => {
                    if (props.event.key === "Escape") {
                      popup[0].hide();
                      return true;
                    }
                    return reactRenderer.ref?.onKeyDown(props);
                  },
                  onExit: () => {
                    popup[0].destroy();
                    reactRenderer.destroy();
                  },
                };
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
      }).configure({}),
    ],
    content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
    onUpdate({ editor }) {},
  });

  return <EditorContent allowFullScreen editor={editor} autoFocus />;
}
