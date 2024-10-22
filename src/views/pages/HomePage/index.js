import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CardImage from "components/CardImage";
import {
  writeStorage,
  deleteFromStorage,
  useLocalStorage,
} from "@rehooks/local-storage";
import { ShowToastMessage } from "utils/ShowToastMessage";
import { getAllProjects } from "../../../network/ApiAxios";
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

  const [projectListAll, setProjectListAll] = useLocalStorage("projectListAll", []);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const response = await getAllProjects();

        const { data } = response;
        console.log("🚀 ~ fetchAllProjects ~ data:", data);
        if (data.statusCode === 200 && data.body.length > 0) {
          setProjectListAll(data.body || []);
          // ShowToastMessage({
          //   title: "Get data",
          //   message: "Lấy dữ liệu thành công",
          //   type: "success",
          // });
        } else {
          ShowToastMessage({
            title: "Get data",
            message: "Không có dữ liệu",
            type: "warning",
          });
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchAllProjects ~ error:",
          error
        );
      }
    };
    fetchAllProjects();
  }, []);

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <CardGallery cards={projectListAll} />
    </div>
  );
};

export default HomePage;
