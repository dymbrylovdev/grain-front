import React from "react";

import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatUnderlined from "@material-ui/icons/FormatUnderlined";

import BaseButton from "../BaseButton";

const INLINE_STYLES = [
  {
    inlineStyle: "BOLD",
    tooltip: "Bold",
    icon: FormatBoldIcon,
  },
  {
    inlineStyle: "ITALIC",
    tooltip: "Italic",
    icon: FormatItalicIcon,
  },
  {
    inlineStyle: "UNDERLINE",
    tooltip: "Underline",
    icon: FormatUnderlined,
  },
];

interface IProps {
  editorState: any;
  onToggle: any;
}

const InlineStyleButtons: React.FC<IProps> = ({ editorState, onToggle }) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, inlineStyle: any) => {
    e.preventDefault();
    onToggle("inlineStyle", inlineStyle);
  };

  return (
    <>
      {INLINE_STYLES.map((button: any) => (
        <BaseButton
          key={button.inlineStyle}
          active={currentStyle.has(button.inlineStyle)}
          tooltip={button.tooltip}
          ButtonProps={{
            onMouseDown: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleClick(event, button.inlineStyle),
          }}
        >
          {button.icon ? <button.icon /> : button.text}
        </BaseButton>
      ))}
    </>
  );
};

export default InlineStyleButtons;
