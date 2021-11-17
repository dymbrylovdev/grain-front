import React, { useMemo, useState } from "react";
import { Card, IconButton, makeStyles } from "@material-ui/core";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGalleryLib from "react-image-gallery";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import ArrowNext from "@material-ui/icons/ArrowForwardIos";
import { toAbsoluteUrl } from "../../../../../../_metronic/utils/utils";
// import { API_DOMAIN } from "../../../../../constants";

interface IProps {
  //   product: any;
}

const useStyles = makeStyles(theme => ({
  imgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    backgroundColor: "black",
  },
  imgContainerSmall: {
    borderRadius: 4,
    maxHeight: "250px",
    backgroundColor: "transparent",
    [theme.breakpoints.up("md")]: {
      maxHeight: "500px",
    },
  },
  imgContainerFull: {
    maxHeight: "85vh",
  },
  img: {
    objectFit: "cover",
    objectPosition: "center center",
    backgroundColor: "#000",
    width: "100%",
    height: "100%",
  },
  galleryContainer: {
    width: "100%",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
    color: "#fff",
  },
}));

const photos = [
  {
    big: null,
    extension: null,
    id: 1,
    main: true,
    mime_type: null,
    name: null,
    origin: null,
    path: toAbsoluteUrl("/images/defaultImage.jpg"),
    small: toAbsoluteUrl("/images/defaultImage.jpg"),
  },
  {
    big: null,
    extension: null,
    id: 2,
    main: false,
    mime_type: null,
    name: null,
    origin: null,
    path: toAbsoluteUrl("/images/wheat (1).jpg"),
    small: toAbsoluteUrl("/images//wheat (1).jpg"),
  },
  {
    big: null,
    extension: null,
    id: 3,
    main: false,
    mime_type: null,
    name: null,
    origin: null,
    path: toAbsoluteUrl("/images/wheat (2).jpg"),
    small: toAbsoluteUrl("/images/wheat (2).jpg"),
  },
  {
    big: null,
    extension: null,
    id: 4,
    main: false,
    mime_type: null,
    name: null,
    origin: null,
    path: toAbsoluteUrl("/images/wheat (3).jpg"),
    small: toAbsoluteUrl("/images/wheat (3).jpg"),
  },
];

const ImageGallery: React.FC<IProps> = () => {
  const classes = useStyles();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // images
  const images = useMemo(() => {
    // if (product?.photos) {
    return photos.map(el => ({
      original: el.path,
      thumbnail: el.small,
      renderItem: ({ original }) => (
        <Card
          className={`${classes.imgContainer} ${isFullScreen ? classes.imgContainerFull : classes.imgContainerSmall}`}
          style={{ height: isFullScreen ? "85vh" : 500 }}
        >
          <img alt="" className={classes.img} style={{ objectFit: isFullScreen ? "contain" : "cover" }} src={original} />
        </Card>
      ),
    }));
    // } else {
    //   return null;
    // }
    // return []
  }, [isFullScreen, photos, classes]);

  return (
    <div className={classes.galleryContainer}>
      {images && (
        <>
          {images.length > 0 ? (
            <ImageGalleryLib
              onScreenChange={boolean => setIsFullScreen(boolean)}
              items={images}
              useBrowserFullscreen
              showThumbnails={images.length > 1}
              showFullscreenButton
              disableThumbnailScroll={false}
              showPlayButton={false}
              thumbnailPosition="bottom"
              infinite
              renderLeftNav={onClick => (
                <IconButton onClick={onClick} className={classes.arrow} style={{ left: 15 }}>
                  <ArrowBack style={{ fontSize: 30 }} />
                </IconButton>
              )}
              renderRightNav={onClick => (
                <IconButton onClick={onClick} className={classes.arrow} style={{ right: 15 }}>
                  <ArrowNext style={{ fontSize: 30 }} />
                </IconButton>
              )}
            />
          ) : (
            <Card className={classes.imgContainer} elevation={0}>
              <img className={classes.img} src={toAbsoluteUrl("/images/defaultImage.jpg")} />
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ImageGallery;
