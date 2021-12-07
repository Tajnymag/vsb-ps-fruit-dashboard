<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import {io, Socket} from 'socket.io-client';
import {BrowserToServerEvents, ServerToBrowserEvents} from "fruit-dashboard-server";

const socket: Socket<ServerToBrowserEvents, BrowserToServerEvents> = io('https://vsb-fruit-dashboard.herokuapp.com/web');

socket.on('connect', () => {
  console.log('connected to heroku');
});

socket.on('disconnect', () => {
  console.log('disconnected from heroku');
})

socket.on('NEW_SENSOR_DATA', sensorData => {
  console.log(sensorData);
});
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
