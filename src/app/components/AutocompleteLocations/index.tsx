import React, { useState, useEffect } from "react";
import { Autocomplete as MaterialAutocomplete } from "@material-ui/lab";
import { TextField, CircularProgress, IconButton, makeStyles } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const innerStyles = makeStyles(theme => ({
  pulseRoot: {
    "& fieldset": {
      animation: "2000ms ease-in-out infinite both TextFieldBorderPulse",
    },
  },
}));

interface IOptionsItem {
  text: string;
}

interface IProps {
  id?: string;
  options: IOptionsItem[];
  inputValue: IOptionsItem;
  label: string;
  inputClassName: any;
  editable: boolean;
  inputError: boolean;
  inputHelperText: any;
  disable: boolean;
  handleBlur?: (e: any) => {} | void;
  fetchLocations: (location: string) => {} | void;
  clearLocations: () => {};
  setSelectedLocation: (location: any) => {} | void;
  prompterRunning?: boolean;
  prompterStep?: number;
  loading?: boolean;
}

const Autocomplete: React.FC<IProps> = ({
  id = "",
  options,
  inputValue,
  label,
  loading,
  inputClassName,
  handleBlur,
  editable,
  inputError,
  inputHelperText,
  fetchLocations,
  clearLocations,
  setSelectedLocation,
  disable,
  prompterRunning,
  prompterStep,
}) => {
  const [editableLocation, setEditableLocation] = useState(editable);
  const [location, setLocation] = useState<string>("");
  const [loadingLocal, setLoadingLocal] = useState(loading);
  const innerClasses = innerStyles();

  useEffect(() => {
    clearLocations();
  }, [clearLocations]);

  useEffect(() => {
    if (location.length > 1) {
      const loadingDelay = setTimeout(() => {
        setLoadingLocal(true);
      }, 500);

      const fetchDelay = setTimeout(() => {
        // console.log('fetch for:', location);
        fetchLocations(location);
        setLoadingLocal(false);
      }, 1500);

      return () => {
        clearTimeout(fetchDelay);
        clearTimeout(loadingDelay);
      };
    } else {
      setLoadingLocal(false);
    }
  }, [fetchLocations, location]);

  useEffect(() => {
    if (inputValue.text === "") setEditableLocation(true);
    if (inputValue.text !== "") setEditableLocation(false);
  }, [inputValue, setEditableLocation]);

  return (
    <MaterialAutocomplete
      id={`autocomplete${id}`}
      noOptionsText="Введите место"
      options={options}
      loading={loading || loadingLocal}
      getOptionLabel={option => option.text}
      onChange={(_: any, val: any) => {
        console.log("val", val);

        if (val) {
          setSelectedLocation(val);
          setEditableLocation(false);
        } else {
          setLocation("");
        }
      }}
      filterOptions={options => options}
      disabled={!editableLocation}
      value={inputValue}
      onInputChange={(_e: any, _val: any, reason: any) => {
        if (reason === "clear") setSelectedLocation({ text: "" });
      }}
      classes={prompterRunning && prompterStep === 0 && !location ? { root: innerClasses.pulseRoot } : {}}
      renderInput={(params: any) => {
        return (
          <TextField
            {...params}
            type="text"
            margin="normal"
            name="location"
            variant="outlined"
            label={label}
            className={inputClassName}
            onBlur={handleBlur}
            onChange={e => {
              setLocation(e.target.value);
            }}
            helperText={inputHelperText}
            error={inputError}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {(loading || loadingLocal) && <CircularProgress color="inherit" size={20} />}
                  {!editableLocation && !disable && (
                    <IconButton
                      onClick={() => {
                        setEditableLocation(!editableLocation);
                      }}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}

                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        );
      }}
    />
  );
};

export default Autocomplete;
