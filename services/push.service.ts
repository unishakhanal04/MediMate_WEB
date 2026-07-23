import { apiFetch } from "./api-client";

// Web Push subscription keys are URL-safe base64; PushManager.subscribe needs them
// as a raw Uint8Array applicationServerKey.
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const isPushSupported = (): boolean =>
  typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;

export const pushService = {
  async getStatus(): Promise<{ subscribed: boolean }> {
    return apiFetch<{ subscribed: boolean }>("/api/v1/push/status");
  },

  async subscribe(): Promise<void> {
    if (!isPushSupported()) {
      throw new Error("Push notifications are not supported in this browser.");
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission was not granted.");
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const { publicKey } = await apiFetch<{ publicKey: string }>("/api/v1/push/vapid-public-key");

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    });

    const json = subscription.toJSON();
    await apiFetch("/api/v1/push/subscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
    });
  },

  async unsubscribe(): Promise<void> {
    if (!isPushSupported()) return;

    const registration = await navigator.serviceWorker.getRegistration("/sw.js");
    const subscription = await registration?.pushManager.getSubscription();

    if (subscription) {
      await apiFetch("/api/v1/push/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
    }
  },
};
