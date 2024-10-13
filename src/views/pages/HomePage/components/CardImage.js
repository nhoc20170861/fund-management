import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  LinearProgress,
  Chip,
  Box,
  Grid,
  Button,
} from "@mui/material";
import { Media } from "reactstrap";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";

// Styled Card để đặt Chip vào góc trên bên trái
const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "visible",
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 1,
  cursor: "pointer", // Để cho thấy Chip có thể click
}));

const CardImage = ({
  image,
  orgName,
  fundName = "Unknown",
  fundType = "Môi trường",
  currentAmount,
  targetAmount,
  daysRemaining,
  logo,
}) => {
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Tính phần trăm tiền tích lũy so với mục tiêu
  const progress = (currentAmount / targetAmount) * 100;

  const fundColors = {
    children: "primary",
    healthcare: "secondary",
    education: "success",
    disaster: "error",
  };

  // Đặt tên loại quỹ với màu sắc tương ứng
  const fundLabel = {
    children: "Trẻ em",
    healthcare: "Y tế",
    education: "Giáo dục",
    disaster: "Thiên tai",
  };

  const convertToSlug = (str) => {
    // Chuyển đổi tiếng Việt có dấu thành không dấu
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Thay thế khoảng cách bằng dấu gạch ngang và chuyển tất cả về chữ thường
    return str.replace(/\s+/g, "-").toLowerCase();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(amount);
  };

  const onFundClick = () => {
    console.log("Fund clicked");
    const slug = convertToSlug(fundName); // Chuyển đổi fundName thành slug
    navigate(`/du-an/${slug}`); // Điều hướng tới URL mới
  };
  const onLogoClick = (e) => {
    console.log("Logo clicked");
  };
  const onChipClick = () => {};
  return (
    <Card sx={{ maxWidth: 345, height: "400p" }}>
      <StyledCard>
        <StyledChip
          label={fundLabel[fundType] || "Unknown"}
          color={fundColors[fundType] || "default"}
          size="medium"
          onClick={onChipClick} //
        />
        <CardActionArea onClick={onFundClick}>
          {/* Hình ảnh */}
          <CardMedia
            component="img"
            height="180"
            image={image}
            alt={fundName}
          />
        </CardActionArea>

        <CardContent>
          <Grid container alignItems="center" spacing={1}>
            {/* Avatar logo tổ chức */}
            <Button
              onClick={onLogoClick}
              sx={{ textTransform: "none", color: "gray" }}
            >
              <Media className="align-items-center">
                <Avatar
                  alt="logo"
                  src={logo}
                  sx={{ width: 35, height: 35, cursor: "pointer" }}
                ></Avatar>

                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm font-weight-bold">
                    {" "}
                    {orgName}
                  </span>
                </Media>
              </Media>
            </Button>
            {/* <IconButton onClick={onLogoClick}>
                  <Avatar
                    alt="logo"
                    src={logo}
                    sx={{ width: 35, height: 35, cursor: "pointer" }}
                  ></Avatar>
                  <Typography variant="h7" component="div">
                    {orgName}
                  </Typography>
                </IconButton> */}

            {/* Tên quỹ */}
          </Grid>
          <div>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "700",
                cursor: "pointer",
                "&:hover": {
                  color: "primary.main", // Thay đổi màu sắc khi hover
                  cursor: "pointer", // Thay đổi con trỏ thành pointer
                },
              }}
              onClick={onFundClick}
            >
              {fundName}
            </Typography>
          </div>
          {/* Thanh tiến trình (Progress bar) */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                progress
              )}%`}</Typography>
            </Box>
          </Box>

          {/* Số tiền hiện tại và mục tiêu */}
          <Typography
            variant="body2"
            sx={{ mt: 1, fontWeight: "bold", color: "red" }}
          >
            {`${formatAmount(currentAmount)} VND`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <span style={{ fontWeight: "700" }}>
              Với mục tiêu: {`${formatAmount(targetAmount)} VND`}
            </span>
          </Typography>
          {/* Số ngày còn lại */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <span style={{ fontWeight: "700" }}>
              Số ngày còn lại: {`${daysRemaining}`}
            </span>
          </Typography>
        </CardContent>
      </StyledCard>
    </Card>
  );
};

export default CardImage;
