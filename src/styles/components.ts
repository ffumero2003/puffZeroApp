import { StyleSheet } from "react-native";

export const components = StyleSheet.create({ 
  //Componentes

    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },

    headerTextContainer: {
      flex: 1,
      paddingRight: 10,
      
    },

  
    headerLogo: {
      width: 105,
      height: 105,
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
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 16,
      borderWidth: 2,
    },

  
    multiText: {
      fontSize: 20,
    },
    


    //onboarding progress bar

    wrapper: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      
      gap: 10,
    },
    backButton: {
      marginRight: 5,
    },
    progressContainer: {
      flex: 1,
      height: 16,
      borderRadius: 20,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 20,
    },

    //login text

    footer: {
      
      fontSize: 20,
      textAlign: "center",
      paddingBottom: 30
    },
   


    // onboarding option card

    card: {
      borderWidth: 2,
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    
    badge: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      marginBottom: 6,
    },
    
    badgeText: {
      fontSize: 16,
    },
    description:{
      fontSize: 18,
    },



    //onboarding white button

    buttonWhite: {
      width: "100%",
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 16,
      borderWidth: 2,
    },
    textWhite: {
      fontSize: 20,
    },


    //register text

    register: {
      textAlign: "center",
      fontSize: 18,
    },
    

});

