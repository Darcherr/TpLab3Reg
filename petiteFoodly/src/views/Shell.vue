<script setup lang="ts">
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import { useRouter } from 'vue-router';

const router = useRouter();

const items = ref([
    {
        data: "/home",
        label: "Inicio",
        icon: "pi pi-home"
    },
    {
        data: "/order",
        label: "Ordenes",
        icon: "pi pi-shopping-cart"
    },
    {
        data: "/menu",
        label: "Menus",
        icon: "pi pi-receipt"
    },
]);

const goToView = (path: string) => {
    router.push({ path });
};
</script>

<template>
    <div class="card">
        <Menubar :model="items">
            <template #item="{ item, props }">
                <a @click.prevent="goToView(item.data)" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </template>
        </Menubar>
    </div>
    <div class="p-3">
        <RouterView></RouterView>
    </div>
</template>
