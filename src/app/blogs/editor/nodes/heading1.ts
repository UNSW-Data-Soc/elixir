// import Heading from "@tiptap/extension-heading";
// import { Command, RawCommands } from "@tiptap/react";

// declare module "@tiptap/core" {
//   interface Commands<ReturnType> {
//     heading1: {
//       setHeading1: () => Command;
//       toggleHeading1: () => Command;
//     };
//   }
// }

// const Heading1 = Heading.extend({
//   name: "heading1",
//   addCommands() {
//     return {
//       setHeading1:
//         () =>
//         ({ commands }: { commands: RawCommands }) =>
//           commands.setNode("heading1"),
//       toggleHeading1:
//         () =>
//         ({ commands }: { commands: RawCommands }) => {
//           return commands.toggleNode("heading1", "paragraph");
//         },
//     };
//   },
//   renderHTML({ HTMLAttributes }) {
//     return [
//       "h1",
//       {
//         ...HTMLAttributes,
//         HTMLAttributes: {
//           class: "text-4xl",
//         },
//       },
//       0,
//     ];
//   },
// });

// export default Heading1;
