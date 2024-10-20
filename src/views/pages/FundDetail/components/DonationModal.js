import React, { useState, useEffect } from "react";
import {
  Modal,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";

const DonateModal = ({ open, handleClose }) => {
  const [anonymous, setAnonymous] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [usdEquivalent, setUsdEquivalent] = useState(""); // State for VND
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [peraWallet, setPeraWallet] = useState(
    new PeraWalletConnect({ chainId: "4160" })
  );
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
    "MQZFSTFJAI7FYMHNGQBIBQ3WKM4SYHJFYILT6MNM5B65I7DNQONCEVKOOA";

  // Ngắt kết nối khi component được mount
  useEffect(() => {
    const disconnectWallet = async () => {
      if (walletConnected) {
        await peraWallet.disconnect();
        setWalletConnected(false);
        setUserAddress(null);
      }
    };

    disconnectWallet();

    // Cleanup function để ngắt kết nối khi component unmount
    return () => {
      disconnectWallet();
    };
  }, []); // Chỉ chạy một lần khi component được mount
  // Thiết lập kết nối với Pera Wallet
  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      peraWallet.connector?.on("disconnect", handleDisconnectWallet);
      setUserAddress(accounts[0]);
      setWalletConnected(true);
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
    try {
      if (!walletConnected) {
        alert("Bạn cần kết nối với ví trước!");
        return;
      }

      if (!userAddress) {
        alert("Địa chỉ ví không hợp lệ!");
        return;
      }
      console.log("🚀 ~ sendTransaction ~ userAddress:", userAddress);

      const algodToken = ""; // Thay bằng API key của Algorand node
      const algodServer = "https://testnet-api.4160.nodely.dev";
      const algodPort = "443";

      const algodClient = new algosdk.Algodv2(
        algodToken,
        algodServer,
        algodPort
      );
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

      const acctInfoUser = await algodClient
        .accountInformation(userAddress)
        .do();
      console.log(`Account balance: ${acctInfo.amount} microAlgos`);
      console.log(
        `Account balance userAddress: ${acctInfoUser.amount} microAlgos`
      );
      if (parseFloat(usdEquivalent) <= 0 || isNaN(parseFloat(usdEquivalent))) {
        alert("Số tiền quyên góp không hợp lệ!");
        return;
      }

      console.log("🚀 ~ sendTransaction ~ usdEquivalent:", usdEquivalent);
      const params = await algodClient.getTransactionParams().do();
      console.log("Amount:", parseInt(usdEquivalent, 10) * 1000000);
      console.log("Suggested Params:", params);
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: userAddress,
        to: fundWalletAddress,
        amount: parseInt(usdEquivalent, 10) * 1000000,
        suggestedParams: params,
      });

      console.log("Transaction:", txn);

      const signedTxn = await peraWallet.signTransaction([txn]);
      console.log("Signed Transaction:", signedTxn);

      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
      console.log("Transaction ID:", txId);
      alert("Giao dịch thành công!");
    } catch (error) {
      console.error("Lỗi trong khi gửi giao dịch:", error);
      alert("Giao dịch thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          margin: "100px auto",
          width: "30rem",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Nhập Thông Tin Ủng Hộ
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Họ và tên" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Số điện thoại" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Địa chỉ" variant="outlined" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Địa chỉ Email" variant="outlined" fullWidth />
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
        {walletConnected ? (
          <Typography
            variant="body2"
            color="green"
            gutterBottom
            sx={{ wordWrap: "break-word" }}
          >
            Ví đã kết nối: {userAddress}
          </Typography>
        ) : (
          <Button variant="contained" color="secondary" onClick={connectWallet}>
            Kết nối ví
          </Button>
        )}

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
