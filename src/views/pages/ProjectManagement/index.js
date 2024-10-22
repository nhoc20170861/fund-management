/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState, useEffect } from "react";
import { ShowToastMessage } from "utils/ShowToastMessage";
// reactstrap components
import {
    CardBody,
    Container,
    Row,
    Col,
} from "reactstrap";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";
// core components
import HeaderCustom from "components/Headers/HeaderCustom.js";
// import network
import { getProjectDetailByUserAndFundId } from "../../../network/ApiAxios";

import CardImage from "./components/CardImage"; // Import component CardImage
import ProjectDetail from "./components/ProjectDetail";
import {
    writeStorage,
    deleteFromStorage,
    useLocalStorage,
} from "@rehooks/local-storage";


const FundInfo = ({ fundListForCurrentUser, projectComplete, activeProjects, fundId }) => {
    const [fundData, setFundData] = useState({});

    useEffect(() => {
        const found = fundListForCurrentUser.find(fund => fund.id == fundId);
        setFundData(found);
    }, [fundListForCurrentUser, fundId]);

    return (
        fundData ? (
            <Card sx={{ boxShadow: 3, p: 2 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center" sz>
                        {/* Fund Image: 30% width of CardContent */}
                        <Grid item size={4}>
                            <Box
                                component="img"
                                src={fundData.logo}
                                alt={fundData.name_fund}
                                sx={{
                                    width: "100%",           // Responsive width
                                    maxWidth: "300px",      // Restrict the maximum width of the image
                                    height: "auto",          // Maintain aspect ratio
                                    borderRadius: 2,
                                    margin: "0 auto",        // Center the image within the grid item
                                    display: "block"         // Ensures proper centering
                                }}
                            />
                        </Grid>
                     

                            {/* Fund Details: 70% width of CardContent */}
                            <Grid item size={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            {fundData.name_fund}
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary">
                                            {fundData.description}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                            Ngày tạo: {new Date(fundData.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2">
                                                Số project còn hạn: {activeProjects}
                                            </Typography>
                                            <Typography variant="body2">
                                                Số project đã kết thúc: {projectComplete}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2">
                                                Email: Chưa cập nhật
                                            </Typography>
                                            <Typography variant="body2">
                                                Địa chỉ: Chưa cập nhật
                                            </Typography>
                                            <Typography variant="body2">
                                                Số điện thoại: Chưa cập nhật
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                       
                    </Grid>
                </CardContent>
            </Card>
        ) : null
    );
};

const ProjectManagement = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [projectListForCurrentFund, setProjectListForCurrentFund] = useState([]);
    const [activeProjects, setActiveProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [fundListForCurrentUser, setFundListForCurrentUser] = useLocalStorage("fundListForCurrentUser", {});
    const navigate = useNavigate();
    const location = useLocation();
    const { fundId } = useParams();
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');  // Lấy projectId từ query string


    useEffect(() => {
        const fetchAllProjectForCurrentFund = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const response = await getProjectDetailByUserAndFundId(userId, fundId);

                const { data } = response;
                console.log("🚀 ~ fetchAllProjectForCurrentFund ~ data:", data);
                if (data.statusCode !== 200) {
                    ShowToastMessage({
                        title: "fetchAllProjectForCurrentFund",
                        message: "Không thể lấy thông tin quỹ",
                        type: "error",
                    });
                    return;
                }
                ShowToastMessage({
                    title: "fetchAllProjectForCurrentFund",
                    message: "Lấy thông tin quỹ thành công",
                    type: "success",
                });
                setProjectListForCurrentFund(data.body);
                const now = dayjs();
                const active = data?.body.filter((project) =>
                    dayjs(project.deadline).isAfter(now)
                );
                const completed = data?.body.filter((project) =>
                    dayjs(project.deadline).isBefore(now)
                );

                setActiveProjects(active);
                setCompletedProjects(completed);
            } catch (error) {
                console.log(
                    "🚀 ~ file: index.js:223 ~ fetchAllTaskQueue ~ error:",
                    error
                );
            }
        };
        fetchAllProjectForCurrentFund();
    }, [fundId]);

    // Hàm điều hướng trở lại trang danh sách project
    const handleBackClick = () => {
        navigate(`/admin/fund-detail/${fundId}`);  // Quay lại trang danh sách project
    };



    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    return (
        <>
            <HeaderCustom />





            <Container className="mt--7" fluid>
                {projectId ? (


                    <div className="col">

                        <ProjectDetail projectId={projectId} onBackClick={handleBackClick} />

                    </div>

                ) : (
                    <Row>
                        <Box sx={{ width: "100%", padding: "20px" }}>
                            <FundInfo
                                fundListForCurrentUser={fundListForCurrentUser}
                                projectComplete={completedProjects?.length || 0}
                                activeProjects={activeProjects?.length || 0}
                                fundId={fundId}
                            />
                        </Box>
                        <Box sx={{ width: "100%", padding: "20px" }}>
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
                                    <Grid container spacing={2} justifyContent="center">
                                        {activeProjects.map((project, index) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                key={index}
                                                sx={{
                                                    flexGrow: activeProjects.length < 3 ? 0 : 1, // Giữ nguyên kích thước khi ít hơn 3 thẻ
                                                    maxWidth: activeProjects.length < 3 ? "33%" : "auto", // Giới hạn bề rộng khi có ít hơn 3 thẻ
                                                    flexBasis: activeProjects.length < 3 ? "33%" : "auto",
                                                }}
                                            >
                                                {/* Card sẽ chiếm 12/12 trên màn hình nhỏ, 6/12 trên màn hình vừa và 4/12 trên màn hình lớn */}
                                                <CardImage {...project} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                                {selectedTab === 1 && (
                                    <Grid container spacing={2} justifyContent="center">
                                        {completedProjects.map((project, index) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                key={index}
                                                sx={{
                                                    flexGrow: completedProjects.length < 3 ? 0 : 1, // Giữ nguyên kích thước khi ít hơn 3 thẻ
                                                    maxWidth: completedProjects.length < 3 ? "33%" : "auto", // Giới hạn bề rộng khi có ít hơn 3 thẻ
                                                    flexBasis: completedProjects.length < 3 ? "33%" : "auto",
                                                }}
                                            >
                                                {/* Card sẽ chiếm 12/12 trên màn hình nhỏ, 6/12 trên màn hình vừa và 4/12 trên màn hình lớn */}
                                                <CardImage {...project} handleBackClick={handleBackClick} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>
                        </Box>

                    </Row>
                )}
            </Container >
        </>
    );
};

export default ProjectManagement;
