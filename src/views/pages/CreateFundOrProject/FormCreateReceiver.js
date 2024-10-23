import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import {
  getProjectDetailByUserAndFundId,
  addReceiverForOneProject,
  getFundsForOneUser,
} from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";
import {
  writeStorage,
  deleteFromStorage,
  useLocalStorage,
} from "@rehooks/local-storage";

const wallet_type = {
  pera: "Pera Wallet",
};

const FormCreateReceiver = () => {
  // Initialize Pera Wallet
  const peraWallet = new PeraWalletConnect();
  const [fundListForCurrUser, setFundListForCurrUser] = useLocalStorage(
    "fundListForCurrUser",
    []
  );
  const [formData, setFormData] = useState({
    email: "",
    sodienthoai: "",
    address: "",
    name: "",
    type_receiver_wallet: "Pera",
    receiver_wallet_address: null,
  });

  const [isValidAddress, setIsValidAddress] = useState(null); // Track address validity
  const [errorMessage, setErrorMessage] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [fundIdSlected, setFundIdSelected] = useState(0);
  const [projectListForCurrentUser, setProjectListForCurrentUser] =
    useLocalStorage("projectListForCurrentUser", []);

  // Validate Algorand wallet address
  const validateAlgorandAddress = (address) => {
    try {
      if (algosdk.isValidAddress(address)) {
        setIsValidAddress(true);
        setErrorMessage("");
      } else {
        setIsValidAddress(false);
        setErrorMessage("Invalid Algorand wallet address.");
      }
    } catch (error) {
      setIsValidAddress(false);
      setErrorMessage("Invalid address format.");
    }
  };

  useEffect(() => {
    const fetchAllFundsForThisUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getFundsForOneUser(userId);

        const { data } = response;
        setFundListForCurrUser(data.body);
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchAllFundsForThisUser ~ error:",
          error
        );
      }
    };
    fetchAllFundsForThisUser();
  }, []);

  useEffect(() => {
    const fetchAllProjectByFunds = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getProjectDetailByUserAndFundId(
          userId,
          fundIdSlected
        );

        const { data } = response;
        console.log("🚀 ~ fetchAllProjectByFunds ~ data:", data);

        if (data.statusCode === 200) {
          setProjectListForCurrentUser(data.body);
        } else {
          ShowToastMessage({
            title: "get project",
            message: "Lấy dự án không thành công",
            type: "error",
          });
        }
      } catch (error) {
        console.log(
          "🚀 ~ file: index.js:223 ~ fetchAllProjectByFunds ~ error:",
          error
        );
      }
    };
    fetchAllProjectByFunds();
  }, [fundIdSlected]);

  useEffect(() => {
    const disconnectWallet = async () => {
      try {
        await peraWallet.disconnect();
        setWalletConnected(false);
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    };

    disconnectWallet();

    // Cleanup function để ngắt kết nối khi component unmount
    return () => {
      if (walletConnected) {
        peraWallet.disconnect().catch((error) => {
          console.error("Error during cleanup disconnect:", error);
        });
      }
    };
  }, []); // Chỉ chạy một lần khi component được mount

  const handleInpuTFundIdChange = (e) => {
    const { name, value } = e.target;
    setFundIdSelected(value);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "receiver_wallet_address") {
      validateAlgorandAddress(e.target.value); // Validate the address on input
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    const finalData = {
      ...formData,
    };
    // You can submit this data to your backend
    e.preventDefault();
    if (isValidAddress) {
      console.log(
        "Submitting valid wallet address:",
        formData.receiver_wallet_address
      );
      // Handle form submission logic here (e.g., send to backend)

      try {
        console.log("Submitted Receiver data:", finalData);
        finalData.project_hash = formData.receiver_wallet_address;
        const response = await addReceiverForOneProject(finalData);
        const { data } = response;
        if (data.id) {
          ShowToastMessage({
            title: "Create project",
            message: "Thêm người nhận thành công",
            type: "success",
          });
        } else {
          ShowToastMessage({
            title: "Create project",
            message: "Thêm người nhận không thành công",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting project data:", error);
      }
    } else {
      setErrorMessage("Please enter a valid Algorand wallet address.");
    }
  };

  // Connect to Pera Wallet and retrieve the address
  const connectPeraWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      console.log("🚀 ~ connectPeraWal ~ accounts:", accounts);
      peraWallet.connector?.on("disconnect", handleDisconnectWallet);
      setFormData((prevData) => ({
        ...prevData,
        receiver_wallet_address: accounts[0],
      }));

      setIsValidAddress(true);
      setWalletConnected(true);
    } catch (error) {
      setErrorMessage("Error connecting to Pera Wallet.");
      console.error(error);
    }
  };

  const handleDisconnectWallet = () => {
    peraWallet.disconnect();
    setWalletConnected(false);
    setFormData((prevData) => ({
      ...prevData,
      receiver_wallet_address: "",
    }));
  };

  return (
    <Box sx={{ p: 2, width: "100%", mx: "auto" }}>
      <Grid container spacing={2}>
        {/* Project Name */}
        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        {/* Fund Raise Total */}
        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Mobile phone"
              name="sodienthoai"
              value={formData.sodienthoai}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Your name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Địa chỉ  */}
        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        <Grid item size={4}>
          {/* Fund ID (Dropdown) */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="fundId"
              name="fund_id"
              value={fundIdSlected}
              onChange={handleInpuTFundIdChange}
              label="Tổ chức Quỹ"
              fullWidth
              variant="standard"
              required
              select
              helperText="Hãy chọn Quỹ mà bạn muốn tạo dự án"
            >
              {fundListForCurrUser.map((fund) => (
                <MenuItem key={fund.id} value={fund.id}>
                  {fund.name_fund}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item size={4}>
          {/* Status (Dropdown) */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="project_id"
              name="project_id"
              value={formData.project_id ?? ""}
              onChange={handleInputChange}
              label="Chọn dự án"
              fullWidth
              required
              select
              helperText="Hãy chọn dự án bạn muốn thêm người nhận tiền"
            >
              {projectListForCurrentUser.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Wallet Address */}
        <Grid size={8}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Wallet Address"
              name="receiver_wallet_address"
              value={formData.receiver_wallet_address ?? ""}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{
                endAdornment:
                  isValidAddress !== null &&
                  (isValidAddress ? (
                    <CheckCircleOutlineIcon color="success" />
                  ) : (
                    <ErrorOutlineIcon color="error" />
                  )),
              }}
            />
            {errorMessage && (
              <Typography variant="body2" color="error">
                {errorMessage}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item size={4}>
          {/* Type (Dropdown) */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="type_receiver_wallet"
              name="type_receiver_wallet"
              value={formData.type_receiver_wallet ?? ""}
              onChange={handleInputChange}
              label="Loại Ví"
              fullWidth
              required
              select
            >
              {Object.entries(wallet_type).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        {/* Pera Wallet Connect Button */}
        {walletConnected ? (
          <Typography variant="body2" color="green" gutterBottom>
            Connected to Pera Wallet: {formData.receiver_wallet_address}
          </Typography>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={connectPeraWallet}
            sx={{ mt: 2 }}
          >
            Connect via Pera Wallet
          </Button>
        )}
      </Grid>
      {/* Submit Button */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormCreateReceiver;
