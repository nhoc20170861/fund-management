// ShowToastMessage.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

// Toast function
//Function to add date and time of last update
function updateDateTime() {
  var currentdate = new Date();
  let currentHour =
    currentdate.getHours() < 10
      ? `0${currentdate.getHours()}`
      : currentdate.getHours();
  let currentMinute =
    currentdate.getMinutes() < 10
      ? `0${currentdate.getMinutes()}`
      : currentdate.getMinutes();
  let currentSecond =
    currentdate.getSeconds() < 10
      ? `0${currentdate.getSeconds()}`
      : currentdate.getSeconds();
  var datetime = currentHour + ":" + currentMinute + ":" + currentSecond;
  // document.getElementById("update-time").innerHTML = datetime;
  // console.log(datetime);
  return datetime;
}
export function ShowToastMessage({
  title = "",
  message = "",
  type = "info",
  duration = 3000,
}) {
  // Show the toast message using react-toastify
  toast[type](message, {
    autoClose: duration,
    position: "bottom-left",
    theme: "colored",
    draggable: true,
  });
}

// Component to customize the content of the toast message
const ToastContent = ({ title, message }) => (
  <div>
    <div>
      <h3>{title}</h3>
      <small>{updateDateTime()}</small>
    </div>
    <p>{message}</p>
  </div>
);
