import { StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

export const layout = StyleSheet.create({

  /* 🔵 VISTAS */
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 30,
    justifyContent: "space-between"
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

  containerAuth : {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 20,
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
    
    marginTop: 40,
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
    
    
  },

  errorText: {
    color: Colors.light.danger,
    fontSize: 16,
    marginTop: 4,
    marginLeft: 4,
  },

  titleCenter: {
    marginTop: 30,
    fontSize: 28,
    color: Colors.light.text,
    textAlign: "center",
  },
  titleCenterNoMargin: {

    fontSize: 28,
    color: Colors.light.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 8,
    marginBottom: 20
  },

  subtitleAuth: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 8,
    
  },

  description: {
    fontSize: 20,
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
    height: 250, // ajustá si es más alta o más baja
    marginVertical: 20,
  },
  bigImage: {
    width: "100%",
    height: 480,
  },



  //footer login link

  footer: {
      
      color: Colors.light.text,
      fontSize: 18,
      textAlign: "center",
      paddingBottom: 30
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

    //Login

    forgotContainer: {
      marginTop: 10,
      alignSelf: "flex-start",
    },

    forgotLink: {
      color: Colors.light.primary,
      fontSize: 18,
    },


  bottomContainer: {
      flex: 1,
      justifyContent: "flex-end",
      marginBottom: 30, // ajustá según tu diseño
    },

    text: {
      textAlign: "center",
      fontSize: 16,
      color: Colors.light.textMuted,
      lineHeight: 20,
    },

    linkLogin: {
      color: Colors.light.primary,
    },


    //privacy policy/terms of use

  
    sectionTitle: {
      fontSize: 18,
      color: Colors.light.text,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 8,
    },
    subsectionTitle: {
      fontSize: 16,
      color: Colors.light.text,
      fontWeight: "600",
      marginTop: 10,
      marginBottom: 4,
    },
    paragraph: {
      fontSize: 15,
      color: Colors.light.textMuted,
      lineHeight: 22,
    },
    contentPolicyTerms: {
      marginTop: 20
    },


    //Reviews

    reviewCard: {
      backgroundColor: "white",
      padding: 18,
      borderRadius: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#D7D7F3",
    },

    profileCircle: {
      width: 45,
      height: 45,
      borderRadius: 25,
      backgroundColor: "#E0E0E0",
      marginBottom: 10,
    },

    reviewHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },

    reviewStars: {
      fontSize: 16,
    },

    reviewText: {
      fontSize: 15,
      color: Colors.light.text,
      lineHeight: 20,
    },

    headerImage: {
    width: "100%",
    height: 200,   // ajustá según tu imagen real
    marginBottom: 20,
  },

  bottomButtonContainer: {
      width: "100%",
      paddingBottom: 25,
      justifyContent: "flex-end",
    },

  });

    