import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      background: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
    },
    form: {
      maxWidth: '800px',
      width: '100%',
      padding: theme.spacing(3),
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },

    table: {
        width: "100%",
    },
    actionButtonsContainer: {
        flexDirection: 'column'
    }
  }));

  export default useStyles;