import TitleBlock from "@/src/components/onboarding/titleBlock";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import AppText from "../../../src/components/appText";
import ContinueButton from "../../../src/components/onboarding/continueButton";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import { Colors } from "../../../src/constants/theme";

export default function OnboardingMoneySpent() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CRC"); // "CRC" | "USD"
  const [pickerOpen, setPickerOpen] = useState(false);

  function formatDisplayCurrency(code: string) {
    return code === "CRC" ? "Colones" : "Dólares";
  }

  return (
    <View style={styles.container}>
      <OnboardingHeader step={5} total={10} />

      <View style={styles.content}>
        <TitleBlock
          title="¿Cuánto gastás por semana?"
          subtitle="Registrar tus gastos te muestra cuánto podrías ahorrar."
        />

        {/* INPUT NUMÉRICO */}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#A0A0BF"
          value={amount}
          onChangeText={(text) => {
            const clean = text.replace(/[^0-9]/g, "");
            setAmount(clean);
          }}
        />

        {/* SELECTOR DE MONEDA */}
        <TouchableOpacity
          style={styles.currencyPicker}
          onPress={() => setPickerOpen(true)}
        >
          <AppText weight="semibold" style={styles.currencyText}>
            {formatDisplayCurrency(currency)}
          </AppText>

          <AppText style={{ fontSize: 14 }}>⌄</AppText>
        </TouchableOpacity>

        {/* PICKER MODAL (simple) */}
        {pickerOpen && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setCurrency("CRC");
                  setPickerOpen(false);
                }}
              >
                <AppText weight="medium">Colones (CRC)</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setCurrency("USD");
                  setPickerOpen(false);
                }}
              >
                <AppText weight="medium">Dólares (USD)</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setPickerOpen(false)}
              >
                <AppText weight="medium" style={{ color: Colors.light.danger }}>
                  Cancelar
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        
      </View>
      {/* BOTÓN */}
        <ContinueButton 
          text="Continuar"
          route="/(auth)/onboarding/onboardingComparison"
          style={{ paddingBottom: 30 }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  content: {
    flex: 1,
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textMuted,
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#E6E4FF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 22,
    color: Colors.light.text,
    fontFamily: "Manrope_600SemiBold",
    width: "100%",
  },
  currencyPicker: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#E6E4FF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currencyText: {
    fontSize: 18,
    color: Colors.light.text,
  },

  /* MODAL */
  modalOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalCancel: {
    paddingVertical: 10,
    alignItems: "center",
  },
  bottomButtonContainer: {
    width: "100%",
    paddingBottom: 40,
},
});
