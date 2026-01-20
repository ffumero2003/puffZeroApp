// useResetPasswordViewModel.ts
import { isDevMode } from "@/src/config/dev";
import { ROUTES } from "@/src/constants/routes";
import { supabase } from "@/src/lib/supabase";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
export function useResetPasswordViewModel() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams();
  const didInit = useRef(false);

  const recoveryUsed = useRef(false);


  async function hydrateSessionFromUrl(url: string) {
    // 🔕 Recovery ya consumido → salir sin alertas
    if (recoveryUsed.current) {
      router.replace(ROUTES.ONBOARDING);
      return false;
    }

    const parsed = Linking.parse(url);

    const access_token = parsed.queryParams?.access_token as string | undefined;
    const refresh_token = parsed.queryParams?.refresh_token as string | undefined;

    if (!access_token || !refresh_token) {
      if(!isDevMode()) {
        router.replace(ROUTES.ONBOARDING);
        return false;
      }
      return true;
    }

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      router.replace(ROUTES.ONBOARDING);
      return false;
    }

    return true;
  }




  useEffect(() => {
    // #region agent log
    console.log('🔍 [H1] useEffect triggered', { didInitCurrent: didInit.current, params: JSON.stringify(params) });
    fetch('http://127.0.0.1:7242/ingest/0fd0a7db-6453-4c6c-82b9-a41e6e00598d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useResetPasswordViewModel.ts:useEffect',message:'useEffect triggered',data:{didInitCurrent:didInit.current,params:JSON.stringify(params)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    if (didInit.current) return;
    didInit.current = true;

    const access = params.access_token as string | undefined;
    const refresh = params.refresh_token as string | undefined;

    // #region agent log
    console.log('🔍 [H1] Token check', { hasAccess: !!access, hasRefresh: !!refresh, isDevMode: isDevMode() });
    fetch('http://127.0.0.1:7242/ingest/0fd0a7db-6453-4c6c-82b9-a41e6e00598d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useResetPasswordViewModel.ts:useEffect:tokens',message:'Token check',data:{hasAccess:!!access,hasRefresh:!!refresh,isDevMode:isDevMode()},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion

    if (!access || !refresh) {
      if (!isDevMode()) {
        router.replace(ROUTES.ONBOARDING);
      }
      return;
    }

    // #region agent log
    console.log('🔍 [H2] Calling hydrateSessionFromUrl');
    fetch('http://127.0.0.1:7242/ingest/0fd0a7db-6453-4c6c-82b9-a41e6e00598d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useResetPasswordViewModel.ts:useEffect:hydrate',message:'Calling hydrateSessionFromUrl',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion

    hydrateSessionFromUrl(
      `puffzero://reset-password?access_token=${access}&refresh_token=${refresh}`
    );

    const sub = Linking.addEventListener("url", ({ url }) => {
      hydrateSessionFromUrl(url);
    });

    return () => sub.remove();
  }, [params]);


  async function submit() {
    if (!password || !confirm) {
      Alert.alert("Error", "Completá ambos campos.");
      return false;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return false;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      if (
        error.message.toLowerCase().includes("different") ||
        error.message.toLowerCase().includes("old password")
      ) {
        Alert.alert(
          "Contraseña inválida",
          "La nueva contraseña no puede ser igual a la anterior."
        );
      } else {
        Alert.alert("Error", error.message);
      }
      return false;
    }

    // 🔒 SOLO SI TODO SALIÓ BIEN
    recoveryUsed.current = true;

    // 🔥 CERRAR SESIÓN DE RECOVERY
    await supabase.auth.signOut();


    Alert.alert("Listo", "Tu contraseña fue actualizada.");
    return true;
  }



  return {
    password,
    confirm,
    loading,
    setPassword,
    setConfirm,
    submit,
  };
}
