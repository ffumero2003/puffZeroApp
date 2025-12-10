import { useState } from "react";
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
import { useRef } from "react";
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

/* 🔥 Mínimos realistas por moneda */
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

/* 🔥 Formato automático amigable */
function formatCurrency(value: string, currency: string) {
  if (!value) return "";

  const number = Number(value);
  if (isNaN(number)) return "";

  // USD_SV → USD  / USD_PA → USD
  const isoCurrency = currency.startsWith("USD") ? "USD" : currency;

  return new Intl.NumberFormat("es-LA", {
    style: "currency",
    currency: isoCurrency,
  }).format(number);
}


export default function OnboardingMoneySpent() {
  const [amount, setAmount] = useState("");
  const [localCurrency, setLocalCurrency] = useState("CRC");
  const [pickerOpen, setPickerOpen] = useState(false);

  const { setMoney, setCurrency } = useOnboarding();

  const formatted = formatCurrency(amount, localCurrency);
  const amountNumber = Number(amount);

  const minValue = MIN_BY_CURRENCY[localCurrency];

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
      <View style={styles.container}>
        <OnboardingHeader step={6} total={11} />

        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TitleBlock
            title="¿Cuánto gastás por mes?"
            subtitle="Registrar tus gastos te muestra cuánto podrías ahorrar."
          />

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#A0A0BF"
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
          />

          {formatted ? (
            <AppText style={styles.previewText}>
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

        {/* Modal */}
        {pickerOpen && (
        <Animated.View
          style={[styles.modalOverlay, overlayStyle]}
          onStartShouldSetResponder={() => true}
          onResponderRelease={(e) => {
            if (!modalRef.current) return;

            // verificar si el usuario tocó FUERA del modal
            modalRef.current.measure((x, y, width, height, pageX, pageY) => {
              const touchX = e.nativeEvent.pageX;
              const touchY = e.nativeEvent.pageY;

              const inside =
                touchX >= pageX &&
                touchX <= pageX + width &&
                touchY >= pageY &&
                touchY <= pageY + height;

              if (!inside) {
                overlayOpacity.value = withTiming(0, { duration: 150 });
                modalOpacity.value = withTiming(0, { duration: 150 });
                modalTranslate.value = withTiming(50, { duration: 150 });

                setTimeout(() => setPickerOpen(false), 150);
              }
            });
          }}
        >
          <Animated.View
            ref={modalRef}
            style={[styles.modalBox, modalBoxStyle]}
            onStartShouldSetResponder={() => true}
          >
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


        <ContinueButton
          text="Continuar"
          disabled={amountNumber < minValue}
          onPress={() => {
            setMoney(amountNumber);
            setCurrency(localCurrency);

            router.push("/onboarding-comparison");
          }}
          style={{ paddingBottom: 30 }}
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
