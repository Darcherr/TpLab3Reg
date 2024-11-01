<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToOrderPage = () => {
    router.push({ name: "order" });
};
</script>

<template>
    <div class="flex flex-column justify-content-center align-items-center min-h-screen p-5 bg-welcome">
        <Card class="text-center shadow-4 border-round-lg welcome-card p-5">
            <template #content>
                <!-- Contenedor del logo -->
                <div class="logo-container mb-4">
                    <img alt="app logo" src="/public/descarga.png" class="welcome-logo" />
                </div>
                <!-- Mensaje de bienvenida -->
                <h1 class="text-welcome-title font-bold mb-3">¡Bienvenido a Nuestro Menú!</h1>
                <p class="text-welcome-desc mb-5">
                    Disfruta de la mejor comida. Haz tu pedido con solo un clic.
                </p>
                <!-- Botón para ir a la página de pedidos -->
                <Button label="Hacer Pedido" class="p-button-lg p-button-rounded p-button-primary w-full"
                    @click="goToOrderPage" style="background-color: #ff9800; color: white;" />
            </template>
        </Card>
    </div>
</template>

<style scoped>
/* Fondo para la pantalla de bienvenida */
.bg-welcome {
    background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
    color: #ffffff;
}

/* Estilo del Card */
.welcome-card {
    width: 100%;
    max-width: 600px;
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

/* Estilo del logo */
.welcome-logo {
    width: 70%;
    max-width: 250px;
    border-radius: 12px;
}

/* Estilos de texto */
.text-welcome-title {
    color: #333333;
    font-size: 2rem;
}

.text-welcome-desc {
    color: #666666;
    font-size: 1.1rem;
}
</style>
