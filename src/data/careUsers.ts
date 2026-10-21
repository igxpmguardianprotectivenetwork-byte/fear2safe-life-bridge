import type { UserCondition } from "./mock"

/** Care Console / Live Vitals id for the operator TCP watch. */
export const MY_DEVICE_USER_ID = "self"

export const myDeviceCareUser = {
  id: MY_DEVICE_USER_ID,
  label: "My Device",
  type: "protected" as const,
  condition: "safe" as UserCondition,
  lat: 6.8544,
  lng: 79.8635,
  nodeId: "USR-OWN",
}

export function isMyDeviceUserId(id: string | null | undefined) {
  return id === MY_DEVICE_USER_ID || id === "own" || id === "p6"
}
