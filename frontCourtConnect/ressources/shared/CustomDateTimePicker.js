import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function CustomDateTimePicker({
  value = new Date(),
  onChange,
  theme,
}) {
  const utcDate = new Date(value);

  const [tempDateTime, setTempDateTime] = useState(utcDate);
  const [tempDay, setTempDay] = useState(utcDate.getUTCDate());
  const [tempMonth, setTempMonth] = useState(utcDate.getUTCMonth() + 1);
  const [tempYear, setTempYear] = useState(utcDate.getUTCFullYear());
  const [tempHour, setTempHour] = useState(utcDate.getUTCHours());
  const [tempMinute, setTempMinute] = useState(utcDate.getUTCMinutes());

  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [days, setDays] = useState([]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() + i
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    const lastDay = new Date(tempYear, tempMonth, 0).getDate();
    setDays(Array.from({ length: lastDay }, (_, i) => i + 1));
    if (tempDay > lastDay) setTempDay(lastDay);
  }, [tempMonth, tempYear]);

  useEffect(() => {
    const d = new Date(value);
    setTempDateTime(d);
    setTempDay(d.getUTCDate());
    setTempMonth(d.getUTCMonth() + 1);
    setTempYear(d.getUTCFullYear());
    setTempHour(d.getUTCHours());
    setTempMinute(d.getUTCMinutes());
  }, [value]);

  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setShowDateModal(true)}
          style={[
            styles.inputBlock,
            {
              borderColor: theme.primary,
              backgroundColor: theme.background_light,
            },
          ]}
        >
          <Text style={{ color: theme.text }}>
            {`${String(tempDateTime.getUTCDate()).padStart(2, "0")}/${String(
              tempDateTime.getUTCMonth() + 1
            ).padStart(2, "0")}/${tempDateTime.getUTCFullYear()}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTimeModal(true)}
          style={[
            styles.inputBlock,
            {
              borderColor: theme.primary,
              backgroundColor: theme.background_light,
            },
          ]}
        >
          <Text style={{ color: theme.text }}>
            {`${String(tempDateTime.getUTCHours()).padStart(2, "0")}:${String(
              tempDateTime.getUTCMinutes()
            ).padStart(2, "0")}`}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showDateModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setShowDateModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContainer,
                  { backgroundColor: theme.background },
                ]}
              >
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Choisir une date
                </Text>
                <View style={styles.pickerRow}>
                  <Picker
                    selectedValue={tempDay}
                    onValueChange={setTempDay}
                    style={styles.picker}
                    itemStyle={{ fontSize: 14, color: theme.text }}
                  >
                    {days.map((d) => (
                      <Picker.Item
                        key={d}
                        label={String(d).padStart(2, "0")}
                        value={d}
                      />
                    ))}
                  </Picker>
                  <Picker
                    selectedValue={tempMonth}
                    onValueChange={setTempMonth}
                    style={styles.picker}
                    itemStyle={{ fontSize: 14, color: theme.text }}
                  >
                    {months.map((m) => (
                      <Picker.Item
                        key={m}
                        label={String(m).padStart(2, "0")}
                        value={m}
                      />
                    ))}
                  </Picker>
                  <Picker
                    selectedValue={tempYear}
                    onValueChange={setTempYear}
                    style={styles.picker}
                    itemStyle={{ fontSize: 14, color: theme.text }}
                  >
                    {years.map((y) => (
                      <Picker.Item key={y} label={String(y)} value={y} />
                    ))}
                  </Picker>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const newDate = new Date(
                      Date.UTC(
                        tempYear,
                        tempMonth - 1,
                        tempDay,
                        tempHour,
                        tempMinute
                      )
                    );
                    setTempDateTime(newDate);
                    onChange?.(newDate);
                    setShowDateModal(false);
                  }}
                  style={[
                    styles.closeButton,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text style={{ color: "#fff" }}>Valider</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={showTimeModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setShowTimeModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContainer,
                  { backgroundColor: theme.background_light },
                ]}
              >
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Choisir une heure
                </Text>
                <View style={styles.pickerRow}>
                  <Picker
                    selectedValue={tempHour}
                    onValueChange={setTempHour}
                    style={styles.picker}
                  >
                    {hours.map((h) => (
                      <Picker.Item
                        key={h}
                        label={String(h).padStart(2, "0")}
                        value={h}
                      />
                    ))}
                  </Picker>
                  <Picker
                    selectedValue={tempMinute}
                    onValueChange={setTempMinute}
                    style={styles.picker}
                  >
                    {minutes.map((m) => (
                      <Picker.Item
                        key={m}
                        label={String(m).padStart(2, "0")}
                        value={m}
                      />
                    ))}
                  </Picker>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const newDate = new Date(
                      Date.UTC(
                        tempYear,
                        tempMonth - 1,
                        tempDay,
                        tempHour,
                        tempMinute
                      )
                    );
                    setTempDateTime(newDate);
                    onChange?.(newDate);
                    setShowTimeModal(false);
                  }}
                  style={[
                    styles.closeButton,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text style={{ color: "#fff" }}>Valider</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  inputBlock: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    height: 350,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    minWidth: 80,
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
