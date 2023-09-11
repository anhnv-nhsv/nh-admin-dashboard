<template>
  <div>
    <a class="btn btn-info" title="" @click="$router.go(-1)"
      ><i class="fa fa-chevron-left"></i> Quay lại</a
    >
    <div class="banner-wrapper">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="Tên" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="ruleForm.url" />
        </el-form-item>
        <el-form-item label="Hình ảnh">
          <!-- <el-input v-model="ruleForm.img" /> -->
          <el-upload action="#" list-type="picture-card" :auto-upload="false">
            <i class="bi bi-file-earmark-arrow-up"></i>

            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="bi bi-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="bi bi-trash"></i>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="Publish">
          <el-switch v-model="ruleForm.delivery" />
        </el-form-item>
        <el-form-item label="Nội dung">
          <el-input v-model="ruleForm.desc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <div class="banner-btn">
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              Create
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import type { FormInstance, FormRules, UploadFile } from "element-plus";
import { computed, defineComponent, ref, watch, toRaw } from "vue";

import { reactive } from "vue";
interface RuleForm {
  name: string;
  url: string;
  img: string;
  delivery: boolean;
  desc: string;
}

export default defineComponent({
  name: "create-banner",
  props: {},
  components: {},
  setup(props, ctx) {
    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);
    const disabled = ref(false);
    const formSize = ref("default");
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive<RuleForm>({
      name: "",
      url: "",
      img: "",
      delivery: false,
      desc: "",
    });

    const rules = reactive({
      name: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "blur",
        },
      ],
    });

    const handleRemove = (file: UploadFile) => {
      console.log(file);
    };

    const handlePictureCardPreview = (file: UploadFile) => {
      dialogImageUrl.value = file.url!;
      dialogVisible.value = true;
    };

    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log("submit: ", JSON.parse(JSON.stringify(ruleForm)));
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    return {
      dialogVisible,
      disabled,
      rules,
      dialogImageUrl,
      ruleFormRef,
      ruleForm,
      formSize,
      submitForm,
      handleRemove,
      handlePictureCardPreview,
      resetForm,
    };
  },
});
</script>

<style scoped>
.banner-wrapper {
  margin-top: 20px;
}
.banner-btn {
  width: 100%;
  text-align: center;
}
</style>
