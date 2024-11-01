<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';

import OrderForm from './components/OrderForm.vue';

import OrderService from '@/services/order-serivce';
import MenuService from '@/services/menu-service';

import ApiParams from '@/models/apiParams';
import OrderDto from '@/models/order-dto';
import MenuDto from '@/models/menu-dto';

const orderService = new OrderService();
const menuService = new MenuService();

const orderList = ref<OrderDto[]>([])
const itemSelected = ref();
const itemToEdit = ref();
const showOrderFormDialog = ref(false)

const getOrderList = async () => {
    const response = await orderService.getList();
    const rawOrderList: OrderDto[] = response.map(mapApiParamsToOrderDto);

    orderList.value = await Promise.all(
        rawOrderList.map(async x => {
            const response2 = await menuService.get(x.idMenu);
            const menu: MenuDto = mapApiParamsToMenuDto(response2);
            const menuDescription = menu.description;
            return { ...x, menuDescription };
        })
    );
}

const editOrder = () => {
    itemToEdit.value = itemSelected.value;
    itemSelected.value = null
    toggleOrderForm();
};


const toggleOrderForm = () => {
    showOrderFormDialog.value = !showOrderFormDialog.value;
    if (!showOrderFormDialog.value) {
        getOrderList();
        itemToEdit.value = false;
    }
}

const deleteOrder = async () => {
    const id = mapOrderDtoToApiParams(itemSelected.value).idcod;
    const data = {
        data: {
            idcod: id
        }
    }
    const response = await orderService.delete(data)
    await getOrderList();
}

const mapOrderDtoToApiParams = (data: OrderDto): ApiParams => {
    return {
        idcod: data.idcod,
        param1: data.date,
        param2: data.idMenu,
        param3: data.observation,
        param4: "",
        param5: "",
        param6: "",
        param7: "",
        param8: "",
        param9: "",
        param10: "",
        tabla: ""
    };
};

const mapApiParamsToOrderDto = (item: ApiParams): OrderDto => {
    return {
        idcod: item.idcod,
        date: formateStringDate(item.param1!),
        idMenu: item.param2,
        observation: item.param3,
    };
};

const mapApiParamsToMenuDto = (item: ApiParams): MenuDto => {
    return {
        idcod: item.idcod,
        description: item.param1,
        price: parseFloat(item.param2!),
        type: item.param3,
        avaiable: item.param4 === "disponible",
    };
};

const formateStringDate = (date: string) => {
    return date.replaceAll("a", "/");
}

onMounted(async () => {
    await getOrderList();
});

</script>
<template>
    <div class="grid">
        <div class="col-12 text-center">
            <Toolbar class="toolbar">
                <template #start>
                    <Button label="Crear" icon="pi pi-plus-circle" class="p-button-success"
                        v-on:click="toggleOrderForm()"></Button>
                    <Button label="Editar" icon="pi pi-pencil" class="p-button ml-2" v-on:click="editOrder()"
                        v-bind:disabled="!itemSelected"></Button>
                    <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger ml-2" @click="deleteOrder()"
                        v-bind:disabled="!itemSelected"></Button>
                </template>
            </Toolbar>
        </div>
        <div class="col-12">
            <DataTable dataKey="idcod" selectionMode="single" :value="orderList" responsiveLayout="scroll"
                v-bind:metaKeySelection="false" v-model:selection="itemSelected">
                <Column field="idcod" header="ID"></Column>
                <Column field="menuDescription" header="Menu"></Column>
                <Column field="date" header="Fecha"></Column>
                <Column field="observation" header="Observaciones"></Column>
            </DataTable>
        </div>
    </div>
    <Dialog class="w-9" :modal="true" :closable="false" :visible="showOrderFormDialog">
        <OrderForm @closeForm="toggleOrderForm" :item="itemToEdit"></OrderForm>
    </Dialog>
</template>