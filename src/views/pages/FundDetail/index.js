import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Card,
  CardMedia,
  Avatar,
  Typography,
  Button,
  Grid,
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
import LinearProgress from "@mui/material/LinearProgress";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
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

// Dữ liệu giả lập cho ví dụ
const images = [
  "https://images2.thanhnien.vn/528068263637045248/2024/9/9/tham-gia-don-dep-cay-xanh-nga-do-o-ha-noituan-minh-172588565429228770254.jpg",
  "https://via.placeholder.com/600x400/FF00FF/FFFFFF?text=Image+5",
  "https://cdn1.tuoitre.vn/thumb_w/1200/471584752817336320/2024/9/10/bao-lu-172595526965627861618-116-79-526-862-crop-17259628774121531732058.jpg",
  "https://mediabhy.mediatech.vn/upload/image/202409/medium/75000_c6a92d33916160c79007bb253aab3663.webp",
  "https://media-cdn-v2.laodong.vn/storage/newsportal/2024/9/10/1392076/Lai-Chau-Giup-Dan-Kh.jpg?w=800&h=496&crop=auto&scale=both",
];

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
const FundDetail = () => {
  const [open, setOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { fundName } = useParams(); // Lấy fundName từ URL

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
        {/* Bên trái: Carousel ảnh chiếm 1/2 */}
        <Box sx={{ width: "50%", height: "fit-content" }}>
          <Slider
            {...settings}
            ref={(slider) => {
              sliderRef = slider;
            }}
          >
            {images.map((src, index) => (
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
          {/* Nhóm 1 */}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            {fundName}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} container alignItems="center">
              <Avatar
                alt="Organization Logo"
                src="https://via.placeholder.com/40"
              />
              <Typography variant="h6" sx={{ marginLeft: 2 }}>
                Tổ Chức Gây Quỹ
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: "auto" }}>
                150 lượt ủng hộ
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ProgressContainer>
                <Typography variant="body2">
                  Số tiền quyên góp: 500/1000 VNĐ
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={50}
                  sx={{ height: "10px" }}
                />
              </ProgressContainer>
            </Grid>
          </Grid>

          {/* Nhóm 2: Nút ủng hộ */}
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Ủng Hộ
            </Button>
          </Box>
        </Box>
      </StyledCard>
      <Card style={{ padding: "20px 5px 5px 5px" }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="fund tabs"
        >
          <Tab label="Mô Tả" />
          <Tab label="Người Ủng Hộ" />
        </Tabs>
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
                  {fundDescription}
                </ReactMarkdown>
              </Typography>
            </Box>
            <Box sx={{ width: "30%" }}>
              <Card sx={{ padding: 2 }}>
                <Avatar
                  alt="Quỹ"
                  src="/path/to/avatar.jpg"
                  sx={{ width: 56, height: 56 }}
                />
                <Typography variant="h6">Tên Quỹ</Typography>
                <Typography variant="body2">Địa chỉ: Địa chỉ quỹ</Typography>
              </Card>
            </Box>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box sx={{ marginTop: "1rem" }}>
            <Box sx={{ width: "50%", paddingLeft: 2 }}>
              <TextField
                label="Tìm kiếm người ủng hộ"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Bảng */}
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {["Người ủng hộ", "Số tiền", "Thời gian"].map(
                      (header, index) => (
                        <TableCell
                          key={index}
                          sx={{
                            backgroundColor: "#f5f5f5",
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          {header}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSupporters
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((supporter, index) => (
                      <TableRow key={index}>
                        <TableCell>{supporter.name}</TableCell>
                        <TableCell>{supporter.amount}</TableCell>
                        <TableCell>{supporter.time}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Phân trang */}
              <CustomTablePagination
                component="div"
                count={filteredSupporters.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[10, 20, 50]}
                labelRowsPerPage="Số dòng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) => {
                  return `Hiển thị ${from}-${to} của ${
                    count !== -1 ? count : `nhiều hơn ${to}`
                  }`;
                }}
              />
            </TableContainer>
            {/* Biểu đồ tổng số tiền nạp mỗi ngày */}
            <Box sx={{ marginTop: 4 }}>
              <FormControl sx={{ marginBottom: 2, minWidth: 120 }}>
                <InputLabel id="time-range-label">Khoảng thời gian</InputLabel>
                <Select
                  labelId="time-range-label"
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  label="Khoảng thời gian"
                >
                  <MenuItem value="daily">Ngày</MenuItem>
                  <MenuItem value="weekly">Tuần</MenuItem>
                  <MenuItem value="monthly">Tháng</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Biểu đồ tổng số tiền nạp
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getChartData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={getXAxisKey()} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </Card>
      {/* Modal để nhập thông tin người dùng */}
      <Modal open={open} onClose={handleClose}>
        <ModalContainer>
          {/* Phần 1: Thông tin người ủng hộ */}
          <Typography variant="h6" component="h2" gutterBottom>
            Nhập Thông Tin Ủng Hộ
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Họ và tên" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Số điện thoại" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Địa chỉ" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Địa chỉ Email" variant="outlined" fullWidth />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={anonymous}
                onChange={handleAnonymousChange}
                name="anonymous"
              />
            }
            label="Ủng hộ ẩn danh"
          />

          {/* Phần 2: Nhập số tiền */}
          <TextField
            label="Số tiền quyên góp"
            variant="outlined"
            fullWidth
            margin="normal"
            value={donationAmount}
            onChange={handleDonationChange}
            helperText={"Ví dụ số tièn: 50.000"}
            InputProps={{
              endAdornment: <InputAdornment position="end">đ</InputAdornment>,
            }}
            inputProps={{
              "aria-label": "weight",
            }}
          />

          {/* Phần 3: Nút Submit */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleClose}
            sx={{ mt: 2 }}
          >
            Gửi Thông Tin
          </Button>
        </ModalContainer>
      </Modal>
    </div>
  );
};

export default FundDetail;
