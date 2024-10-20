import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import algosdk from "algosdk";
import DonationModal from "./components/DonationModal";
import {
  Box,
  Card,
  CardMedia,
  Avatar,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import Slider from "react-slick"; // Thêm thư viện Slider
import ReactMarkdown from "react-markdown";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SupportersList from "./components/SupportersList";
import { getOneProjectDetail } from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";
// Dữ liệu giả lập cho ví dụ

const fundDescription = `
# Quỹ Hỗ Trợ Cộng Đồng

Quỹ Hỗ Trợ Cộng Đồng được thành lập nhằm giúp đỡ những người có hoàn cảnh khó khăn trong xã hội. Chúng tôi cam kết mang đến sự hỗ trợ thiết thực và hiệu quả cho các đối tượng cần giúp đỡ.

## Mục Tiêu của Quỹ

- **Hỗ trợ tài chính**: Cung cấp quỹ cho những gia đình gặp khó khăn.
- **Giáo dục**: Tạo điều kiện cho trẻ em có hoàn cảnh khó khăn được đến trường.
- **Y tế**: Hỗ trợ chi phí khám chữa bệnh cho những người không có khả năng chi trả.

![Hình ảnh mô tả quỹ](https://givenow.vn/wp-content/uploads/2024/09/Luc-Ngan-Bac-Giang-Bao-Bac-Giang.jpg)

## Lợi Ích Khi Tham Gia Quỹ

Tham gia quỹ không chỉ giúp đỡ những người cần giúp mà còn mang lại cho bạn:

1. **Cảm giác thỏa mãn**: Bạn sẽ cảm thấy tự hào khi giúp đỡ cộng đồng.
2. **Mạng lưới kết nối**: Gặp gỡ những người có cùng mục tiêu và lý tưởng.
3. **Chứng nhận tham gia**: Nhận chứng nhận để công nhận những đóng góp của bạn.

## Liên Hệ

Nếu bạn có bất kỳ câu hỏi nào hoặc muốn tham gia cùng chúng tôi, vui lòng liên hệ:

- **Email**: support@fund.org
- **Số điện thoại**: 0123-456-789
- **Địa chỉ**: 123 Đường ABC, Thành phố XYZ
`;

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

const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}));

const CustomTablePagination = styled(TablePagination)({
  backgroundColor: "#f5f5f5",
  color: "black",
  fontWeight: "bold",
  fontSize: "16px",
  textAlign: "center",
  "& .MuiToolbar-root p": {
    margin: "0", // Loại bỏ margin-top của thẻ <p>
  },
});

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
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [tabIndex, setTabIndex] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [sender, setSender] = useState(""); // Địa chỉ ví người gửi
  const [receiver, setReceiver] = useState(""); // Địa chỉ ví người nhận
  const [loading, setLoading] = useState(true);
  const [projectDetail, setProjectDetail] = useState({}); // Địa chỉ ví người nhận
  const [isProjectEnded, setIsProjectEnded] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { prjectName, projectId } = useParams(); // Lấy fundName từ URL

  useEffect(() => {
    const fetchOneProjectDetail = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
        const response = await getOneProjectDetail(projectId);

        const { data } = response;
        console.log("🚀 ~ fetchOneProjectDetail ~ data:", data);
        if (data.statusCode === 200) {
          setProjectDetail(data.body || {});
          setIsProjectEnded(dayjs(data.body?.deadline).isBefore(dayjs()));

          ShowToastMessage({
            title: "Get data",
            message: "Lấy dữ liệu thành công",
            type: "success",
          });
        } else {
          ShowToastMessage({
            title: "Get data",
            message: "Lấy dữ liệu thất bại",
            type: "error",
          });
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchAllTaskQueue ~ error:",
          error
        );
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchOneProjectDetail();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDonationChange = (e) => setDonationAmount(e.target.value);
  const handleAnonymousChange = (e) => setAnonymous(e.target.checked);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) =>
    setRowsPerPage(parseInt(event.target.value, 10));
  const donationDataDaily = [
    { day: "2024-10-01", amount: 500 },
    { day: "2024-10-02", amount: 700 },
    { day: "2024-10-03", amount: 1500 },
    { day: "2024-10-04", amount: 900 },
    { day: "2024-10-05", amount: 1200 },
    { day: "2024-10-06", amount: 300 },
    { day: "2024-10-07", amount: 450 },
  ];

  const supporters = [
    { name: "Nguyễn Văn A", amount: "100.000 VNĐ", time: "2024-10-01 10:00" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    { name: "Trần Thị B", amount: "200.000 VNĐ", time: "2024-10-02 11:30" },
    // Thêm các mục người ủng hộ khác
  ];

  const filteredSupporters = supporters.filter(
    (supporter) =>
      supporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supporter.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supporter.time.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let sliderRef = React.useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };

  const [timeRange, setTimeRange] = useState("daily"); // Default is daily view

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  const donationDataWeekly = [
    { week: "Week 1", amount: 4200 },
    { week: "Week 2", amount: 3900 },
  ];

  // Dữ liệu mẫu theo tháng
  const donationDataMonthly = [
    { month: "October", amount: 8100 },
    { month: "November", amount: 4500 },
  ];
  // Chọn dữ liệu biểu đồ dựa trên khoảng thời gian
  const getChartData = () => {
    switch (timeRange) {
      case "weekly":
        return donationDataWeekly;
      case "monthly":
        return donationDataMonthly;
      default:
        return donationDataDaily;
    }
  };

  const getXAxisKey = () => {
    switch (timeRange) {
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      default:
        return "day";
    }
  };
  // Cấu hình cho carousel
  const settings = {
    dots: true,
    infinite: true,
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

  const sendTransaction = async () => {
    try {
      const algodToken = { "X-API-Key": "Your-PureStake-API-Key" };
      const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
      const algodPort = "";
      const algodClient = new algosdk.Algodv2(
        algodToken,
        algodServer,
        algodPort
      );

      const params = await algodClient.getTransactionParams().do();

      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        sender, // Địa chỉ ví người gửi
        receiver, // Địa chỉ ví người nhận
        parseInt(donationAmount) * 1000000, // Chuyển đổi từ Algo sang microAlgo
        undefined,
        undefined,
        params
      );

      const senderPrivateKey = "Your-Sender-Private-Key"; // Quản lý bảo mật khóa này
      const signedTxn = txn.signTxn(senderPrivateKey);
      const txId = txn.txID().toString();

      await algodClient.sendRawTransaction(signedTxn).do();
      setTransactionId(txId);
      alert(`Giao dịch thành công! TxID: ${txId}`);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi giao dịch!");
    }
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
                {projectDetail?.linkcardImage.length > 0 &&
                  projectDetail?.linkcardImage.map((src, index) => (
                    <CardMedia
                      key={index}
                      component="img"
                      image={src}
                      alt={`Image ${index + 1}`}
                      sx={{ width: "100%", height: "auto", borderRadius: 2 }}
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
                      {`${formatAmount(
                        projectDetail?.fund_raise_total ?? "0"
                      )} VND`}
                    </Typography>
                  </Box>

                  {/* Progress Bar */}
                  <LinearProgress
                    variant="determinate"
                    value={50}
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
                      Đã quyên góp:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {`${formatAmount(
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
                    onClick={handleOpen}
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
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                    />
                    {`Hotline: ${
                      projectDetail?.hotline ?? "Số điện thoại liên hệ"
                    }`}
                  </Typography>
                  <Typography variant="body2" mt={1} mb={2}>
                    <EmailIcon
                      fontSize="small"
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                    />
                    {`Email: ${projectDetail?.email ?? "Email liên hệ"}`}
                  </Typography>
                </Box>
              </Box>
            )}
            {tabIndex === 1 && (
              <SupportersList />
              // <Box sx={{ marginTop: "1rem" }}>
              //   <Box sx={{ width: "50%", paddingLeft: 2 }}>
              //     <TextField
              //       label="Tìm kiếm người ủng hộ"
              //       variant="outlined"
              //       fullWidth
              //       value={searchQuery}
              //       onChange={handleSearchChange}
              //       InputProps={{
              //         startAdornment: (
              //           <InputAdornment position="start">
              //             <SearchIcon />
              //           </InputAdornment>
              //         ),
              //       }}
              //     />
              //   </Box>

              //   {/* Bảng */}
              //   <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              //     <Table>
              //       <TableHead>
              //         <TableRow>
              //           {["Người ủng hộ", "Số tiền", "Thời gian"].map(
              //             (header, index) => (
              //               <TableCell
              //                 key={index}
              //                 sx={{
              //                   backgroundColor: "#f5f5f5",
              //                   color: "black",
              //                   fontWeight: "bold",
              //                   fontSize: "16px",
              //                 }}
              //               >
              //                 {header}
              //               </TableCell>
              //             )
              //           )}
              //         </TableRow>
              //       </TableHead>
              //       <TableBody>
              //         {filteredSupporters
              //           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              //           .map((supporter, index) => (
              //             <TableRow key={index}>
              //               <TableCell>{supporter.name}</TableCell>
              //               <TableCell>{supporter.amount}</TableCell>
              //               <TableCell>{supporter.time}</TableCell>
              //             </TableRow>
              //           ))}
              //       </TableBody>
              //     </Table>

              //     {/* Phân trang */}
              //     <CustomTablePagination
              //       component="div"
              //       count={filteredSupporters.length}
              //       page={page}
              //       onPageChange={handlePageChange}
              //       rowsPerPage={rowsPerPage}
              //       onRowsPerPageChange={handleRowsPerPageChange}
              //       rowsPerPageOptions={[10, 20, 50]}
              //       labelRowsPerPage="Số dòng mỗi trang:"
              //       labelDisplayedRows={({ from, to, count }) => {
              //         return `Hiển thị ${from}-${to} của ${
              //           count !== -1 ? count : `nhiều hơn ${to}`
              //         }`;
              //       }}
              //     />
              //   </TableContainer>
              //   {/* Biểu đồ tổng số tiền nạp mỗi ngày */}
              //   <Box sx={{ marginTop: 4 }}>
              //     <FormControl sx={{ marginBottom: 2, minWidth: 120 }}>
              //       <InputLabel id="time-range-label">Khoảng thời gian</InputLabel>
              //       <Select
              //         labelId="time-range-label"
              //         value={timeRange}
              //         onChange={handleTimeRangeChange}
              //         label="Khoảng thời gian"
              //       >
              //         <MenuItem value="daily">Ngày</MenuItem>
              //         <MenuItem value="weekly">Tuần</MenuItem>
              //         <MenuItem value="monthly">Tháng</MenuItem>
              //       </Select>
              //     </FormControl>
              //     <Typography variant="h6" sx={{ marginBottom: 2 }}>
              //       Biểu đồ tổng số tiền nạp
              //     </Typography>
              //     <ResponsiveContainer width="100%" height={300}>
              //       <BarChart
              //         data={getChartData()}
              //         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              //       >
              //         <CartesianGrid strokeDasharray="3 3" />
              //         <XAxis dataKey={getXAxisKey()} />
              //         <YAxis />
              //         <Tooltip />
              //         <Bar dataKey="amount" fill="#8884d8" />
              //       </BarChart>
              //     </ResponsiveContainer>
              //   </Box>
              // </Box>
            )}
          </>
        )}
      </Card>
      {/* Modal để nhập thông tin người dùng */}
      <DonationModal
        open={open}
        handleClose={handleClose}
        sendTransaction={sendTransaction}
        donationAmount={donationAmount}
        setDonationAmount={setDonationAmount}
        anonymous={anonymous}
        handleAnonymousChange={handleAnonymousChange}
      />
      {transactionId && (
        <div>
          <p>Giao dịch thành công với TxID: {transactionId}</p>
        </div>
      )}
    </div>
  );
};

export default FundDetail;
const formatAmount = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(amount);
};
