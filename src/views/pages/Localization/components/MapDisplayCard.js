import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import configs from "configs";
import { RosContext } from "../index";
import { getConfigMap, getAllTargetPoint } from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";
export default function MediaCard({
  image_src,
  title,
  map_description,
  fileConfig,
  mapId,
}) {
  const { setMapInfo, setIsShowModalRobotAvailable, setShowRosMonitor } =
    React.useContext(RosContext);
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={`${configs.DOMAIN_SERVER}/${image_src}`}
        title={title || "default map"}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {map_description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={async () => {
            try {
              const response = await getConfigMap(fileConfig);

              if (!response.data.success) {
                throw new Error("Something is wrong");
              }
              const mapConfig = response.data.mapConfig;

              ShowToastMessage({
                title: "loadMap",
                message: "Load map info successfully",
                type: "success",
              });

              const newMapInfo = {};
              newMapInfo.currentMapId = mapId;
              newMapInfo.mapConfig = mapConfig;
              newMapInfo.imageMapSource = `${configs.DOMAIN_SERVER}/${image_src}`;
              setMapInfo(newMapInfo);

              await setIsShowModalRobotAvailable(true);
              setShowRosMonitor(2);
            } catch (error) {
              console.log(error.message);
            }
          }}
        >
          LOAD
        </Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
