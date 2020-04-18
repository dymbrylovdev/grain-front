import React, { useState } from 'react';
import { makeStyles, createStyles, Button } from '@material-ui/core';

const useInnerStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100%',
    },
    text: {
      fontSize: 14,
      marginBottom: theme.spacing(2),
    },
  })
);

const BodyConfigPage: React.FC = () => {
  const innerClasses = useInnerStyles();

  const [offButton, setOffButton] = useState(false);

  return (
    <div className={innerClasses.container}>
      <div className={innerClasses.text}>Что-то пошло не так</div>
      <Button
        variant="contained"
        color="primary"
        disabled={offButton}
        onClick={() => {
          setOffButton(true);
          document.location.reload(true);
        }}
      >
        Обновить страницу
      </Button>
    </div>
  );
};

export default BodyConfigPage;
