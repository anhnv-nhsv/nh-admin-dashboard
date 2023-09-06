<template>
  <div
    class="modal fade"
    id="kt_modal_test_editor"
    ref="testEditorModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-1000px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_test_editor_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">Test Editor</h2>
          <!--end::Modal title-->
          <!--begin::Close-->
          <div
            id="kt_modal_test_editor_close"
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
<!--          <NhEditor />-->
          <NhForm />
        </div>
        <!--end::Modal body-->

        <!--begin::Modal footer-->
        <div class="modal-footer">
          <!--begin::Button-->
          <button
            type="reset"
            id="kt_modal_test_editor_cancel"
            class="btn btn-light me-3"
            data-bs-dismiss="modal"
          >
            Discard
          </button>
          <!--end::Button-->

          <!--begin::Button-->
          <button class="btn btn-lg btn-primary" type="submit">
            <span v-if="false" class="indicator-label">
              Submit
              <span class="svg-icon svg-icon-3 ms-2 me-0">
                <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
              </span>
            </span>
            <span v-if="true" class="indicator-progress">
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
import NhEditor from "@/components/editor/NHEditor.vue";
import NhForm from "@/components/nh-forms/NHForm.vue";

export default defineComponent({
  name: "test-editor-modal",
  components: { NhForm, NhEditor },
  props: {},
  setup(props) {
    return {};
  },
});
</script>

<style scoped></style>
