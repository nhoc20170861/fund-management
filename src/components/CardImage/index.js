import React from "react";
import { useNavigate } from "react-router-dom";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";

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
  fundName = "Môi trường",
  fundType = "environment",
  currentAmount,
  targetAmount,
  daysRemaining,
  logo,
  isCompleted = false, // Thêm prop isCompleted để kiểm tra dự án đã kết thúc hay chưa
}) => {
  const navigate = useNavigate();

  const progress = (currentAmount / targetAmount) * 100;

  const fundColors = {
    children: "primary",
    healthcare: "secondary",
    education: "success",
    disaster: "error",
    environment: "warning",
  };

  const fundLabel = {
    children: "Trẻ em",
    healthcare: "Y tế",
    education: "Giáo dục",
    disaster: "Thiên tai",
    environment: "Môi trường",
  };

  const convertToSlug = (str) => {
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return str.replace(/\s+/g, "-").toLowerCase();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(amount);
  };

  const onFundClick = () => {
    const slug = convertToSlug(fundName);
    navigate(`/du-an/${slug}`);
  };

  return (
    <Card sx={{ maxWidth: 345, height: "400p" }}>
      <StyledCard>
        {/* Icon trạng thái dự án */}
        {isCompleted ? (
          <CheckCircleIcon
            sx={{
              color: "green",
              position: "absolute",
              top: 10,
              left: 10,
              fontSize: 30,
              zIndex: 10,
            }}
          />
        ) : (
          <WatchLaterIcon
            sx={{
              color: "orange",
              position: "absolute",
              top: 10,
              left: 10,
              fontSize: 30,
              zIndex: 10,
            }}
          />
        )}

        <StyledChip
          label={fundLabel[fundType] || "Unknown"}
          color={fundColors[fundType] || "default"}
          size="medium"
        />
        <CardActionArea onClick={onFundClick}>
          <CardMedia
            component="img"
            height="180"
            image={image}
            alt={fundName}
          />
        </CardActionArea>

        <CardContent>
          <Grid container alignItems="center" spacing={1}>
            <Button sx={{ textTransform: "none", color: "gray" }}>
              <Media className="align-items-center">
                <Avatar alt="logo" src={logo} sx={{ width: 35, height: 35 }} />
                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm font-weight-bold">
                    {orgName}
                  </span>
                </Media>
              </Media>
            </Button>
          </Grid>
          <div>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "700",
                cursor: "pointer",
                "&:hover": {
                  color: "primary.main",
                  cursor: "pointer",
                },
              }}
              onClick={onFundClick}
            >
              {fundName}
            </Typography>
          </div>
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <span style={{ fontWeight: "700" }}>
              Số ngày còn lại: {daysRemaining}
            </span>
          </Typography>
        </CardContent>
      </StyledCard>
    </Card>
  );
};

export default CardImage;
