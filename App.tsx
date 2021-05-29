import React, { useState } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import { BleManager } from "react-native-ble-plx";

const bleManager = new BleManager();

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<string[]>([]);

  const startScanning = () => {
    setIsScanning(true);
    bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, scannedDevice) => {
        if (error) {
          stopScanning();
          return console.log(error);
        }
        if (scannedDevice) {
          const { id, name } = scannedDevice;
          console.log({ id, name });
          if (name) {
            setDevices(devices.concat([name]));
          }
        }
      }
    );
  };

  const stopScanning = () => {
    setIsScanning(false);
    setDevices([]);
    bleManager.stopDeviceScan();
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
          <Button title="Scan" onPress={startScanning} />
        )}
      </View>
      <View style={styles.devices}>
        <Text style={styles.title}>LIST DEVICES</Text>
        {devices.map((deviceName, index) => (
          <Text style={styles.device} key={index}>
            {deviceName}
          </Text>
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
