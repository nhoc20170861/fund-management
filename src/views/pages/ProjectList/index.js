import React, { useState } from "react";
import { Tabs, Tab, Box, Grid } from "@mui/material";
import CardImage from "components/CardImage"; // Import component CardImage

// Dữ liệu mẫu cho các dự án
const activeProjects = [
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

const completedProjects = [
  {
    image:
      "https://baovephapluat.vn/data/images/0/2020/07/12/tamlt/anhgsffsfsfsfsf.jpg?dpi=150&quality=100&w=830",
    orgName: "Quỹ xây dựng trường học",
    fundName: "Quỹ từ thiện về giáo dục",
    fundType: "education",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s",
    currentAmount: 5000,
    targetAmount: 10000,
    daysRemaining: 0,
    isCompleted: true,
  },
];

const ProjectList = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      {/* Tabs cho danh sách dự án */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="project tabs"
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
      >
        <Tab label="Dự án đang gây quỹ" sx={{ fontWeight: "600" }} />
        <Tab label="Dự án đã kết thúc" sx={{ fontWeight: "600" }} />
      </Tabs>

      {/* Nội dung cho từng tab */}
      <Box sx={{ mt: 2 }}>
        {selectedTab === 0 && (
          <Grid container spacing={2}>
            {activeProjects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {/* Card sẽ chiếm 12/12 trên màn hình nhỏ, 6/12 trên màn hình vừa và 4/12 trên màn hình lớn */}
                <CardImage {...project} />
              </Grid>
            ))}
          </Grid>
        )}
        {selectedTab === 1 && (
          <Grid container spacing={2}>
            {completedProjects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                {/* Card sẽ chiếm 12/12 trên màn hình nhỏ, 6/12 trên màn hình vừa và 4/12 trên màn hình lớn */}
                <CardImage {...project} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ProjectList;
