import { StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

export const components = StyleSheet.create({ 
  //Componentes

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    headerTextContainer: {
      flex: 1,
      paddingRight: 10,
      
    },

  
    headerLogo: {
      width: 95,
      height: 95,
    },

    bottomButtonContainer: {
      width: "100%",
      paddingBottom: 25,
      justifyContent: "flex-end",
    },
    bottomButtonContainerAuth: {
      width: "100%",
      
    },



    googleBtn: {
      backgroundColor: "#000",
      height: 65,                 // 🔥 ALTURA FIJA
      paddingHorizontal: 32,
      borderRadius: 20,
      width: "100%",

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    googleText: {
      color: "#fff",
      marginLeft: 8,
      fontSize: 24,
    },

    button: {
      marginTop: 30,
      backgroundColor: Colors.light.primary,

      height: 65,              // 🔥 ALTURA FIJA GLOBAL
      paddingHorizontal: 32,   // OK
      borderRadius: 20,
      width: "100%",

      alignItems: "center",
      justifyContent: "center",
    },

    buttonText: {
      textAlign: "center",
      fontSize: 24,
      color: "#fff",
    },


    //multi select

    multiButton: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: "#C9D2FB",
    },

    multiButtonSelected: {
      backgroundColor: "#E5E0FF",
      borderColor: Colors.light.primary,
    },

    multiText: {
      fontSize: 20,
      color: Colors.light.text,
    },
    multiTextSelected: {
      color: Colors.light.primary,
    },


    //onboarding progress bar

    wrapper: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 40,
      gap: 10,
    },
    backButton: {
      marginRight: 5,
    },
    progressContainer: {
      flex: 1,
      height: 16,
      backgroundColor: Colors.light.secondary,
      borderRadius: 20,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: Colors.light.primary,
      borderRadius: 20,
    },

    //login text

    footer: {
      
      color: Colors.light.text,
      fontSize: 20,
      textAlign: "center",
      paddingBottom: 30
    },
    link: {
      color: Colors.light.primary,
    },


    // onboarding option card

    card: {
      backgroundColor: Colors.light.secondaryBackground,
      borderWidth: 2,
      borderColor: "#C9D2FB",
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    cardSelected: {
      backgroundColor: "#E5E0FF",
      borderColor: Colors.light.primary,
    },
    badge: {
      alignSelf: "flex-start",
      backgroundColor: Colors.light.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      marginBottom: 6,
    },
    badgeSelected: {
      borderColor: Colors.light.primary,
    },
    badgeText: {
      fontSize: 16,
      color: Colors.light.textWhite,
    },
    description: {
      color: Colors.light.text,
      fontSize: 18,
    },



    //onboarding white button

    buttonWhite: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: "#C9D2FB",
    },
    textWhite: {
      fontSize: 20,
      color: Colors.light.text,
    },


    //register text

    register: {
      textAlign: "center",
      fontSize: 18,
      color: Colors.light.text,
    },
    

});

