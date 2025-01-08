import { MessageBox } from "react-chat-elements";

interface CustomMessageBoxProps {
  position?: "left" | "right"; // Extend with the missing prop
  type?: "text" | "photo" | "audio" | "video" | "file" | "location" | "link" | "spotify";
  title?: string;
  text?: string;
}

const CustomMessageBox = ({ position, ...props }: CustomMessageBoxProps) => (
  <MessageBox {...props} />
);

export default CustomMessageBox;
