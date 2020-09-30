import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { injectIntl, FormattedMessage, WrappedComponentProps } from "react-intl";
import { Formik, Form } from "formik";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";

import { getDoc, createDoc, editDoc } from "../../../crud/docs.crud";

import { RichEditor } from "../../../components";
import ButtonWithLoader from "../../../components/ui/Buttons/ButtonWithLoader";
import { GrainMenu } from "../../../components/Menu";

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
  menuFlexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
  },
}));

interface IUserAgreement {
  code: string;
  name: string;
  text: string;
  public: boolean;
}

// TODO: make user_agreement from router
const UserDocPage: React.FC<WrappedComponentProps> = ({ intl }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [userAgreement, setUserAgreement] = useState<IUserAgreement | null>(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    setLoading(true);
    getDoc("user_agreement")
      .then(({ data: requestData }) => {
        setUserAgreement(requestData.data);
        const contentState = stateFromHTML(requestData.data.text);
        setEditorState(EditorState.createWithContent(contentState));
        setLoading(false);
      })
      .catch(error => {
        setUserAgreement(null);
        setLoading(false);
      });
  }, []);

  const handleUnLoading = () => setLoading(false);

  const handleSubmit = async () => {
    const data: IUserAgreement = {
      code: "user_agreement",
      name: "Пользовательское соглашение",
      text: stateToHTML(editorState.getCurrentContent()),
      public: true,
    };
    setLoading(true);

    if (!userAgreement) {
      createDoc(data)
        .then(handleUnLoading)
        .catch(handleUnLoading);
    } else {
      editDoc("user_agreement", data)
        .then(handleUnLoading)
        .catch(handleUnLoading);
    }
  };

  return (
    <div className={classes.menuFlexRow}>
      <GrainMenu />
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <RichEditor
              editorState={editorState}
              setEditorState={setEditorState}
              placeholder={userAgreement ? userAgreement.text : ""}
            />

            <div className={classes.buttonContainer}>
              <ButtonWithLoader onPress={handleSubmit} loading={loading}>
                <FormattedMessage
                  id={userAgreement ? "USERDOC.BUTTON.SAVE" : "USERDOC.BUTTON.CREATE"}
                />
              </ButtonWithLoader>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default injectIntl(UserDocPage);
