<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import OrderDto from '@/models/order-dto';
import MenuDto from '@/models/menu-dto';
import MenuService from '@/services/menu-service';
import ApiParams from '@/models/apiParams';
import OrderService from '@/services/order-serivce';

const props = defineProps(["item"]);
const emit = defineEmits(["closeForm"]);

const menuService = new MenuService();
const orderService = new OrderService();

const order = ref<OrderDto>({})
const menuList = ref<MenuDto[]>();
const submiting = ref(false)
const orderDate = ref<Date>()

const submitForm = async () => {
    submiting.value = !submiting.value;
    order.value.date = formatDateToString(orderDate.value!);
    if (!!props.item) {
        await orderService.update(mapOrderDtoToApiParams(order.value));
        emit("closeForm");
    } else {
        const apiData = mapOrderDtoToApiParams(order.value);

        await orderService.create(apiData);

        emit("closeForm");
    }
    submiting.value = !submiting.value;
};

const formatDateToString = (date: Date) => {
    return date.toLocaleDateString().replaceAll("/", "a");
}


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

    menuList.value = menuFullList.filter(x => x.avaiable);
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

const loadOrder = async () => {
    //TODO: Traer order actualizado por endpoint
    if (!!props.item) {
        orderDate.value = typeof props.item.date === 'string' ? new Date(props.item.date) : props.item.date;
        order.value = props.item;
    }
}


onMounted(async () => {
    await getMenuList();
    await loadOrder();
});
</script>

<template>
    <div class="col-12">
        <form @submit.prevent="submitForm">
            <div class="grid">
                <div class="col-6">
                    <label for="date">Fecha</label>
                    <Calendar class="w-full" v-model="orderDate" dateFormat="dd/mm/yy" showIcon iconDisplay="input"
                        placeholder="Seleccione la fecha de su pedido" />
                    <small class="p-error" v-if="!orderDate">
                        <i class="pi pi-exclamation-triangle"></i>
                        Este campo es obligatorio.
                    </small>
                </div>
                <div class="col-6">
                    <label for="menu">Menu</label>
                    <Dropdown class="w-full" v-model="order.idMenu" :options="menuList" optionValue="idcod"
                        optionLabel="description" :class="{ 'p-invalid': !order.idMenu }">
                    </Dropdown>
                    <small class="p-error" v-if="!order.idMenu">
                        <i class="pi pi-exclamation-triangle"></i>
                        Este campo es obligatorio.
                    </small>
                </div>

                <div class="col-12">
                    <label for="observation">Observaciones</label>
                    <InputText class="w-full" v-model="order.observation" />
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