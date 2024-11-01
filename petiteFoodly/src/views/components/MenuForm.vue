<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';

import { MenuType } from '@/constants/menutype-enum';

import MenuService from '@/services/menu-service';

import MenuDto from '@/models/menu-dto';
import ApiParams from '@/models/apiParams';

const props = defineProps(["item"]);
const emit = defineEmits(["closeForm"]);

const menuService = new MenuService();
const menu = ref<MenuDto>({});

const submiting = ref(false)

const submitForm = async () => {
    submiting.value = !submiting.value;
    menu.value.avaiable = true;
    if (!!props.item) {

        const response = await menuService.update(mapMenuDtoToApiParams(menu.value))
        emit("closeForm");
    } else {
        const apiData = mapMenuDtoToApiParams(menu.value);

        await menuService.create(apiData)

        emit("closeForm");
    }
    submiting.value = !submiting.value;
};

const loadMenu = async () => {
    //TODO: Traer menu actualizado por endpoint
    if (!!props.item) {
        menu.value = props.item;
    }
}

const menuTypes = [
    { id: MenuType.Clasico, name: "Clasico" },
    { id: MenuType.Especial, name: "Especial" },
];

const mapMenuDtoToApiParams = (data: MenuDto): ApiParams => {
    return {
        idcod: data.idcod,
        param1: data.description,
        param2: data.price?.toString(),
        param3: data.type,
        param4: data.avaiable ? "disponible" : "no disponible",
        param5: "",
        param6: "",
        param7: "",
        param8: "",
        param9: "",
        param10: "",
        tabla: ""
    };
};

onMounted(async () => {
    await loadMenu();
});

</script>

<template>
    <div class="col-12">
        <form @submit.prevent="submitForm">
            <div class="grid">
                <div class="col-3">
                    <label for="menuType">Tipo</label>
                    <Dropdown id="menuType" class="w-full" v-model="menu.type" :options="menuTypes" optionValue="id"
                        optionLabel="name" :class="{ 'p-invalid': !menu.type }">
                    </Dropdown>
                    <small class="p-error" v-if="!menu.type">
                        <i class="pi pi-exclamation-triangle"></i>
                        Este campo es obligatorio.
                    </small>
                </div>
                <div class="col-9">
                    <label for="menuDescription">Descripción</label>
                    <InputText class="w-full" v-model="menu.description" :class="{ 'p-invalid': !menu.description }" />
                    <small class="p-error" v-if="!menu.description">
                        <i class="pi pi-exclamation-triangle"></i>
                        Este campo es obligatorio.
                    </small>
                </div>
                <div class="col-9">
                    <label for="menuPrice">Precio</label>
                    <InputNumber class="w-full" v-model="menu.price" :class="{ 'p-invalid': !menu.price }" />
                    <small class="p-error" v-if="!menu.price">
                        <i class="pi pi-exclamation-triangle"></i>
                        Este campo es obligatorio.
                    </small>
                </div>
                <div class="col-12">
                    <div class="button-row text-right">
                        <Button label="Cancelar" class="p-button-text" @click="emit('closeForm')" />
                        <Button label="Guardar" type="submit" :loading="submiting" />
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>