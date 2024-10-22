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
  UncontrolledTooltip,
} from "reactstrap";
import {
  writeStorage,
  deleteFromStorage,
  useLocalStorage,
} from "@rehooks/local-storage";
import Avatar from "@mui/material/Avatar";
import HeaderCustom from "components/Headers/HeaderCustom.js";
import MemberList from "./components/MemberList";
import DropdownAction from "./components/DropdownAction";
import { getFundsForOneUser, getAllUsers } from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";

const RenderFundList = ({ fundList, users, currentPage, rowsPerPage }) => {
  // Calculate the starting index of the items for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const selectedFunds = fundList.slice(startIndex, startIndex + rowsPerPage);

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
                          "https://pbs.twimg.com/profile_images/962068712772616196/eYwuB0TO_400x400.jpg"
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

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const rowsPerPage = 5; // Set rows per page to 5

  const handleBtnClick = (key) => {
    // const url = location.pathname + "/" + key;
    // console.log("🚀 ~ file: index.js:107 ~ handleBtnClick ~ url:", url);
    // navigate(url);
    // setIsShowModal(!isShowModal);
  };
  const [projectListForCurrentUser, setProjectListForCurrentUser] = useState(
    () => {
      const projectList = JSON.parse(
        localStorage.getItem("ProjectListForCurrentUser")
      );

      return projectList || [];
    }
  );
  const currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [fundList, setFundList] = useLocalStorage("fundList", []);

  useEffect(() => {
    const fetchAllFundsForThisUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getFundsForOneUser(userId);

        const { data } = response;
        console.log("🚀 ~ fetchAllFundsForThisUser ~ data:", data);
        if (data.statusCode !== 200) {
          ShowToastMessage({
            title: "fetchAllFundsForThisUser",
            message: "Loading funds failed",
            type: "error",
          });
          return;
        }
        ShowToastMessage({
          title: "fetchAllFundsForThisUser",
          message: "funds loaded successfully",
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

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(fundList.length / rowsPerPage); // Calculate total pages

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
                        <span className="heading">{fundList.length}</span>
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
          <Col className="order-xl-1 mb-5 mb-xl-0" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="text-center border-0 pt-8 pt-md-2 pb-0 pb-md-4">
                Select to View Fund Details
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                {/* Table */}
                <Row>
                  <Col>
                    <div
                      style={{
                        maxHeight: "400px", // Set the maximum height for the container
                        overflowY: "auto", // Enable vertical scrolling
                      }}
                    >
                      <Row className="icon-examples">
                        {fundList.map((fund, index) => {
                          return (
                            <Col
                              lg="4"
                              md="6"
                              sm="12"
                              key={index}
                              className="mb-4"
                            >
                              {/* Button for fund */}
                              <Button
                                fullWidth
                                className="custom-border-box"
                                type="button"
                                id={`tooltip${index}`}
                                onClick={() => handleBtnClick(fund.id ?? 1)}
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
                                    {/* Fund name with ellipsis if it's too long */}
                                    <span
                                      className="mb-0 text-sm font-weight-bold"
                                      style={{
                                        display: "inline-block",
                                        maxWidth: "150px", // Adjust this width based on your button size
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {fund.name_fund}
                                    </span>
                                  </Media>
                                </Media>
                              </Button>

                              {/* Tooltip to show full fund name */}
                              <UncontrolledTooltip
                                delay={0}
                                trigger="hover focus"
                                target={`tooltip${index}`}
                              >
                                {fund.name_fund}
                              </UncontrolledTooltip>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  </Col>
                </Row>
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
                    fundList={fundList}
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

export default UserProfile;
