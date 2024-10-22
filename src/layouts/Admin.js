/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useLocation, Outlet, useParams } from "react-router-dom";

import { ToastContainer } from "react-toastify";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";

const Admin = (props) => {
    const mainContent = React.useRef(null);
    const location = useLocation();
    const params = useParams();

    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        mainContent.current.scrollTop = 0;
    }, [location]);

    const getBrandText = (url) => {
        console.log("🚀 ~ file: Admin.js:41 ~ getBrandText ~ url:", url);
        for (let i = 0; i < routes.length; i++) {
            if (url.pathname === routes[i].layout + "/" + routes[i].path) {
                return routes[i].name;
            }
        }

        console.log("🚀 ~ file: Admin.js:51 ~ getBrandText ~ params:", params);
        return params.robotId || "brand";
    };

    return (
        <>
            {/* Add ToastContainer here to display toast messages */}
            <ToastContainer
                hideProgressBar={false}
                position="bottom-left"
                newestOnTop
                closeOnClick
                limit={4}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                theme="colored"
                pauseOnHover={false}
            />
            <Sidebar
                {...props}
                routes={routes.filter((route) => !route.path.includes("fund-detail"))}  // Loại bỏ các route chứa "fund-detail"
                logo={{
                    innerLink: "/admin/index",
                    imgSrc: "https://algorandtechnologies.com/assets/media-kit/logos/full/png/algorand_full_logo_black.png",
                    imgAlt: "...",
                }}
            />
            <div className="main-content" ref={mainContent}>
                <Outlet></Outlet>
                <AdminNavbar {...props} brandText={getBrandText(location)} />
                <Container fluid>
                    <AdminFooter />
                </Container>
            </div>
        </>
    );
};

export default Admin;
