import React from "react";
import { makeStyles } from "@material-ui/core";

interface IProps {
  color: string;
}

const useStyles = makeStyles({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: (props: IProps) => `${props.color}`,
    marginRight: 9,
    marginTop: 4,
    flex: "none",
    alignSelf: "flex-start",
  },
});

const MiniColorDot: React.FC<IProps> = ({ color }) => {
  const classes = useStyles({ color });
  return <div className={classes.dot}></div>;
};

export default MiniColorDot;
