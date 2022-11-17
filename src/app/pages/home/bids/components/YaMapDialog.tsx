import React from "react";
import { Dialog, DialogContent, IconButton } from "@material-ui/core";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { IBid } from "../../../../interfaces/bids";
import { REACT_APP_GOOGLE_API_KEY } from "../../../../constants";
import { useBidTableStyles } from "./hooks/useStyles";
import Close from "@material-ui/icons/Close";
import { useStyles } from "./imageDialog/imageDialog";
interface IProps {
  mapState: {
    center: number[];
    zoom: number;
    margin: number[];
  } | null;
  showYaMap: boolean;
  setShowYaMap: (value: React.SetStateAction<boolean>) => void;
  currentBid: IBid | null;
  setMap: (value: any) => void;
  setYmaps: (value: any) => void;
  showPlacemark: boolean;
}

const YaMapDialog = React.memo<IProps>(({ mapState, showYaMap, setShowYaMap, currentBid, setMap, setYmaps, showPlacemark }) => {
  const innerClasses = useBidTableStyles();
  const imageDialogClasses = useStyles();
  return (
    <Dialog
      open={showYaMap}
      onClose={() => setShowYaMap(false)}
      maxWidth={"xl"}
      fullWidth
      style={{ padding: 0 }}
      BackdropProps={{
        classes: {
          root: innerClasses.backdrop,
        },
      }}
    >
      <div className={imageDialogClasses.wrapperBtnClose}>
        <IconButton onClick={() => setShowYaMap(false)} className={imageDialogClasses.btnClose}>
          <Close className={imageDialogClasses.iconClose} />
        </IconButton>
      </div>
      <DialogContent style={{ padding: 0 }}>
        <div>
          {mapState && currentBid && (
            <YMaps query={{ apikey: '7f9da232-66bd-4aa0-97de-928d75b7ea37' }}>
              <div>
                <Map
                  state={mapState}
                  instanceRef={ref => setMap(ref)}
                  width={"100%"}
                  height={600}
                  onLoad={ymaps => {
                    setYmaps(ymaps);
                  }}
                  modules={["templateLayoutFactory", "route", "geoObject.addon.balloon"]}
                >
                  {showPlacemark && (
                    <Placemark
                      geometry={mapState.center}
                      properties={{ iconCaption: currentBid.location.text }}
                      modules={["geoObject.addon.balloon"]}
                    />
                  )}
                </Map>
              </div>
            </YMaps>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default YaMapDialog;
