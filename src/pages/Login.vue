<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <img class="h-20 w-20" src="/poker.png" alt="Poker Logo" />
      <h1 class="text-[3rem] font-poker font-semibold mb-4">La Poker</h1>
      <div class="flex">
        <input
          v-model="name"
          id="usernameInput"
          class="border-2 border-gray-300 rounded-l-md py-2 px-4 w-48 focus:outline-none focus:border-[#003366]"
          type="text"
          placeholder="Ingresá tu nombre"
          @keyup.enter="$emit('init', name)"
        />
        <button
          id="submitButton"
          class="bg-[#003366] hover:bg-[#003366] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-r-md focus:outline-none"
          @click="$emit('init', name)"
        >
          Entrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

let name = ref("");
</script>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
