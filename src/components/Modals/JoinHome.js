import React from "react";
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
  Modal,
  Row,
  Col,
} from "reactstrap";

const JoinHome = (props) => {
  const roomLists = [
    {
      name: "Kitchen",
      id: "kitchen_1",
    },
    {
      name: "Study Room",
      id: "study_room_1",
    },
    {
      name: "Dining Room",
      id: "study_dinning_1",
    },
    {
      name: "Living Room",
      id: "study_living_1",
    },
  ];
  console.log("🚀 ~ file: index.js:20 ~ JoinHome ~ props:", props);
  return (
    <Modal
      className="modal-dialog-centered"
      size="sm"
      isOpen={props.isShowModal}
      toggle={() => {
        props.setIsShowModal();
      }}
    >
      <div className="modal-body p-0">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5">
            <div className="text-center text-muted mb-4">
              <h3 className="mb-0">Create a home</h3>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="bi bi-house-add-fill" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Home Name" type="home_name" />
                </InputGroup>
              </FormGroup>

              <div className="text-center text-muted mb-3">
                <small>------ Add Room -------</small>
              </div>

              {roomLists.map((room, index) => {
                return (
                  <div
                    key={index}
                    className="custom-control custom-checkbox mb-3"
                  >
                    <input
                      className="custom-control-input"
                      id={room.id}
                      type="checkbox"
                    />
                    <label className="custom-control-label" htmlFor={room.id}>
                      <span className="text-muted">{room.name}</span>
                    </label>
                  </div>
                );
              })}
              <div className="text-center">
                <Button className="my-4" color="primary" type="button">
                  Create
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </Modal>
  );
};
export default JoinHome;
