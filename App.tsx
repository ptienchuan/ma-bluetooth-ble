import React, { useState } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

const bleManager = new BleManager();

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);

  const startScanning = () => {
    setDevices([]);
    setIsScanning(true);
    bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, scannedDevice) => {
        if (error) {
          stopScanning();
          return console.log(error);
        }
        if (scannedDevice && scannedDevice.name) {
          setDevices((prevState) => {
            const deviceIndex = prevState.findIndex(
              ({ name }) => name === scannedDevice.name
            );
            if (deviceIndex < 0) {
              return [...prevState, scannedDevice];
            }
            return prevState;
          });
        }
      }
    );
  };

  const stopScanning = () => {
    setIsScanning(false);
    bleManager.stopDeviceScan();
  };

  const selectDevice = async (device: Device) => {
    const selectedDevice = await bleManager.connectToDevice(device.id);
    console.log({ selectedDevice });
  };

  const getListConnected = async () => {
    console.log("GET CONNECTED");
    setDevices([]);
    const connectedDevices = await bleManager.connectedDevices([]);
    console.log("GET CONNECTED");
    setDevices(connectedDevices);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.functions}>
        {isScanning ? (
          <>
            <Text>Scanning ...</Text>
            <Button title="Stop scanning" onPress={stopScanning} />
          </>
        ) : (
          <>
            <Button title="Scan" onPress={startScanning} />
            <Button title="Connected" onPress={getListConnected} />
          </>
        )}
      </View>
      <View style={styles.devices}>
        <Text style={styles.title}>LIST DEVICES</Text>
        {devices.map((device) => (
          <Button
            key={device.id}
            title={device.name || ""}
            onPress={() => selectDevice(device)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  functions: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#DAE8FC",
  },
  devices: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10,
  },
  device: {
    marginVertical: 5,
  },
});
