<template>
  <div
    class="modal fade"
    id="kt_banner_modal"
    ref="bannerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-800px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">
            {{ translate("addBanner") }}
          </h2>
          <h2 class="fw-bolder" v-else>{{ translate("editBanner") }}</h2>
          <div
            id="kt_customer_export_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body scroll-y mx-5 mx-xl-5">
          <NhForm>
            <template v-slot:customForm>
              <el-form
                ref="ruleFormRef"
                :model="bannerForm"
                label-width="160px"
              >
                <el-form-item :label="translate('name')">
                  <el-input
                    v-model="bannerForm.name"
                    :placeholder="translate('name')"
                    clearable
                  />
                </el-form-item>
                <el-form-item :label="translate('url')">
                  <el-input
                    v-model="bannerForm.attachUrl"
                    :placeholder="translate('url')"
                    clearable
                  />
                </el-form-item>
                <el-form-item :label="translate('image')" prop="imageUrl">
                  <el-input
                    v-model="bannerForm.imageUrl"
                    :placeholder="translate('image')"
                    clearable
                    disabled
                  >
                    <template #prepend>
                      <el-button type="primary" @click.prevent="chooseImage">
                        {{ translate("chooseFile") }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="translate('content')">
                  <el-input
                    v-model="bannerForm.content"
                    :placeholder="translate('content')"
                    clearable
                  />
                </el-form-item>
                <el-form-item>
                  <el-checkbox
                    v-model="bannerForm.isPublish"
                    :label="translate('publish')"
                    size="large"
                  />
                </el-form-item>
              </el-form>
            </template>
          </NhForm>
        </div>
        <div class="modal-footer">
          <button
            type="reset"
            id="kt_modal_test_editor_cancel"
            class="btn btn-light me-3"
            data-bs-dismiss="modal"
          >
            {{ translate("cancelBtn") }}
          </button>
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            @click.prevent="handleRequest(ruleFormRef)"
          >
            <span v-if="!loading" class="indicator-label">
              {{ translate("submitBtn") }}
              <span class="svg-icon svg-icon-3 ms-2 me-0">
                <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
              </span>
            </span>
            <span v-if="loading" class="indicator-progress">
              {{ translate("pleaseWait") }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import NhForm from "@/components/nh-forms/NHForm.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import type { FormInstance } from "element-plus";
import { useBanner } from "@/stores/banner";
import qs from "qs";
import { hideModal } from "@/core/helpers/dom";
import { translate } from "@/core/helpers/i18n-translate";

export default defineComponent({
  name: "banner-category-modal",
  props: {
    action: { type: String, default: () => "add", required: false },
    data: {
      type: Object,
      default: () => {
        return {};
      },
      required: true,
    },
  },
  components: { NhForm },
  setup(props, ctx) {
    const loading = ref(false);
    const store = useBanner();
    const ruleFormRef = ref<FormInstance>();
    const bannerModalRef = ref<null | HTMLElement>(null);
    const bannerForm = ref({
      id: undefined,
      name: "",
      attachUrl: "",
      imageUrl: "",
      content: "",
      isPublish: false,
    });
    const rules = reactive({
      imageUrl: [
        {
          required: true,
          message: translate("requiredField"),
          trigger: "blur",
        },
      ],
    });

    watch(
      () => props.data,
      (newData) => {
        const data = JSON.parse(JSON.stringify(newData));
        bannerForm.value = {
          id: data.id,
          name: data.name,
          attachUrl: data.attachUrl,
          imageUrl: data.imageUrl,
          content: data.content,
          isPublish: data.isPublish === 1,
        };
        console.log(bannerForm.value);
      }
    );

    watch(
      () => props.action,
      (newAction) => {
        if (newAction === "add") {
          bannerForm.value.imageUrl = "";
        }
      }
    );

    const chooseImage = () => {
      window.addEventListener("message", handleMessage);
      Swal.fire({
        width: "80%",
        heightAuto: false,
        /* eslint-disable no-useless-escape */
        html: `<iframe
                    ref="fileManagerIframe"
                    class="rounded h-600px w-100"
                    src="http://172.33.30.19:8010/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1&lang=en_EN&akey=YQv5t_7gG2.gu7b7\-xcoW"
                    :allowfullscreen="true"
               ></iframe>`,
        closeButtonAriaLabel: "Close file manager",
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
          htmlContainer: "rfm-height-100",
        },
      });
    };

    const handleMessage = (event) => {
      if (event.data.sender === "responsivefilemanager") {
        if (event.data.field_id) {
          bannerForm.value.imageUrl = event.data.url;
          Swal.close();
          // Delete handler of the message from ResponsiveFilemanager
          window.removeEventListener("message", handleMessage);
        }
      }
    };

    const handleRequest = (formEl: FormInstance | undefined) => {
      loading.value = true;
      if (!formEl) return;
      formEl.validate(async (valid, fields) => {
        if (valid) {
          const rawForm = JSON.parse(JSON.stringify(bannerForm.value));
          const formData = {
            id: rawForm.id,
            name: rawForm.name,
            content: rawForm.content,
            publish: rawForm.isPublish ? 1 : 0,
            link: rawForm.attachUrl,
            image: rawForm.imageUrl,
          };
          if (props.action === "add") {
            const result = await store.createBanner(qs.stringify(formData));
            if (result.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate("addBannerSuccessfully"),
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                ctx.emit("on-close");
                hideModal(bannerModalRef.value);
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: result.data.mess,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          } else {
            const result = await store.editBanner(qs.stringify(formData));
            if (result.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate("editBannerSuccessfully"),
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                ctx.emit("on-close");
                hideModal(bannerModalRef.value);
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: result.data.mess,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          }
        } else {
          console.log("error submit!", fields);
        }
      });
      loading.value = false;
    };

    return {
      bannerForm,
      ruleFormRef,
      rules,
      loading,
      bannerModalRef,
      chooseImage,
      handleRequest,
      translate,
    };
  },
});
</script>

<style scoped lang="scss">
.btn-upload {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-collapse: inherit !important;
  background-color: #009ef7 !important;
  color: #fff !important;
}
</style>
