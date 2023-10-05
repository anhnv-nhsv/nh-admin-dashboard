<template>
  <div
    class="modal fade"
    id="kt_menu_modal"
    ref="userModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-800px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">{{ translate("addMenuList") }}</h2>
          <div
            id="kt_user_action_close"
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
                :model="userForm"
                label-width="160px"
                :rules="rules"
              >
                <el-form-item :label="translate('nameMenu')" prop="nameMenu">
                  <el-input
                    v-model="userForm.nameMenu"
                    :placeholder="translate('nameMenu')"
                    clearable
                  />
                </el-form-item>
              </el-form>
            </template>
          </NhForm>
        </div>
        <div class="modal-footer">
          <button
            type="reset"
            id="kt_user_action_cancel"
            class="btn btn-light me-3"
            @click.prevent="resetForm(ruleFormRef)"
          >
            {{ translate("reset") }}
          </button>
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            @click.prevent="handleRequest(ruleFormRef)"
          >
            <span v-if="!loading" class="indicator-label">
              {{ translate("addBtn") }}
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { translate } from "@/core/helpers/i18n-translate";
import NhForm from "@/components/nh-forms/NHForm.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import type { FormInstance } from "element-plus";
import qs from "qs";
import { hideModal } from "@/core/helpers/dom";
import { useUserMgmt } from "@/stores/user-mgmt";

export default defineComponent({
  name: "menu-modal",
  components: { NhForm },
  setup(props, ctx) {
    const loading = ref(false);
    const store = useUserMgmt();
    const ruleFormRef = ref<FormInstance>();
    const userModalRef = ref<null | HTMLElement>(null);
    const userForm = ref({
      nameMenu: "",
    });
    const rules = reactive({
      nameMenu: [
        {
          required: true,
          message: translate("nameMenuValidate"),
          trigger: "blur",
        },
      ],
    });

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    const handleRequest = (formEl: FormInstance | undefined) => {
      loading.value = true;
      if (!formEl) return;
      formEl.validate(async (valid, fields) => {
        if (valid) {
          const result = await store.createUser(
            qs.stringify(JSON.parse(JSON.stringify(userForm.value)))
          );
          if (result.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("addNewsSuccessfully"),
              showConfirmButton: false,
              timer: 1000,
            }).then(() => {
              ctx.emit("on-close");
              formEl.resetFields();
              hideModal(userModalRef.value);
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
          console.log("error submit!", fields);
        }
      });
      loading.value = false;
    };

    return {
      userForm,
      ruleFormRef,
      rules,
      loading,
      userModalRef,
      handleRequest,
      resetForm,
      translate,
    };
  },
});
</script>

<style scoped lang="scss"></style>
