import React, { Component } from "react";
// @ts-ignore
import isSoftNewlineEvent from "draft-js/lib/isSoftNewlineEvent";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import { CompositeDecorator, Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import { withStyles, createStyles, Theme, Paper, Divider } from "@material-ui/core";

import { getSelectionRange, getSelectionCoords, findLinkEntities } from "./utils";

import { EditorToolbar } from "./components/EditorToolbar";
// import InputModal from '../ui/Modals/InputModal';

interface IPosition {
  top: number;
  left: number;
}

interface IState {
  inlineToolbar: {
    show?: boolean;
    position?: IPosition | null;
  };
  editorState: any;
  openUrlModal: boolean;
}

interface IProps {
  classes: any;
  initialState: any;
  handleEditorChange: any;
}

const Link = (props: any) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <a href={url} title={url} className="ed-link">
      {props.children}
    </a>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

class DraftEditor extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      inlineToolbar: { show: false, position: null },
      editorState: props.initialState
        ? EditorState.createWithContent(stateFromHTML(props.initialState), decorator)
        : EditorState.createEmpty(decorator),
      openUrlModal: false,
    };
  }

  componentDidUpdate(props: IProps) {
    if (props.initialState && props.initialState !== this.props.initialState) {
      this.setState({
        editorState: EditorState.createWithContent(stateFromHTML(props.initialState), decorator),
      });
    }
  }
  // @ts-ignore
  public focus = () => this.refs.editor?.focus();
  public getEditorState = () => this.state.editorState;
  public logState = () => console.log("editor state ==> ", convertToRaw(this.state.editorState.getCurrentContent()));

  private onChange = (editorState: any) => {
    if (!editorState.getSelection().isCollapsed()) {
      const selectionRange = getSelectionRange();

      if (!selectionRange) {
        this.setState({ inlineToolbar: { show: false } });

        return;
      }

      const selectionCoords = getSelectionCoords(selectionRange);
      const position = selectionCoords ? { top: selectionCoords.offsetTop, left: selectionCoords.offsetLeft } : null;

      this.setState({
        inlineToolbar: {
          show: true,
          position,
        },
      });
    } else {
      this.setState({ inlineToolbar: { show: false } });
    }

    this.setState({ editorState });
    this.changeEditorState(editorState.getCurrentContent());
  };

  private setLink = () => {
    const urlValue = prompt("Paste URL", "");
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity("LINK", "IMMUTABLE", {
      url: urlValue,
    });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const _editorState = RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);
    this.setState(
      {
        editorState: _editorState,
      },
      () => {
        setTimeout(() => this.focus(), 0);
        this.changeEditorState(_editorState.getCurrentContent());
      }
    );
  };

  private changeEditorState = (state: any) => {
    if (this.props.handleEditorChange) this.props.handleEditorChange(stateToHTML(state));
  };

  private toggleInlineStyle = (type: string, inlineStyle: any) => {
    if (type === "blockType") {
      this.onChange(RichUtils.toggleBlockType(this.state.editorState, inlineStyle));
    } else {
      this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }
  };

  private handleKeyCommand = (command: any) => {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return true;
    }

    return false;
  };

  private handleReturn = (e: any) => {
    const { editorState } = this.state;

    if (isSoftNewlineEvent(e)) {
      this.onChange(RichUtils.insertSoftNewline(editorState));
      return "handled";
    }

    return "not_handled";
  };

  private closeModal = () => {
    this.setState({ openUrlModal: false });
  };

  render() {
    const { editorState } = this.state;
    const { classes } = this.props;

    return (
      <Paper id="editor-container" className={classes.root}>
        {/* <InputModal open={openUrlModal} onClose={this.closeModal} /> */}
        <EditorToolbar setLink={this.setLink} editorState={editorState} onToggle={this.toggleInlineStyle} />

        {/* {inlineToolbar.show && (
          <InlineToolbar
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
            position={inlineToolbar.position}
            setLink={this.setLink}
          />
        )} */}
        <Divider />

        <div className={classes.editorContainer} onClick={this.focus}>
          {
            // @ts-ignore
            <Editor
              editorState={editorState}
              onChange={this.onChange}
              handleKeyCommand={this.handleKeyCommand}
              customStyleMap={customStyleMap}
              handleReturn={this.handleReturn}
              ref="editor"
            />
          }
        </div>
      </Paper>
    );
  }
}

export default withStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        position: "relative",
      },
      editorContainer: {
        padding: theme.spacing(2),
        minHeight: 400,
        "& .public-DraftEditorPlaceholder-root": {
          ...theme.typography.body2,
        },
        "& .public-DraftEditorPlaceholder-hasFocus": {
          display: "none",
        },
        "& .public-DraftEditor-content": {
          "& p": {
            ...theme.typography.body1,
          },
          "& h1": {
            ...theme.typography.h1,
          },
          "& h2": {
            ...theme.typography.h2,
          },
          "& h3": {
            ...theme.typography.h3,
          },

          "& ul": {
            ...theme.typography.body1,
            marginLeft: theme.spacing(4),
          },
          "& ol": {
            ...theme.typography.body1,
            marginLeft: theme.spacing(4),
          },
          "& a": {
            color: "#3b5998",
            textDecoration: "underline",
          },
        },
      },
    })
  //@ts-ignore
)(DraftEditor);

const customStyleMap = {
  HIGHLIGHT: {
    backgroundColor: "palegreen",
  },
};
