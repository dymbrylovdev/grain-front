import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { Editor, EditorState, RichUtils, Modifier, getDefaultKeyBinding } from 'draft-js';
import { makeStyles } from '@material-ui/styles';
import { Paper, Divider } from '@material-ui/core';

import { EditorToolbar } from './components';
import { blockRenderMap } from './utils';

const useStyles = makeStyles((theme: any) => ({
  root: {},
  editorContainer: {
    padding: theme.spacing(2),
    minHeight: 400,
    '& .public-DraftEditorPlaceholder-root': {
      ...theme.typography.body2,
    },
    '& .public-DraftEditorPlaceholder-hasFocus': {
      display: 'none',
    },
    '& .public-DraftEditor-content': {
      '& p': {
        ...theme.typography.body1,
      },
      '& h1': {
        ...theme.typography.h1,
      },
      '& h2': {
        ...theme.typography.h2,
      },
      '& h3': {
        ...theme.typography.h3,
      },
      // '& h4': {
      //   ...theme.typography.h4,
      // },
      // '& h5': {
      //   ...theme.typography.h5,
      // },
      // '& h6': {
      //   ...theme.typography.h6,
      // },
      // '& blockquote': {
      //   ...theme.typography.subtitle1,
      // },
      '& ul': {
        ...theme.typography.body1,
        marginLeft: theme.spacing(4),
      },
      '& ol': {
        ...theme.typography.body1,
        marginLeft: theme.spacing(4),
      },
      // '& pre': {
      //   backgroundColor: 'rgba(0, 0, 0, 0.05)',
      //   fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      //   fontSize: 16,
      //   padding: 2,
      // },
      link: {
        color: '#3b5998',
        textDecoration: 'underline',
      },
    },
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  textAlignJustify: {
    textAlign: 'justify',
  },
}));

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const RichEditor = (props: any) => {
  const { placeholder, className, ...rest } = props;

  const classes = useStyles();

  const editorRef = useRef(null);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleContainerClick = () => {
    if (editorRef) {
      // @ts-ignore
      editorRef.current.focus();
    }
  };

  const handleToolbarToggle = (type: any, value: any) => {
    if (type === 'blockType') {
      if (['left', 'center', 'right', 'justify'].includes(value)) {
        const newContentState = Modifier.setBlockData(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          // @ts-ignore
          { 'text-align': value }
        );

        const newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');

        setEditorState(newEditorState);
        return;
      }

      setEditorState(RichUtils.toggleBlockType(editorState, value));
    } else {
      setEditorState(RichUtils.toggleInlineStyle(editorState, value));
    }
  };

  const handleEditorChange = (editorState: any) => {
    setEditorState(editorState);
  };

  const handleKeyCommand = (command: any, editorState: any) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      handleEditorChange(newState);
      return true;
    }

    return false;
  };

  const mapKeyToEditorCommand = (event: any) => {
    if (event.keyCode === 9) {
      const newEditorState = RichUtils.onTab(event, editorState, 4);

      if (newEditorState !== editorState) {
        handleEditorChange(newEditorState);
      }

      return;
    }

    return getDefaultKeyBinding(event);
  };

  function blockStyleFn(contentBlock: any) {
    const textAlign = contentBlock.getData().get('text-align');

    if (textAlign) {
      const className = `textAlign${capitalize(textAlign)}`;
      // @ts-ignore
      return classes[className];
    }

    return '';
  }

  return (
    <Paper {...rest} className={clsx(classes.root, className)}>
      <EditorToolbar editorState={editorState} onToggle={handleToolbarToggle} />
      <Divider />
      <div className={classes.editorContainer} onClick={handleContainerClick}>
        {
          // @ts-ignore
          <Editor
            blockRenderMap={blockRenderMap}
            blockStyleFn={blockStyleFn}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            onChange={handleEditorChange}
            placeholder={placeholder}
            ref={editorRef}
            spellCheck
          />
        }
      </div>
    </Paper>
  );
};

export default RichEditor;
