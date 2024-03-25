<template>
  <div v-for="player in players" :key="player" class="player-container">
    <div
      :class="[
        'card',
        {
          hide: cardsFaceDown && cards[player],
          selected: !!cards[player],
        },
      ]"
    >
      <img
        v-if="cards[player]"
        :src="
          cards[player] && cardsFaceDown
            ? 'cards/back.png'
            : `cards/cardSpades_${cards[player]}.png`
        "
        alt=""
      />
    </div>
    <span class="player-name">{{ player }}</span>
  </div>
</template>

<script setup>
defineProps({
  players: {
    type: Array,
    required: true,
  },
  cardsFaceDown: {
    type: Boolean,
    required: true,
  },
  cards: {
    type: Object,
    required: true,
  },
});
</script>
