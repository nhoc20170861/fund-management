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
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Icon for copy
import CircularProgress from "@mui/material/CircularProgress";

import QrCodeIcon from "@mui/icons-material/QrCode2"; // Icon for QR Code
import { QRCodeCanvas } from "qrcode.react"; // Library for generating QR code

import { PeraWalletConnect } from "@perawallet/connect";
import { ShowToastMessage } from "utils/ShowToastMessage";
import {
  addContributeTranstaction,
  updateProjectFunding,
} from "network/ApiAxios";

import CustomAlert from "components/CustomAlert"; // Import CustomAlert
import configs from "configs";

const peraWallet = new PeraWalletConnect();
const algodToken = ""; // Thay bằng API key của Algorand node
const algodServer = configs.ALGORAND_SERVER;
const algodPort = configs.ALGORAND_SERVER_PORT;
const indexerServer = configs.algorand_indexer_server;
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const DonationModal = ({
  open,
  handleCloseModal,
  walletAddress: walletAddressOfProject,
  projectName,
  projectId,
  setProjectDetail,
  exchangeRate,
}) => {
  const [anonymous, setAnonymous] = useState(true);
  const [donationAmount, setDonationAmount] = useState(0);
  const [usdEquivalent, setUsdEquivalent] = useState(""); // State for VND
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [openQRModal, setOpenQRModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => ({
    project_id: projectId,
    txid: 0,
    amount: 0,
    email: "",
    sodienthoai: "",
    address: "",
    name: "",
    type_sender_wallet: "pera",
    sender_wallet_address: "",
    project_wallet_address: "",
    time_round: 0,
  }));
  // Toggle the QR code modal
  const toggleQRModal = () => {
    setOpenQRModal(!openQRModal);
  };

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

  const handleDataFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const convertMicroAlgosToVND = (microAlgos) => {
    console.log("🚀 ~ convertMicroAlgosToVND ~ microAlgos:", microAlgos);
    const algos = Number(microAlgos) / 1e6; // Chuyển đổi từ microAlgos sang Algos
    return algos * exchangeRate; // Chuyển đổi từ Algos sang VND
  };

  // Địa chỉ ví quỹ
  const projectWalletAddress =
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

  // Hàm kiểm tra số dư tài khoản
  const checkAccountBalance = async (projectWalletAddress) => {
    try {
      const accountInfo = await algodClient
        .accountInformation(projectWalletAddress)
        .do();
      const balance = accountInfo.amount; // Số dư tài khoản trong microAlgos
      const balanceInVND = convertMicroAlgosToVND(balance);
      console.log(
        `Số dư tài khoản ${projectWalletAddress}: ${balance} microAlgos (${balanceInVND} VND)`
      );
      return Number(balanceInVND.toFixed(0));
    } catch (error) {
      console.error("Lỗi khi kiểm tra số dư tài khoản:", error);
      throw error;
    }
  };

  const getTransactionFromIndexer = async (txid) => {
    const indexerClient = new algosdk.Indexer(
      "",
      indexerServer, // URL của indexer, đây là một ví dụ cho TestNet
      ""
    );
    try {
      // Truy vấn thông tin giao dịch từ Indexer bằng transaction ID (txid)
      const txnResponse = await indexerClient.lookupTransactionByID(txid).do();

      console.log("Transaction details from indexer:", txnResponse);

      const roundTime = txnResponse.transaction["roundTime"];
      console.log("Round time from indexer:", roundTime);

      return roundTime;
    } catch (error) {
      console.error("Error querying transaction from indexer:", error);
    }
  };

  async function getNodeStatus() {
    try {
      const status = await algodClient.status().do();
      console.log("Node status:", status);
    } catch (err) {
      console.error("Failed to get node status:", err);
    }
  }

  React.useEffect(() => {
    if (open === false) {
      setTransactionId("");
    }
  }, [open]);

  const sendTransaction = async () => {
    if (!walletConnected) {
      alert("😭🤗 Bạn cần kết nối với ví trước!");
      return;
    }
    console.log(
      "🚀 ~ sendTransaction ~ projectWalletAddress:",
      projectWalletAddress
    );
    if (!projectWalletAddress) {
      alert("😭🤔 Địa chỉ ví dự án không hợp lệ!");
      return;
    }
    if (!userAddress) {
      alert("😭😑 Địa chỉ ví của bạn không hợp lệ!");
      return;
    }
    // Check if the userAddress and projectWalletAddress are the same
    if (userAddress === projectWalletAddress) {
      alert(
        "🤗😓 Sorry! Địa chỉ người gửi và người nhận không thể giống nhau!"
      );
      return; // Dừng nếu địa chỉ giống nhau
    }
    console.log("🚀 ~ sendTransaction ~ userAddress:", userAddress);

    // Call the function to print the node status
    // getNodeStatus();

    // const acctInfoUser = await algodClient.accountInformation(userAddress).do();
    // console.log(
    //     `Account balance userAddress: ${acctInfoUser.amount} microAlgos`
    // );
    if (parseFloat(usdEquivalent) <= 0 || isNaN(parseFloat(usdEquivalent))) {
      alert("Số tiền quyên góp không hợp lệ!");
      return;
    }

    console.log("🚀 ~ sendTransaction ~ usdEquivalent:", usdEquivalent);

    const suggestedParams = await algodClient.getTransactionParams().do();
    console.log("Suggested Params:", suggestedParams);

    setLoading(true);
    // Generate transaction group
    const txGroups = await generatePaymentTxns({
      sender: userAddress,
      receiver: projectWalletAddress,
      amountAlgo: parseInt(usdEquivalent * 1000000, 10), // Amount in microAlgos
      noteMessage: new Uint8Array(
        Buffer.from(`This is a transaction to charity ${projectName}`)
      ),
    });

    console.log("Transaction:", txGroups);
    // Close the modal after generating the transaction
    // handleCloseModal();

    let signedTxn; // Khai báo signedTxn ở bên ngoài khối try-catch
    let txid = ""; // Khai báo txid ở ngoài để dùng sau khi gửi giao dịch
    let roundTime = ""; // Khai báo roundTime để dùng sau khi lấy từ indexer
    try {
      // Sign the transaction using Pera Wallet
      signedTxn = await peraWallet.signTransaction([txGroups]);
      console.log("Transaction signed successfully");
    } catch (error) {
      if (error.message.includes("Confirmation Failed")) {
        // Handle the case when the user rejects the transaction
        console.error("Transaction rejected by the user:", error);
        alert("Giao dịch đã bị hủy! Người dùng đã từ chối xác nhận giao dịch.");
      } else {
        // Handle other errors (network issues, etc.)
        console.error("Error during transaction:", error);
        alert("Đã xảy ra lỗi trong quá trình giao dịch. Vui lòng thử lại sau.");
      }
    }

    try {
      // Send the raw signed transaction to the network
      const sendTxnResponse = await algodClient
        .sendRawTransaction(signedTxn)
        .do();
      txid = sendTxnResponse.txid; // Lấy transaction ID
      console.log("Transaction ID:", txid);
    } catch (error) {
      console.error("Error sending the transaction:", error);
      alert("Có lỗi xảy ra khi gửi giao dịch lên mạng. Vui lòng thử lại sau.");
      return; // Dừng nếu có lỗi
    }

    try {
      // Wait for confirmation of the transaction
      const result = await algosdk.waitForConfirmation(algodClient, txid, 10);
      // console.log("Transaction confirmed:", result);
      // console.log("Transaction Information:", result.txn.txn);
      console.log(
        `Decoded Note: ${Buffer.from(result.txn.txn.note).toString()}`
      );

      // Gọi Indexer API để lấy thông tin round time
      setTransactionId(txid);
      roundTime = await getTransactionFromIndexer(txid);
      console.log("Round time:", roundTime);
    } catch (error) {
      console.error(
        "Error waiting for confirmation or getting round time:",
        error
      );
      alert(
        "Có lỗi xảy ra trong quá trình xác nhận giao dịch hoặc lấy thông tin round time."
      );
      return;
    }
    setLoading(false);
    ShowToastMessage({
      title: "Payment Transaction",
      message: `Giao dịch thành công!`,
      type: "success",
    });

    try {
      // Save transaction info to the database
      // const acctInfo = await algodClient
      //   .accountInformation(projectWalletAddress)
      //   .do();
      // console.log(`Account balance: ${acctInfo.amount} microAlgos`);
      const newContribute_trans = {
        ...formData,
        amount: donationAmount,
        sender_wallet_address: userAddress,
        project_wallet_address: projectWalletAddress,
        txid: txid,
        time_round: roundTime,
      };

      if (anonymous) {
        newContribute_trans.sodienthoai = "";
        newContribute_trans.address = "";
        newContribute_trans.name = "";
      }
      const project_current_fund = await checkAccountBalance(
        projectWalletAddress
      );
      newContribute_trans.project_current_fund = project_current_fund;
      setProjectDetail((prev) => ({
        ...prev,
        current_fund: project_current_fund,
        fund_raise_count: prev.fund_raise_count + 1,
      }));
      console.log(
        "🚀 ~ addContributeTranstaction ~ newContribute_trans:",
        newContribute_trans
      );

      const response = await addContributeTranstaction(
        projectId,
        newContribute_trans
      );

      // const response = await updateProjectFunding(projectId, updateProject);

      const { data } = response;
      console.log("🚀 ~ updateProjectFunding ~ data:", response);
      if (data?.statusCode === 200) {
        ShowToastMessage({
          title: "Store transtaction",
          message: "Lưu transtaction thành công",
          type: "success",
        });
      } else {
        ShowToastMessage({
          title: "Store transtaction",
          message: "Cập nhập dữ liệu thất bại",
          type: "error",
        });
      }
    } catch (innerError) {
      console.error("Error handling response data:", innerError);
      ShowToastMessage({
        title: "Error",
        message: "Có lỗi xảy ra khi xử lý dữ liệu phản hồi",
        type: "error",
      });
    }

    // alert("Giao dịch thành công!");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(projectWalletAddress)
      .then(() => {
        console.log("Đã sao chép địa chỉ ví vào clipboard!"); // Show success message
        ShowToastMessage({
          title: "Copied Wallet Address",
          message: "Địa chỉ ví đã được sao chép vào clipboard!",
          type: "success",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          style={{
            position: "absolute",
            top: "0%",
            left: "50%",
            transform: "translate(-50%, -10%)",
            padding: "20px",
            backgroundColor: "#fff",
            margin: "100px auto",
            width: "35rem",
            borderRadius: "10px",
            maxHeight: "90vh", // Limit the height of the modal to 90% of the viewport height
            overflowY: "auto", // Enable vertical scrolling if the content overflows
          }}
        >
          {/* Section 1: Wallet Address and QR Code */}
          <Box
            sx={{
              padding: "15px",
              marginBottom: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                Địa chỉ ví của Dự án:
              </Typography>
              <div sx={{ display: "flex", justifyContent: "space-between" }}>
                <Tooltip title="Sao chép địa chỉ ví">
                  {/* Copy button */}
                  <IconButton onClick={copyToClipboard} sx={{ ml: 1 }}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                {/* Show QR code button */}
                <Tooltip title="Hiển thị mã QR">
                  <IconButton onClick={toggleQRModal} sx={{ ml: 1 }}>
                    <QrCodeIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Box>
            <Typography
              variant="h7"
              component="h2"
              gutterBottom
              sx={{
                wordWrap: "break-word",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {projectWalletAddress}
              {/* Add an icon button for copying */}
            </Typography>
          </Box>

          {/* Section 2: Donation Form */}
          <Box
            sx={{
              padding: "20px",
              backgroundColor: "#f3f4f6",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Nhập Thông Tin Ủng Hộ
            </Typography>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid size={6}>
                <TextField
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={anonymous}
                  name="name"
                  value={formData.name ?? "Your name"}
                  onChange={handleDataFormChange}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={anonymous}
                  name="sodienthoai"
                  value={formData.sodienthoai ?? "Your Mobile Phone"}
                  onChange={handleDataFormChange}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Địa chỉ Email"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={anonymous}
                  name="email"
                  value={formData.email ?? "Your email"}
                  onChange={handleDataFormChange}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Địa chỉ"
                  variant="outlined"
                  fullWidth
                  required
                  disabled={anonymous}
                  name="address"
                  value={formData.address ?? "Your address"}
                  onChange={handleDataFormChange}
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
            {transactionId && (
              <div>
                <p style={{ color: "black" }}>
                  Giao dịch thành công với TxID: {transactionId}
                </p>
              </div>
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
              disabled={!userAddress || donationAmount <= 0}
            >
              Gửi Thông Tin
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal to show the QR Code */}
      <Modal
        open={openQRModal}
        onClose={toggleQRModal}
        aria-labelledby="qr-code-modal-title"
        aria-describedby="qr-code-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="qr-code-modal-title" variant="h6" component="h2">
            Mã QR địa chỉ Ví
          </Typography>
          <QRCodeCanvas value={projectWalletAddress} size={200} />{" "}
          {/* Generate QR code */}
          <Button variant="contained" onClick={toggleQRModal} sx={{ mt: 2 }}>
            Đóng
          </Button>
        </Box>
      </Modal>
      <Modal open={loading} onClose={() => setLoading(false)}>
        {/* Nội dung của modal loading, ví dụ: */}
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Loading...
            <CircularProgress />
          </Typography>
          {/* Thêm nội dung hoặc hình ảnh loading ở đây */}
        </Box>
      </Modal>
    </>
  );
};

export default DonationModal;
async function generatePaymentTxns({
  receiver,
  sender,
  amountAlgo,
  noteMessage = new Uint8Array(Buffer.from("This is a transaction to charity")),
}) {
  const suggestedParams = await algodClient.getTransactionParams().do();

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender,
    receiver,
    amount: amountAlgo || 1,
    suggestedParams,
    note: noteMessage,
  });

  return [{ txn, signers: [sender] }];
}
