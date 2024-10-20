import React from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css"; // Import MDE styles
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  Chip,
} from "@mui/material";

const DescriptionField = (props) => {
  const [selectedTab, setSelectedTab] = React.useState("write"); // State for Markdown editor
  return (
    <>
      <FormControl fullWidth margin="normal">
        <Typography variant="body1" gutterBottom>
          Description (supports Markdown)
        </Typography>
        <ReactMde
          value={props.description}
          onChange={(value) =>
            props.setFormData((prevData) => ({
              ...prevData,
              description: value,
            }))
          }
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(
              <Typography variant="body1">
                {/* Chuyển đổi nội dung Markdown thành HTML */}
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <img
                        {...props}
                        style={{
                          maxWidth: "100%", // Đảm bảo ảnh không tràn ra ngoài
                          height: "auto", // Giữ tỷ lệ của ảnh
                        }}
                      />
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </Typography>
            )
          }
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
        />
      </FormControl>
    </>
  );
};
export default DescriptionField;
