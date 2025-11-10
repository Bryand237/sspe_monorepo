import kyStandard from "ky";

const BASE_URL = "http://localhost:5500/api/";

export default kyStandard.create({
  prefixUrl: BASE_URL,
});
