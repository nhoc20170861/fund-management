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
import { useState, useEffect } from "react";
import { ShowToastMessage } from "utils/ShowToastMessage";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Media,
} from "reactstrap";
import { useNavigate, useLocation, Outlet, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
// core components
import HeaderCustom from "components/Headers/HeaderCustom.js";
// import network
import { getRobotConfigs } from "../../../network/ApiAxios";
import {
  writeStorage,
  deleteFromStorage,
  useLocalStorage,
} from "@rehooks/local-storage";

const StyledBadge = styled(Badge)(({ theme }) => {
  console.log("🚀 ~ file: index.js:41 ~ theme:", theme.palette);
  const style = {
    "& .MuiBadge-badge": {
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  };
  return style;
});

const ProejctManagement = () => {
  const [robotConfigs, setRobotConfigs] = useLocalStorage("robotConfig", {});
  const navigate = useNavigate();
  const location = useLocation();
  const { robotId } = useParams();

  // useEffect(() => {
  //   const fetchRobotConfigs = async () => {
  //     try {
  //       const response = await getRobotConfigs();

  //       const { data } = response;
  //       console.log("🚀 ~ fetchRobotConfigs ~ data:", data);
  //       setRobotConfigs(data.robotConfigs);
  //       if (!data.success) {
  //         ShowToastMessage({
  //           title: "fetchAllTaskQueue",
  //           message: "Can not get task queue",
  //           type: "error",
  //         });
  //         return;
  //       }
  //       ShowToastMessage({
  //         title: "fetch dat robotConfig",
  //         message: data.message,
  //         type: "success",
  //       });
  //     } catch (error) {
  //       console.log(
  //         "🚀 ~ file: index.js:223 ~ fetchAllTaskQueue ~ error:",
  //         error
  //       );
  //     }
  //   };
  //   fetchRobotConfigs();
  // }, []);

  const [isShowModal, setIsShowModal] = useState(false);

  const handleBtnClick = (key) => {
    const url = location.pathname + "/" + key;
    console.log("🚀 ~ file: index.js:107 ~ handleBtnClick ~ url:", url);
    navigate(url);

    setIsShowModal(!isShowModal);
  };
  return (
    <>
      <HeaderCustom />
      {/* Page content */}

      {!robotId ? (
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h3 className="mb-0">Robots List</h3>
                </CardHeader>
                <CardBody>
                  <Row className="icon-examples">
                    {Object.keys(robotConfigs).map((key, index) => {
                      return (
                        <Col lg="3" md="6">
                          <Button
                            fullwidth
                            className="custom-border-box"
                            type="button"
                            onClick={(e) => handleBtnClick(key)}
                          >
                            <Media className="align-items-center">
                              <StyledBadge
                                overlap="circular"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                                color={
                                  robotConfigs[key].isConnected
                                    ? "success"
                                    : "error"
                                }
                                variant="dot"
                              >
                                <Avatar
                                  alt={key}
                                  src="https://www.hmi-mbs.fr/wp-content/uploads/2020/08/mir100.png"
                                  sx={{ width: 50, height: 50 }}
                                />
                              </StyledBadge>
                              <Media className="pl-2 ml-2 d-none d-lg-block">
                                <span className="mb-0 text-sm font-weight-bold">
                                  {key}
                                </span>
                              </Media>
                            </Media>
                          </Button>
                        </Col>
                      );
                    })}
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      ) : (
        <Outlet></Outlet>
      )}
    </>
  );
};

export default ProejctManagement;
