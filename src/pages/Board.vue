<template>
  <!-- Board -->
  <div class="flex flex-1 items-center justify-center">
    <div class="table-container">
      <!-- Top -->
      <div class="table-top flex justify-center items-end">
        <PlayerContainer
          :players="table['top']"
          :cards="cardsByPlayers"
          :cards-face-down="cardsFaceDown"
        ></PlayerContainer>
      </div>
      <div></div>

      <!-- Left -->
      <div class="table-left flex justify-end items-center">
        <PlayerContainer
          :players="table['left']"
          :cards="cardsByPlayers"
          :cards-face-down="cardsFaceDown"
        ></PlayerContainer>
      </div>

      <!-- Board -->
      <div class="board-container">
        <div
          id="board"
          :class="[{ ready: activeCard }, 'flex flex-col items-center justify-center']"
        >
          <!-- Cases -->
          <div v-if="cases.length > 0" class="flex text-white items-center select-none">
            <div
              :class="[
                { invisible: caseVisible == 0 },
                'font-bold mx-2 text-2xl cursor-pointer',
              ]"
              @click="prevCase"
            >
              &lt;
            </div>
            <div v-for="(c, index) in cases" :key="c">
              <div v-if="index == caseVisible" class="my-4 text-white text-2xl">
                <a :href="c" target="_blank" class="hover:underline"
                  >Case #{{ c.split("Id:")[1] }}</a
                >
              </div>
            </div>
            <div
              :class="[
                { invisible: caseVisible == cases.length - 1 },
                'font-bold mx-2 text-2xl cursor-pointer',
              ]"
              @click="nextCase"
            >
              &gt;
            </div>
          </div>

          <!-- Action button -->
          <button
            class="p-2 border-2 border-white border-opacity-40 text-white rounded-lg"
            @click="cardsFaceDown ? revealCards() : resetCards()"
          >
            {{ cardsFaceDown ? "Revelar cartas" : "Nueva votación" }}
          </button>
        </div>
      </div>

      <!-- Right -->
      <div class="table-right flex justify-start items-center">
        <PlayerContainer
          :players="table['right']"
          :cards="cardsByPlayers"
          :cards-face-down="cardsFaceDown"
        ></PlayerContainer>
      </div>

      <!-- Bottom -->
      <div class="table-bottom flex justify-center items-start">
        <div class="player-container">
          <div
            :class="[
              'card',
              { hide: cardsFaceDown && cardsByPlayers[playerName], selected: !!cardsByPlayers[playerName] },
            ]"
          >
            <img
              v-if="cardsByPlayers[playerName]"
              :src="
                cardsByPlayers[playerName] && cardsFaceDown
                  ? 'cards/back.png'
                  : `cards/cardSpades_${cardsByPlayers[playerName]}.png`
              "
              alt=""
            />
          </div>
          <span class="player-name">{{ playerName }}</span>
        </div>
      </div>
    </div>
  </div>


  <!-- Deck -->
  <div id="cardDeck" class="flex justify-center">
    <button
      v-for="card in cardsOptions"
      :key="card"
      :class="['card selected', { active: activeCard == card }]"
      :value="card"
      @click="changeActiveCard(card)"
    >
      <img :src="`cards/cardSpades_${card}.png`" :alt="`Card ${card}`" />
    </button>
  </div>


  <!-- Settings -->
  <!-- Icon -->
  <div
    class="absolute h-14 w-14 p-3 bottom-5 right-5 bg-white rounded shadow-xl cursor-pointer"
    @click="modalSettingsIsOpen = true"
  >
    <IconSettings></IconSettings>
  </div>
  <!-- Modal -->
  <Modal v-if="modalSettingsIsOpen">
    <template #title> Carga de cases </template>
    <template #body>
      <textarea
        rows="50"
        cols="1"
        class="border border-black rounded w-full h-52"
        v-model="casesString"
        placeholder="https://teg.avature.net/#Case/Id:80081
https://teg.avature.net/#Case/Id:80083
https://teg.avature.net/#Case/Id:80085"
      />
    </template>
    <template #footer>
      <button
        @click="
          caseVisible = 0;
          saveCases();
        "
        class="bg-[#003366] hover:bg-[#003366] hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded focus:outline-none"
      >
        Aceptar
      </button>
    </template>
  </Modal>


  <!-- Fireworks -->
  <Fireworks v-if="showFireworks"></Fireworks>
</template>

<script setup>
import {
  setDoc,
  doc,
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { db } from "@/firebase.js";
import { ref, computed, defineProps, toRefs } from "vue";

import Modal from "@/components/elements/Modal.vue";
import IconSettings from "../components/icons/IconSettings.vue";
import PlayerContainer from "../components/elements/PlayerContainer.vue";
import Fireworks from "@/components/Fireworks.vue";

const props = defineProps({
  playerName: {
    type: String,
    required: true,
  },
});
const { playerName } = toRefs(props);
const cardsOptions = [1, 2, 3, 5, 8, 13, 21, 999];

let table = ref({});
let activeCard = ref(0);
let cardsByPlayers = ref({});
let cardsFaceDown = ref(true);
let modalSettingsIsOpen = ref(false);
let casesString = ref("");
let caseVisible = ref(0);

// Init
function resetTable() {
  Object.assign(table.value, {
    left: [],
    top: [],
    right: [],
  });
}
resetTable();


// Session ID
let queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (!urlParams.get("sessionId")) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("sessionId", Math.random().toString(16).slice(2));
  window.location.search = urlParams;
}
/* Unique internal session id by day */
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const sessionId = urlParams.get("sessionId") + year + month + day;


// Players
async function getPlayers() {
  const playersSnapshot = doc(db, "sessions", sessionId);
  onSnapshot(playersSnapshot, (doc) => {
    let activePlayers = [];
    let players = doc.data() || [];

    // Set cards for players
    Object.keys(players).forEach((player) => {
      activePlayers.push(player);
      cardsByPlayers.value[player] = players[player];
    });
    Object.keys(cardsByPlayers.value).forEach((player) => {
      if (!activePlayers.includes(player)) {
        delete cardsByPlayers.value[player];
      }
    });

    // Set players in table
    resetTable();
    let users = Object.keys(cardsByPlayers.value).filter((u) => u != playerName.value);
    while (users.length > 0) {
      Object.keys(table.value).forEach((position) => {
        if (users.length == 0) return false;
        table.value[position].push(users.shift());
      });
    }
  });
}
getPlayers();


// Cards
function resetCards() {
  activeCard.value = null;
  revealCards();
  Object.keys(cardsByPlayers.value).forEach((n) => {
    setDoc(
      doc(db, "sessions", sessionId),
      {
        [n]: null,
      },
      { merge: true }
    );
  });
}

// Settings
const settingsSnapshot = doc(db, "settings", sessionId);
onSnapshot(settingsSnapshot, (doc) => {
  cardsFaceDown.value = doc.data()?.reveal || false;
  if (cardsFaceDown.value) {
    getPlayers();
    activeCard.value = null;
  }
});

function revealCards() {
  setDoc(
    doc(db, "settings", sessionId),
    { reveal: !cardsFaceDown.value },
    { merge: true }
  );
  cardsFaceDown.value = !cardsFaceDown.value;
  getPlayers();
}

async function changeActiveCard(option) {
  activeCard.value = option;
  setDoc(
    doc(db, "sessions", sessionId),
    {
      [playerName.value]: activeCard.value,
    },
    { merge: true }
  );
}
changeActiveCard(null);


// Cases
async function getCases() {
  const casesSnapshot = doc(db, "cases", sessionId);
  onSnapshot(casesSnapshot, (doc) => {
    casesString.value = doc.data()?.value || "";
    caseVisible.value = doc.data()?.activeCase;
    //caseVisible.value = 0;
  });
}
getCases();

async function saveCases() {
  setDoc(
    doc(db, "cases", sessionId),
    {
      value: casesString.value,
    },
    { merge: true }
  );
  modalSettingsIsOpen.value = false;
}

function nextCase(){
  caseVisible.value < cases.value.length - 1 ? caseVisible.value++ : ''
  setActiveCase();
}
function prevCase(){
  caseVisible.value > 0 ? caseVisible.value-- : ''
  setActiveCase();
}
async function setActiveCase(){
  setDoc(
    doc(db, "cases", sessionId),
    {
      activeCase: caseVisible.value,
    },
    { merge: true }
  );
}

const cases = computed(() => {
  return casesString.value.split("\n").filter((line) => line.trim() !== "");
});


// Logout on exit
window.addEventListener("beforeunload", async (event) => {
  event.preventDefault();
  try {
    const docRef = doc(db, "sessions", sessionId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const updatedData = { ...data };
      delete updatedData[playerName.value];
      await setDoc(docRef, updatedData);
    }
    event.returnValue = ""; // Necessary for some browsers
  } catch (error) {
    console.error("Error while updating document:", error);
  }
});


// Fireworks
const showFireworks = computed(() => {
  let cardsFiltered = Object.values(cardsByPlayers.value).filter((card) => card && card !== 999);
  return (
    !cardsFaceDown.value &&
    cardsFiltered.length > 1 &&
    cardsFiltered.every((card) => card === cardsFiltered[0])
  );
});
</script>