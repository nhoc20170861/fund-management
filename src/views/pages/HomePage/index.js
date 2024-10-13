import React, { useState } from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CardImage from "components/CardImage";

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
        "https://baovephapluat.vn/data/images/0/2020/07/12/tamlt/anhgsffsfsfsfsf.jpg?dpi=150&quality=100&w=830",
      orgName: "Charity Fundraising 1",
      fundName: "Quỹ từ thiện về giáo dục",
      fundType: "education",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
      currentAmount: 5000,
      targetAmount: 10000,
      daysRemaining: 0,
      isCompleted: true,
    },
    {
      image:
        "https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-charity-sale-charity-poster-background-image_165549.jpg",
      orgName: "Tổ chức y tế",
      fundName: "Dự án về y tế",
      fundType: "healthcare",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
      currentAmount: 3000,
      targetAmount: 8000,
      daysRemaining: 15,
    },
    {
      image:
        "https://www.unicef.org/vietnam/sites/unicef.org.vietnam/files/styles/hero_tablet/public/UNI641159_0.webp?itok=3REO0U48",
      orgName: "Tổ chức A",
      fundName: "Dự án về trẻ em",
      fundType: "children",
      currentAmount: 5000000,
      targetAmount: 10000000,
      daysRemaining: 10,
      logo: "https://ambassade-vietnam.com/wp-content/uploads/2024/09/b9427dca2144861adf55-172594690-3355-5124-1725947002.jpg",
      isCompleted: false,
    },
    {
      image:
        "https://bcp.cdnchinhphu.vn/334894974524682240/2024/8/8/lulut-1723032078514-1723109893706460025454.jpeg",
      orgName: "Tổ chức ứng phó thiên tai",
      fundName: "Dự án về thiên tai",
      fundType: "disaster",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
      currentAmount: 7000,
      targetAmount: 9000,
      daysRemaining: 7,
    },
    {
      image:
        "https://bcp.cdnchinhphu.vn/thumb_w/640/334894974524682240/2024/3/22/thanhnien-1711099894064177932592.jpeg",
      orgName: "Quỹ chống biến đổi khí hậu",
      fundName: "Dự án về môi trường",
      fundType: "environment",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
      currentAmount: 1000,
      targetAmount: 6000,
      daysRemaining: 20,
    },
  ];

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <CardGallery cards={cards} />
    </div>
  );
};

export default HomePage;
