import React, { useCallback, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Button, CardContent, CardHeader, Grid, IconButton, Typography } from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useStylesPhotosForm } from "../hooks/useStyles";
import { API_DOMAIN } from "../../../../../constants";
import FilesDropzone from "../filesDropzone/FilesDropzone";
import ButtonWithLoader from "../../../../../components/ui/Buttons/ButtonWithLoader";

interface IProps {
  data?: any;
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
  isOnePhoto?: boolean;
  titleSaveBtn?: string;
  saveFunc?: () => void;
  loadingSave?: boolean;
}

const PhotosForm: React.FC<IProps> = ({
  data,
  delPhoto,
  isView = false,
  forUser = false,
  userAvatar,
  title = "Загрузить изображение",
  photos,
  setPhotos,
  localDelPhoto,
  isOnePhoto,
  titleSaveBtn,
  saveFunc,
  loadingSave,
}) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [uploadPhoto, setUploadPhoto] = useState<string | null>(null);
  const classes = useStylesPhotosForm();
  const history = useHistory();
  const mainPhoto = data?.photos?.find(item => item?.main);
  const handleUpload = useCallback(
    files => {
      const data = new FormData();
      if (files) {
        if (forUser) {
          setUploadPhoto(URL.createObjectURL(files[0]));
          data.append("photo", files[0]);
        } else {
          isOnePhoto
            ? setPhotos([...files])
            : setPhotos((prevState: any) => {
                return [...prevState, ...files];
              });

          // files.flatMap((file: any) => data.append('photo[]', file));
          // submit(data);
        }
      }
    },
    [files, forUser, photos.length, photos, isOnePhoto]
  );

  return (
    <>
      <Row style={{ width: "100%" }}>
        <Col>
          <div className={classes.actions} style={{ justifyContent: "space-between" }}>
            <Button onClick={() => history.goBack()} className={classes.buttons} variant="outlined" color="primary">
              Назад
            </Button>
            {saveFunc && titleSaveBtn && (
              <ButtonWithLoader disabled={loadingSave} loading={loadingSave} onPress={() => saveFunc()}>
                {titleSaveBtn}
              </ButtonWithLoader>
            )}
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
                {!data?.photos?.length && photos.length < 1 ? (
                  <Typography className={classes.empty} component="h5" variant="h5">
                    Нет изображений
                  </Typography>
                ) : (
                  <Grid className={classes.container} container justify="center" alignItems="center">
                    {isOnePhoto ? (
                      <>
                        {photos.length < 1 &&
                          data?.photos &&
                          data.photos.length > 0 &&
                          data.photos.map(item => (
                            <Card className={classes.imgContainer} key={item.id}>
                              <img src={`${API_DOMAIN}${item.path || item.small}`} alt={item.name} className={classes.img} />
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
                                  <IconButton onClick={() => localDelPhoto(index)} className={classes.icon}>
                                    <DeleteOutline />
                                  </IconButton>
                                </Grid>
                              </Card>
                            );
                          })}
                      </>
                    ) : (
                      <>
                        {data?.photos &&
                          data.photos.length > 0 &&
                          data.photos.map(item => (
                            <Card className={classes.imgContainer} key={item.id}>
                              <img src={`${API_DOMAIN}${item.path || item.small}`} alt={item.name} className={classes.img} />
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
                                  <IconButton onClick={() => localDelPhoto(index)} className={classes.icon}>
                                    <DeleteOutline />
                                  </IconButton>
                                </Grid>
                              </Card>
                            );
                          })}
                      </>
                    )}
                  </Grid>
                )}
              </CardContent>
            </Card>
          )}

          {!isView && (
            <>
              <Card className={classes.mainContainer}>
                {/* <CardContent> */}
                <FilesDropzone
                  maxFiles={isOnePhoto ? 1 : 100}
                  title={title}
                  files={files}
                  setFiles={setFiles}
                  handleUpload={handleUpload}
                />
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
