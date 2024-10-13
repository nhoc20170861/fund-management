import React, { useEffect, useContext } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { ShowToastMessage } from "utils/ShowToastMessage";
import ROSLIB from "roslib";
import ROS2D from "../library/ros2d";
import * as createjs from "createjs-module";
import { sha512 } from "js-sha512";
import socket from "../../../../socket";
import { RosContext } from "../index";
import { TargetPointListOrigin, HomePointList } from "../index";
import { getCurrentPose } from "network/ApiAxios";

var prev_scale = 1;
var current_scale = 0;
var offsetScale = 102;
var mouseDown = false;
var zoomKey = false;
var panKey = false;
let scale = 1;
const scaleDim = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};
const shift = {
  x: 0,
  y: 0,
  xSum: 0,
  ySum: 0,
  doShift: false,
};
var currentPose = {};
const getRosQuaternionToGlobalTheta = function (orientation) {
  // See https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Rotation_matrices
  // here we use [x y z] = R * [1 0 0]
  let q0 = orientation.w;
  let q1 = orientation.x;
  let q2 = orientation.y;
  let q3 = orientation.z;
  // Canvas rotation is clock wise and in degrees
  return -Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3));
};

function RosMonitor(props) {
  const { allTargetPointList, mapInfo, setShowRosMonitor } =
    React.useContext(RosContext);
  const [viewer, setViewer] = React.useState(
    () =>
      new ROS2D.Viewer({
        divID: "robot_nav2d",
        width: "100%",
        height: "100%",
        context2dOptions: { willReadFrequently: true },
      })
  );

  // const [gridClient, setGridClient] = React.useState(
  //   () =>
  //     new ROS2D.OccupancyGridClient({
  //       ros: ros,
  //       rootObject: viewer.scene,
  //       continuous: true,
  //     })
  // );

  const [imageMapClient, setImageMapClient] = React.useState(
    () =>
      new ROS2D.ImageMapClient({
        rootObject: viewer.scene,
        image: mapInfo.imageMapSource,
        mapConfig: mapInfo.mapConfig,
      })
  );

  const robotConfigs = JSON.parse(
    JSON.stringify(useContext(RosContext).robotConfigs)
  );

  function initMouseEvent() {
    const newTargetPoint = new ROS2D.TargetPoint({
      pointSize: 0.2,
      scale: scale,
    });
    viewer.scene.addChild(newTargetPoint);

    //Add panning to the viewer.
    var panView = new ROS2D.PanView({
      rootObject: viewer.scene,
    });
    // Add zoom to the viewer.
    var zoomView = new ROS2D.ZoomView({
      rootObject: viewer.scene,
    });

    /**
     * Register mouse event handler
     */
    function registerMouseHandlers() {
      // Setup mouse event handlers

      var startPos = new ROSLIB.Vector3();
      viewer.scene.addEventListener("stagemousedown", function (event) {
        event.preventDefault();
        if (event.nativeEvent.ctrlKey === true) {
          zoomKey = true;
          zoomView.startZoom(event.stageX, event.stageY);
        } else if (event.nativeEvent.altKey === true) {
          panKey = true;
          panView.startPan(event.stageX, event.stageY);
        } else if (event.nativeEvent.shiftKey === true) {
          let pos = viewer.scene.globalToRos(event.stageX, event.stageY);

          newTargetPoint.startGoalSelection(pos);
        }
        startPos.x = event.stageX;
        startPos.y = event.stageY;
        mouseDown = true;
      });

      viewer.scene.addEventListener("stagemousemove", function (event) {
        if (mouseDown === true) {
          if (zoomKey === true) {
            var dy = event.stageY - startPos.y;
            var zoom =
              1 + (10 * Math.abs(dy)) / viewer.scene.canvas.clientHeight;
            if (dy < 0) zoom = 1 / zoom;
            zoomView.zoom(zoom);
          } else if (panKey === true) {
            shift.x = event.stageX;
            shift.y = event.stageY;
            panView.pan(event.stageX, event.stageY);
          } else if (event.nativeEvent.shiftKey === true) {
            let pos = viewer.scene.globalToRos(event.stageX, event.stageY);
            newTargetPoint.orientGoalSelection(pos);
          }
        }
      });

      viewer.scene.addEventListener("stagemouseup", function (event) {
        if (mouseDown === true) {
          if (zoomKey === true) {
            zoomKey = false;
          } else if (panKey === true) {
            panKey = false;
          } else if (event.nativeEvent.shiftKey === true) {
            const { goalPose, RosPose } = newTargetPoint.endGoalSelection();

            console.log("🚀 ~ file: RosMonitor.js:202 ~ goalPose:", RosPose);

            props.setTargetPoint({
              x: goalPose.x,
              y: -goalPose.y,
              theta: goalPose.Orientation,
            });
          }
          mouseDown = false;
        }
      });
    }
    registerMouseHandlers();

    // // Scale the canvas to fit to the map
    // gridClient.on("change", function () {
    //   scaleDim.width = gridClient.currentGrid.width;
    //   scaleDim.height =
    //     (gridClient.currentGrid.width / window.innerWidth) * window.innerHeight;
    //   scaleDim.x = gridClient.currentGrid.pose.position.x;
    //   scaleDim.y =
    //     (scaleDim.height / gridClient.currentGrid.width) *
    //     gridClient.currentGrid.pose.position.y;

    //   viewer.scaleToDimensions(scaleDim.width, scaleDim.height);
    //   viewer.shift(scaleDim.x, scaleDim.y);

    //   shift.xSum = 0;
    //   shift.ySum = 0;
    //   shift.doShift = false;

    //   registerMouseHandlers();
    // });
  }

  useEffect(() => {
    imageMapClient.on("change", function () {
      ShowToastMessage({
        title: "imageClientOnChange",
        message: "robot visual start",
        type: "success",
      });
      //scaleDim.width = imageMapClient.currentImage.width;
      // scaleDim.height = imageMapClient.currentImage.height;
      const robot_nav2d = document.getElementById("robot_nav2d");
      scaleDim.width = imageMapClient.currentImage.width;
      scaleDim.height =
        (imageMapClient.currentImage.width / robot_nav2d.offsetWidth) *
        robot_nav2d.offsetHeight;

      scaleDim.x = imageMapClient.currentImage.pose.position.x;
      // scaleDim.y = imageMapClient.currentImage.y
      scaleDim.y =
        (scaleDim.height / scaleDim.width) *
        imageMapClient.currentImage.pose.position.y;

      viewer.scaleToDimensions(scaleDim.width, scaleDim.height);

      viewer.shift(scaleDim.x, scaleDim.y);

      shift.xSum = 0;
      shift.ySum = 0;
      shift.doShift = false;

      console.log("🚀 ~ file: RosMonitor.js:220 ~ change: imageMapClient");
      scale = scaleDim.width / offsetScale;
      // Show target point to map
      const targetPoint = new ROS2D.TargetPoint({
        pointSize: 0.4,
        textSize: 0.8,
        scale,
      });
      Object.keys(allTargetPointList)
        .filter((key) => {
          return !key.includes("home");
        })
        .map((objKey, index) =>
          targetPoint.addPoint({
            x: allTargetPointList[objKey].position.x,
            y: -allTargetPointList[objKey].position.y,
            pointName: objKey,
          })
        );
      viewer.scene.addChild(targetPoint);

      Object.keys(currentPose).forEach((key) => {
        imageMapClient.rootObject.addChild(robotConfigs[key].model);

        // =====reate path view =========
        robotConfigs[key]["pathTopic"] =
          "/move_base_node/DWBLocalPlanner/global_plan";
        // robotConfigs[key]["pathTopic"] =
        // "/move_base_node/SBPLLatticePlanner/plan";
        //robotConfigs[key]["pathTopic"] = "/move_base/NavfnROS/plan";
        robotConfigs[key]["pathView"] = new ROS2D.PathShape({
          scale: scaleDim.width / offsetScale,
          strokeSize: 0.11,
          strokeColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
        });

        imageMapClient.rootObject.addChild(robotConfigs[key]["pathView"]);

        initMouseEvent();
      });
    });

    // Object.keys(allTargetPointList).map((objKey, index) => {
    //   const goalPoint = new ROS2D.GoalPoint({
    //     pointName: objKey,
    //   });
    //   goalPoint.setPos(allTargetPointList[objKey]);
    //   imageMapClient.rootObject.addChild(goalPoint);
    // });

    // const homePoint = new ROS2D.TargetPoint({
    //   pointSize: 0.5,
    //   pointColor: "#BC8864",
    // });

    // Object.keys(HomePointList).map((objKey, index) =>
    //   homePoint.addPoint({
    //     x: HomePointList[objKey].position.x,
    //     y: -HomePointList[objKey].position.y,
    //     pointName: objKey,
    //   })
    // );
    // viewer.scene.addChild(homePoint);

    const handleWheelEvent = (event) => {
      let startZoom = false;

      if (event.altKey === true) {
        event.preventDefault();
        event.stopPropagation();
        startZoom = true;
      }
      if (startZoom && event.wheelDeltaY) {
        current_scale =
          event.wheelDeltaY > 0 ? prev_scale * 1.05 : prev_scale / 1.05;
        prev_scale = current_scale;

        viewer.scaleToDimensions(
          scaleDim.width / current_scale,
          scaleDim.height / current_scale
        );

        viewer.shift(
          (scaleDim.x + shift.xSum) / current_scale,
          (scaleDim.y + shift.ySum) / current_scale
        );
      }
    };

    // add handleWheelEvent
    const canvasMap = document.getElementById("canvas-map");
    if (canvasMap) {
      canvasMap.addEventListener("wheel", handleWheelEvent);
    }

    return () => {
      const eventWheel = document.getElementById("canvas-map");

      if (eventWheel) eventWheel.removeEventListener("wheel", handleWheelEvent);
    };
  }, []);

  useEffect(() => {
    const fetchCurrenPose = async () => {
      try {
        const response = await getCurrentPose();

        const { data } = response;
        console.log("🚀    ~ data:", data);
        if (!data.success) {
          return;
        }

        currentPose = data.currentPose;
        Object.keys(currentPose).forEach((key) => {
          robotConfigs[key].model = "";
          robotConfigs[key].namespace =
            robotConfigs[key].robotName !== ""
              ? "/" + robotConfigs[key].robotName
              : "";
          robotConfigs[key].fillColor =
            "#" + Math.floor(Math.random() * 16777215).toString(16);
          robotConfigs[key]["model"] = new ROS2D.RobotModel({
            scale: scaleDim.width / offsetScale,
            // strokeColor: createjs.Graphics.getRGB(255, 0, 0),
            strokeSize: 0.1,
            width: 1.1,
            height: 0.7,
            fillColor: robotConfigs[key].fillColor,
            robotName: robotConfigs[key].robotName,
          });
          robotConfigs[key]["model"].setPos(currentPose[key]);
        });
      } catch (error) {
        console.log("🚀 ~ fetchCurrentPOse ~ error:", error);
      }
    };

    fetchCurrenPose();
    // connect to websocket
    function onConnect() {
      console.log("🚀 ~ file: index.js:87 ~ onConnect ~ onConnect:");
      props.setIsSocketConnected(true);
    }

    function onDisconnect() {
      props.setIsSocketConnected(false);
    }

    function onEventCurrentPose(response) {
      console.log("🚀 ~ file: ~ response:", response);
      const robotId = response.robotId;
      if (robotId) {
        const pose = response.currentPose[robotId];
        if (pose.position) robotConfigs[robotId]["model"].setPos(pose);
      }
    }

    function onEventPathGlobalTopic(response) {
      const robotId = response.robotId;
      if (robotId) {
        const pose = response.pathGlobal[robotId];
        robotConfigs[robotId]["pathView"].setPath(pose);
      }
    }
    socket.connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(`currentPose`, onEventCurrentPose);
    socket.on(`pathGlobalTopic`, onEventPathGlobalTopic);
    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(`currentPose`, onEventCurrentPose);
      socket.off(`pathGlobalTopic`, onEventPathGlobalTopic);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
      }}
    >
      <IconButton
        color="secondary"
        aria-label="show ros monit or"
        onClick={() => {
          setShowRosMonitor(2);
        }}
        className="button__background"
      >
        <ArrowBackIcon></ArrowBackIcon>
      </IconButton>
    </div>
  );
}

export default RosMonitor;
