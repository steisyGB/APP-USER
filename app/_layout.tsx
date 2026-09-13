import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from './src/context/AuthContext';

function NavigationGuard() {
  const {token,isLoadingSession}=useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if(isLoadingSession) return

    const inProtectedScreen = segments[0] === "(protected)"

    if(token){
      if(!inProtectedScreen){
        router.replace("/(protected)/dashboard")
      }
    }else{
      if(inProtectedScreen){
        router.replace("/")
      }
    }
  }, [token,isLoadingSession,segments])

  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name='(public)/index'/>
      <Stack.Screen name='(public)/register'/>
      <Stack.Screen name='(protected)'/>
    </Stack>

  );
}
export default function RootLayout(){
  return (
    <AuthProvider>
      <NavigationGuard/>
    </AuthProvider>
  );
}