import { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import TitleBlock from "@/src/components/onboarding/TitleBlock";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { Colors } from "@/src/constants/theme";
import { layout } from "@/src/styles/layout";

import { LATAM_CURRENCIES } from "@/src/constants/currency";
import { formatCurrency } from "@/src/utils/currency";
import { useMoneySpentViewModel } from "@/src/viewmodels/onboarding/useMoneySpentViewModel";

import { router } from "expo-router";


export default function OnboardingMoneySpent() {
  const [amount, setAmount] = useState("");
  const [localCurrency, setLocalCurrency] = useState("CRC");
  const [pickerOpen, setPickerOpen] = useState(false);

  const { isValidAmount, submitMoney } = useMoneySpentViewModel();

  const formatted = useMemo(
    () => formatCurrency(amount, localCurrency),
    [amount, localCurrency]
  );

  const amountNumber = Number(amount);

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

  const handleContinue = () => {
    const ok = submitMoney(amountNumber, localCurrency);
    if (ok) {
      router.push("/onboarding-comparison");
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={layout.screenContainer}>
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

          <ContinueButton
            text="Continuar"
            disabled={!isValidAmount(amountNumber, localCurrency)}
            onPress={handleContinue}
            style={layout.bottomButtonContainer}
          />
        </View>

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
    </ScreenWrapper>
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
