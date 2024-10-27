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
import Toast from "react-bootstrap/Toast";
import { register } from "../../network/ApiAxios";
import configs from "configs";

const Register = () => {
  const [yourName, setYourName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDay, setBirthdate] = useState("");
  const [checkbox, setCheckbox] = useState(false);

  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "Email sent! Check it to reset your password."
  );
  const [userID, setUserID] = useState(null);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const registerUser = async () => {
    if (
      !(
        yourName &&
        email &&
        password &&
        confirmPassword &&
        birthDay &&
        checkbox
      )
    ) {
      setError(
        "Make sure to fill all the inputs and agree to the privacy policy"
      );
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    } else {
      setError(null);
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Passwords must have 6 characters");
      return;
    }

    const payload = {
      yourName,
      email,
      password,
      birthDay,
    };

    try {
      console.log("🚀 ~ registerUser ~ payload:", payload);
      const response = await register(payload);

      const { data } = response;
      if (data.statusCode !== 200) {
        setError("Something went wrong, please try again");
        return;
      }
      if (configs.DEMO) {
        setToastMessage(
          "This is a demo, so we will not send you an email. Instead, click on this link to verify your account:"
        );
        setUserID(data.user.id || null);
      }
      setError("");
      setYourName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCheckbox(false);
      setShowToast(true);
    } catch (error) {
      console.log("🚀 ~ file: Login.js:61 ~ tryRegister ~ error:", error);
    }
  };

  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          minHeight: "100px",
          width: "35%",
          right: 10,
          bottom: 80,
          zIndex: 50,
        }}
      >
        <Toast
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
          }}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={10000}
          autohide={!configs.DEMO}
        >
          <Toast.Header>
            <img
              style={{ height: "30px", width: "100px" }}
              src={require("assets/img/brand/argon-react.png").default}
              alt="..."
            />
          </Toast.Header>
          <Toast.Body>
            {toastMessage}
            {configs.DEMO ? (
              <a href={configs.APP_DOMAIN_NAME + "/confirm-email/" + userID}>
                {configs.APP_DOMAIN_NAME + "/confirm-email/" + userID}
              </a>
            ) : null}
          </Toast.Body>
        </Toast>
      </div>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent">
            <div className="text-muted text-center mt-2 mb-4">
              <p
                style={{ fontSize: "1rem", fontWeight: "bold", color: "black" }}
              >
                Đăng ky tài khoản AlgoMind bằng
              </p>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon mr-4"
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
                Hoặc đăng ký bằng thông tin đăng nhập
              </p>
            </div>
            <Form role="form">
              <Row>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Your name"
                        type="text"
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-calendar-grid-58" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Birthdate"
                        type="date"
                        value={birthDay}
                        onChange={(e) => setBirthdate(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    placeholder="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>

              {error ? (
                <div className="text-muted font-italic">
                  <small>
                    error:{" "}
                    <span className="text-red font-weight-700">{error}</span>
                  </small>
                </div>
              ) : null}
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                      checked={checkbox}
                      onChange={() => setCheckbox(!checkbox)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button
                  onClick={registerUser}
                  className="mt-4"
                  color="primary"
                  type="button"
                  block
                >
                  Đăng ký
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
