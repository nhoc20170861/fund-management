import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import DescriptionField from "./components/DescriptionField";
import { getFundsForOneUser, createNewProject } from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";
const fundLabel = {
  children: "Trẻ em",
  healthcare: "Y tế",
  education: "Giáo dục",
  disaster: "Thiên tai",
  environment: "Môi trường",
};

const statusOptions = ["pending", "approved", "rejected"];

// Styled component for image links
const ImageLinkField = styled(TextField)({
  marginBottom: "10px",
});

const ProjectForm = () => {
  // Initialize Pera Wallet
  const peraWallet = new PeraWalletConnect();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fund_id: "",
    type: "",
    status: "",
    deadline: null,
    linkcardImage: [""],
    wallet_address: "",
  });

  const [funds, setFunds] = useState([]); // Fund IDs fetched from server
  const [isValidAddress, setIsValidAddress] = useState(null); // Track address validity
  const [errorMessage, setErrorMessage] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const [imageErrors, setImageErrors] = useState({}); // To track which images are invalid

  const isValidImageURL = (url) => {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  };

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
        setFunds(data.body);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "wallet_address") {
      validateAlgorandAddress(e.target.value); // Validate the address on input
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeadlineChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      deadline: date,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.linkcardImage];
    newImages[index] = value;
    if (!isValidImageURL(value)) {
      setImageErrors((prevErrors) => ({
        ...prevErrors,
        [index]: "Invalid image URL",
      }));
    } else {
      setImageErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[index]; // Remove error if the image is valid
        return newErrors;
      });
    }
    setFormData((prevData) => ({
      ...prevData,
      linkcardImage: newImages,
    }));
  };

  const addImageField = () => {
    setFormData((prevData) => ({
      ...prevData,
      linkcardImage: [...prevData.linkcardImage, ""],
    }));
  };

  const removeImageField = (index) => {
    const newImages = formData.linkcardImage.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      linkcardImage: newImages,
    }));
  };

  const handleFormSubmit = async (e) => {
    const user_id = localStorage.getItem("userId"); // Get user_id from localStorage
    const finalData = {
      ...formData,
      user_id,
      current_fund: 0,
      fund_raise_count: 0,
      is_verify: true,
    };
    // You can submit this data to your backend
    e.preventDefault();
    if (isValidAddress && Object.keys(imageErrors).length === 0) {
      console.log("Submitting valid wallet address:", formData.wallet_address);
      // Handle form submission logic here (e.g., send to backend)

      try {
        console.log("Submitted Project Data:", finalData);
        finalData.project_hash = formData.wallet_address;
        const response = await createNewProject(finalData);
        const { data } = response;
        if (data.id) {
          ShowToastMessage({
            title: "Create project",
            message: "Tạo dự án thành công",
            type: "success",
          });
        } else {
          ShowToastMessage({
            title: "Create project",
            message: "Tạo dự án không thành công",
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
        wallet_address: accounts[0],
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
      wallet_address: "",
    }));
  };

  return (
    <Box sx={{ p: 2, width: "100%", mx: "auto" }}>
      <Grid container spacing={2}>
        {/* Project Name */}
        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Project Name"
              name="name"
              value={formData.name}
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
              label="Fund Raise Total"
              name="fund_raise_total"
              type="number"
              value={formData.fund_raise_total}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </FormControl>
        </Grid>

        {/* Deadline (Date Picker) */}
        <Grid item size={4}>
          <FormControl fullWidth margin="normal">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Deadline"
                value={formData.deadline}
                onChange={handleDeadlineChange}
                shouldDisableDate={(date) =>
                  dayjs(date).isBefore(dayjs(), "day")
                } // Disable past dates
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>
      </Grid>

      {/* Wallet Address */}
      <FormControl fullWidth margin="normal">
        <TextField
          label="Wallet Address"
          name="wallet_address"
          value={formData.wallet_address ?? ""}
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
      {/* Pera Wallet Connect Button */}
      {walletConnected ? (
        <Typography variant="body2" color="green" gutterBottom>
          Connected to Pera Wallet: {formData.wallet_address}
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
      <Grid container spacing={2}>
        {/* Project Name */}
        <Grid item size={4}>
          {/* Fund ID (Dropdown) */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="fundId"
              name="fund_id"
              value={formData.fund_id ?? ""}
              onChange={handleInputChange}
              label="Tổ chức Quỹ"
              fullWidth
              variant="standard"
              required
              select
              helperText="Hãy chọn Quỹ mà bạn muốn tạo dự án"
            >
              {funds.map((fund) => (
                <MenuItem key={fund.id} value={fund.id}>
                  {fund.name_fund}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item size={4}>
          {/* Type (Dropdown) */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="fundType"
              name="type"
              value={formData.type ?? ""}
              onChange={handleInputChange}
              label="Loại Dự án"
              fullWidth
              variant="standard"
              required
              select
            >
              {Object.entries(fundLabel).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item size={4}>
          {/* Status (Dropdown) */}
          <FormControl fullWidth margin="normal">
            <TextField
              id="status"
              label="Trạng thái Dự án"
              name="status"
              value={formData.status ?? ""}
              onChange={handleInputChange}
              fullWidth
              required
              select
              variant="standard"
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>

      {/* Image Links (Multiple) */}
      <Typography variant="body1" gutterBottom mt={2}>
        Image Links:
      </Typography>
      {formData?.linkcardImage &&
        formData?.linkcardImage.map((image, index) => (
          <Grid container alignItems="center" spacing={1} key={index}>
            <Grid item size="grow">
              <ImageLinkField
                label={`Image Link ${index + 1}`}
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                fullWidth
                required
              />
              {/* Error Message */}
              {imageErrors[index] && (
                <Typography variant="body2" color="error">
                  {imageErrors[index]}
                </Typography>
              )}
            </Grid>
            {/* Image Preview (if URL is valid) */}
            {isValidImageURL(image) ? (
              <Grid item xs={2}>
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              </Grid>
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              ></div>
            )}
            <Grid item xs={2}>
              <IconButton onClick={() => removeImageField(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addImageField}
        sx={{ mt: 2 }}
      >
        Add Another Image
      </Button>

      {/* Markdown Description Editor */}
      <DescriptionField
        description={formData.description}
        setFormData={setFormData}
      />

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

export default ProjectForm;

// Helper function to check if URL is a valid image
const isValidImageURL = (url) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
};
