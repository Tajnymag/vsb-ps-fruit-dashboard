<template>
  <div class="container">
    <div class="row">
      <input type="text" v-model="textToSlide" />
      <button @click="printText">Send text</button>
    </div>

    <hr/>

    <div class="row">
      <LineChart v-bind="humidityChartProps"/>
      <LineChart v-bind="pressureChartProps"/>
      <LineChart v-bind="temperatureChartProps"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {io, Socket} from 'socket.io-client';
import {Chart, registerables} from 'chart.js';
import {parseJSON} from 'date-fns';
import 'chartjs-adapter-date-fns';
import {LineChart, useLineChart} from "vue-chart-3";
import {BrowserToServerEvents, NewSensorData, ServerToBrowserEvents} from "fruit-dashboard-server";

Chart.register(...registerables);

const socket: Socket<ServerToBrowserEvents, BrowserToServerEvents> = io('https://vsb-fruit-dashboard.herokuapp.com/web');

const textToSlide = ref("AHOJ");
const sensorDataset = ref<NewSensorData[]>([]);
const discoveredFruits = ref<string[]>([]);

const {lineChartProps: humidityChartProps, lineChartRef: humidityChartRef} = useLineChart({
  options: {
    responsive: true,
    scales: {
      x: { type: 'timeseries' }
    },
    plugins: {
      title: {
        display: true,
        text: 'Tlak'
      }
    }
  },
  chartData: {
    datasets: discoveredFruits.value.map(fruitIp => (
        {
          label: fruitIp,
          data: sensorDataset.value.filter(d => d.fruitIp === fruitIp).map(d => ({x: parseJSON(d.measuredAt).valueOf(), y: d.humidity}))
        }
    ))
  }
});

const {lineChartProps: pressureChartProps, lineChartRef: pressureChartRef} = useLineChart({
  options: {
    responsive: true,
    scales: {
      x: { type: 'timeseries' }
    },
    plugins: {
      title: {
        display: true,
        text: 'Tlak'
      }
    }
  },
  chartData: {
    datasets: discoveredFruits.value.map(fruitIp => (
        {
          label: fruitIp,
          data: sensorDataset.value.filter(d => d.fruitIp === fruitIp).map(d => ({x: parseJSON(d.measuredAt).valueOf(), y: d.pressure}))
        }
    ))
  }
});

const {lineChartProps: temperatureChartProps, lineChartRef: temperatureChartRef} = useLineChart({
  options: {
    responsive: true,
    scales: {
      x: { type: 'timeseries' }
    },
    plugins: {
      title: {
        display: true,
        text: 'Teplota'
      }
    }
  },
  chartData: {
    datasets: discoveredFruits.value.map(fruitIp => (
        {
          label: fruitIp,
          data: sensorDataset.value.filter(d => d.fruitIp === fruitIp).map(d => ({x: parseJSON(d.measuredAt).valueOf(), y: (d.temperatureFromHumidity + d.temperatureFromPressure) / 2}))
        }
    ))
  }
});

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
  if (!discoveredFruits.value.includes(sensorData.fruitIp)) {
    discoveredFruits.value.push(sensorData.fruitIp);
  }
  sensorDataset.value.push(sensorData);
});
</script>

<style>
</style>
