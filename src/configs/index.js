const { REACT_APP_SERVER_DOMAIN_NAME, REACT_APP_APP_DOMAIN_NAME, HASH_KEY_API } = process.env;
const doamin_server =
  process.env.REACT_APP_APP_NODE_ENV === "production"
    ? REACT_APP_SERVER_DOMAIN_NAME
    : "http://localhost:3000";
const react_app_domain =
  process.env.NODE_ENV === "production"
    ? REACT_APP_APP_DOMAIN_NAME
    : "http://localhost:4000";

const algorand_server = process.env.REACT_APP_ALGORAND_SERVER;

const configs = {
  WS_BASE_URL: doamin_server,
  DOMAIN_SERVER: doamin_server,
  APP_DOMAIN_NAME: react_app_domain,
  DEMO: false,
  ALGORAND_SERVER: algorand_server,
  ALGORAND_SERVER_PORT: process.env.REACT_APP_ALGORAND_SERVER_PORT || 443,
  HASH_KEY_API
};

export default configs;
