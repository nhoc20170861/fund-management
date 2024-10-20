import React, { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Button,
  Typography,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Icon for copy
import { ShowToastMessage } from "utils/ShowToastMessage";
import configs from "configs";
const peraWallet = new PeraWalletConnect();
const algodToken = ""; // Thay bằng API key của Algorand node
const algodServer = configs.ALGORAND_SERVER;
const algodPort = configs.ALGORAND_SERVER_PORT;

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const DonateModal = ({
  open,
  handleCloseModal,
  walletAddress: walletAddressOfProject,
}) => {
  const [anonymous, setAnonymous] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [usdEquivalent, setUsdEquivalent] = useState(""); // State for VND
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(0); // Tỷ giá ALGO/VND

  useEffect(() => {
    // Lấy tỷ giá hối đoái từ CoinGecko API
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=VND"
        );
        const data = await response.json();
        setExchangeRate(data.algorand.vnd); // Lưu tỷ giá vào state
      } catch (error) {
        console.error("Lỗi khi lấy tỷ giá:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  const handleAnonymousChange = (event) => {
    setAnonymous(event.target.checked);
  };

  const handleDonationChange = (event) => {
    let vndAmount = event.target.value;

    // Loại bỏ dấu chấm và dấu phẩy để nhận được số nguyên
    vndAmount = vndAmount.replace(/[,.]/g, "");

    setDonationAmount(vndAmount);

    // Tính toán số tiền ALGO tương ứng
    if (!isNaN(vndAmount) && vndAmount > 0) {
      const algoAmount = (vndAmount / exchangeRate).toFixed(6); // Chuyển đổi VND sang ALGO
      setUsdEquivalent(algoAmount);
    } else {
      setUsdEquivalent("");
    }
  };

  // Địa chỉ ví quỹ
  const fundWalletAddress =
    walletAddressOfProject ||
    "MQZFSTFJAI7FYMHNGQBIBQ3WKM4SYHJFYILT6MNM5B65I7DNQONCEVKOOA";

  // Ngắt kết nối khi component được mount
  // useEffect(() => {
  //   const disconnectWallet = async () => {
  //     if (walletConnected) {
  //       await peraWallet.disconnect();
  //       setWalletConnected(false);
  //       setUserAddress(null);
  //     }
  //   };

  //   disconnectWallet();

  //   // Cleanup function để ngắt kết nối khi component unmount
  //   return () => {
  //     disconnectWallet();
  //   };
  // }, []); // Chỉ chạy một lần khi component được mount

  useEffect(() => {
    // Reconnect to the session when the component is mounted

    peraWallet
      .reconnectSession()
      .then((accounts) => {
        // Setup the disconnect event listener
        peraWallet.connector?.on("disconnect", handleDisconnectWallet);

        if (peraWallet.isConnected && accounts.length) {
          setUserAddress(accounts[0]);
          setWalletConnected(true);
        }
      })
      .catch((error) => {
        console.error("Error reconnecting the session:", error);
      });
  }, []);

  // Thiết lập kết nối với Pera Wallet
  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      peraWallet.connector?.on("disconnect", handleDisconnectWallet);
      setUserAddress(accounts[0]);
      setWalletConnected(true);
      console.log("🚀 ~ connectWal ~ accounts:", accounts);
    } catch (error) {
      console.error("Lỗi kết nối ví:", error);
    }
  };

  const handleDisconnectWallet = () => {
    peraWallet.disconnect();
    setWalletConnected(false);
    setUserAddress(null);
  };

  const sendTransaction = async () => {
    if (!walletConnected) {
      alert("Bạn cần kết nối với ví trước!");
      return;
    }
    console.log("🚀 ~ sendTransaction ~ fundWalletAddress:", fundWalletAddress);
    if (!fundWalletAddress) {
      alert("Địa chỉ ví dự án không hợp lệ!");
      return;
    }
    if (!userAddress) {
      alert("Địa chỉ ví của bạn không hợp lệ!");
      return;
    }
    console.log("🚀 ~ sendTransaction ~ userAddress:", userAddress);

    async function getNodeStatus() {
      try {
        const status = await algodClient.status().do();
        console.log("Node status:", status);
      } catch (err) {
        console.error("Failed to get node status:", err);
      }
    }

    // Call the function to print the node status
    getNodeStatus();

    const acctInfo = await algodClient
      .accountInformation(fundWalletAddress)
      .do();

    const acctInfoUser = await algodClient.accountInformation(userAddress).do();
    console.log(`Account balance: ${acctInfo.amount} microAlgos`);
    console.log(
      `Account balance userAddress: ${acctInfoUser.amount} microAlgos`
    );
    if (parseFloat(usdEquivalent) <= 0 || isNaN(parseFloat(usdEquivalent))) {
      alert("Số tiền quyên góp không hợp lệ!");
      return;
    }

    console.log("🚀 ~ sendTransaction ~ usdEquivalent:", usdEquivalent);
    const suggestedParams = await algodClient.getTransactionParams().do();
    console.log("Suggested Params:", suggestedParams);

    const txGroups = await generatePaymentTxns({
      sender: userAddress,
      receiver: fundWalletAddress,
      amountAlgo: parseInt(usdEquivalent * 1000000, 10),
    });
    console.log("Transaction:", txGroups);
    try {
      const signedTxn = await peraWallet.signTransaction([txGroups]);
      console.log("Signed Transaction:", signedTxn);
      handleCloseModal();
      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      console.log(`txns signed successfully! - txID: ${txId}`);
      ShowToastMessage({
        title: "Payment Transaction",
        message: `Giao dịch thành công! - txID: ${txId}`,
        type: "success",
      });
      // alert("Giao dịch thành công!");
    } catch (error) {
      console.log("Couldn't sign payment txns", error);
      alert("Giao dịch thất bại. Vui lòng thử lại.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(fundWalletAddress)
      .then(() => {
        alert("Đã sao chép địa chỉ ví vào clipboard!"); // Show success message
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          margin: "100px auto",
          width: "35rem",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          - Địa chỉ ví của Dự án:
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h7"
            component="h2"
            gutterBottom
            sx={{
              wordWrap: "break-word",
              fontWeight: "bold",
              width: "80%",
            }}
          >
            {fundWalletAddress}
            {/* Add an icon button for copying */}
          </Typography>
          <Tooltip title="Sao chép địa chỉ ví">
            <IconButton onClick={copyToClipboard} sx={{ ml: 1 }}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h6" component="h2" gutterBottom>
          - Nhập Thông Tin Ủng Hộ
        </Typography>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={6}>
            <TextField
              label="Họ và tên"
              variant="outlined"
              fullWidth
              required
              disabled={anonymous}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              required
              disabled={anonymous}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              label="Địa chỉ"
              variant="outlined"
              fullWidth
              required
              disabled={anonymous}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Địa chỉ Email"
              variant="outlined"
              fullWidth
              required
              disabled={anonymous}
            />
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Checkbox
              checked={anonymous}
              onChange={handleAnonymousChange}
              name="anonymous"
            />
          }
          label="Ủng hộ ẩn danh"
        />

        {/* TextField nhập tiền VND */}
        <TextField
          label="Số tiền quyên góp (VND)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={donationAmount}
          onChange={handleDonationChange}
          helperText={"Ví dụ số tiền: 50.000"}
          required
          InputProps={{
            endAdornment: <InputAdornment position="end">đ</InputAdornment>,
          }}
        />

        {/* Hiển thị số tiền ALGO tương ứng */}
        {usdEquivalent && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Số tiền tương ứng: {usdEquivalent} ALGO
          </Typography>
        )}

        {/* Kết nối ví */}
        {walletConnected && (
          <Typography
            variant="body2"
            color="green"
            gutterBottom
            sx={{ wordWrap: "break-word" }}
          >
            Ví đã kết nối: {userAddress}
          </Typography>
        )}
        <Button
          variant="contained"
          color={walletConnected ? "secondary" : "success"}
          fullWidth
          onClick={!!userAddress ? handleDisconnectWallet : connectWallet}
        >
          {!!userAddress ? "huỷ kết nôi" : "Kết nối Pera Wallet"}
        </Button>

        {/* Gửi giao dịch */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={sendTransaction}
          sx={{ mt: 2 }}
        >
          Gửi Thông Tin
        </Button>
      </div>
    </Modal>
  );
};

export default DonateModal;
async function generatePaymentTxns({ receiver, sender, amountAlgo }) {
  const suggestedParams = await algodClient.getTransactionParams().do();

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender,
    receiver,
    amount: amountAlgo || 1,
    suggestedParams,
  });

  return [{ txn, signers: [sender] }];
}
