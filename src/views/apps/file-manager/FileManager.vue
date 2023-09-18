<template>
  <div class="card">
    <iframe
      class="rounded w-100 custom-height-100vh"
      src="http://127.0.0.1/filemanager/plugins/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1&lang=en_EN"
      :allowfullscreen="true"
    ></iframe>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "file-manager",
});
</script>

<style scoped lang="scss">
.custom-height-100vh {
  height: 100vh;
}
</style>
