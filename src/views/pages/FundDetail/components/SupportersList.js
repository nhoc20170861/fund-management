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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styled from "@mui/material/styles/styled";
import { formatAmountVND, formatAlgoAmount } from "utils/functions";
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

// Main component
const SupportersList = (props) => {
  const [supporters, setSupporters] = useState([]); // State to hold supporters data
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [timeRange, setTimeRange] = useState("daily");
  const [exchangeRate, setExchangeRate] = useState(0); // To store ALGO to VND exchange rate

  // Fetch the exchange rate from CoinGecko (or another API)
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=vnd"
      );
      const data = await response.json();
      setExchangeRate(data.algorand.vnd); // Set the exchange rate for ALGO to VND
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };
  const fetchSupporters = async (rate) => {
    try {
      const indexerUrl = "https://testnet-idx.algonode.cloud"; // Replace with your Algorand Indexer API URL
      const address =
        props.walletAddress ||
        "MQZFSTFJAI7FYMHNGQBIBQ3WKM4SYHJFYILT6MNM5B65I7DNQONCEVKOOA"; // Replace with your Algorand address

      // Fetch transactions for the address
      const url = `${indexerUrl}/v2/transactions?limit=100&address=${address}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log("🚀 ~ fetchSupporters ~ data:", data);

      const formattedSupporters = data.transactions.map((tx) => {
        const algoAmount = tx["payment-transaction"].amount / 1e6; // Convert microAlgos to Algos
        const vndAmount = algoAmount * rate; // Convert ALGO to VND
        console.log("🚀 ~ formattedSupporters ~ rate:", rate);

        return {
          name: tx.sender, // Or the receiver based on your requirement
          amountAlgo: formatAlgoAmount(algoAmount), // ALGO amount
          amountVND: vndAmount.toFixed(0), // VND amount
          time: new Date(tx["round-time"] * 1000).toLocaleString(), // Convert timestamp
        };
      });

      setSupporters(formattedSupporters);
    } catch (error) {
      console.error("Error fetching supporters:", error);
    }
  };
  useEffect(() => {
    fetchExchangeRate(); // Fetch the exchange rate on component mount
  }, []);

  // When exchange rate is set, fetch supporters data
  useEffect(() => {
    if (exchangeRate !== null) {
      fetchSupporters(exchangeRate);
    }
  }, [exchangeRate]); // Only run when exchangeRate is updated

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
    </Box>
  );
};

export default SupportersList;
