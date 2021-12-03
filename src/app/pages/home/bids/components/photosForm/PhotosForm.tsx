import React, { useCallback, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Button, CardContent, CardHeader, Grid, IconButton, Typography } from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";

import { useHistory } from "react-router-dom";
import { useIntl } from "react-intl";
import { useStylesPhotosForm } from "../hooks/useStyles";
import { API_DOMAIN } from "../../../../../constants";
import { IBid } from "../../../../../interfaces/bids";
import FilesDropzone from "../filesDropzone/FilesDropzone";

interface IProps {
  bid?: IBid;
  submit?: any;
  delPhoto?: any;
  editLoading?: boolean;
  setMainPhoto?: any;
  isView?: boolean;
  forUser?: boolean;
  userAvatar?: string;
  title?: string;
  setPhotos?: any;
  photos: any[];
  localDelPhoto: any;
  // loadAndSetMain: any;
  // handleSubmit: any;
}

const PhotosForm: React.FC<IProps> = ({
  bid,
  //   submit,
  delPhoto,
  editLoading,
  setMainPhoto,
  isView = false,
  forUser = false,
  userAvatar,
  title = "Загрузить изображение",
  photos,
  setPhotos,
  localDelPhoto,
}) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadPhoto, setUploadPhoto] = useState<string | null>(null);
  const classes = useStylesPhotosForm();
  const history = useHistory();
  const intl = useIntl();
  const mainPhoto = bid?.photos?.find(item => item.main);

  const handleUpload = useCallback(
    files => {
      const data = new FormData();
      if (files) {
        if (forUser) {
          setUploadPhoto(URL.createObjectURL(files[0]));
          data.append("photo", files[0]);
        } else {
          setPhotos((prevState: any) => {
            return [...prevState, ...files];
          });
          // files.flatMap((file: any) => data.append('photo[]', file));
          // submit(data);
        }
      }
    },
    [files, forUser, photos.length, photos]
  );

  return (
    <>
      <Row style={{ width: "100%" }}>
        <Col>
        <div className={classes.actions} style={{justifyContent: 'flex-start'}}>
            <Button onClick={() => history.goBack()} className={classes.buttons} variant="outlined" color="primary">
              Назад
            </Button>
          </div>
          {mainPhoto ? (
            // <Card className={classes.mainContainer}>
            <Card className={classes.mainImgContainer}>
              <img src={`${API_DOMAIN}${mainPhoto.path}`} alt={mainPhoto.name} className={classes.img} style={{ maxWidth: "100%" }} />
            </Card>
          ) : (
            // </Card>
            userAvatar && (
              <Card className={classes.mainContainer}>
                {/* <CardHeader title="Main photo" /> */}
                <CardContent>
                  <img src={`${API_DOMAIN}/${userAvatar}`} alt="avatar" style={{ maxWidth: 500 }} />
                </CardContent>
              </Card>
            )
          )}

          {!forUser && (
            <Card className={classes.mainContainer}>
              <CardHeader title="Галерея изображений" />
              <CardContent>
                {!bid?.photos?.length && photos.length < 1 ? (
                  <Typography className={classes.empty} component="h5" variant="h5">
                    Нет изображений
                  </Typography>
                ) : (
                  <Grid className={classes.container} container justify="center" alignItems="center">
                    {bid?.photos &&
                      bid.photos.length > 0 &&
                      bid.photos.map(item => (
                        <Card className={classes.imgContainer} key={item.id}>
                          <img src={`${API_DOMAIN}${item.path}`} alt={item.name} className={classes.img} />
                          {!isView && (
                            <Grid container direction="row" justify="space-between" alignItems="center" className={classes.titleBar}>
                              <IconButton onClick={() => delPhoto(item.id)} className={classes.icon}>
                                <DeleteOutline />
                              </IconButton>
                            </Grid>
                          )}
                        </Card>
                      ))}
                    {photos.length > 0 &&
                      photos.map((item: any, index: any) => {
                        return (
                          <Card className={classes.imgContainer} key={index}>
                            <img src={item.preview} alt={item.name} className={classes.img} />
                            <Grid container direction="row" justify="space-between" alignItems="center" className={classes.titleBar}>
                              <IconButton onClick={() => localDelPhoto(index)} className={classes.icon} style={{ marginLeft: "auto" }}>
                                <DeleteOutline />
                              </IconButton>
                            </Grid>
                          </Card>
                        );
                      })}
                  </Grid>
                )}
              </CardContent>
            </Card>
          )}

          {!isView && (
            <>
              <Card className={classes.mainContainer}>
                {/* <CardContent> */}
                <FilesDropzone maxFiles={forUser ? 1 : 100} title={title} files={files} setFiles={setFiles} handleUpload={handleUpload} />
                {/* </CardContent> */}
              </Card>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default PhotosForm;
