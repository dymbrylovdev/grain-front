import React, { Fragment } from "react";

import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";

import BaseButton from "../BaseButton";

const BLOCK_TYPES = [
  {
    blockType: "header-one",
    tooltip: "Heading 1",
    text: "H1",
  },
  {
    blockType: "header-two",
    tooltip: "Heading 2",
    text: "H2",
  },
  {
    blockType: "header-three",
    tooltip: "Heading 3",
    text: "H3",
  },
  {
    blockType: "unordered-list-item",
    tooltip: "Unordered list",
    icon: FormatListBulletedIcon,
  },
  {
    blockType: "ordered-list-item",
    tooltip: "Ordered list",
    icon: FormatListNumberedIcon,
  },
];

const BlockTypeButtons = (props: any) => {
  const { editorState, onToggle } = props;

  const handleClick = (event: any, blockType: any) => {
    event.preventDefault();

    onToggle("blockType", blockType);
  };

  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const blockData = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getData();

  return (
    <Fragment>
      {BLOCK_TYPES.map(button => {
        let active = false;

        if (["left", "center", "right", "justify"].includes(button.blockType)) {
          active = blockData.get("text-align") === button.blockType;
        } else {
          active = button.blockType === blockType;
        }

        return (
          <BaseButton
            active={active}
            key={button.blockType}
            ButtonProps={{
              onMouseDown: (event: any) => handleClick(event, button.blockType),
            }}
            tooltip={button.tooltip}
          >
            {button.icon ? <button.icon /> : button.text}
          </BaseButton>
        );
      })}
    </Fragment>
  );
};

export default BlockTypeButtons;
