self.addEventListener("push", (event) => {
  let data = { title: "MediMate", body: "" };
  try {
    if (event.data) data = event.data.json();
  } catch {
    // Ignore malformed payloads rather than crashing the service worker.
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "MediMate", {
      body: data.body || "",
      data: { url: data.url || "/user/reminders" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/user/reminders";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
