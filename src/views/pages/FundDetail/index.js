import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Card,
  CardMedia,
  Avatar,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { pink } from "@mui/material/colors";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { useLocalStorage } from "@rehooks/local-storage";

import ReactMarkdown from "react-markdown";
import Slider from "react-slick"; // Thêm thư viện Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DonationModal from "./components/DonationModal";
import SupportersList from "./components/SupportersList";
import ReceiverList from "./components/ReceiverList";
import { getOneProjectDetail } from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";
import { formatAmountVND } from "utils/functions";

import configs from "configs";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  padding: theme.spacing(2),
  height: 400, // Đặt chiều cao cố định cho card
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledBox = styled(Box)({
  backgroundColor: "#f9f9f9", // Light background to make it stand out
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
});

const FundDetail = () => {
  const [open, setOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projectDetail, setProjectDetail] = useState({}); // Địa chỉ ví người nhận
  const [isProjectEnded, setIsProjectEnded] = useState(false);
  const [exchangeRate, setExchangeRate] = useLocalStorage(
    "exchangeRateAlgoToVND",
    0
  ); // To store ALGO to VND exchange rate

  const [progress, setProgress] = React.useState(() => {
    const previousProgress =
      (projectDetail?.current_fund / projectDetail?.fund_raise_total) * 100;
    return !isNaN(previousProgress) ? previousProgress : 0;
  });
  useEffect(
    () =>
      setProgress(
        (projectDetail?.current_fund / projectDetail?.fund_raise_total) * 100
      ),
    [projectDetail?.current_fund, projectDetail?.fund_raise_total]
  );
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { prjectName, projectId } = useParams(); // Lấy fundName từ URL

  useEffect(() => {
    const fetchOneProjectDetail = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        // await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
        const response = await getOneProjectDetail(projectId);

        const { data } = response;
        console.log("🚀 ~ fetchOneProjectDetail ~ data:", data);
        if (data.statusCode === 200 && data?.body?.id) {
          setProjectDetail(data.body || {});
          setIsProjectEnded(dayjs(data.body?.deadline).isBefore(dayjs()));

          // ShowToastMessage({
          //   title: "Get data",
          //   message: "Lấy dữ liệu thành công",
          //   type: "success",
          // });
        } else {
          ShowToastMessage({
            title: "Get data",
            message: "Lấy dữ liệu thất bại",
            type: "error",
          });
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchOneProjectDetail ~ error:",
          error
        );
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    const fetchExchangeRateAlgoToVND = async () => {
      try {
        const response = await fetch(configs.api_convert_Algo_to_VND);
        const data = await response.json();
        console.log(
          "🚀 ~ fetchExchangeRateAlgoToVND ~ data.algorand.vnd:",
          data.algorand.vnd
        );
        setExchangeRate(data.algorand.vnd); // Lưu tỷ giá vào state
      } catch (error) {
        console.error("Lỗi khi lấy tỷ giá:", error);
      }
    };

    fetchOneProjectDetail();
    fetchExchangeRateAlgoToVND();
  }, []);

  const handleOpenFormRaise = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const handleAnonymousChange = (e) => setAnonymous(e.target.checked);

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
      projectDetail?.linkcardImage && projectDetail?.linkcardImage.length > 1,
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
    <div
      style={{
        padding: "20px",
        width: "100%",
        position: "relative",
        gap: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StyledCard>
        {loading ? (
          <Typography variant="h5">Loading...</Typography>
        ) : (
          <>
            {/* Bên trái: Carousel ảnh chiếm 1/2 */}
            <Box sx={{ width: "50%", height: "fit-content" }}>
              <Slider
                {...settings}
                ref={(slider) => {
                  sliderRef = slider;
                }}
              >
                {projectDetail?.linkcardImage &&
                  projectDetail?.linkcardImage.length > 0 &&
                  projectDetail?.linkcardImage.map((src, index) => (
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
            </Box>

            {/* Bên phải: UI control chiếm 1/2 */}
            <Box sx={{ width: "50%", paddingLeft: 2 }}>
              <StyledBox sx={{ width: "100%", margin: "auto", padding: 3 }}>
                {/* Nhóm 1 */}
                <Typography
                  variant="h5"
                  gutterBottom
                  mb={2}
                  sx={{ fontWeight: "bold" }}
                >
                  {projectDetail?.name || prjectName}
                </Typography>

                <Grid
                  container
                  spacing={2}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  {/* Avatar and Fund Name */}
                  <Grid item xs={8} container alignItems="center" space={0}>
                    <Avatar
                      alt="Quỹ"
                      src={
                        projectDetail?.logo ||
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
                        {projectDetail?.fund_name ?? "Tổ Chức Gây Quỹ"}
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
                    <Typography variant="body2" sx={{ fontWeight: "500" }}>
                      {`${projectDetail?.fund_raise_count || 1} lượt ủng hộ`}
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
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      Số tiền mục tiêu:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {`${formatAmountVND(
                        projectDetail?.fund_raise_total ?? "0"
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
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      Đã nhận quyên góp:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {`${formatAmountVND(
                        projectDetail?.current_fund ?? "0"
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
                      : `Ngày kết thúc: ${dayjs(projectDetail?.deadline).format(
                          "DD/MM/YYYY"
                        )}`}
                  </Typography>
                </ProgressContainer>

                {/* Nhóm 3: Donation Button */}
                <Box sx={{ marginTop: 3, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenFormRaise}
                    sx={{ padding: "10px 20px" }}
                  >
                    Ủng Hộ
                  </Button>
                </Box>
              </StyledBox>
            </Box>
          </>
        )}
      </StyledCard>
      <Card style={{ padding: "20px 5px 5px 5px" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="fund tabs"
        >
          <Tab
            label={
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textTransform: "none",
                }}
              >
                Mô Tả
              </span>
            }
          />
          <Tab
            label={
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textTransform: "none",
                }}
              >
                Người Ủng Hộ
              </span>
            }
          />
          <Tab
            label={
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textTransform: "none",
                }}
              >
                Người nhận tiền
              </span>
            }
          />
        </Tabs>

        {loading ? (
          <Typography variant="h5">Loading...</Typography>
        ) : (
          <>
            {tabIndex === 0 && (
              <Box sx={{ display: "flex", marginTop: 2, padding: "5px" }}>
                <Box sx={{ width: "70%", paddingRight: 2 }}>
                  <Typography variant="body1">
                    {/* Chuyển đổi nội dung Markdown thành HTML */}
                    <ReactMarkdown
                      components={{
                        img: ({ node, ...props }) => (
                          // eslint-disable-next-line jsx-a11y/alt-text
                          <img
                            {...props}
                            style={{
                              maxWidth: "100%", // Đảm bảo ảnh không tràn ra ngoài
                              height: "auto", // Giữ tỷ lệ của ảnh
                            }}
                          />
                        ),
                      }}
                    >
                      {projectDetail?.description ?? "# No description"}
                    </ReactMarkdown>
                  </Typography>
                </Box>
                <Box sx={{ width: "30%" }}>
                  <Typography
                    variant="h5"
                    mb={2}
                    color="green"
                    sx={{ fontWeight: "bold", fontFamily: "Arial, sans-serif" }}
                  >
                    Thông tin quỹ
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      alt="Quỹ"
                      src={
                        projectDetail?.logo ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s"
                      }
                      sx={{ width: 56, height: 56, flexShrink: 0 }}
                    />
                    <Typography
                      variant="h6"
                      ml={2}
                      mb={2}
                      mt={2}
                      sx={{ wordWrap: "break-word" }}
                    >
                      {projectDetail?.fundName ?? "Tổ Chức Gây Quỹ"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    mt={1}
                    p={1}
                    sx={{ fontStyle: "italic", fontSize: "1rem" }}
                  >
                    “{projectDetail?.fund_description ?? "Mô tả thông tin quỹ"}”
                  </Typography>
                  <Typography variant="body2" mt={1} mb={2}>
                    <LocationOnIcon
                      color="secondary"
                      fontSize="small"
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                    />
                    {`Địa chỉ: ${
                      projectDetail?.fundAdress ?? "Địa chỉ Tổ chức quỹ"
                    }`}
                  </Typography>
                  <Typography variant="body2" mt={1} mb={2}>
                    <PhoneIcon
                      fontSize="small"
                      sx={{
                        color: pink[500],
                        verticalAlign: "middle",
                        mr: 0.5,
                      }}
                    />
                    {`Hotline: ${
                      projectDetail?.hotline ?? "Số điện thoại liên hệ"
                    }`}
                  </Typography>
                  <Typography variant="body2" mt={1} mb={2}>
                    <EmailIcon
                      fontSize="small"
                      sx={{
                        verticalAlign: "middle",
                        mr: 0.5,
                        color: "orange",
                      }}
                    />
                    {`Email: ${projectDetail?.email ?? "Email liên hệ"}`}
                  </Typography>
                </Box>
              </Box>
            )}
            {tabIndex === 1 && (
              <SupportersList
                exchangeRate={exchangeRate}
                walletAddress={projectDetail.wallet_address}
              />
            )}
            {tabIndex === 2 && (
              <ReceiverList
                exchangeRate={exchangeRate}
                walletAddress={projectDetail.wallet_address}
              />
            )}
          </>
        )}
      </Card>
      {/* Modal để nhập thông tin người dùng */}
      <DonationModal
        exchangeRate={exchangeRate}
        walletAddress={projectDetail.wallet_address}
        open={open}
        handleCloseModal={handleCloseModal}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        anonymous={anonymous}
        handleAnonymousChange={handleAnonymousChange}
        projectName={projectDetail?.name || "default"}
        projectId={projectId}
        setProjectDetail={setProjectDetail}
      />
    </div>
  );
};

export default FundDetail;
