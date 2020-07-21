import React from "react";
import { makeStyles, createStyles, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useInnerStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100%",
    },
    text: {
      fontSize: 14,
      marginBottom: theme.spacing(2),
    },
  })
);

const Error404Page: React.FC = () => {
  const innerClasses = useInnerStyles();

  const history = useHistory();

  return (
    <div className={innerClasses.container}>
      <div className={innerClasses.text}>Этой страницы не существует</div>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          history.goBack();
        }}
      >
        Назад
      </Button>
    </div>
  );
};

export default Error404Page;
