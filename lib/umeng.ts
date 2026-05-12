export const UMENG_APP_KEY = "69fbe4d69a7f376488d5a10d";
export const UMENG_SDK_ID = "203467608";

export type AplusCommand = {
  action: string;
  arguments: unknown[];
};

type AplusPayload = Record<string, string | number | boolean | null | undefined>;
type AplusQueue = Array<AplusCommand>;

function getAplusQueue() {
  if (typeof window === "undefined") {
    return null;
  }

  const targetWindow = window as Window & {
    aplus_queue?: AplusQueue;
  };

  targetWindow.aplus_queue = targetWindow.aplus_queue || [];
  return targetWindow.aplus_queue;
}

function pushAplusCommand(command: AplusCommand, queue?: AplusQueue | null) {
  const targetQueue = queue ?? getAplusQueue();
  if (!targetQueue) {
    return;
  }

  targetQueue.push(command);
}

export function createAplusInitCommands(appKey = UMENG_APP_KEY): AplusCommand[] {
  return [
    {
      action: "aplus.setMetaInfo",
      arguments: ["appKey", appKey],
    },
    {
      action: "aplus.setMetaInfo",
      arguments: ["aplus-waiting", "MAN"],
    },
  ];
}

export function getAplusScriptUrl(sdkId = UMENG_SDK_ID) {
  return `https://d.alicdn.com/alilog/mlog/aplus/${sdkId}.js`;
}

export function getAplusBootstrapScript() {
  const initCommands = createAplusInitCommands();
  const serializedCommands = initCommands
    .map((command) => `window.aplus_queue.push(${JSON.stringify(command)});`)
    .join("\n");

  return `
    window.aplus_queue = window.aplus_queue || [];
    (function(w, d, s, q, i) {
      if (d.getElementById('beacon-aplus')) {
        return;
      }
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.async = true;
      j.id = 'beacon-aplus';
      j.src = 'https://d.alicdn.com/alilog/mlog/aplus/' + i + '.js';
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'aplus_queue', '${UMENG_SDK_ID}');
    ${serializedCommands}
  `;
}

export function sendManualPageView(pageData: AplusPayload = {}, queue?: AplusQueue) {
  pushAplusCommand(
    {
      action: "aplus.sendPV",
      arguments: [
        {
          is_auto: false,
        },
        pageData,
      ],
    },
    queue,
  );
}

export function recordAplusClick(eventCode: string, eventParams: AplusPayload = {}, queue?: AplusQueue) {
  pushAplusCommand(
    {
      action: "aplus.record",
      arguments: [eventCode, "CLK", eventParams],
    },
    queue,
  );
}
