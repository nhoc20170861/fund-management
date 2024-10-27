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
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
//
import { useLocalStorage } from "@rehooks/local-storage";
// import dayjs
import dayjs from "dayjs";
// import lodash
import { groupBy, sumBy } from "lodash";
import _ from "lodash";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";
import { formatAlgoAmount, formatAmountVND } from "utils/functions";
import cfg from "configs";

//import Header from "components/Headers/Header.js";

const Dashboard = (props) => {
  const [supporters, setSupporters] = useState([]); // State to hold supporters data
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [timeRange, setTimeRange] = useState("daily");
  const [chartDataBar, setChartDataBar] = useState({
    labels: [],
    datasets: [],
  });
  const [chartDataForLine, setChartDataForLine] = useState({
    labels: [],
    datasets: [],
  });
  const [exchangeRate, setExchangeRate] = useLocalStorage(
    "exchangeRateAlgoToVND",
    0
  ); // To store ALGO to VND exchange rate
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index, type) => {
    e.preventDefault();
    setActiveNav(index);
    // setChartExample1Data("data" + index);
    setTimeRange(type);
  };

  useEffect(() => {
    // When exchange rate is set, fetch supporters data
    const fetchSupporters = async (rate) => {
      try {
        const indexerUrl = cfg.algorand_indexer_server; // Replace with your Algorand Indexer API URL
        const address =
          props.walletAddress ||
          "MQZFSTFJAI7FYMHNGQBIBQ3WKM4SYHJFYILT6MNM5B65I7DNQONCEVKOOA"; // Replace with your Algorand address

        // Fetch transactions for the address
        console.log("🚀 ~ fetchSupporters ~ address:", address);
        const url = `${indexerUrl}/v2/transactions?limit=100&address=${address}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("🚀 ~ fetchSupporters ~ data:", data);

        const formattedSupporters = data.transactions
          .filter((tx) => tx["payment-transaction"].receiver === address)
          .map((tx) => {
            const algoAmount = tx["payment-transaction"].amount / 1e6; // Convert microAlgos to Algos
            const vndAmount = algoAmount * rate; // Convert ALGO to VND
            console.log("🚀 ~ formattedSupporters ~ rate:", rate);

            return {
              name: tx.sender, // Or the receiver based on your requirement
              amountAlgo: formatAlgoAmount(algoAmount), // ALGO amount
              amountVND: Math.round(vndAmount), // VND amount
              time: new Date(tx["round-time"] * 1000).toLocaleString(), // Convert timestamp
            };
          });
        console.log(
          "🚀 ~ formattedSupporters ~ formattedSupporters:",
          formattedSupporters
        );

        setSupporters(formattedSupporters);
      } catch (error) {
        console.error("Error fetching supporters:", error);
      }
    };
    fetchSupporters(exchangeRate);
  }, [props.walletAddress, exchangeRate]); // Only run when exchangeRate is updated

  useEffect(() => {
    // Function to group donations based on selected time range
    const processDonationData = () => {
      let groupedData = [];
      let labels = [];

      if (timeRange === "daily") {
        groupedData = groupBy(supporters, (d) =>
          dayjs(new Date(d.time)).format("YYYY-MM-DD")
        );
      } else if (timeRange === "weekly") {
        groupedData = groupBy(
          supporters,
          (d) => dayjs(new Date(d.time)).week() // Use week() function for week of the year
        );
      } else if (timeRange === "monthly") {
        groupedData = groupBy(supporters, (d) =>
          dayjs(new Date(d.time)).format("YYYY-MM")
        );
      }

      labels = Object.keys(groupedData);
      const formattedData = labels.map((key, index) => {
        return {
          time: key, // X-axis value
          money: sumBy(groupedData[key], "amountVND"), // Y-axis value
        };
      });
      const chartData = {};
      chartData.labels = labels;
      chartData.datasets = [
        {
          label: "donation",
          data: formattedData.map((data, index) => {
            return formatAmountVND(data.money);
          }),
        },
      ];
      setChartDataForLine(chartData);

      // calculate for bar
      const calculateDataForBar = groupBy(supporters, (d) =>
        dayjs(new Date(d.time)).format("YYYY-MM")
      );
      const labels2 = Object.keys(calculateDataForBar);
      const formattedData2 = labels2.map((key, index) => {
        return {
          time: key, // X-axis value
          money: sumBy(calculateDataForBar[key], "amountVND"), // Y-axis value
        };
      });
      const chartData2 = {};
      chartData2.labels = labels2;
      chartData2.datasets = [
        {
          label: "donationMonth",
          data: formattedData2.map((data, index) => {
            return formatAmountVND(data.money);
          }),
          maxBarThickness: 15,
        },
      ];

      console.log("🚀 ~ processDonationData ~ element2:", chartData2);
      setChartDataBar(chartData2);
    };

    processDonationData();
  }, [timeRange, supporters]);

  return (
    <>
      {/* Page content */}

      <Row>
        <Col className="mb-5 mb-xl-0" xl="8">
          <Card className="bg-gradient-default shadow">
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h6 className="text-uppercase text-light ls-1 mb-1">
                    Overview
                  </h6>
                  <h2 className="text-white mb-0">Biểu đồ quyên góp</h2>
                </div>
                <div className="col">
                  <Nav className="justify-content-end" pills>
                    <NavItem>
                      <NavLink
                        className={classnames("py-2 px-3", {
                          active: activeNav === 1,
                        })}
                        href="#pablo"
                        onClick={(e) => toggleNavs(e, 1, "daily")}
                      >
                        <span className="d-none d-md-block">Ngày</span>
                        <span className="d-md-none">M</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames("py-2 px-3", {
                          active: activeNav === 2,
                        })}
                        data-toggle="tab"
                        href="#pablo"
                        onClick={(e) => toggleNavs(e, 2, "weekly")}
                      >
                        <span className="d-none d-md-block">Tuần</span>
                        <span className="d-md-none">W</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </Row>
            </CardHeader>
            <CardBody>
              {/* Chart */}
              <div className="chart">
                <Line
                  data={chartDataForLine}
                  options={chartExample1.options}
                  getDatasetAtEvent={(e) => console.log(e)}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl="4">
          <Card className="shadow">
            <CardHeader className="bg-transparent">
              <Row className="align-items-center">
                <div className="col">
                  <h6 className="text-uppercase text-muted ls-1 mb-1">
                    Số tiền
                  </h6>
                  <h2 className="mb-0">Tổng quyên góp hàng tháng</h2>
                </div>
              </Row>
            </CardHeader>
            <CardBody>
              {/* Chart */}
              <div className="chart">
                <Bar data={chartDataBar} options={chartExample2.options} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
