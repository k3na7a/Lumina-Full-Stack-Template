import { ComputedRef, Ref, computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useAppHandler } from "@/core/handlers/app.handler";
import { AppStore, useAppStore } from "@/core/store/app.store";

import { UserDto } from "@lib/dto/user.dto";
import { MORE_NAVIGATION } from "../config/more-navigation.schema";
import { more_navigation } from "@/shared/components/dropdown/types/more-navigation.type";
import { ROUTE_NAMES } from "@lib/enums/route-names.enum";

type MainLayout = {
  register: () => void;
  signin: () => void;
  signout: () => void;
  loading: Ref<boolean>;
  user: ComputedRef<UserDto | undefined>;
  isAuthenticated: ComputedRef<boolean>;
  MORE_NAVIGATION: more_navigation;
  USER_NAVIGATION: more_navigation;
  USER_ACTIONS: actions[];
};

export interface actions {
  title: string;
  disabled?: boolean;
  icon: [string, string];
  theme:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "light";
  callback?: () => void;
}

function useMainLayout(): MainLayout {
  const { t } = useI18n();
  const { register, signin, signout } = useAppHandler(t);

  const appStore: AppStore = useAppStore();

  const user: ComputedRef<UserDto | undefined> = computed(
    () => appStore.authenticatedUser
  );
  const isAuthenticated: ComputedRef<boolean> = computed(
    () => appStore.isAuthenticated
  );

  const loading = ref<boolean>(true);

  const USER_NAVIGATION: more_navigation = [
    {
      children: [
        {
          title: "settings.label",
          redirect: ROUTE_NAMES.SETTINGS,
          icon: ["fas", "gear"],
        },
      ],
    },
  ];

  const USER_ACTIONS: actions[] = [
    {
      title: "actions.log-out",
      icon: ["fas", "right-from-bracket"],
      theme: "danger",
      callback: signout,
    },
  ];

  onMounted(async () => {
    loading.value = true;
    await appStore
      .initialize()
      .catch((err) => console.warn(`[Auth] Err: ${err.message}`))
      .finally(() => (loading.value = false));
  });

  return {
    register,
    signin,
    signout,
    loading,
    user,
    isAuthenticated,
    MORE_NAVIGATION,
    USER_NAVIGATION,
    USER_ACTIONS,
  };
}

export { useMainLayout };
