import { EditorState, ContentBlock, genKey } from 'draft-js';

import { List } from 'immutable';

export const getSelectionRange = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

export const getSelectionCoords = (selectionRange: any) => {
  const editorBounds = document.getElementById('editor-container')?.getBoundingClientRect();
  if (!editorBounds) return null;

  const rangeBounds = selectionRange.getBoundingClientRect();
  const rangeWidth = rangeBounds.right - rangeBounds.left;
  const offsetLeft =
    rangeBounds.left -
    editorBounds.left +
    rangeWidth / 2 -
    /* 107px is width of inline toolbar */
    142 / 2;
  // 42px is height of inline toolbar (35px) + 5px center triangle and 2px for spacing
  const offsetTop = rangeBounds.top - editorBounds.top - 42;

  return { offsetLeft, offsetTop };
};

export const getCurrentBlock = (editorState: any) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();

  return contentState.getBlockForKey(selectionState.getStartKey());
};

export const addNewBlockAt = (
  editorState: any,
  pivotBlockKey: any,
  newBlockType = 'unstyled',
  initialData = {}
) => {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  const block = blockMap.get(pivotBlockKey);

  if (!block) {
    throw new Error(`The pivot key - ${pivotBlockKey} is not present in blockMap.`);
  }

  // @ts-ignore
  const blocksBefore = blockMap.toSeq().takeUntil(v => v === block);
  const blocksAfter = blockMap
    .toSeq()
    // @ts-ignore
    .skipUntil(v => v === block)
    .rest();
  const newBlockKey = genKey();

  const newBlock = new ContentBlock({
    key: newBlockKey,
    type: newBlockType,
    text: '',
    // @ts-ignore
    characterList: new List(),
    depth: 0,
    data: initialData,
  });

  const newBlockMap = blocksBefore
    .concat(
      [
        [pivotBlockKey, block],
        [newBlockKey, newBlock],
      ],
      blocksAfter
    )
    .toOrderedMap();

  const selection = editorState.getSelection();

  const newContent = content.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusKey: newBlockKey,
      focusOffset: 0,
      isBackward: false,
    }),
  });

  return EditorState.push(editorState, newContent, 'split-block');
};

export const closest = (element: any, matchFunction: any) => {
  let currentElement = element;

  while (currentElement) {
    if (matchFunction(currentElement)) return currentElement;
    currentElement = currentElement.parentNode;
  }
};

export const hasClass = (element: any, className: any) => {
  let isHasClass = false;

  if (element.classList) {
    isHasClass = element.classList.contains(className);
  } else {
    isHasClass = new RegExp(`(^| )${className}( |$)`, 'gi').test(element.className);
  }

  return isHasClass;
};

export const findLinkEntities = (contentBlock: any, callback: any, contentState: any) => {
  contentBlock.findEntityRanges((character: any) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
};
