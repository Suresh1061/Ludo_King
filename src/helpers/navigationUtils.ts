import { CommonActions, createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef()

export async function navigate(routeName: any, params?: any) {
     navigationRef.isReady()

     if (navigationRef.isReady()) {
          navigationRef.dispatch(CommonActions.navigate(routeName, params))
     }
}

export async function resetAndNavigate(routeName: string) {
     if (navigationRef?.isReady()) {
          navigationRef.dispatch(
               CommonActions.reset({
                    index: 0,
                    routes: [{ name: routeName }],
               })
          );
     } else {
          console.warn('Navigation is not ready. Unable to reset and navigate.');
     }
}

export async function goBack() {
     navigationRef.isReady()
     if (navigationRef.isReady()) {
          navigationRef.dispatch(
               CommonActions.goBack()
          )
     }
}

export async function push(routeName: any, params: any) {
     navigationRef.isReady()
     if (navigationRef.isReady()) {
          navigationRef.dispatch(
               CommonActions.navigate(routeName, params)
          )
     }
}


export async function prepareNavigation() {
     await navigationRef.isReady()
}