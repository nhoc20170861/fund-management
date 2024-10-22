import React, { useState } from "react";

import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  IconButton,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionField from "./components/DescriptionField";
import { createNewFund } from "network/ApiAxios";
import { ShowToastMessage } from "utils/ShowToastMessage";
import { getOneUserByEmail } from "network/ApiAxios";
import PreviewIcon from "@mui/icons-material/Preview";
const StyledChip = styled(Chip)({
  margin: "8px 0",
});
const FormCreateFund = (props) => {
  const [formData, setFormData] = useState(() => {
    const state = {
      name_fund: "",
      members: [],
      description: "",
      logo: "",
    };
    return state;
  });

  const [emailSearch, setEmailSearch] = useState("");
  const [foundUser, setFoundUser] = useState(null); // Found user from search
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected users to add

  const handleOpenSearchDialog = () => setOpenSearchDialog(true);
  const handleCloseSearchDialog = () => {
    setFoundUser(null);
    setEmailSearch("");
    setOpenSearchDialog(false);
  };

  const handleDataFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Convert members to array of integers
    const formattedData = {
      ...formData,
      members: formData.members
        .map((member) => member.id)
        .filter((id) => !isNaN(id)), // Ensure valid numbers
    };
    formattedData["user_id"] = localStorage.getItem("userId");
    console.log("Submitting fund data:", formattedData);
    if (!formattedData.members) {
      formattedData.members = [];
    }

    if (!formattedData.logo) {
      formattedData.logo =
        "https://pbs.twimg.com/profile_images/962068712772616196/eYwuB0TO_400x400.jpg";
    }

    // You can send this data to your API
    e.preventDefault();
    try {
      const response = await createNewFund(formattedData);
      const { data } = response;
      console.log("🚀 ~ handleSubmit ~ data:", data);
      if (data.statusCode === 200 && data?.body?.fund_id) {
        ShowToastMessage({
          title: "Create Fund",
          message: "Tạo Quỹ thành công",
          type: "success",
        });
      } else {
        ShowToastMessage({
          title: "Create Fund",
          message: "Có lỗi xảy ra khi tạo quỹ",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting project data:", error);
    }
  };

  // Add the selected user to the members list
  const handleAddSelectedUser = () => {
    if (
      foundUser &&
      !formData.members.some((member) => member.id === foundUser.id)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        members: [...prevData.members, foundUser],
      }));
    }
    handleCloseSearchDialog(); // Close the search dialog after adding
  };

  const mockSearchUserByEmail = (email) => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    ];
    return mockUsers.find((user) => user.email === email);
  };
  const handleSearch = async () => {
    try {
      const response = await getOneUserByEmail(emailSearch);
      const { data } = response;
      console.log("🚀 ~ handleSearch ~ data:", data);
      if (data.statusCode === 200 && data.body.length > 0) {
        setFoundUser(data.body[0] || null);
        ShowToastMessage({
          title: "Get data",
          message: "Lấy dữ liệu thành công",
          type: "success",
        });
      } else {
        ShowToastMessage({
          title: "Get data",
          message: "Không có dữ liệu",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error searching user by email:", error);
    }
  };

  // Handle user selection
  const handleUserSelection = (user) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([
        ...selectedUsers,
        {
          id: user.id,
          name: user.username,
          email: user.email,
        },
      ]);
    }
  };

  // Remove a member from the list
  const handleRemoveMember = (memberId) => {
    setFormData((prevData) => ({
      ...prevData,
      members: prevData.members.filter((member) => member.id !== memberId),
    }));
  };
  return (
    <Box sx={{ p: 2, width: "100%", mx: "auto" }}>
      {/* Fund Name */}
      <FormControl fullWidth margin="normal">
        <TextField
          label="Fund Name"
          name="name_fund"
          value={formData.name_fund}
          onChange={handleDataFormChange}
          fullWidth
          required
        />
      </FormControl>

      {/* Members - Display Chips and Open Search Dialog */}
      <FormControl fullWidth margin="normal">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" gutterBottom>
            Members:
          </Typography>
          <IconButton
            variant="outlined"
            onClick={handleOpenSearchDialog}
            color="primary"
          >
            <AddToPhotosIcon />
          </IconButton>
          {/* Button to open the search dialog for adding members */}
        </div>
        {/* Display chips for selected members */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {formData.members.map((member) => (
            <StyledChip
              key={member.id}
              label={member.username}
              onDelete={() => handleRemoveMember(member.id)}
              deleteIcon={<CloseIcon />}
              {...stringAvatar(member.username)}
            />
          ))}
        </Box>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <TextField
          label="Description"
          name="description"
          value={formData.description ?? "Enter the description"}
          onChange={handleDataFormChange}
          fullWidth
          required
          multiline
          rows={4}
          //helperText="Supports Markdown for formatting"
        />
      </FormControl>

      {/* Logo URL */}
      <FormControl fullWidth margin="normal">
        <Grid container spacing={2}>
          <Grid item size="grow">
            <TextField
              label="Logo URL"
              name="logo"
              value={formData.logo ?? ""}
              onChange={handleDataFormChange}
              fullWidth
              placeholder="Enter the logo URL"
            />
          </Grid>

          {/* Image Preview (if URL is valid) */}
          <Grid item xs={2}>
            {isValidImageURL(formData.logo ?? "") ? (
              <img
                src={formData.logo ?? ""}
                alt={`Preview  ${formData.name_fund}`}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PreviewIcon />
              </div>
            )}
          </Grid>
        </Grid>
      </FormControl>

      {/* Markdown Description Editor */}
      {/* <DescriptionField
        description={formData.description}
        setFormData={setFormData}
      /> */}

      {/* Submit and Reset Buttons */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            //onClick={() => setFormData({})}
          >
            Reset
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      {/* Dialog for searching and adding members */}
      <Dialog open={openSearchDialog} onClose={handleCloseSearchDialog}>
        <DialogTitle>Search for Members by Email</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter Email"
            fullWidth
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            margin="dense"
          />
          <Button
            onClick={handleSearch}
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
          >
            Search
          </Button>

          {foundUser && (
            <Box sx={{ mt: 2 }}>
              <StyledChip
                label={foundUser?.username ?? "unknow"}
                color={
                  selectedUsers.find((u) => u.id === foundUser.id)
                    ? "primary"
                    : "default"
                }
                onClick={() => handleUserSelection(foundUser)}
                avatar={
                  <Checkbox
                    checked={selectedUsers.find((u) => u.id === foundUser.id)}
                  />
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSearchDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddSelectedUser}
            color="primary"
            disabled={selectedUsers.length === 0}
            variant="contained"
          >
            Add Selected
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function stringToColor(string) {
  if (!string) return "#fe6f5e";
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
function stringAvatar(name = "unknow") {
  console.log("🚀 ~ stringAvatar ~ name:", name);
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
  };
}
const isValidImageURL = (url) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
};

export default FormCreateFund;
