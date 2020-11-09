import React, { useState, useCallback } from "react";
import { Col } from "react-bootstrap";
import { useFormik } from "formik";
import { useSelector, shallowEqual, connect } from "react-redux";
import { injectIntl } from "react-intl";

import { ICropParam } from "../../../interfaces/crops";
import CheckBoxParamGroup from "../../../pages/home/bids/components/filter/CheckBoxParamGroup";
import { IAppState } from "../../../store/rootDuck";

interface IProps {
  cropId: string | undefined;
  intl: any | undefined;
  classes: any | undefined;
}

const FilterBids: React.FC<IProps> = ({
  cropId,
  intl,
  classes,
}) => {
  const { me, filterCount, crops } = useSelector((state: IAppState) => ({
    me: state.auth.user,
    filterCount: state.myFilters.filterCount,
    crops: state.crops2.crops,
  }));

  return (
    <>
      {/* {enumParams &&
        enumParams.map(param => (
          <Col key={param.id}>
            <CheckBoxParamGroup
              param={param}
              values={}
              handleChange={}
            />
          </Col>
        ))} */}
      <h6>test</h6>
    </>
  );
};

export default FilterBids;
