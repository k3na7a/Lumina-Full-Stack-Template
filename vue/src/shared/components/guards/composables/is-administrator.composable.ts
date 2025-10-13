import { ComputedRef, computed } from "vue";

import { AppStore, useAppStore } from "@/core/store/app.store";
import {
  PERMISSION_MATRIX,
  PermissionDomain,
} from "@lib/constants/permissions.constants";

type IsAdministratorGuard = {
  isAuthenticated: ComputedRef<boolean>;
};

function useIsAdministratorGuard(): IsAdministratorGuard {
  const { canActivate }: AppStore = useAppStore();
  const isAuthenticated: ComputedRef<boolean> = computed(() =>
    canActivate([
      PERMISSION_MATRIX[PermissionDomain.FRONT_END].CAN_VIEW_ADMIN_DASHBOARD,
    ])
  );

  return { isAuthenticated };
}

export type { IsAdministratorGuard };
export { useIsAdministratorGuard };
