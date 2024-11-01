<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';

import MenuForm from './components/MenuForm.vue';

import MenuService from '@/services/menu-service';

import MenuDto from '@/models/menu-dto';
import ApiParams from '@/models/apiParams';

const menuService = new MenuService();

const menuList = ref<MenuDto[]>([]);
const itemSelected = ref();
const itemToEdit = ref();
const showMenuFormDialog = ref(false)

const verTodos = ref(false)


const getMenuList = async () => {
    const response = await menuService.getList();
    const menuFullList: MenuDto[] = response.map((item: ApiParams) => {
        return {
            idcod: item.idcod,
            description: item.param1,
            price: parseFloat(item.param2!),
            type: item.param3,
            avaiable: item.param4 === "disponible"
        }
    });

    menuList.value = verTodos.value
        ? menuFullList
        : menuFullList.filter(x => x.avaiable);

}

const editMenu = () => {
    itemToEdit.value = itemSelected.value;
    itemSelected.value = null
    toggleMenuForm();
};

const toggleMenuForm = () => {
    showMenuFormDialog.value = !showMenuFormDialog.value;
    if (!showMenuFormDialog.value) {
        getMenuList();
        itemToEdit.value = false;
    }
}

const deleteMenu = async () => {
    const id = mapMenuDtoToApiParams(itemSelected.value).idcod;
    const data = {
        data: {
            idcod: id
        }
    }
    const response = await menuService.delete(data)
    await getMenuList();
}

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
    await getMenuList();
});
</script>

<template>
    <div class="grid">
        <div class="col-12 text-center">
            <Toolbar class="toolbar">
                <template #start>
                    <Button label="Crear" icon="pi pi-plus-circle" class="p-button-success"
                        v-on:click="toggleMenuForm()"></Button>
                    <Button label="Editar" icon="pi pi-pencil" class="p-button ml-2" v-on:click="editMenu()"
                        v-bind:disabled="!itemSelected"></Button>
                    <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger ml-2" @click="deleteMenu()"
                        v-bind:disabled="!itemSelected"></Button>
                </template>
                <template #end>
                    <label>
                        <Checkbox v-model="verTodos" :binary="true" @change="getMenuList()" />
                        Ver todos
                    </label>
                </template>
            </Toolbar>
        </div>
        <div class="col-12">
            <DataTable dataKey="idcod" selectionMode="single" :value="menuList" responsiveLayout="scroll"
                v-bind:metaKeySelection="false" v-model:selection="itemSelected">
                <Column field="idcod" header="ID"></Column>
                <Column field="description" header="Descripción"></Column>
                <Column field="price" header="Precio"></Column>
                <Column field="type" header="Tipo"></Column>
            </DataTable>
        </div>
    </div>
    <Dialog class="w-9" :modal="true" :closable="false" :visible="showMenuFormDialog">
        <MenuForm @closeForm="toggleMenuForm()" :item="itemToEdit"></MenuForm>
    </Dialog>
</template>