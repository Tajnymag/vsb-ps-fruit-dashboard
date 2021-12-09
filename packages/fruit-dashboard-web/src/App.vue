<template>
  <div class="container">
    <div class="row">
      <input type="text" v-model="textToSlide" />
      <button @click="printText">Send text</button>
    </div>

    <hr/>

    <div class="row">
      <LineChart ref="humidityChartRef" :chartData="humidityChartData" :options="humidityChartOptions"></LineChart>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ComputedRef, reactive, ref, withCtx} from "vue";
import {io, Socket} from 'socket.io-client';
import {Chart, ChartData, ChartOptions, registerables} from 'chart.js';
import {parseJSON} from 'date-fns';
import 'chartjs-adapter-date-fns';
import {ExtractComponentData, LineChart, useLineChart} from "vue-chart-3";
import {BrowserToServerEvents, NewSensorData, ServerToBrowserEvents} from "fruit-dashboard-server";
import {reactify} from "@vueuse/core";

Chart.register(...registerables);

const socket: Socket<ServerToBrowserEvents, BrowserToServerEvents> = io('https://vsb-fruit-dashboard.herokuapp.com/web');

const textToSlide = ref("AHOJ");
const sensorDataset = reactive<NewSensorData[]>([]);
const discoveredFruits = reactive<string[]>([]);

const humidityChartOptions = reactive<ChartOptions<'line'>>({
  responsive: true,
  scales: {
    x: { type: 'timeseries' }
  },
  plugins: {
    title: {
      display: true,
      text: 'Vlhkost'
    }
  }
});
const humidityChartData = computed<ChartData<'line'>>(() => ({
  datasets: discoveredFruits.map(fruitIp => (
      {
        label: fruitIp,
        data: sensorDataset.filter(d => d.fruitIp === fruitIp).map(d => ({x: parseJSON(d.measuredAt).valueOf(), y: d.humidity}))
      }
  ))
}));

const printText = () => {
  socket.emit('PRINT_TEXT', textToSlide.value);
}

socket.on('connect', () => {
  console.log('connected to heroku');
});

socket.on('disconnect', () => {
  console.log('disconnected from heroku');
})

socket.on('NEW_SENSOR_DATA', sensorData => {
  if (!discoveredFruits.includes(sensorData.fruitIp)) {
    discoveredFruits.push(sensorData.fruitIp);
  }
  sensorDataset.push(sensorData);
});
</script>

<style>
</style>
