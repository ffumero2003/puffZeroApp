import AppText from "@/src/components/AppText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { Colors } from "@/src/constants/theme";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { layout } from "@/src/styles/layout";
import { View } from "react-native";



export default function OnboardingPaywall() {
  // const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  // const { grantAccess } = useSubscription();
  const { name } = useOnboarding();

    
  return (
      <View style={layout.screenContainer}>
        <View style={layout.content}>   
            {/* Header */}
          <OnboardingHeader showProgress={false} showBack={false} />

          <AppText style={layout.titleCenter} weight="bold">
            {name ? (
              <>
                Hey{" "}
                <AppText weight="bold" style={{ color: Colors.light.primary }}>
                  {name}
                </AppText>
                , desbloqueá Puff
              </>
            ) : (
              <>Hey, desbloqueá Puff</>
            )}
            <AppText weight="bold" style={{ color: Colors.light.primary }}>
              Zero
            </AppText>{" "}
            para llegar a tu mejor versión.
          </AppText>



        </View> 
      
              
      </View>
    );
}