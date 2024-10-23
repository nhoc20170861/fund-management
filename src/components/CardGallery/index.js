import React, { useState, useEffect } from "react";

import { Button, Typography, Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Grid from "@mui/material/Grid2";
import CardImage from "../CardImage";

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

        <Typography variant="body1" sx={{ mx: 2, color: "black" }}>
          Trang {currentPage + 1} / {totalPages}
        </Typography>

        <Button onClick={handleNext} disabled={currentPage === totalPages - 1}>
          <ArrowForwardIosIcon />
        </Button>
      </Box>
    </Box>
  );
};
export default CardGallery;
