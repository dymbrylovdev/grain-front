import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import LinkIcon from "@material-ui/icons/Link";

import InlineStyleButtons from "../InlineStyleButtons";
import BlockTypeButtons from "../BlockTypeButtons";
import BaseButton from "../BaseButton";

const useStyles = makeStyles((theme: any) => ({
  root: {},
  inner: {
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
  },
  float: {
    position: "absolute",
    zIndex: 9999,
    height: 35,
    cursor: "default",
    backgroundColor: "#ebebf1",
  },
}));

interface IEditorToolbarProps {
  editorState: any;
  onToggle: any;
  className?: any;
  position?: any;
  setLink?: any;
}

const EditorToolbar: React.FC<IEditorToolbarProps> = ({ editorState, onToggle, className, position, setLink, ...rest }) => {
  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx({
        [classes.root]: true,
        [classes.float]: position,
      })}
      style={position}
    >
      <div className={classes.inner}>
        <BlockTypeButtons editorState={editorState} onToggle={onToggle} />
        <InlineStyleButtons editorState={editorState} onToggle={onToggle} />
        <BaseButton
          tooltip="Link"
          active={false}
          ButtonProps={{
            onMouseDown: setLink,
          }}
        >
          <LinkIcon />
        </BaseButton>
      </div>
    </div>
  );
};

export default EditorToolbar;
