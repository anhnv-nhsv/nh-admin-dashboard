import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { translate } from "@/core/helpers/i18n-translate";

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    // Any HTTP Code which is not 2xx will be considered as error

    const statusCode = err.response.status;
    if (statusCode === 401 || statusCode === 403) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: translate("expiredToken"),
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.localStorage.removeItem("id_token");
        window.location.href = `/#/sign-in`;
      });
    }
    return Promise.reject(err);
  }
);
