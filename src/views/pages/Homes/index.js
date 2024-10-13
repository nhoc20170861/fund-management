/*!

=========================================================
* Argon Dashboard React-v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState } from "react";
// react component that copies the given text inside your clipboard

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Col,
  UncontrolledTooltip,
  Button,
  Badge,
  CardFooter,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Row,
} from "reactstrap";
// core components
import HeaderCustom from "components/Headers/HeaderCustom.js";
import CreateNewHome from "components/Modals/CreateNewHome";
import AvatarGroup from "./components/AvatarGroup";
import DropdownAction from "./components/DropdownAction";
import { getAll } from "network/ApiAxios";

const RenderHomeLists = () => {
  return (
    <tr>
      <th scope="row">
        <Media className="align-items-center">
          <a
            className="avatar rounded-circle mr-3"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <img alt="..." src={require("assets/img/theme/bootstrap.jpg")} />
          </a>
          <Media>
            <span className="mb-0 text-sm">Argon Design System</span>
          </Media>
        </Media>
      </th>
      <td>$2,500 USD</td>
      <td>
        <Badge color="" className="badge-dot mr-4">
          <i className="bg-warning" />
          pending
        </Badge>
      </td>
      <td>
        <AvatarGroup></AvatarGroup>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <span className="mr-2">60%</span>
          <div>
            <Progress max="100" value="60" barClassName="bg-warning" />
          </div>
        </div>
      </td>
      <td className="text-right">
        <DropdownAction></DropdownAction>
      </td>
    </tr>
  );
};
const HomeManagement = () => {
  const homeServices = [
    {
      icon: "bi bi-house-add",
      name: "Create a home",
      id: "Home" + Math.floor(Math.random() * 16777215).toString(16),
      tooltip_content: "Select Home",
      typeModal: "CreateHome",
    },
    {
      icon: "bi bi-houses",
      name: "Join a home",
      id: "Home" + Math.floor(Math.random() * 16777215).toString(16),
      tooltip_content: "Select Home",
      typeModal: "JoinHome",
    },
  ];
  const [isShowModal, setIsShowModal] = useState(false);
  const [typeModal, setTypeModal] = useState("Default");

  const toggleModal = (typeModal) => {
    setIsShowModal(!isShowModal);
    setTypeModal(typeModal);
  };
  return (
    <>
      <HeaderCustom />
      <CreateNewHome
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        type={typeModal}
      >
        {" "}
      </CreateNewHome>

      {/* Page content */}

      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0"> Home Services </h3>
              </CardHeader>
              <CardBody>
                <Row className="icon-examples">
                  {homeServices.map((device, index) => {
                    return (
                      <Col lg="3" md="6">
                        <Button
                          className="btn-icon-clipboard"
                          data-placement="top"
                          id={device.id}
                          type="button"
                          onClick={() => toggleModal(device.typeModal)}
                        >
                          <div key={index}>
                            <i className={device.icon} />
                            <span> {device.name} </span>
                          </div>
                        </Button>
                        {/* <UncontrolledTooltip
                          delay={0}
                          trigger="hover"
                          target={device.id}
                        >
                          {device.tooltip_content}
                        </UncontrolledTooltip> */}
                      </Col>
                    );
                  })}
                </Row>
                <Row className="icon-examples">
                  <Col lg="3" md="6">
                    <Button
                      className="btn-icon-clipboard"
                      data-placement="top"
                      type="button"
                      onClick={() => getAll()}
                    >
                      <div>
                        <i className="bi bi-house" />
                        <span> test </span>
                      </div>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Row>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0"> Home Lists </h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col"> Home Name </th>
                    <th scope="col"> Room Management </th>
                    <th scope="col"> Home Owner </th>
                    <th scope="col"> Home Member </th>
                    <th scope="col"> location </th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <RenderHomeLists />
                  <tr>
                    <th scope="row">
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            src={require("assets/img/theme/angular.jpg")}
                          />
                        </a>
                        <Media>
                          <span className="mb-0 text-sm">
                            Angular Now UI Kit PRO
                          </span>
                        </Media>
                      </Media>
                    </th>
                    <td> $1, 800 USD </td>
                    <td>
                      <Badge color="" className="badge-dot">
                        <i className="bg-success" />
                        completed
                      </Badge>
                    </td>
                    <td>
                      <div className="avatar-group">
                        <a
                          className="avatar avatar-sm"
                          href="#pablo"
                          id="tooltip746418347"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={require("assets/img/theme/team-1-800x800.jpg")}
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip746418347"
                        >
                          Ryan Tompson
                        </UncontrolledTooltip>
                        <a
                          className="avatar avatar-sm"
                          href="#pablo"
                          id="tooltip102182364"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={require("assets/img/theme/team-2-800x800.jpg")}
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip102182364"
                        >
                          Romina Hadid
                        </UncontrolledTooltip>
                        <a
                          className="avatar avatar-sm"
                          href="#pablo"
                          id="tooltip406489510"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={require("assets/img/theme/team-3-800x800.jpg")}
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip406489510"
                        >
                          Alexander Smith
                        </UncontrolledTooltip>
                        <a
                          className="avatar avatar-sm"
                          href="#pablo"
                          id="tooltip476840018"
                          onClick={(e) => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            className="rounded-circle"
                            src={require("assets/img/theme/team-4-800x800.jpg")}
                          />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip476840018"
                        >
                          Jessica Doe
                        </UncontrolledTooltip>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2"> 100 % </span>
                        <div>
                          <Progress
                            max="100"
                            value="100"
                            barClassName="bg-success"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-right"></td>
                  </tr>
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only"> Previous </span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only"> (current) </span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only"> Next </span>
                      </PaginationLink>
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
