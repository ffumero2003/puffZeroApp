import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { router } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import TitleBlock from "../../src/components/onboarding/title-block";
import { Colors } from "../../src/constants/theme";
import { useOnboarding } from "../../src/providers/onboarding-provider";
import { layout } from "../../src/styles/layout";

/* 🔥 Lista de monedas de Latinoamérica */
const LATAM_CURRENCIES = [
  { code: "USD_SV", label: "El Salvador (USD)" },
  { code: "USD_PA", label: "Panamá (USD)" },
  { code: "CRC", label: "Costa Rica (Colones)" },
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

const MIN_BY_CURRENCY: Record<string, number> = {
  CRC: 10000,
  USD_SV: 20,
  USD_PA: 20,
  MXN: 300,
  COP: 25000,
  PEN: 20,
  CLP: 7000,
  ARS: 10000,
  GTQ: 50,
  HNL: 200,
  NIO: 400,
  PYG: 40000,
  UYU: 300,
  VES: 250,
};

function formatCurrency(value: string, currency: string) {
  if (!value) return "";
  const num = Number(value);
  if (isNaN(num)) return "";

  const iso = currency.startsWith("USD") ? "USD" : currency;

  return new Intl.NumberFormat("es-LA", {
    style: "currency",
    currency: iso,
  }).format(num);
}


export default function OnboardingMoneySpent() {
  const [amount, setAmount] = useState("");
  const [localCurrency, setLocalCurrency] = useState("CRC");
  const [pickerOpen, setPickerOpen] = useState(false);

  const { setMoney, setCurrency } = useOnboarding();

  const formatted = formatCurrency(amount, localCurrency);
  const amountNumber = Number(amount);
  const minValue = MIN_BY_CURRENCY[localCurrency];

  /* 🔥 Animaciones */
  const overlayOpacity = useSharedValue(0);
  const modalTranslate = useSharedValue(50);
  const modalOpacity = useSharedValue(0);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalBoxStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ translateY: modalTranslate.value }],
  }));

  const modalRef = useRef<View>(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={layout.screenContainer}>

        {/* 🔵 GROUP 1 — Header + contenido scroll */}
        <View style={{ flex: 1 }}>
          <OnboardingHeader step={6} total={11} />

          <ScrollView
            style={layout.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <TitleBlock
              title="¿Cuánto gastás por mes?"
              subtitle="Registrar tus gastos te muestra cuánto podrías ahorrar."
            />

            <TextInput
              style={styles.inputCurrency}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#A0A0BF"
              value={amount}
              onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
            />

            {formatted ? (
              <AppText style={layout.previewText}>
                ≈ {formatted} por semana
              </AppText>
            ) : null}

            {/* Picker */}
            <TouchableOpacity
              style={styles.currencyPicker}
              onPress={() => {
                setPickerOpen(true);

                overlayOpacity.value = withTiming(1, { duration: 200 });
                modalTranslate.value = withTiming(0, {
                  duration: 260,
                  easing: Easing.out(Easing.quad),
                });
                modalOpacity.value = withTiming(1, { duration: 260 });
              }}
            >
              <AppText weight="semibold" style={styles.currencyText}>
                {LATAM_CURRENCIES.find((c) => c.code === localCurrency)?.label}
              </AppText>
              <AppText style={styles.arrow}>▼</AppText>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 🟢 GROUP 2 — Botón siempre abajo */}
        <ContinueButton
          text="Continuar"
          disabled={amountNumber < minValue}
          onPress={() => {
            setMoney(amountNumber);
            setCurrency(localCurrency);
            router.push("/onboarding-comparison");
          }}
          style={layout.bottomButtonSpacing}
        />

      </View>

      {/* 🟣 MODAL (fuera del layout para overlay full-screen) */}
      {pickerOpen && (
        <Animated.View
          style={[styles.modalOverlay, overlayStyle]}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => {
            if (!modalRef.current) return;

            modalRef.current.measure((x, y, width, height, pageX, pageY) => {
              const { pageX: tx, pageY: ty } = e.nativeEvent;
              const inside =
                tx >= pageX &&
                tx <= pageX + width &&
                ty >= pageY &&
                ty <= pageY + height;

              if (!inside) {
                overlayOpacity.value = withTiming(0, { duration: 150 });
                modalOpacity.value = withTiming(0, { duration: 150 });
                modalTranslate.value = withTiming(50, { duration: 150 });

                setTimeout(() => setPickerOpen(false), 150);
              }
            });
          }}
        >
          <Animated.View ref={modalRef} style={[styles.modalBox, modalBoxStyle]}>
            <ScrollView style={{ maxHeight: 300 }}>
              {LATAM_CURRENCIES.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={styles.modalOption}
                  onPress={() => {
                    setLocalCurrency(item.code);
                    setPickerOpen(false);
                  }}
                >
                  <AppText weight="medium">{item.label}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}

    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  inputCurrency: {
      backgroundColor: "#E6E4FF",
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 20,
      fontSize: 22,
      color: Colors.light.text,
      fontFamily: "Manrope_600SemiBold",
      marginTop: 20
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
    ...StyleSheet.absoluteFillObject,
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
    maxHeight: "60%",
  },

  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
});
