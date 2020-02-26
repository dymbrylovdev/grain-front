import React, { useState, useEffect } from "react";
import { Autocomplete as MaterialAutocomplete } from "@material-ui/lab";
import { TextField, CircularProgress, IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

interface IOptionsItem {
  text: string;
}

interface IProps {
  options: IOptionsItem[];
  defaultValue: IOptionsItem;
  label: string;
  inputClassName: any;
  editable: boolean;
  loading: boolean;
  inputError: boolean;
  inputHelperText: any;
  handleBlur: () => {};
  fetchLocations: (location: string) => {};
  clearLocations: () => {};
  setSelectedLocation: (location: any) => {};
}

const Autocomplete: React.FC<IProps> = ({
  options,
  defaultValue,
  label,
  inputClassName,
  handleBlur,
  editable,
  loading,
  inputError,
  inputHelperText,
  fetchLocations,
  clearLocations,
  setSelectedLocation,
}) => {
  const [editableLocation, setEditableLocation] = useState(editable);
  const [location, setLocation] = useState("");

  useEffect(() => {
    clearLocations();
  }, [clearLocations]);

  useEffect(() => {
    fetchLocations(location);
  }, [fetchLocations, location]);

  return (
    <MaterialAutocomplete
      id="autocomplete"
      noOptionsText="Введите место"
      options={options}
      loading={loading}
      getOptionLabel={option => option.text}
      onChange={(e: any, val: any) => {
        if (val) {
          setSelectedLocation(val);
          setEditableLocation(false);
        }
      }}
      filterOptions={options => options}
      disabled={!editableLocation}
      defaultValue={defaultValue}
      renderInput={(params: any) => (
        <TextField
          {...params}
          type="text"
          margin="normal"
          name="location"
          variant="outlined"
          label={label}
          className={inputClassName}
          onBlur={handleBlur}
          value={location}
          onChange={e => setLocation(e.target.value)}
          helperText={inputHelperText}
          error={inputError}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {!editableLocation && (
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
      )}
    />
  );
};

export default Autocomplete;
