import React, { useEffect } from "react";
import { IntlShape } from "react-intl";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { useFormik } from "formik";
import { ICropParam, ICrop } from "../../../interfaces/crops";
import { IDealsFilter, IDealsFilterForEdit } from "../../../interfaces/deals";
import { ActionWithPayload } from "../../../utils/action-helper";

const getInitialValues = (
  cropId: number,
  allCropParams: { [key: string]: ICropParam[] },
  dealsFilters: IDealsFilter[] | undefined
): { [key: string]: boolean } => {
  let newValues: { [key: string]: boolean } = {};
  for (let key in allCropParams) {
    if (+key === cropId) {
      allCropParams[key].forEach(cropParam => {
        newValues[cropParam.id] =
          !!dealsFilters &&
          !!dealsFilters.find(
            item =>
              !!item.parameters.length && item.parameters.find(param => param.id === cropParam.id)
          );
      });
    }
  }
  return newValues;
};

const getValuesToRequest = (values: { [key: string]: boolean }): IDealsFilterForEdit => {
  let filters: number[] = [];
  for (let key in values) {
    if (values[key]) filters.push(+key);
  }
  return { parameter_ids: filters };
};

interface IProps {
  intl: IntlShape;
  dealsFilters: IDealsFilter[] | undefined;
  crop: ICrop;
  allCropParams: { [key: string]: ICropParam[] };
  editFilter: (
    id: number,
    data: IDealsFilterForEdit
  ) => ActionWithPayload<
    "deals/EDIT_FILTER_REQUEST",
    {
      id: number;
      data: IDealsFilterForEdit;
    }
  >;
  editFilterLoading: boolean;
}

const FilterForm: React.FC<IProps> = ({
  intl,
  dealsFilters,
  crop,
  allCropParams,
  editFilter,
  editFilterLoading,
}) => {
  const { values, handleSubmit, handleChange, resetForm } = useFormik({
    initialValues: getInitialValues(crop.id, allCropParams, dealsFilters),
    onSubmit: values => {
      if (!!dealsFilters) {
        const id = dealsFilters.find(item => item.crop.id === crop.id)?.id;
        if (!!id) editFilter(id, getValuesToRequest(values));
      }
    },
  });

  useEffect(() => {
    resetForm({ values: getInitialValues(crop.id, allCropParams, dealsFilters) });
  }, [allCropParams, crop.id, dealsFilters, resetForm]);

  return (
    <div>
      {!allCropParams[crop.id].length ? (
        <div style={{ fontSize: 12 }}>{intl.formatMessage({ id: "DEALS.FILTER.EMPTY" })}</div>
      ) : (
        <>
          {allCropParams[crop.id].map(item => (
            <div key={item.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values[item.id]}
                    onChange={(e: any) => {
                      handleChange(e);
                      handleSubmit();
                    }}
                    size="small"
                  />
                }
                label={item.name}
                name={item.id.toString()}
                disabled={!dealsFilters || editFilterLoading}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FilterForm;
