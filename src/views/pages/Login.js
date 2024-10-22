/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { signin } from "../../network/ApiAxios";

const Login = (props) => {
  const [Email, setUername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const tryLogin = async () => {
    try {
      const response = await signin(Email, password);
      const { data } = response;
      console.log("🚀 ~ file: Login.js:47 ~ tryLogin ~ response:", data);
      if (data.statusCode === 200) {
        // setError("");
        localStorage.setItem("accessToken", data.body.token);
        // localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            email: data.body.email,
            name: data.body.name,
            birthday: data.body.birthday,
          })
        );

        localStorage.setItem("userId", data.body.id);
        localStorage.setItem(
          "projectListForCurrentUser",
          JSON.stringify(data.body.projects)
        );
        // localStorage.setItem(
        //   "FundListForCurrentUser",
        //   JSON.stringify(data.body.funds)
        // );

        navigate("/admin/user-profile", { replace: true });
      } else {
        setPassword("");
        setError(data.message);
      }
    } catch (error) {
      console.log("🚀 ~ file: Login.js:61 ~ tryLogin ~ error:", error);
      setPassword("");
      setError(error?.response?.data?.body || "Lỗi không xác định");
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-1">
            <div className="text-muted text-center mt-2 mb-3">
              <p
                style={{ fontSize: "1rem", fontWeight: "bold", color: "black" }}
              >
                Đăng nhập vào AlgoMind bằng
              </p>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("assets/img/icons/common/facebook.svg").default
                    }
                  />
                </span>
                <span className="btn-inner--text">Facebook</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={require("assets/img/icons/common/google.svg").default}
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <p style={{ color: "black" }}>
                Hoặc đăng nhập bằng địa chỉ email
              </p>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="Email"
                    autoComplete="Email"
                    value={Email}
                    onChange={(e) => setUername(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
                <div className="custom-control custom-checkbox mb-3">
                  <br />
                  <input
                    className="custom-control-input"
                    defaultChecked
                    id="customCheck2"
                    type="checkbox"
                  />
                  {/* <label
                    className="custom-control-label"
                    htmlFor="customCheck2"
                  >
                    Save me
                  </label> */}
                </div>
              </FormGroup>
              {/*<div className="custom-control custom-control-alternative custom-checkbox">*/}
              {/*    <input*/}
              {/*        className="custom-control-input"*/}
              {/*        id=" customCheckLogin"*/}
              {/*        type="checkbox"*/}
              {/*    />*/}
              {/*    <label*/}
              {/*        className="custom-control-label"*/}
              {/*        htmlFor=" customCheckLogin"*/}
              {/*    >*/}
              {/*        <span className="text-muted">Remember me</span>*/}
              {/*    </label>*/}
              {/*</div>*/}
              {error ? (
                <div className="text-muted font-italic">
                  <small>
                    error:{" "}
                    <span className="text-red font-weight-700">{error}</span>
                  </small>
                </div>
              ) : null}
              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  block
                  onClick={tryLogin}
                >
                  Đăng nhập
                </Button>
              </div>
            </Form>
            <Row className="mt-3">
              <Col xs="6">
                <a
                  href="#"
                  className="text-light"
                  onClick={() => navigate("/reset-password")}
                >
                  <p style={{ color: "black" }}>Quên mật khẩu?</p>
                </a>
              </Col>
              <Col className="text-right" xs="6">
                <a
                  href="#"
                  className="text-light"
                  onClick={() => navigate("/register")}
                >
                  <p style={{ color: "black" }}>Tạo tài khoản mới</p>
                </a>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
