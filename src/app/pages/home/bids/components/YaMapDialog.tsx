import React from "react";
import { Dialog, DialogContent } from "@material-ui/core";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { IBid } from "../../../../interfaces/bids";
import { REACT_APP_GOOGLE_API_KEY } from "../../../../constants";
import { useBidTableStyles } from "./hooks/useStyles";

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
      <DialogContent style={{ padding: 0 }}>
        <div>
          {mapState && currentBid && (
            <YMaps query={{ apikey: REACT_APP_GOOGLE_API_KEY }}>
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
