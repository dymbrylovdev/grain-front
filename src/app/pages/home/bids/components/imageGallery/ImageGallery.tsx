import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardMedia, IconButton, makeStyles } from "@material-ui/core";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGalleryLib from "react-image-gallery";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import ArrowNext from "@material-ui/icons/ArrowForwardIos";
import { toAbsoluteUrl } from "../../../../../../_metronic/utils/utils";
import ImageDialog from "../imageDialog/imageDialog";
import { API_DOMAIN } from "../../../../../constants";
import { ICrop } from "../../../../../interfaces/crops";

interface IProps {
  photos:
    | {
        id: number;
        path: string;
        main: boolean;
        name: string;
        extension: string;
        mimeType: string;
        small: string;
      }[]
    | undefined;
  currentCrop?: ICrop;
}

const useStyles = makeStyles(theme => ({
  imgContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
  },
  imgContainerSmall: {
    borderRadius: 4,
    maxHeight: "311px",
    backgroundColor: "transparent",
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
  wrapperBtnFull: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    maxWidth: 530,
    width: "42%",
    height: 311,
    zIndex: 1,
    // eslint-disable-next-line no-useless-computed-key
    ["@media (max-width:840px)"]: {
      paddingRight: 20,
      width: "100%",
      maxWidth: "100%",
    },
  },
}));

const ImageGallery: React.FC<IProps> = ({ photos, currentCrop }) => {
  const classes = useStyles();
  const imageGalleryRef: any = useRef();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const defaultUrl = currentCrop?.photo
      ? `${API_DOMAIN}${currentCrop.photo.small}`
      : `${API_DOMAIN}${"/uploaded/images/bid/default.jpg"}`;
    setCurrentImage(photos && photos.length > 0 ? `${API_DOMAIN}${photos[0].path}` : defaultUrl);
  }, [photos, setCurrentImage, currentCrop]);

  // images
  const images = useMemo(() => {
    if (photos && photos.length > 0) {
      return photos.map(el => ({
        original: `${API_DOMAIN}${el.path}`,
        thumbnail: `${API_DOMAIN}${el.path}`,
        renderItem: ({ original }) => (
          <Card
            className={`${classes.imgContainer} ${isFullScreen ? classes.imgContainerFull : classes.imgContainerSmall}`}
            style={{ height: isFullScreen ? "85vh" : 500 }}
          >
            <img alt="" className={classes.img} style={{ objectFit: isFullScreen ? "contain" : "cover" }} src={original} />
          </Card>
        ),
      }));
    } else {
      const defaultUrl = currentCrop?.photo
        ? `${API_DOMAIN}${currentCrop.photo.small}`
        : `${API_DOMAIN}${"/uploaded/images/bid/default.jpg"}`;
      return [
        {
          original: defaultUrl,
          thumbnail: defaultUrl,
          renderItem: ({ original }) => (
            <Card
              className={`${classes.imgContainer} ${isFullScreen ? classes.imgContainerFull : classes.imgContainerSmall}`}
              style={{ height: isFullScreen ? "85vh" : 500 }}
            >
              <img alt="" className={classes.img} style={{ objectFit: isFullScreen ? "contain" : "cover" }} src={original} />
            </Card>
          ),
        },
      ];
    }
  }, [isFullScreen, photos, classes, currentCrop]);

  const handleArrow = useCallback(
    (operation: "prev" | "next") => {
      if (photos && photos.length > 0) {
        const currentIndex: number = imageGalleryRef.current.getCurrentIndex();
        const maxIndex = photos.length - 1;
        if (operation === "next") {
          currentIndex === maxIndex ? imageGalleryRef.current.slideToIndex(0) : imageGalleryRef.current.slideToIndex(currentIndex + 1);
        }
        if (operation === "prev") {
          currentIndex === 0 ? imageGalleryRef.current.slideToIndex(maxIndex) : imageGalleryRef.current.slideToIndex(currentIndex - 1);
        }
      }
    },
    [photos, imageGalleryRef]
  );

  return (
    <>
      {currentImage && (
        <ImageDialog open={showFullImage} url={currentImage} handleClose={() => setShowFullImage(false)} handleArrow={handleArrow} />
      )}
      <div className={classes.galleryContainer}>
        <div className={classes.wrapperBtnFull}>
          <CardMedia
            component="img"
            title="image"
            image={toAbsoluteUrl("/images/isFullImage.png")}
            style={{ objectFit: "none", width: 100, height: 100, cursor: "pointer" }}
            onClick={() => setShowFullImage(true)}
          />
        </div>
        {images && (
          <>
            {images.length > 0 ? (
              <ImageGalleryLib
                ref={imageGalleryRef}
                onScreenChange={boolean => setIsFullScreen(boolean)}
                items={images}
                showThumbnails={images.length > 1}
                showFullscreenButton={false}
                disableThumbnailScroll={false}
                showPlayButton={false}
                thumbnailPosition="bottom"
                infinite
                onSlide={index => photos && photos.length > 0 && setCurrentImage(`${API_DOMAIN}${photos[index].path}`)}
                renderLeftNav={onClick => (
                  <IconButton onClick={onClick} className={classes.arrow} style={{ left: 15, zIndex: 2 }}>
                    <ArrowBack style={{ fontSize: 30 }} />
                  </IconButton>
                )}
                renderRightNav={onClick => (
                  <IconButton onClick={onClick} className={classes.arrow} style={{ right: 15, zIndex: 2 }}>
                    <ArrowNext style={{ fontSize: 30 }} />
                  </IconButton>
                )}
              />
            ) : (
              <Card className={classes.imgContainer} elevation={0}>
                <img className={classes.img} src={toAbsoluteUrl("/images/defaultImage.jpg")} alt="imageDefault" />
              </Card>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ImageGallery;
