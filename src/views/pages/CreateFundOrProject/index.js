import { useState } from "react";
// react component that copies the given text inside your clipboard
// reactstrap components
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap";
import { Box, Tabs, Tab } from "@mui/material";

// core components
import HeaderCustom from "components/Headers/HeaderCustom.js";
import FormCreateFund from "./FormCreateFund";
import FormCreateProject from "./FormCreateProject";
import FormCreateReceiver from "./FormCreateReceiver";
const CreateFundOrProject = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <>
      <HeaderCustom />

      {/* <DeviceSetting
        isShowModal={isShowModal}
        typeModal={typeModal}
        setIsShowModal={setIsShowModal}
      ></DeviceSetting> */}

      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  aria-label="project tabs"
                  textColor="secondary"
                  indicatorColor="secondary"
                  variant="fullWidth"
                >
                  <Tab label="Tạo Quỹ Từ Thiện" sx={{ fontWeight: "600" }} />
                  <Tab label="Tạo Dự Án" sx={{ fontWeight: "600" }} />
                  <Tab
                    label="Thêm người nhận tiền"
                    sx={{ fontWeight: "600" }}
                  />
                </Tabs>
              </CardHeader>
              <CardBody sx={{ paddingTop: "1rem" }}>
                <div>
                  {selectedTab === 0 && <FormCreateFund />}

                  {selectedTab === 1 && <FormCreateProject />}
                  {selectedTab === 2 && <FormCreateReceiver />}
                </div>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default CreateFundOrProject;
