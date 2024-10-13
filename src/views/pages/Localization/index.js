/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import {
  writeStorage,
  deleteFromStorage,
  useLocalStorage,
} from "@rehooks/local-storage";

import React, { useState, createContext, useContext, useEffect } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Col,
  Row,
  Button,
} from "reactstrap";

// hook component

// core components
import HeaderCustom from "components/Headers/HeaderCustom.js";
import CreateNewPoint from "./components/CreateNewPoint";
import { IconButton } from "@mui/material";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
// RosMonitor component
import RosMonitor from "./components/RosMonitor";
import RobotAvailable from "./components/RobotAvailable";
import MapDisplayCard from "./components/MapDisplayCard";
import CircularProgress from "@mui/material/CircularProgress";
import { ShowToastMessage } from "utils/ShowToastMessage";
// import network
import { getRobotConfigs, getMapList } from "../../../network/ApiAxios";

export const RosContext = createContext("RosHandle");

const Localization = () => {
  const [showFormCreatePoint, setShowFormCreatePoint] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [targetPoint, setTargetPoint] = useState({});

  const [showRosMonitor, setShowRosMonitor] = useState(0);

  const [isShowModalRobotAvailable, setIsShowModalRobotAvailable] =
    useState(false);

  const [robotConfigs, setRobotConfigs] = useLocalStorage("robotConfig", {});

  const [mapInfo, setMapInfo] = useLocalStorage("mapInfo", {
    currentMapId: 1,
    imageMapSource: "",
    mapConfig: {},
  });

  const [mapList, setMapList] = useLocalStorage("mapList", []);
  const [allTargetPointList, setAllTargetPointList] = useLocalStorage(
    "allTargetPointList",
    {}
  );

  useEffect(() => {
    const fetchRobotConfigs = async () => {
      try {
        const response = await getRobotConfigs();

        const { data } = response;
        console.log("🚀 ~ fetchRobotConfigs ~ data:", data);
        setRobotConfigs(data.robotConfigs);
        if (!data.success) {
          console.error(data.message);
          return;
        }
        // ShowToastMessage({
        //   title: "fetch dat robotConfig",
        //   message: data.message,
        //   type: "success",
        // });
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchAllTaskQueue ~ error:",
          error
        );
      }
    };

    const fetchMapList = async () => {
      try {
        const response = await getMapList();

        const { data } = response;
        console.log("🚀 ~ fetchMapList ~ data:", data);
        setMapList(data.mapList);
        if (!data.success) {
          ShowToastMessage({
            title: "fetchMapList",
            message: "Can not get map list",
            type: "error",
          });
          return;
        }
        ShowToastMessage({
          title: "fetchMapList",
          message: data.message,
          type: "success",
        });
      } catch (error) {
        console.log("🚀 ~ file: index.js:223 ~ fetchMapList ~ error:", error);
      }
    };

    //if (Object.keys(robotConfigs).length < 1) {
    fetchRobotConfigs();
    //}

    if (Object.keys(mapList).length < 1) {
      fetchMapList();
    }
  }, []);
  /*
  // connect to ros
  useEffect(() => {
    RosHandle.on("error", function (error) {
      console.log(error);
      setIsRosConnect(error);
    });

    // Find out exactly when we made a connection.
    RosHandle.on("connection", function () {
      console.log("Connected!");
      setIsRosConnect("Connected!");

      // subscribe();
    });

    RosHandle.on("close", function () {
      console.log("Connection closed");
      setIsRosConnect("Connection closed");
      if (!timeIntervelReconnectRos) {
        timeIntervelReconnectRos = setInterval(() => {
          // RosHandle.connect("ws://0.0.0.0:9090");
          RosHandle.connect(ROS_SERVER);
        }, 10000);
      }
    });

    RosHandle.connect(ROS_SERVER);
    return () => {
      RosHandle.close();
      clearInterval(timeIntervelReconnectRos);
    };
  }, []);
  */

  useEffect(() => {
    try {
      if (showRosMonitor === 2) {
        const robot_nav2d = document.getElementById("robot_nav2d");
        const canvas = document.getElementById("canvas-map");
        if (canvas) {
          robot_nav2d.removeChild(canvas);
        }
      }
    } catch (error) {
      console(error.message);
    }
  }, [showRosMonitor]);

  return (
    <RosContext.Provider
      value={{
        robotConfigs,
        setRobotConfigs,
        allTargetPointList,
        mapInfo,
        setMapInfo,
        isShowModalRobotAvailable,
        setIsShowModalRobotAvailable,
        showRosMonitor,
        setShowRosMonitor,
        setAllTargetPointList,
      }}
    >
      <HeaderCustom />
      {robotConfigs && <RobotAvailable></RobotAvailable>}

      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">
                  {" "}
                  Create a new Target point{" "}
                  <Button
                    className="float-right pt-0 pb-0 pl-1 pr-1"
                    onClick={() => {
                      setShowFormCreatePoint(!showFormCreatePoint);
                    }}
                  >
                    {showFormCreatePoint ? (
                      <i className="ni ni-bold-up"></i>
                    ) : (
                      <i className="ni ni-bold-down"></i>
                    )}
                  </Button>
                </h3>
              </CardHeader>
              <CardBody>
                {showFormCreatePoint ? (
                  <CreateNewPoint targetPoint={targetPoint} mapList={mapList} />
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <div className="col">
            <Card className="shadow">
              {" "}
              <CardHeader className="bg-transparent">
                <div
                  className="row"
                  style={{
                    padding: "0rem 1.5rem",
                    alignItems: "center",
                  }}
                >
                  <h3 className="mb-0">Localization Monitor</h3>

                  <IconButton color="secondary" aria-label="Config Montitor">
                    <SettingsSuggestIcon />
                  </IconButton>

                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {isSocketConnected && (
                      <h4 className="text-green mb-0">Socket connected</h4>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {showRosMonitor !== 1 ? (
                  <Row className="">
                    {mapList.length > 0 &&
                      mapList.map((map) => {
                        return (
                          <Col>
                            <MapDisplayCard
                              title={map.mapName}
                              image_src={map.mapImageSrc}
                              fileConfig={map.mapConfigSrc}
                              mapId={map.id}
                            />
                          </Col>
                        );
                      })}
                  </Row>
                ) : null}

                <div id="robot_nav2d" style={{ position: "relative" }}>
                  {showRosMonitor === 0 ? null : showRosMonitor === 1 ? (
                    <RosMonitor
                      setTargetPoint={setTargetPoint}
                      setIsSocketConnected={setIsSocketConnected}
                    />
                  ) : (
                    <CircularProgress />
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </RosContext.Provider>
  );
};

export default Localization;
// export function useRos() {
//   const ros = useContext(RosContext).RosHandle;
//   try {
//     if (ros === undefined) {
//       throw new Error("rosreact components must be wrapped by a RosProvider");
//     }
//   } catch (error) {
//     console.error(error);
//   }

//   return ros;
// }

export const TargetPointListOrigin = {
  point_1: {
    position: {
      x: -4.06,
      y: 3.5,
      z: 0,
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
  },
  point_2: {
    position: {
      x: -4.048,
      y: 1.09,
      z: 0,
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
  },
  point_3: {
    position: {
      x: 0.47,
      y: 0.32,
      z: 0,
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
  },
  point_4: {
    position: {
      x: 4.63,
      y: 3.7,
      z: 0,
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
  },
  point_5: {
    position: {
      x: 4.55,
      y: 0.74,
      z: 0,
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
  },
};

export const HomePointList = {
  home_0: {
    position: {
      x: -6.62,
      y: 4.0,
      z: 0,
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
  },
  home_1: {
    position: {
      x: -6.62,
      y: 3.25,
      z: 0,
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
  },
  home_2: {
    position: {
      x: -6.62,
      y: 2.5,
      z: 0,
    },
    orientation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
  },
};
