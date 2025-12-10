// 💠 ESCENARIO POR DEFECTO — comportamiento real
// export const DEBUG = {
//   forceUserLoggedOut: false,      
//   forceUserLoggedIn: false,       
//   forceOnboardingCompleted: null, // null = usar valor real
// };

//usuario nuevo sin sesion
export const DEBUG = {
  forceUserLoggedOut: true,       // USER = null
  forceUserLoggedIn: false,
  forceOnboardingCompleted: false // onboarding NO completado
};

//usuario con sesion activa
// export const DEBUG = {
//   forceUserLoggedOut: false,
//   forceUserLoggedIn: true,        // crea un usuario dummy
//   forceOnboardingCompleted: true, // onboarding ya hecho
// };

