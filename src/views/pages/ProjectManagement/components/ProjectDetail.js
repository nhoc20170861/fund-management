import React, { useEffect } from "react";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Container,
} from "reactstrap";
// core components
import Dashboard from "./DashBoard";
const ProjectDetail = (props) => {
    return (
        <>
            {/* Page content */}

            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                        <Button onClick={props.onBackClick}>Quay lại <span>
                            <i className="ni ni-user-run" style={{ color: "red" }}></i>
                        </span></Button>
                    </Col>
                </Row>
                <Row>
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                        <Card className="card-profile shadow">
                            <Row className="justify-content-center">
                                <Col className="order-lg-2" lg="3">
                                    <div className="card-profile-image">
                                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                className="rounded-circle"
                                                src="https://www.hmi-mbs.fr/wp-content/uploads/2020/08/mir100.png"
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
                                        Connect
                                    </Button>
                                    <Button
                                        className="float-right"
                                        color="default"
                                        href="#pablo"
                                        onClick={(e) => e.preventDefault()}
                                        size="sm"
                                    >
                                        Message
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4">
                                <Row>
                                    <div className="col">
                                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                            <div>
                                                <span className="heading">1.5 m/s</span>
                                                <span className="description">Max. speed</span>
                                            </div>
                                            <div>
                                                <span className="heading">100 kg</span>
                                                <span className="description">Payload</span>
                                            </div>
                                            <div>
                                                <span className="heading">10 h</span>
                                                <span className="description">Run time</span>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="text-center">
                                    <h3>Mir 100</h3>
                                    <div className="h5 font-weight-300">
                                        <i className="ni location_pin mr-2" />
                                        Mobile Industrial Robots
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
                                                                Traffic
                                                            </CardTitle>
                                                            <span className="h2 font-weight-bold mb-0">
                                                                350,897
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
                                                                New users
                                                            </CardTitle>
                                                            <span className="h2 font-weight-bold mb-0">
                                                                2,356
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
                                    <Row className="mt-3">
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
                                    </Row>
                                </Container>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Dashboard />
            </Container>
        </>
    );
};
export default ProjectDetail;
