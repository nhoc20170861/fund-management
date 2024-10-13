import React, { useState, useContext, useEffect } from "react";
// reactstrap components
import {
  Button,
  Modal,
  Row,
  Col,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { ShowToastMessage } from "utils/ShowToastMessage";
import Checkbox from "@mui/material/Checkbox";
import configs from "configs";
import { getConfigMap, getAllTargetPoint } from "network/ApiAxios";
import { RosContext } from "../index";
const RobotAvailable = (props) => {
  const {
    robotConfigs,
    setRobotConfigs,
    isShowModalRobotAvailable,
    setIsShowModalRobotAvailable,
    showRosMonitor,
    setShowRosMonitor,
    mapInfo,
    setAllTargetPointList,
  } = useContext(RosContext);
  useEffect(() => {
    console.log(
      "🚀 ~ file: ConfigRobot.js:19 ~ ConfigRobot ~ robotConfigs:",
      robotConfigs
    );
  }, [robotConfigs]);

  const handleRobotNameChange = (e, key) => {
    const { name, value } = e.target;
    const newRobotConfigs = { ...robotConfigs };
    newRobotConfigs[key].robotName = value;

    setRobotConfigs(newRobotConfigs);
  };

  const handleRobotNameRemove = (index) => {
    const list = [...robotConfigs];
    list.splice(index, 1);
    setRobotConfigs(list);
  };

  const handleRobotAdd = () => {
    setRobotConfigs([...robotConfigs, { robotName: "", robotStatus: "" }]);
  };

  const handleBtnClick = async () => {
    try {
      const response2 = await getAllTargetPoint(mapInfo.currentMapId);
      if (!response2.data.success) {
        throw new Error("getAllTargetPoint is wrong");
      }
      const GoalPoseArray = response2.data.GoalPoseArray;

      await setAllTargetPointList({ ...GoalPoseArray });
      await setIsShowModalRobotAvailable(true);
      setShowRosMonitor(2);
    } catch (error) {
      console.log(error.message);
    }
    setIsShowModalRobotAvailable(false);

    if (showRosMonitor === 2 || showRosMonitor === 0) setShowRosMonitor(1);
    // ShowToastMessage({
    //   title: "saveConfigRobot",
    //   message: "Save Config Robot successfully",
    //   type: "info",
    // });
  };
  return (
    <Modal
      className="modal-dialog-centered"
      size="md"
      isOpen={isShowModalRobotAvailable}
      toggle={() => {
        setIsShowModalRobotAvailable(false);
      }}
    >
      <div
        className="pb-2 modal-header"
        style={{
          borderBottom: "2px solid #e0a9a98a ",
        }}
      >
        <h2 className="modal-title" id="exampleModalLabel">
          Robots Availabe
        </h2>
        <button
          aria-label="Close"
          className="close"
          data-dismiss="modal"
          type="button"
          onClick={() => setIsShowModalRobotAvailable(false)}
        >
          <span aria-hidden={true}>×</span>
        </button>
      </div>
      <ModalBody className="pt-2 mt-2">
        <Col>
          {Object.keys(robotConfigs).length === 0 ? (
            <Row className="mb-3">All Robots are not availabe</Row>
          ) : (
            Object.keys(robotConfigs).map((key, index) => (
              <>
                <Row className="mb-3" key={index}>
                  <Col className="col-md-9">
                    <TextField
                      fullWidth
                      key={index}
                      value={robotConfigs[key].robotName ?? ""}
                      // defaultValue={"tb3_" + index}
                      id={"robot_" + index}
                      name="robotName"
                      label="robotName"
                      variant="outlined"
                      onChange={(e) => handleRobotNameChange(e, key)}
                    />
                  </Col>
                  <Col className="col-md-3">
                    <span>
                      <Checkbox
                        checked={robotConfigs[key].isConnected}
                        // defaultChecked
                        size="small"
                      />{" "}
                      {robotConfigs[key].isConnected
                        ? "Connected"
                        : " Disconnected"}
                    </span>
                  </Col>

                  {/* {robotConfigs.length !== 1 && (
                  <IconButton
                    color="secondary"
                    aria-label="show ros monitor"
                    onClick={()=>handleRobotNameRemove(index)}
                  >
                    <DeleteIcon></DeleteIcon>
                  </IconButton>
                )} */}
                </Row>

                {Object.keys(robotConfigs).length - 1 === index && (
                  <Row className="pl-3">
                    {/* <Button
                    variant="contained"
                    // endIcon={<SendIcon />}
                    onClick={handleRobotAdd}
                  >
                    Add Robot
                  </Button> */}
                    <Button
                      variant="contained"
                      // endIcon={<SendIcon />}
                      color="success"
                      onClick={handleBtnClick}
                    >
                      Start Visual
                    </Button>
                  </Row>
                )}
              </>
            ))
          )}
        </Col>
      </ModalBody>
    </Modal>
  );
};
export default RobotAvailable;
