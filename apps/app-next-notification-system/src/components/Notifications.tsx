import React from "react";
import { createStore } from "@tresorama/react-file-state";

// Demo
export const Notifications = () => {
  return (
    <>
      <NotificationRenderer />

      <div className="flex flex-col space-y-2 mt-[20vh]">
        <NotificationConsumer text="Submit Form" />
        <NotificationConsumer text="Delete Post" />
        <NotificationConsumer text="Check Quiz Answers" />
      </div>
    </>
  );
};

// Types
type NotificationSeverity = "success" | "error" | "info";
type Notification = { id: string; } & (
  | {
    severity?: NotificationSeverity;
    message?: string;
  }
  | {
    content?: React.ReactNode;
  }
);
// State + Store
const notificationStore = createStore(
  {
    notifications: [],
  } as {
    notifications: Notification[];
  },
  undefined,
  (set, get) => {
    // Factory
    const createNewNotification = (data: Omit<Notification, "id">) => {
      const randomId = () => (Math.random() * Math.random()).toString();
      const newNotification: Notification = {
        ...data,
        id: randomId(),
      };
      const newNotifications = get().notifications.concat(newNotification);
      set((prev) => ({ ...prev, notifications: newNotifications }));
      return newNotification;
    };
    const removeNotification = (id: Notification["id"]) => {
      const newNotifications = get().notifications.filter((n) => n.id !== id);
      set((prev) => ({ ...prev, notifications: newNotifications }));
    };

    // API
    return {
      addNotification: (notification: Omit<Notification, "id">) => {
        const newNotification = createNewNotification(notification);
        setTimeout(() => {
          removeNotification(newNotification.id);
        }, 4000);
      },
    };
  },
);

// Notification Renderer
const NotificationRenderer = () => {
  const [notifications] = notificationStore.useStore((s) => s.notifications);

  return (
    <div className="bg-gray-400 p-6 fixed bottom-0 right-0 left-0">
      <div className="flex flex-col space-y-2">
        {notifications.map((item) => (
          <NotificationCard key={item.id} notification={item} />
        ))}
      </div>
    </div>
  );
};

const NotificationCard = ({ notification }: { notification: Notification; }) => {
  if ("content" in notification) {
    return <>{notification.content}</>;
  }

  if (!("severity" in notification)) return <></>;

  const { severity, message } = notification;
  return (
    <div
      className={`
        p-3 border rounded font-medium text-lg 
        ${severity === 'success' && "bg-green-500 border-green-400 text-green-100"} 
        ${severity === 'error' && "bg-red-500 border-red-400 text-red-100"} 
        ${severity === 'info' && "bg-gray-200 border-gray-300 text-gray-700"} 
      `}
    >
      {message}
      {/* {JSON.stringify(notification, null, 1)} */}
    </div>
  );
};

// Consumer

const NotificationConsumer = ({ text }: { text: string; }) => {
  const buttonText = text;
  const notificationsPrefix = text;
  const handleClick = () => {
    const severity = getRandomOneOf<NotificationSeverity>([
      "error",
      "success",
      "info",
    ]);

    if (severity === "success") {
      notificationStore.actions.addNotification({
        message: `${notificationsPrefix} - All right 😎!`,
        severity: "success",
      });
      return;
    }
    if (severity === "error") {
      notificationStore.actions.addNotification({
        message: `${notificationsPrefix} - Mistake 😞!`,
        severity: "error",
      });
      return;
    }
    if (severity === "info") {
      notificationStore.actions.addNotification({
        message: `${notificationsPrefix} - Please remember that 🧐 ... `,
        severity: "info",
      });
      return;
    }
  };
  return (
    <div>
      <button
        type="button"
        className="bg-gray-400 text-white hover:bg-gray-600 rounded py-2 px-5"
        onClick={handleClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

function getRandomOneOf<T>(values: T[]): T {
  const optionsCount = values.length;
  const options = Array(optionsCount)
    .fill("")
    .map((_, i) => {
      const size = 1 / optionsCount;
      const min = size * i;
      const max = size * (i + 1);
      const option = {
        matches: (x: ReturnType<typeof Math.random>) => {
          return x >= min && x < max;
        },
      };
      return option;
    });

  const x = Math.random();
  const resultIndex = options.findIndex((option) => option.matches(x));
  return values[resultIndex];
}
