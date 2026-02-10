import { StyleSheet } from "react-native";

export const layout = StyleSheet.create({

  /* 🔵 VISTAS */
  screenContainer: {
    flex: 1,
    paddingHorizontal: 24,
    
    justifyContent: "space-between"
  },

  containerWithLoadingBar: {
    flex: 1,
    paddingHorizontal: 24,
   
    
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 50,
  },

  containerAuth : {
    flex: 1,
    paddingHorizontal: 24,
    
  },
  /* 🔵 HEADER SUPERIOR (OnboardingHeader) */
  headerContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    
  },

  /* 🔵 BLOQUE DE CONTENIDO CENTRAL */
  content: {
    
    marginTop: 20,
  },
  contentNotifications: {
    
    marginTop: 0,
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
    fontSize: 30,
    lineHeight: 32,
    
    
  },

  errorText: {
    fontSize: 16,
    marginTop: 4,
    marginLeft: 4,
  },

  titleCenter: {
    
    fontSize: 30,
    textAlign: "center",
  },
 

  subtitle: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 20
  },

  subtitleAuth: {
    fontSize: 16,
    marginTop: 8,
    
  },

  description: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  /* 🔵 TARJETAS / CARDS ESTÁNDAR */
  card: {
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
    height: 450,
  },


 

  //footer login link

  footer: {
      
      fontSize: 18,
      textAlign: "center",
      paddingBottom: 30
    },
    


    // gasto por mes

    input: {
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 20,
      fontSize: 22,
      fontFamily: "Manrope_600SemiBold",
    },
    previewText: {
      marginTop: 8,
      fontSize: 16,
      marginHorizontal: 10,
    },

    //Login

    forgotContainer: {
      marginTop: 10,
      alignSelf: "flex-start",
    },

    forgotLink: {
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
      lineHeight: 20,
    },

    


    //privacy policy/terms of use

  
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 8,
    },
    subsectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 10,
      marginBottom: 4,
    },
    paragraph: {
      fontSize: 15,
      lineHeight: 22,
    },
    contentPolicyTerms: {
      marginTop: 20
    },


    //Reviews

    reviewCard: {
      padding: 18,
      borderRadius: 20,
      marginBottom: 20,
      borderWidth: 1,
    },

    profileCircle: {
      width: 45,
      height: 45,
      borderRadius: 25,
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

    