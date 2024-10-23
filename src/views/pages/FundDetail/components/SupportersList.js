import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
import styled from "@mui/material/styles/styled";
import { Line, Bar } from "react-chartjs-2";
import {
  formatAmountVND,
  formatAlgoAmount,
  getWeekFromTimestamp,
  getGroupedByDay,
} from "utils/functions";
import cfg from "configs";
import DonationChart from "./DonationChart";

// Styled component for pagination
const CustomTablePagination = styled(TablePagination)({
  backgroundColor: "#f5f5f5",
  color: "black",
  fontWeight: "bold",
  fontSize: "16px",
  textAlign: "center",
  "& .MuiToolbar-root p": {
    margin: "0",
  },
});

const transactions = [
  {
    "round-time": 1729443664,
    "payment-transaction": { amount: 308188 },
  },
  {
    "round-time": 1729443422,
    "payment-transaction": { amount: 3081883 },
  },
  {
    "round-time": 1729441641,
    "payment-transaction": { amount: 1539888 },
  },
  {
    "round-time": 1729440929,
    "payment-transaction": { amount: 1000000 },
  },
  // thêm các giao dịch khác ở đây...
];
const groupedByDay = getGroupedByDay(transactions);
const dataByDay = Object.entries(groupedByDay).map(([date, amount]) => ({
  date,
  amount,
}));
console.log("🚀 ~ dataByDay ~ dataByDay:", dataByDay);
// Main component
const SupportersList = (props) => {
  const [supporters, setSupporters] = useState([]); // State to hold supporters data
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [timeRange, setTimeRange] = useState("daily");

  useEffect(() => {
    // When exchange rate is set, fetch supporters data
    const fetchSupporters = async (rate) => {
      try {
        const indexerUrl = cfg.algorand_indexer_server; // Replace with your Algorand Indexer API URL
        const address =
          props.walletAddress ||
          "MQZFSTFJAI7FYMHNGQBIBQ3WKM4SYHJFYILT6MNM5B65I7DNQONCEVKOOA"; // Replace with your Algorand address

        // Fetch transactions for the address
        const url = `${indexerUrl}/v2/transactions?limit=100&address=${address}`;
        const response = await fetch(url);
        const data = await response.json();

        console.log("🚀 ~ fetchSupporters ~ data:", data);

        const formattedSupporters = data.transactions
          .filter((tx) => tx["payment-transaction"].receiver === address)
          .map((tx) => {
            const algoAmount = tx["payment-transaction"].amount / 1e6; // Convert microAlgos to Algos
            const vndAmount = algoAmount * rate; // Convert ALGO to VND
            // console.log("🚀 ~ formattedSupporters ~ rate:", rate);

            return {
              name: tx.sender, // Or the receiver based on your requirement
              amountAlgo: formatAlgoAmount(algoAmount), // ALGO amount
              amountVND: Math.round(vndAmount), // VND amount
              time: new Date(tx["round-time"] * 1000).toLocaleString(), // Convert timestamp
            };
          });

        setSupporters(formattedSupporters);
      } catch (error) {
        console.error("Error fetching supporters:", error);
      }
    };
    fetchSupporters(props.exchangeRate);
  }, []); // Only run when exchangeRate is updated

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const filteredSupporters = supporters.filter((supporter) =>
    supporter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChartData = () => {
    // Transform data for the chart
    return filteredSupporters.map((supporter) => ({
      name: supporter.name,
      amount: supporter.amount,
    }));
  };

  const getXAxisKey = () => {
    // Return key for the X axis
    return "name";
  };

  return (
    <Box sx={{ marginTop: "1rem" }}>
      <Box sx={{ width: "50%", paddingLeft: 2 }}>
        <TextField
          label="Tìm kiếm người ủng hộ"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Người ủng hộ",
                "Số tiền (ALGO)",
                "Số tiền (VND)",
                "Thời gian",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSupporters
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((supporter, index) => (
                <TableRow key={index}>
                  <TableCell>{supporter.name}</TableCell>
                  <TableCell>{supporter.amountAlgo}</TableCell>
                  <TableCell> {formatAmountVND(supporter.amountVND)}</TableCell>
                  <TableCell>{supporter.time}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <CustomTablePagination
          component="div"
          count={filteredSupporters.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 20, 50]}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `Hiển thị ${from}-${to} của ${
              count !== -1 ? count : `nhiều hơn ${to}`
            }`
          }
        />
      </TableContainer>

      <Box sx={{ mt: 16 }}>
        <DonationChart donationData={supporters} />
      </Box>
    </Box>
  );
};

export default SupportersList;
