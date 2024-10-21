import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Col,
  CardFooter,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Row,
  Button,
  CardTitle,
} from "reactstrap";
import dayjs from "dayjs";
import HeaderCustom from "components/Headers/HeaderCustom.js";

import MemberList from "./components/MemberList";
import DropdownAction from "./components/DropdownAction";
import { getFundsForOneUser, getAllUsers } from "network/ApiAxios";

const RenderFundList = ({ funds, users, currentPage, rowsPerPage }) => {
  // Calculate the starting index of the items for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedFunds = funds.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      {selectedFunds.length > 0
        ? selectedFunds.map((fund, index) => {
            return (
              <tr key={index} className="table-fund-row-hover">
                <th scope="row">
                  <Media className="align-items-center">
                    <a
                      className="avatar rounded-circle mr-3"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        alt="..."
                        src={
                          fund.logo ??
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCeoLmM1J-XCZGPTXuOguB7hGsmsvdvjkVQ&s"
                        }
                      />
                    </a>
                    <Media>
                      <span className="mb-0 text-sm">{fund.name_fund}</span>
                    </Media>
                  </Media>
                </th>
                <td>{fund.description}</td>

                <td
                  style={{
                    display: "flex",
                    direction: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  <MemberList users={users} members={fund.members}></MemberList>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <span className="mr-2" style={{ fontWeight: "600" }}>
                      {fund.created_at || ""}
                    </span>
                  </div>
                </td>
                <td className="text-right">
                  <DropdownAction></DropdownAction>
                </td>
              </tr>
            );
          })
        : null}
    </>
  );
};

const HomeManagement = () => {
  const [funds, setFunds] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const rowsPerPage = 5; // Set rows per page to 5

  const [projectListForCurrentUser, setProjectListForCurrentUser] = useState(
    () => {
      const projectList = JSON.parse(
        localStorage.getItem("ProjectListForCurrentUser")
      );

      return projectList || [];
    }
  );
  const currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchAllFundsForThisUser = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await getFundsForOneUser(userId);
        const { data } = response;
        setFunds(data.body);
      } catch (error) {
        console.log("Error fetching funds:", error);
      }
    };

    const fetchAllUser = async () => {
      try {
        const response = await getAllUsers();
        const { data } = response;
        setUsers(data.body);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchAllFundsForThisUser();
    fetchAllUser();
  }, []);

  console.log(
    projectListForCurrentUser.filter(
      (project) => dayjs(project.deadline).isBefore(dayjs()).length
    )
  );
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(funds.length / rowsPerPage); // Calculate total pages

  return (
    <>
      <HeaderCustom />

      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        className="rounded-circle"
                        alt="..."
                        src="https://pbs.twimg.com/profile_images/962068712772616196/eYwuB0TO_400x400.jpg"
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Edit profile
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Edit Avatar
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">{funds.length}</span>
                        <span className="description">Funds</span>
                      </div>
                      <div>
                        <span className="heading">
                          {projectListForCurrentUser.length}
                        </span>
                        <span className="description">Projects</span>
                      </div>
                      <div>
                        <span className="heading">10 ⭐</span>
                        <span className="description">Stars</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>{currentUserInfo.name}</h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {currentUserInfo.email}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1  mb-5 mb-xl-0" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="text-center border-0 pt-8 pt-md-2 pb-0 pb-md-4"></CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Container fluid>
                  {/* Card stats */}
                  <Row>
                    <Col md="6">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                completed projects
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                {
                                  projectListForCurrentUser.filter(
                                    (project) => {
                                      const currentDate = new Date();
                                      return (
                                        currentDate > new Date(project.deadline)
                                      );
                                    }
                                  ).length
                                }
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                <i className="fas fa-chart-bar" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-success mr-2">
                              <i className="fa fa-arrow-up" /> 3.48%
                            </span>{" "}
                            <span className="text-nowrap">
                              Since last month
                            </span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Projects in Progress
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                {
                                  projectListForCurrentUser.filter(
                                    (project) => {
                                      const currentDate = new Date();
                                      return (
                                        currentDate < new Date(project.deadline)
                                      );
                                    }
                                  ).length
                                }
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                <i className="fas fa-chart-pie" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-danger mr-2">
                              <i className="fas fa-arrow-down" /> 3.48%
                            </span>{" "}
                            <span className="text-nowrap">Since last week</span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  {/* <Row className="mt-3">
                    <Col md="6">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Sales
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                924
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                <i className="fas fa-users" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-warning mr-2">
                              <i className="fas fa-arrow-down" /> 1.10%
                            </span>{" "}
                            <span className="text-nowrap">Since yesterday</span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                Performance
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                49,65%
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                <i className="fas fa-percent" />
                              </div>
                            </Col>
                          </Row>
                          <p className="mt-3 mb-0 text-muted text-sm">
                            <span className="text-success mr-2">
                              <i className="fas fa-arrow-up" /> 12%
                            </span>{" "}
                            <span className="text-nowrap">
                              Since last month
                            </span>
                          </p>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row> */}
                </Container>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Fund Lists</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr className="fund-table">
                    <th scope="col" className="fund-name">
                      Fund Name
                    </th>
                    <th scope="col" className="fund-description">
                      Fund Description
                    </th>
                    <th scope="col" className="fund-member">
                      Fund Member
                    </th>
                    <th scope="col" className="created-at">
                      Created At
                    </th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <RenderFundList
                    funds={funds}
                    users={users}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                  />
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0">
                    {/* Render Previous Button */}
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        previous
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                    </PaginationItem>

                    {/* Render Pagination Numbers */}
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i} active={i + 1 === currentPage}>
                        <PaginationLink onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Render Next Button */}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        next
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomeManagement;
