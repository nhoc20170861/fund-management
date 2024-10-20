const { REACT_APP_SERVER_DOMAIN_NAME, REACT_APP_APP_DOMAIN_NAME } = process.env;
const doamin_server =
  process.env.NODE_ENV === "production"
    ? REACT_APP_SERVER_DOMAIN_NAME
    : "http://localhost:3000";
const react_app_domain =
  process.env.NODE_ENV === "production"
    ? REACT_APP_APP_DOMAIN_NAME
    : "http://localhost:4000";

const configs = {
  WS_BASE_URL: doamin_server,
  DOMAIN_SERVER: doamin_server,
  APP_DOMAIN_NAME: react_app_domain,
  DEMO: false,
};

export default configs;
