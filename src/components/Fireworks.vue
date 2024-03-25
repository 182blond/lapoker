<template>
  <div id="fireworks"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { Fireworks } from "fireworks-js";

onMounted(() => {
  const container = document.querySelector("#fireworks");
  const fireworks = new Fireworks(container, {
    acceleration: 1.02,
    intensity: 12,
    traceSpeed: 1,
    traceLength: 3,
  });
  fireworks.start();
});
</script>

<style scoped>
#fireworks {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}
</style>
