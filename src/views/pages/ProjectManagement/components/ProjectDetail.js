import React, { useEffect, useState } from "react";

// dayjs
import dayjs from "dayjs";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Container,
} from "reactstrap";

// Mui meterial
import {
  IconButton,
  Box,
  CardMedia,
  Avatar,
  Typography,
  Card as MuiCard,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

// React sclick
import Slider from "react-slick"; // Thêm thư viện Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// core components
import Dashboard from "./DashBoard";

import { getOneProjectDetail } from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";
import { formatAmountVND } from "utils/functions";
import ReceiverList from "./ReceiverList";

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledBox = styled(Box)({
  backgroundColor: "#f9f9f9", // Light background to make it stand out
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
});

const ProjectDetail = (props) => {
  const [projectInfo, setProjectInfo] = useState({});
  const [isProjectEnded, setIsProjectEnded] = useState(false);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    setProgress(() => {
      const previousProgress =
        (projectInfo?.current_fund / projectInfo?.fund_raise_total) * 100;
      return !isNaN(previousProgress) ? previousProgress : 0;
    });
  }, [projectInfo]);

  useEffect(() => {
    const fetchOneProjectForThisUser = async () => {
      try {
        const response = await getOneProjectDetail(props.projectId);

        const { data } = response;
        console.log("🚀 ~ fetchOneProjectForThisUser ~ data:", data);
        if (data.statusCode !== 200) {
          ShowToastMessage({
            title: "fetchOneProjectForThisUser",
            message: "Cập nhập dữ liệu thất bại",
            type: "error",
          });
          return;
        }
        ShowToastMessage({
          title: "fetchOneProjectForThisUser",
          message: "Lấy dữ liệu dự án thành công",
          type: "success",
        });
        setProjectInfo(data.body);
        setIsProjectEnded(dayjs(data.body?.deadline).isBefore(dayjs()));
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchOneProjectForThisUser ~ error:",
          error
        );
      }
    };

    fetchOneProjectForThisUser();
  }, []);

  let sliderRef = React.useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };
  // Cấu hình cho carousel
  const settings = {
    dots: true,
    infinite:
      projectInfo?.linkcardImage && projectInfo?.linkcardImage.length > 1,
    speed: 500,
    slidesToShow: 1, // Hiển thị 1 ảnh mỗi lần
    slidesToScroll: 1,

    lazyLoad: true,
    appendDots: (dots) => (
      <div
        style={{
          textAlign: "center",
          zIndex: "10",
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          position: "absolute",
          bottom: "-32px",
        }}
      >
        <IconButton className="button" onClick={previous}>
          <ArrowBackIosIcon />
        </IconButton>

        <ul style={{ margin: "0px", padding: "0px" }}> {dots} </ul>
        <IconButton className="button" onClick={next}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    ),
  };

  return (
    <>
      {/* Page content */}

      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-1" xl="12">
            <Button onClick={props.onBackClick}>
              Quay lại{" "}
              <span>
                <i className="ni ni-user-run" style={{ color: "red" }}></i>
              </span>
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Container
              style={{
                backgroundColor: "#fff",
                paddingBottom: "2rem",
                paddingTop: "0.5rem",
                borderRadius: "5px",
                marginBottom: "3px",
              }}
              fluid
            >
              <Row>
                <>
                  {/* Bên trái: Carousel ảnh chiếm 1/2 */}
                  <Col style={{ height: "fit-content" }} xl="6">
                    <Slider
                      {...settings}
                      ref={(slider) => {
                        sliderRef = slider;
                      }}
                    >
                      {projectInfo?.linkcardImage &&
                        projectInfo?.linkcardImage.length > 0 &&
                        projectInfo?.linkcardImage.map((src, index) => (
                          <CardMedia
                            key={index}
                            component="img"
                            image={src}
                            alt={`Image ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "327px",
                              borderRadius: 2,
                              objectFit: "cover",
                            }}
                          />
                        ))}
                    </Slider>
                  </Col>

                  {/* Bên phải: UI control chiếm 1/2 */}
                  <Col style={{ paddingLeft: 2 }} xl="6">
                    <StyledBox
                      sx={{
                        width: "100%",
                        margin: "auto",
                        padding: 3,
                        paddingBottom: 0,
                        minHeight: "20.5rem",
                      }}
                    >
                      {/* Nhóm 1 */}
                      <Typography
                        variant="h5"
                        gutterBottom
                        mb={2}
                        sx={{ fontWeight: "bold" }}
                      >
                        {projectInfo?.name}
                      </Typography>

                      <Grid
                        container
                        spacing={2}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Avatar and Fund Name */}
                        <Grid
                          item
                          xs={8}
                          container
                          alignItems="center"
                          space={0}
                        >
                          <Avatar
                            alt="Quỹ"
                            src={
                              projectInfo?.logo ||
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s"
                            }
                            sx={{
                              width: 40,
                              height: 40,
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h7"
                              sx={{
                                wordWrap: "break-word",
                                textWrap: "pretty",
                                fontWeight: "600",
                                lineHeight: "1.2", // Adjust line height for readability
                              }}
                            >
                              {projectInfo?.fund_name ?? "Tổ Chức Gây Quỹ"}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Number of Supporters */}
                        <Grid
                          item
                          xs={4}
                          display="flex"
                          justifyContent="flex-end"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "500" }}
                          >
                            {`${
                              projectInfo?.fund_raise_count || 1
                            } lượt ủng hộ`}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Nhóm 2: Progress Bar and Donation Details */}
                      <ProgressContainer>
                        {/* Target Amount */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "5px",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500" }}
                          >
                            Số tiền mục tiêu:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500" }}
                          >
                            {`${formatAmountVND(
                              projectInfo?.fund_raise_total ?? "0"
                            )} VND`}
                          </Typography>
                        </Box>

                        {/* Progress Bar */}
                        <LinearProgress
                          variant="determinate"
                          value={progress || 0}
                          sx={{
                            height: "12px",
                            borderRadius: "5px",
                            marginBottom: "10px",
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "5px",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500" }}
                          >
                            Đã nhận quyên góp:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500" }}
                          >
                            {`${formatAmountVND(
                              projectInfo?.current_fund ?? "0"
                            )} VND`}
                          </Typography>
                        </Box>

                        {/* Amount Raised */}

                        {/* Fundraising Deadline */}
                        <Typography
                          variant="body1"
                          sx={{
                            mt: 1,
                            fontWeight: "500",
                            color: isProjectEnded ? "red" : "inherit",
                          }}
                        >
                          {isProjectEnded
                            ? "Dự án đã kết thúc!"
                            : `Ngày kết thúc: ${dayjs(
                                projectInfo?.deadline
                              ).format("DD/MM/YYYY")}`}
                        </Typography>
                      </ProgressContainer>

                      {/* Nhóm 3: Donation Button */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "1rem",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "500", color: "green" }}
                        >
                          Danh sách người nhận:
                        </Typography>
                        <div
                          style={{
                            marginTop: "1rem",
                            display: "flex",
                            direction: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <ReceiverList
                            receivers={projectInfo?.receivers || []}
                          />
                        </div>
                      </Box>
                    </StyledBox>
                  </Col>
                </>
              </Row>
            </Container>
          </Col>
        </Row>
        {/* <Row>
          <Col className="order-xl-1  mb-5 mb-xl-0">
            <Card>
              <CardHeader className="text-center border-0 pt-8 pt-md-2 pb-0 pb-md-4"></CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Container fluid>
    
                  <Row>
                    <Col className="order-lg-2" lg="3">
                      <div className="card-profile-image">
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          <img
                            alt="..."
                            className="rounded-circle"
                            src="https://www.hmi-mbs.fr/wp-content/uploads/2020/08/mir100.png"
                          />
                        </a>
                      </div>
                    </Col>
                    <Col md="6">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Traffic
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                350,897
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                <i className="fas fa-chart-bar" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-success mr-2">
                              <i className="fa fa-arrow-up" /> 3.48%
                            </span>{" "}
                            <span className="text-nowrap">
                              Since last month
                            </span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                New users
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                2,356
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                <i className="fas fa-chart-pie" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-danger mr-2">
                              <i className="fas fa-arrow-down" /> 3.48%
                            </span>{" "}
                            <span className="text-nowrap">Since last week</span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md="6">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Sales
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                924
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                <i className="fas fa-users" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-warning mr-2">
                              <i className="fas fa-arrow-down" /> 1.10%
                            </span>{" "}
                            <span className="text-nowrap">Since yesterday</span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Performance
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                49,65%
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                <i className="fas fa-percent" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-success mr-2">
                              <i className="fas fa-arrow-up" /> 12%
                            </span>{" "}
                            <span className="text-nowrap">
                              Since last month
                            </span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </CardBody>
            </Card>
          </Col>
          </Row> */}

        <Dashboard walletAddress={projectInfo.wallet_address} />
      </Container>
    </>
  );
};
export default ProjectDetail;
