import React, { useState } from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CardImage from "./components/CardImage";

const CardGallery = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 3;

  // Tính toán số trang
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  // Lấy các thẻ hiện tại
  const currentCards = cards.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box>
      {/* Layout hiển thị các thẻ */}
      <Grid container spacing={2} justifyContent="center">
        {currentCards.map((card, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{
              flexGrow: currentCards.length < 3 ? 0 : 1, // Giữ nguyên kích thước khi ít hơn 3 thẻ
              maxWidth: currentCards.length < 3 ? "33%" : "auto", // Giới hạn bề rộng khi có ít hơn 3 thẻ
              flexBasis: currentCards.length < 3 ? "33%" : "auto",
            }}
          >
            <CardImage {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Điều hướng */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Button onClick={handleBack} disabled={currentPage === 0}>
          <ArrowBackIosIcon />
        </Button>

        <Typography variant="body1" sx={{ mx: 2, color: "white" }}>
          Trang {currentPage + 1} / {totalPages}
        </Typography>

        <Button onClick={handleNext} disabled={currentPage === totalPages - 1}>
          <ArrowForwardIosIcon />
        </Button>
      </Box>
    </Box>
  );
};
const HomePage = (props) => {
  // Danh sách các thẻ card
  const cards = [
    {
      image:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-charity-sale-charity-poster-background-image_165549.jpg",
      orgName: "Charity Fundraising 1",
      fundName: "Fundraising for children",
      fundType: "children",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
      currentAmount: 5000,
      targetAmount: 10000,
      daysRemaining: 10,
    },
    {
      image:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-charity-sale-charity-poster-background-image_165549.jpg",
      orgName: "Phạm Anh Quân",
      fundName: "Phạm Anh Quân",
      fundType: "healthcare",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
      currentAmount: 3000,
      targetAmount: 8000,
      daysRemaining: 15,
    },
    {
      image:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-charity-sale-charity-poster-background-image_165549.jpg",
      orgName: "Charity Fundraising 3",
      fundName: "Fundraising for education",
      fundType: "education",
      currentAmount: 2000,
      targetAmount: 7000,
      daysRemaining: 5,
    },
    {
      image:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-charity-sale-charity-poster-background-image_165549.jpg",
      orgName: "Charity Fundraising 4",
      fundName: "Fundraising for disaster",
      fundType: "disaster",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
      currentAmount: 7000,
      targetAmount: 9000,
      daysRemaining: 7,
    },
    {
      image:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-charity-sale-charity-poster-background-image_165549.jpg",
      orgName: "Charity Fundraising 5",
      fundName: "Fundraising for education",
      fundType: "education",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
      currentAmount: 1000,
      targetAmount: 6000,
      daysRemaining: 20,
    },
  ];
  const projects = [
    {
      id: 1,
      title: "Chung tay cùng dự án sát cánh cùng em qua mùa lũ",
      description:
        "Hãy cùng nhau chung tay góp sức giúp đỡ các em nhỏ vùng lũ.",
      imageUrl:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-charity-sale-charity-poster-background-image_165549.jpg",
      organizationLogo: "https://via.placeholder.com/40", // Thay thế bằng URL logo thực tế
      progress: 50, // % tiến độ
      remainingDays: 10, // Số ngày còn lại
    },
    // Thêm các dự án khác nếu cần
  ];
  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <CardGallery cards={cards} />
    </div>
  );
};

export default HomePage;
