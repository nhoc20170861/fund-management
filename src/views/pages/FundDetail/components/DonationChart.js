import { useState, useEffect } from "react";
import dayjs from "dayjs"; // Importing dayjs package
import weekOfYear from "dayjs/plugin/weekOfYear";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { format } from "dayjs"; // Update the import for 'format' to use 'dayjs' instead of 'date-fns'
import { groupBy, sumBy } from "lodash";
import _ from "lodash";
dayjs.extend(weekOfYear);
const DonationChart = ({ donationData }) => {
  console.log("🚀 ~ DonationChart ~ donationData:", donationData);
  const [timeRange, setTimeRange] = useState("daily");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Function to group donations based on selected time range
    const processDonationData = () => {
      let groupedData = [];
      let labels = [];

      if (timeRange === "daily") {
        groupedData = groupBy(donationData, (d) =>
          dayjs(new Date(d.time)).format("YYYY-MM-DD")
        );
      } else if (timeRange === "weekly") {
        groupedData = groupBy(
          donationData,
          (d) => dayjs(new Date(d.time)).week() // Use week() function for week of the year
        );
      } else if (timeRange === "monthly") {
        groupedData = groupBy(donationData, (d) =>
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
      console.log("🚀 ~ formattedData ~ formattedData:", formattedData);

      setChartData(formattedData);
    };

    processDonationData();
  }, [timeRange, donationData]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <Box sx={{ marginTop: "1rem" }}>
      {/* Time Range Selector */}
      <Box sx={{ marginTop: 4 }}>
        <FormControl sx={{ marginBottom: 2, minWidth: 120 }}>
          <InputLabel id="time-range-label">Khoảng thời gian</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Khoảng thời gian"
          >
            <MenuItem value="daily">Ngày</MenuItem>
            <MenuItem value="weekly">Tuần</MenuItem>
            <MenuItem value="monthly">Tháng</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Biểu đồ tổng số ủng hộ theo Thời gian
        </Typography>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{
                value: "Thời gian",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                // value: "(VND)",
                angle: -90,
                position: "insideLeft",
              }}
              tickFormatter={(value) => value.toLocaleString("vi-VN")}
            />
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              }
            />
            <Bar dataKey="money" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default DonationChart;
