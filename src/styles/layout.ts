import { StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

export const layout = StyleSheet.create({

  /* 🔵 CONTENEDOR BASE PARA TODAS LAS PANTALLAS */
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  containerWithLoadingBar: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 50,
  },

  /* 🔵 HEADER SUPERIOR (OnboardingHeader) */
  headerContainer: {
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  /* 🔵 BLOQUE DE CONTENIDO CENTRAL */
  content: {
    flex: 1,
    marginTop: 30,
  },

  /* 🔵 SECCIONES FLEXIBLES (UP, MIDDLE, BOTTOM) */
  sectionTop: {
    flex: 1,
    justifyContent: "flex-start",
  },

  sectionCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionBottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },

  /* 🔵 TITULOS GLOBALES */
  title: {
    fontSize: 28,
    color: Colors.light.text,
    lineHeight: 32,
    
    marginBottom: 10,
  },

  titleCenter: {
    marginTop: 30,
    fontSize: 28,
    color: Colors.light.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    marginTop: 8,
    marginBottom: 20,
  },

  description: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  /* 🔵 TARJETAS / CARDS ESTÁNDAR */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "92%",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  /* 🔵 IMÁGENES GRANDES (mockups tipo celular) */
  image: {
    width: "100%",
    height: 220, // ajustá si es más alta o más baja
    marginVertical: 20,
  },
  bigImage: {
    width: "100%",
    height: 430,
  },

  /* 🔵 ESPACIADO PARA BOTONES INFERIORES */
  bottomButtonSpacing: {
    paddingBottom: 30,
  },


  //footer login link

  footer: {
      marginTop: 20,
      color: Colors.light.text,
      fontSize: 18,
    },
    link: {
      color: Colors.light.primary,
    },


    // gasto por mes

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

});
