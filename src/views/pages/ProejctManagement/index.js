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
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Media,
} from "reactstrap";
import { useNavigate, useLocation, Outlet, useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
// core components
import HeaderCustom from "components/Headers/HeaderCustom.js";
// import network
import { getFundsForOneUser } from "../../../network/ApiAxios";
import {
  writeStorage,
  deleteFromStorage,
  useLocalStorage,
} from "@rehooks/local-storage";

const ProejctManagement = () => {
  const [fundList, setFundList] = useLocalStorage("fundList", []);
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();

  useEffect(() => {
    const fetchAllFundsForThisUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getFundsForOneUser(userId);

        const { data } = response;
        console.log("🚀 ~ fetchAllFundsForThisUser ~ data:", data);
        if (data.statusCode !== 200) {
          ShowToastMessage({
            title: "fetchAllTaskQueue",
            message: "Can not get task queue",
            type: "error",
          });
          return;
        }
        ShowToastMessage({
          title: "fetch dat robotConfig",
          message: data.message,
          type: "success",
        });
        setFundList(data.body);
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchAllTaskQueue ~ error:",
          error
        );
      }
    };
    fetchAllFundsForThisUser();
  }, []);

  const [isShowModal, setIsShowModal] = useState(false);

  const handleBtnClick = (key) => {
    const url = location.pathname + "/" + key;
    console.log("🚀 ~ file: index.js:107 ~ handleBtnClick ~ url:", url);
    navigate(url);

    setIsShowModal(!isShowModal);
  };
  return (
    <>
      <HeaderCustom />
      {/* Page content */}

      {!projectId ? (
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h3 className="mb-0">Fund List</h3>
                </CardHeader>
                <CardBody>
                  <Row className="icon-examples">
                    {fundList.map((fund, index) => {
                      return (
                        <Col lg="3" md="6">
                          <Button
                            fullwidth
                            className="custom-border-box"
                            type="button"
                            onClick={(e) => handleBtnClick(fund.id ?? 1)}
                          >
                            <Media className="align-items-center">
                              <Avatar
                                alt={index}
                                src={
                                  fund.logo ??
                                  "https://images2.thanhnien.vn/528068263637045248/2024/9/9/tham-gia-don-dep-cay-xanh-nga-do-o-ha-noituan-minh-172588565429228770254.jpg"
                                }
                                sx={{ width: 50, height: 50 }}
                              />

                              <Media className="pl-2 ml-2 d-none d-lg-block">
                                <span className="mb-0 text-sm font-weight-bold">
                                  {fund.name_fund}
                                </span>
                              </Media>
                            </Media>
                          </Button>
                        </Col>
                      );
                    })}
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      ) : (
        <Outlet></Outlet>
      )}
    </>
  );
};

export default ProejctManagement;
