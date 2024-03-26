<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <img class="h-20 w-20" src="/poker.png" alt="Poker Logo" />
      <h1 class="text-[3rem] font-poker font-semibold mb-4">La Poker</h1>
      <div class="flex flex-col gap-2">
        <div class="relative">
          <icon-user alt="User Icon" class="w-4 h-4 text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"></icon-user>
          <input v-model="name" type="text" placeholder="Nombre" class="pl-10 py-2 pr-4 border border-gray-300 rounded-md" @keyup.enter="login()">
        </div>

        <div class="relative">
          <icon-session alt="Session Icon" class="w-4 h-4 text-gray-600 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"></icon-session>
          <input v-model="sessionId" type="text" placeholder="Sala" class="pl-10 py-2 pr-4 border border-gray-300 rounded-md" @keyup.enter="login()">
        </div>

        <button
          id="submitButton"
          class="disabled:bg-gray-400 bg-[#003366] hover:bg-[#003366] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
          :disabled="!(name && sessionId)"
          @click="login()"
        >
          Entrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router';

import IconUser from "../components/icons/IconUser.vue";
import IconSession from "../components/icons/IconSession.vue";

let emit = defineEmits(['init']);

const route = useRoute();
const router = useRouter();

let name = ref("");
let sessionId = ref(route.params.sessionId);

function login(){
  router.push({ params: { sessionId: sessionId.value } });
  emit('init', {
    name: name.value,
    sessionId: sessionId.value
  })
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
