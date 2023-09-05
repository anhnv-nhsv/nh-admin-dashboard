<template>
  <div
    class="modal fade"
    id="kt_modal_sync_kalapa_data"
    ref="syncKalapaModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_sync_kalapa_data_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">Sync data from Kalapa</h2>
          <!--end::Modal title-->
          <!--begin::Close-->
          <div
            id="kt_modal_sync_kalapa_data_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
          <!--end::Close-->
        </div>

        <!--begin::Modal body-->
        <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
          <template v-if="syncType === 'selection'">
            Do you want to synchronize selected data from Kalapa?
          </template>
          <template v-else>
            Do you want to synchronize all data from Kalapa?
          </template>
        </div>
        <!--end::Modal body-->

        <!--begin::Modal footer-->
        <div class="modal-footer">
          <!--begin::Button-->
          <button
            type="reset"
            id="kt_modal_sync_kalapa_data_cancel"
            class="btn btn-light me-3"
            data-bs-dismiss="modal"
          >
            Discard
          </button>
          <!--end::Button-->

          <!--begin::Button-->
          <button
            :data-kt-indicator="loading ? 'on' : null"
            class="btn btn-lg btn-primary"
            type="submit"
            @click.prevent="syncKalapa"
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
        <!--end::Modal footer-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { hideModal } from "@/core/helpers/dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useCustomerStore } from "@/stores/customer-score";

export default defineComponent({
  name: "sync-kalapa-modal",
  props: {
    syncPayload: { type: Array, required: false, default: () => [] },
    syncType: { type: String, required: false, default: () => "" },
  },
  setup(props) {
    const store = useCustomerStore();
    const loading = ref(false);
    const syncKalapaModalRef = ref<null | HTMLElement>(null);
    const syncPropData = ref(props.syncPayload);
    const temSyncData = ref(JSON.parse(JSON.stringify(syncPropData.value)));
    watch(
      () => props.syncPayload,
      (newVal) => {
        syncPropData.value = newVal;
        temSyncData.value = syncPropData.value;
      }
    );

    watch(
      () => props.syncType,
      (newVal) => {
        if (newVal === "all") {
          syncPropData.value = [];
        } else {
          syncPropData.value = temSyncData.value;
        }
      }
    );

    async function callAPISyncKalapaData() {
      console.log(`call API sync Kalapa`);
      loading.value = true;
      const rawPropData = JSON.parse(JSON.stringify(syncPropData.value));
      console.log(rawPropData);
      const syncPayload = rawPropData.map((e) => {
        return {
          id: e.idno,
          name: e.custNM,
          mobile: e.tel,
        };
      });
      await store.syncKalapaScore(syncPayload);
      const syncStatusCode = store.syncKalapaStatusCode;
      loading.value = false;
      return syncStatusCode;
    }

    function syncKalapa() {
      loading.value = true;
      setTimeout(async () => {
        const syncStatusCode = await callAPISyncKalapaData();
        loading.value = false;
        if (syncStatusCode == 204) {
          Swal.fire({
            text: "Request has been received. Wait a minute while synchronizing then reload page!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            hideModal(syncKalapaModalRef.value);
          });
        } else {
          Swal.fire({
            text: "Request has been failed. Please contact administrator!",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            hideModal(syncKalapaModalRef.value);
          });
        }
      }, 1000);
    }
    return {
      loading,
      syncKalapaModalRef,
      syncKalapa,
    };
  },
});
</script>

<style scoped></style>
