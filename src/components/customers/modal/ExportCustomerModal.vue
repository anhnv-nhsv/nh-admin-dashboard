<template>
  <div
    class="modal fade"
    id="kt_customer_export_modal"
    ref="exportCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">Export Customers</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_customer_export_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Modal body-->
        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <!--begin::Form-->
          <el-form
            @submit.prevent="submitExport"
            :model="checkedTypes"
            ref="formRef"
          >
            <!--begin::Row-->
            <div class="row fv-row mb-15">
              <!--begin::Label-->
              <label class="fs-5 fw-bold form-label mb-5">Export type:</label>
              <!--end::Label-->

              <!--begin::Radio group-->
              <div class="d-flex flex-column">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                  >Check all
                </el-checkbox>
                <el-checkbox-group
                  v-model="checkedTypes"
                  @change="handleCheckedTypesChange"
                >
                  <el-checkbox
                    v-for="type in exportTypes"
                    :key="type.typeId"
                    :label="type.typeId"
                  >
                    {{ type.typeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <!--end::Input group-->
            </div>
            <!--end::Row-->

            <!--begin::Actions-->
            <div class="text-center">
              <button
                type="reset"
                id="kt_customer_export_cancel"
                class="btn btn-light me-3"
                data-bs-dismiss="modal"
              >
                Discard
              </button>

              <!--begin::Button-->
              <button
                :data-kt-indicator="loading ? 'on' : null"
                type="submit"
                class="btn btn-lg btn-primary"
              >
                <span v-if="!loading" class="indicator-label">
                  Submit
                  <span class="svg-icon svg-icon-3 ms-2 me-0">
                    <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
                  </span>
                </span>
                <span v-if="loading" class="indicator-progress">
                  Please wait...
                  <span
                    class="spinner-border spinner-border-sm align-middle ms-2"
                  ></span>
                </span>
              </button>
              <!--end::Button-->
            </div>
            <!--end::Actions-->
          </el-form>
          <!--end::Form-->
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useCustomerStore } from "@/stores/customer-score";
import { hideModal } from "@/core/helpers/dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default defineComponent({
  name: "export-customer-modal",
  props: {
    searchPayload: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const store = useCustomerStore();
    const checkAll = ref(false);
    const isIndeterminate = ref(false);
    const checkedTypes = ref<number[]>([]);
    const exportTypes = [
      {
        typeId: 1,
        typeName: "User score",
      },
      {
        typeId: 2,
        typeName: "Blacklist score",
      },
      {
        typeId: 3,
        typeName: "Job score",
      },
      {
        typeId: 4,
        typeName: "Credit score",
      },
    ];
    const loading = ref<boolean>(false);
    const exportCustomerModalRef = ref<null | HTMLElement>(null);

    async function exportCustomersScoreAPI(
      searchType?: string,
      idNo?: string,
      tel?: string,
      name?: string,
      accountNo?: string,
      fromDate?: string,
      toDate?: string,
      startScore?: string,
      endScore?: string,
      blacklist?: string
    ) {
      console.log(`call API`);
      loading.value = true;
      await store.exportCustomersScore({
        params: {
          idNo: idNo ? idNo : "",
          tel: tel ? tel : "",
          name: name ? name : "",
          accountNo: accountNo ? accountNo : "",
          fromDate: fromDate ? fromDate : "",
          toDate: toDate ? toDate : "",
          startScore: startScore ? startScore : "",
          endScore: endScore ? endScore : "",
          blacklist: blacklist ? blacklist : "",
          searchType: searchType ? searchType : "",
        },
        responseType: "blob",
      });
      const exportCustomerResp = store.customersScoreResp;
      loading.value = false;
      return exportCustomerResp;
    }

    const submitExport = async () => {
      console.log(`submit export ${checkedTypes.value}`);
      const formDataRaw = JSON.parse(JSON.stringify(props.searchPayload));
      const exportCustomerResp = await exportCustomersScoreAPI(
        checkedTypes.value.join(","),
        formDataRaw.idNo,
        formDataRaw.tel,
        formDataRaw.name,
        formDataRaw.acctNo,
        formDataRaw.dateRange[0],
        formDataRaw.dateRange[1],
        formDataRaw.userScore.split("-")[0],
        formDataRaw.userScore.split("-")[1],
        formDataRaw.blacklist
      );
      if (exportCustomerResp) {
        console.log(exportCustomerResp);
        // let filename = "";
        // let disposition = exportCustomerResp.headers["content-disposition"];
        // if (disposition && disposition.indexOf("attachment") !== -1) {
        //   let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        //   let matches = filenameRegex.exec(disposition);
        //   if (matches != null && matches[1]) {
        //     filename = matches[1].replace(/['"]/g, "");
        //   }
        // }
        // const temp = window.URL.createObjectURL(
        //   new Blob([exportCustomerResp.data])
        // );
        // const link = document.createElement("a");
        // link.href = temp;
        // link.setAttribute("download", filename); //or any other extension
        // document.body.appendChild(link);
        // link.click();
      } else {
        Swal.fire({
          text: "Export failed. Please contact administrator!",
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
          },
        }).then(() => {
          hideModal(exportCustomerModalRef.value);
        });
      }
    };

    const handleCheckAllChange = (val: boolean) => {
      console.log(checkAll.value);
      checkedTypes.value = val ? exportTypes.map((e) => e.typeId) : [];
      isIndeterminate.value = false;
      console.log(checkAll.value);
    };
    const handleCheckedTypesChange = (value: any[]) => {
      const checkedCount = value.length;
      checkAll.value = checkedCount === exportTypes.length;
      isIndeterminate.value =
        checkedCount > 0 && checkedCount < exportTypes.length;
    };

    return {
      loading,
      checkAll,
      isIndeterminate,
      checkedTypes,
      exportTypes,
      exportCustomerModalRef,
      submitExport,
      handleCheckAllChange,
      handleCheckedTypesChange,
    };
  },
});
</script>

<style scoped></style>
