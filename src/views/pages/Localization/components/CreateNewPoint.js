import * as React from "react";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import { ShowToastMessage } from "utils/ShowToastMessage";
// reactstrap components
import { Form, Row, Col } from "reactstrap";
import { createNewTargetPoint } from "network/ApiAxios";
import { RosContext } from "../index";

const currencies = [
  {
    value: "Charging Station",
    label: "",
  },
  {
    value: "Patient Room",
    label: "",
  },
  {
    value: "Home Point",
    label: "",
  },
  {
    value: "Goal Point",
    label: "",
  },
];
export default function CreateNewPoint({ targetPoint, mapList }) {
  const { mapInfo } = React.useContext(RosContext);
  const [formInput, setFormInput] = React.useState({
    xCoordinate: 0,
    yCoordinate: 0,
    theta: 0,
    pointType: "",
    pointName: "",
    mapId: mapInfo.currentMapId,
  });

  const [validateInputX, setValidateInputX] = React.useState(true);
  const [validateInputY, setValidateInputY] = React.useState(true);
  const [validateInputOri, setValidateInputOri] = React.useState(true);
  const [error, setError] = React.useState("");
  React.useEffect(() => console.log(formInput), [formInput]);
  React.useEffect(() => {
    console.log(
      "🚀 ~ file: CreateNewPoint.js:57 ~ React.useEffect ~ targetPoint:",
      targetPoint
    );
    if (!targetPoint.x || !targetPoint.y || !targetPoint.theta) return;
    else {
      setFormInput({
        ...formInput,
        xCoordinate: +parseFloat(targetPoint.x).toFixed(2),
        yCoordinate: +parseFloat(targetPoint.y).toFixed(2),
        theta: +parseFloat(targetPoint.theta).toFixed(2),
      });
    }
  }, [targetPoint]);

  const handleInput = (evt) => {
    const nameInput = evt.target.name;
    const newValueInput = evt.target.value;
    let checkInput = true;
    const regex = /^[+-]?\d+\.\d{0,2}$/;

    if (nameInput === "xCoordinate") {
      if (newValueInput && !regex.test(newValueInput)) {
        checkInput = false;
        setValidateInputX(false);
      } else setValidateInputX(true);
    }
    if (nameInput === "yCoordinate") {
      if (newValueInput && !regex.test(newValueInput)) {
        checkInput = false;
        setValidateInputY(false);
      } else setValidateInputY(true);
    }
    if (nameInput === "theta") {
      if (newValueInput && !regex.test(newValueInput)) {
        checkInput = false;
        setValidateInputOri(false);
      } else setValidateInputOri(true);
    }
    if (!checkInput) setError("Invalid Input");
    else setError("");

    setFormInput({ ...formInput, [nameInput]: newValueInput });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    let newTargetPoint = { ...formInput };
    if (
      !validateInputX ||
      !formInput.pointType ||
      !validateInputY ||
      !validateInputOri ||
      !formInput.pointName ||
      !formInput.mapId
    )
      setError("All inputs required");
    else {
      setError("");
      console.log(
        "🚀 ~ file: CreateNewPoint.js:77 ~ handleSubmit ~ data:",
        newTargetPoint
      );
      try {
        const response = await createNewTargetPoint(newTargetPoint);

        const { data } = response;
        console.log(
          "🚀 ~ file: CreateNewPoint.js:118 ~ handleSubmit ~ data:",
          data
        );
        if (!data.success) {
          ShowToastMessage({
            title: "createNewTargetPoint",
            message: data.message,
            type: "error",
          });
          return;
        }
        if (data.newPositionGoal) {
          ShowToastMessage({
            title: "createNewTargetPoint",
            message: data.message,
            type: "success",
          });
        }
      } catch (error) {}
    }
  };
  return (
    <>
      <Form>
        <Row className="pb-3">
          <Col md="4">
            <TextField
              fullWidth
              error={!validateInputX}
              value={formInput.xCoordinate ?? ""}
              id="xCoordinate"
              name="xCoordinate"
              label="X Coordinate"
              variant="standard"
              onChange={handleInput}
              helperText={!validateInputX ? "Example input: 10.01" : null}
              InputProps={{
                endAdornment: <InputAdornment position="end">m</InputAdornment>,
              }}
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </Col>
          <Col md="4">
            <TextField
              fullWidth
              value={formInput.yCoordinate ?? ""}
              error={!validateInputY}
              id="yCoordinate"
              name="yCoordinate"
              label="Y Coordinate"
              variant="standard"
              onChange={handleInput}
              helperText={!validateInputY ? "Example input: 10.01" : null}
              InputProps={{
                endAdornment: <InputAdornment position="end">m</InputAdornment>,
              }}
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </Col>
          <Col md="4">
            <TextField
              fullWidth
              value={formInput.theta ?? ""}
              error={!validateInputOri}
              id="theta"
              name="theta"
              label="theta"
              variant="standard"
              onChange={handleInput}
              helperText={!validateInputOri ? "Example input: 10.01" : null}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">rad</InputAdornment>
                ),
              }}
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </Col>
        </Row>
        <Row className="pb-3">
          <Col md="4">
            <TextField
              fullWidth
              value={formInput.pointName ?? ""}
              id="pointName"
              name="pointName"
              label="Point Name"
              variant="standard"
              onChange={handleInput}
            />
          </Col>
          <Col md="4">
            <TextField
              fullWidth
              variant="standard"
              id="pointType"
              name="pointType"
              select
              label="Point Type"
              value={formInput.pointType ?? ""}
              // helperText="Please select your point type"
              onChange={handleInput}
            >
              {currencies.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </Col>
          <Col md="4">
            <TextField
              fullWidth
              variant="standard"
              id="mapId"
              name="mapId"
              select
              label="Map Depend"
              value={formInput.mapId ?? ""}
              helperText="Please select Map you want to create new point "
              // onChange={handleInput}
            >
              {mapList.map((option, index) => (
                <MenuItem
                  key={index}
                  value={option.id}
                  disabled={option.id === formInput.mapId ? false : true}
                >
                  {option.mapName}
                </MenuItem>
              ))}
            </TextField>
          </Col>
        </Row>
        {/* Columns start at 50% wide on mobile and bump up to 33.2% wide on desktop */}
      </Form>
      {error ? (
        <div className="text-muted font-italic">
          <small>
            <span className={`text-red font-weight-700`}>{error}</span>
          </small>
        </div>
      ) : null}
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => {
            setFormInput({
              xCoordinate: "",
              yCoordinate: "",
              theta: "",
              pointType: "",
              pointName: "",
            });
            setError("");
          }}
        >
          Clear
        </Button>

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
        >
          Create
        </Button>
      </Stack>
    </>
  );
}
