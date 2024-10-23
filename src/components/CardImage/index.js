import React, { useEffect } from "react";
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
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Media } from "reactstrap";

import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import dayjs from "dayjs";
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
  id = 1,
  user_id,
  name: projectName = "Unknown",
  description,
  fund_id,
  current_fund: currentAmount,
  fund_raise_total: targetAmount,
  fund_raise_count,
  deadline,
  project_hash,
  is_verify,
  status,
  created_at,
  updated_at,
  deleted_at = null,
  fund_name = "Unknown",
  linkcardImage = [
    "https://cdn.thuvienphapluat.vn//phap-luat/2022/LanAnh/23-07-2022/quy-tu-thien-2.jpg",
  ],
  type: fundType = "defaultType", // Default type
  fund_logo,
  isCompleted = false, // Default isCompleted
}) => {
  const navigate = useNavigate();
  const progress = (currentAmount / targetAmount) * 100;
  // const [progress, setProgress] = React.useState(
  //   () => (currentAmount / targetAmount) * 100
  // );
  // useEffect(
  //   () => setProgress((currentAmount / targetAmount) * 100),
  //   [currentAmount, targetAmount]
  // );
  const isProjectEnded = dayjs(deadline).isBefore(dayjs());
  const formattedDeadline = isProjectEnded
    ? "Dự án đã kết thúc"
    : `Ngày kết thúc ${dayjs(deadline).format("DD/MM/YYYY")}`;
  const textColorDeadline = isProjectEnded ? "red" : "inherit";

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
    defaultType: "Unknown",
  };

  const convertToSlug = (str) => {
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return str.replace(/\s+/g, "-").toLowerCase();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(amount);
  };

  const onFundClick = () => {
    const prject_name = convertToSlug(projectName ?? "unknown");
    if (!id || !Number.isInteger(id)) {
      id = 1;
    }
    navigate(`/du-an/${prject_name}/${id}`);
  };

  return (
    <Card sx={{ width: "22rem", height: "27rem" }}>
      <StyledCard>
        {/* Icon trạng thái dự án */}
        {isProjectEnded ? (
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
            sx={{
              width: "100%",
              objectFit: "cover", // Đảm bảo ảnh giữ tỷ lệ và cắt nếu cần
            }}
            image={
              linkcardImage && linkcardImage.length > 0 && linkcardImage[0]
                ? linkcardImage[0]
                : "https://png.pngtree.com/background/20210710/original/pngtree-love-charity-crowdfunding-public-welfare-poster-publicity-board-picture-image_997653.jpg"
            }
            alt={projectName}
          />
        </CardActionArea>

        <CardContent sx={{ height: "20rem" }}>
          <Grid container alignItems="center" spacing={1}>
            <Button sx={{ textTransform: "none", color: "gray" }}>
              <Media className="align-items-center">
                <Avatar
                  alt="logo"
                  src={
                    fund_logo ??
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s"
                  }
                  sx={{ width: 35, height: 35 }}
                />
                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm font-weight-bold">
                    {fund_name}
                  </span>
                </Media>
              </Media>
            </Button>
          </Grid>
          <div>
            <Typography
              variant="h6"
              sx={{
                height: "3rem",
                fontWeight: "700",
                cursor: "pointer",
                "&:hover": {
                  color: "primary.main",
                  cursor: "pointer",
                },
              }}
              onClick={onFundClick}
            >
              {projectName}
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
            <span style={{ fontWeight: "700", color: textColorDeadline }}>
              {formattedDeadline}
            </span>
          </Typography>
        </CardContent>
      </StyledCard>
    </Card>
  );
};

export default CardImage;
