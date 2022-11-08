import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";
import { Button, List, ListItem, ListItemIcon, ListItemText, Typography, colors, makeStyles } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import clsx from "clsx";
import bytesToSize from "../../../../../utils/bytesToSize";

const useStyles = makeStyles((theme: any) => ({
  root: {},
  dropZone: {
    // border: `2px dashed ${theme.palette.divider}`,
    padding: theme.spacing(6),
    outline: "none",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "center",
    "&:hover": {
      backgroundColor: colors.grey[50],
      opacity: 0.5,
      cursor: "pointer",
    },
  },
  selectedDropZone: {
    borderColor: "#0abb87",
  },
  dragActive: {
    backgroundColor: colors.grey[50],
    opacity: 0.5,
  },
  image: {
    width: 130,
  },
  info: {
    marginTop: theme.spacing(1),
  },
  list: {
    maxHeight: 320,
  },
  actions: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
}));

interface IProps {
  files: File[] | null;
  setFiles: any;
  title?: string;
  description?: string;
  defaulImage?: string;
  maxFiles?: number;
  handleUpload?: (files: any) => void;
}

const FilesDropzone: React.FC<IProps> = ({
  files,
  setFiles,
  defaulImage,
  maxFiles = 3,
  title = "Select logo",
  description = "Перетащите файлы сюда или нажмите, чтобы загрузить",
  handleUpload,
}) => {
  const classes = useStyles();

  const handleDrop = useCallback(
    async acceptedFiles => {
      if (handleUpload) {
        const files = acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        handleUpload(files);
      }
      // const _maxFiles = acceptedFiles.length >= maxFiles ? maxFiles : acceptedFiles.length;
      // const avalibleFiles = acceptedFiles.slice(0, _maxFiles);

      // setFiles(avalibleFiles);
    },
    [handleUpload]
  );

  const handleRemoveAll = () => {
    setFiles(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxFiles,
  });

  return (
    <div className={clsx(classes.root)}>
      <div
        className={clsx({
          [classes.dropZone]: true,
          [classes.dragActive]: isDragActive,
          [classes.selectedDropZone]: files,
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className={classes.content}>
          <Typography gutterBottom variant="h3">
            {title}
          </Typography>
          <Typography className={classes.info} color="textSecondary" variant="body1">
            {description}
          </Typography>
        </div>
      </div>
      {!!files && (
        <div>
          {files.map((file: File, idx: number) => (
            <List key={uuidv4()} className={classes.list}>
              <ListItem divider={true}>
                <ListItemIcon>
                  <FileCopyIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="h5">{file.name}</Typography>}
                  secondary={<Typography>{bytesToSize(file.size)}</Typography>}
                />
              </ListItem>
            </List>
          ))}
          <div className={classes.actions}>
            <Button onClick={handleRemoveAll}>Remove all</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesDropzone;
