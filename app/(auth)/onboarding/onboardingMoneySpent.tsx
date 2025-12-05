import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AppText from "../../../src/components/appText";
import ContinueButton from "../../../src/components/onboarding/continueButton";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import TitleBlock from "../../../src/components/onboarding/titleBlock";
import { Colors } from "../../../src/constants/theme";

/* 🔥 Lista de monedas de Latinoamérica */
const LATAM_CURRENCIES = [
  { code: "CRC", label: "Costa Rica (Colones)" },
  { code: "USD", label: "El Salvador / Panamá (USD)" },
  { code: "MXN", label: "México (Pesos Mexicanos)" },
  { code: "COP", label: "Colombia (Pesos Colombianos)" },
  { code: "PEN", label: "Perú (Sol Peruano)" },
  { code: "CLP", label: "Chile (Peso Chileno)" },
  { code: "ARS", label: "Argentina (Peso Argentino)" },
  { code: "GTQ", label: "Guatemala (Quetzal)" },
  { code: "HNL", label: "Honduras (Lempira)" },
  { code: "NIO", label: "Nicaragua (Córdoba)" },
  { code: "PYG", label: "Paraguay (Guaraní)" },
  { code: "UYU", label: "Uruguay (Peso Uruguayo)" },
  { code: "VES", label: "Venezuela (Bolívar)" },
];

/* 🔥 Formato automático de moneda según país (para el PREVIEW) */
function formatCurrency(value: string, currency: string) {
  if (!value) return "";

  const number = Number(value);
  if (isNaN(number)) return "";

  return new Intl.NumberFormat("es-LA", {
    style: "currency",
    currency,
    minimumFractionDigits:
      currency === "CRC" || currency === "CLP" || currency === "PYG" ? 0 : 2,
  }).format(number);
}

export default function OnboardingMoneySpent() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CRC");
  const [pickerOpen, setPickerOpen] = useState(false);

  const formatted = formatCurrency(amount, currency);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 1 : 0}
    >
      <View style={styles.container}>
        <OnboardingHeader step={5} total={10} />

        {/* Scroll para inputs */}
        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TitleBlock
            title="¿Cuánto gastás por semana?"
            subtitle="Registrar tus gastos te muestra cuánto podrías ahorrar."
          />

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

          {formatted ? (
            <AppText style={styles.previewText}>
              ≈ {formatted} por semana
            </AppText>
          ) : null}

          {/* Selector de moneda */}
          <TouchableOpacity
            style={styles.currencyPicker}
            onPress={() => setPickerOpen(true)}
          >
            <AppText weight="semibold" style={styles.currencyText}>
              {LATAM_CURRENCIES.find((c) => c.code === currency)?.label}
            </AppText>
            <AppText style={styles.arrow}>▼</AppText>
          </TouchableOpacity>
          </ScrollView>
          

          {/* Modal de selección */}
           {pickerOpen && (
            <Pressable style={styles.modalOverlay} onPress={() => setPickerOpen(false)}>
              <View style={styles.modalBox}>
                <ScrollView style={{ maxHeight: 300 }}>
                  {LATAM_CURRENCIES.map((item) => (
                    <TouchableOpacity
                      key={item.code}
                      style={styles.modalOption}
                      onPress={() => {
                        setCurrency(item.code);
                        setPickerOpen(false);
                      }}
                    >
                      <AppText weight="medium">{item.label}</AppText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          )}

        {/* Botón fijo al fondo */}
        <ContinueButton
          text="Continuar"
          route="/(auth)/onboarding/onboardingComparison"
          style={{ paddingBottom: 30 }}
          disabled={!amount}
        />
      </View>
    </KeyboardAvoidingView>
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
    marginTop: 40,
  },
  input: {
    backgroundColor: "#E6E4FF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 22,
    color: Colors.light.text,
    fontFamily: "Manrope_600SemiBold",
  },
  previewText: {
    marginTop: 8,
    fontSize: 16,
    marginHorizontal: 10,
    color: Colors.light.textMuted,
  },
  currencyPicker: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#E6E4FF",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 2,
  },
  currencyText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  arrow: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 4,
  },
  modalOverlay: {
  ...StyleSheet.absoluteFillObject,  // ← full pantalla REAL
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
  zIndex: 99,
},

modalBox: {
  width: "100%",
  maxWidth: 380,
  backgroundColor: Colors.light.secondary,
  paddingVertical: 10,
  borderRadius: 16,
  maxHeight: "60%",      // ← NO pongas height: 100%, rompe scroll
},

  
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
});
