<template>
    <!-- Main modal -->
    <div
        class="overflow-x-hidden text-black fixed right-0 left-0 top-0 bottom-0 z-50 justify-center items-center h-modal md:h-full md:inset-0 bg-black bg-opacity-50"
    >
        <div class="mx-auto relative top-10 px-4 w-full max-w-2xl h-full md:h-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow">
                <!-- Modal header -->
                <div
                    class="flex justify-between items-center py-2 px-4 rounded-t border-b"
                >
                    <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl ">
                        <slot name="title" />
                    </h3>
                    <button
                    v-if="1==2"
                        type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                        @click="$emit('cancel')"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="p-6 space-y-6 text-left">
                    <slot name="body" />
                </div>
                <!-- Modal footer -->
                <div
                    class="flex items-center p-4 space-x-2 rounded-b border-t border-gray-200"
                >
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['cancel', 'ok']
}
</script>
