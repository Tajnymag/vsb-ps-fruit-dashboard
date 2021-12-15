<template>
  <div class="container">
    <div class="input-group">
      <input type="text" class="form-control" v-model="textToSlide" />
      <button type="button" class="btn btn-primary" @click="printText">Send text</button>
    </div>

    <div class="row">
      <LineChart :options="humidityChartOptions" :chartData="humidityChartData"/>
      <LineChart :options="pressureChartOptions" :chartData="pressureChartData"/>
      <LineChart :options="temperatureChartOptions" :chartData="temperatureChartData"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import {io, Socket} from 'socket.io-client';
import {Chart, ChartData, ChartOptions, registerables} from 'chart.js';
import {parseJSON} from 'date-fns';
import 'chartjs-adapter-date-fns';
import {LineChart} from "vue-chart-3";
import {BrowserToServerEvents, NewSensorData, ServerToBrowserEvents} from "fruit-dashboard-server";
import {getRandomColor} from "./utils";

Chart.register(...registerables);

const socket: Socket<ServerToBrowserEvents, BrowserToServerEvents> = io('https://vsb-fruit-dashboard.herokuapp.com/web');

const textToSlide = ref("AHOJ");
const sensorDataset = ref<NewSensorData[]>([]);
const discoveredFruits = ref<string[]>([]);
const fruitColorMap = reactive(new Map<string, string>());
const measurementsLimit = ref(1000);

const commonChartOptions: ChartOptions<'line'> = {
  responsive: true,
  scales: {
    x: {
      type: 'timeseries',
      time: {
        round: 'second'
      }
    }
  },
  spanGaps: true,
  plugins: {
    decimation: {
      algorithm: 'min-max',
      enabled: true
    },
  }
}

const humidityChartOptions: ChartOptions<'line'> = {
  ...commonChartOptions,
  plugins: {
    ...commonChartOptions.plugins,
    title: {
      display: true,
      text: 'Vlhkost'
    }
  }
};
const humidityChartData = computed<ChartData<'line'>>(() => ({
  datasets: discoveredFruits.value.map(fruitIp => (
      {
        label: fruitIp,
        borderColor: fruitColorMap.get(fruitIp),
        data: sensorDataset.value.filter(d => d.fruitIp === fruitIp).map(d => ({x: parseJSON(d.measuredAt).valueOf(), y: d.humidity}))
      }
  ))
}));

const pressureChartOptions: ChartOptions<'line'> = {
  ...commonChartOptions,
  plugins: {
    ...commonChartOptions.plugins,
    title: {
      display: true,
      text: 'Tlak'
    }
  }
};
const pressureChartData = computed<ChartData<'line'>>(() => ({
  datasets: discoveredFruits.value.map(fruitIp => (
      {
        label: fruitIp,
        borderColor: fruitColorMap.get(fruitIp),
        data: sensorDataset.value.filter(d => d.fruitIp === fruitIp).map(d => ({x: parseJSON(d.measuredAt).valueOf(), y: d.pressure}))
      }
  ))
}));

const temperatureChartOptions: ChartOptions<'line'> = {
  ...commonChartOptions,
  plugins: {
    ...commonChartOptions.plugins,
    title: {
      display: true,
      text: 'Teplota'
    }
  }
};
const temperatureChartData = computed<ChartData<'line'>>(() => ({
  datasets: discoveredFruits.value.map(fruitIp => (
      {
        label: fruitIp,
        borderColor: fruitColorMap.get(fruitIp),
        data: sensorDataset.value.filter(d => d.fruitIp === fruitIp).map(d => ({x: parseJSON(d.measuredAt).valueOf(), y: (d.temperatureFromPressure + d.temperatureFromHumidity) / 2}))
      }
  ))
}));

const printText = () => {
  socket.emit('PRINT_TEXT', textToSlide.value);
}

socket.on('connect', () => {
  console.log('connected to heroku');

  socket.emit('GET_SENSOR_DATA', sensorData => {
    sensorDataset.value = [...sensorDataset.value, ...sensorData];
  });
});

socket.on('disconnect', () => {
  console.log('disconnected from heroku');
})

socket.on('NEW_SENSOR_DATA', sensorData => {
  if (!discoveredFruits.value.includes(sensorData.fruitIp)) {
    discoveredFruits.value.push(sensorData.fruitIp);
    fruitColorMap.set(sensorData.fruitIp, getRandomColor());
  }
  sensorDataset.value.push(sensorData);
  sensorDataset.value = sensorDataset.value.filter((_, i, a) => (a.length - i) <= measurementsLimit.value);
});
</script>

<style>
</style>
