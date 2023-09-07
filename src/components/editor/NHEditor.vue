<template>
  <editor style="width: 100%" :init="init" />
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
// TinyMCE
import "tinymce/tinymce";
import "tinymce/icons/default/icons";
import "tinymce/themes/silver/theme";
import "tinymce/models/dom/model";
import "tinymce/skins/ui/oxide/skin.css";
import contentUiCss from "tinymce/skins/ui/oxide/content.css";

// TinyMCE plugins
// https://www.tiny.cloud/docs/tinymce/6/plugins/
import "tinymce/plugins/lists/plugin";
import "tinymce/plugins/link/plugin";
import "tinymce/plugins/image/plugin";
import "tinymce/plugins/table/plugin";
// import "tinymce/plugins/code/plugin";
// import "tinymce/plugins/help/plugin";
import "tinymce/plugins/wordcount/plugin";

import Editor from "@tinymce/tinymce-vue";

export default defineComponent({
  name: "nh-editor",
  props: {
    placeholder: {
      type: String,
      required: false,
      default: () => "Enter content...",
    },
  },
  components: {
    Editor,
  },
  setup(props, ctx) {
    const placeholder = ref(props.placeholder);
    return {
      init: {
        height: 300,
        placeholder: placeholder.value,
        skin: false,
        plugins: "lists link image table wordcount",
        content_css: false,
        content_style: contentUiCss.toString(),
        branding: false,
        menubar: false,
      },
    };
  },
});
</script>

<style scoped lang="scss"></style>
