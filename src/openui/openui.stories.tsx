import type { ActionEvent, OpenUIError } from "@openuidev/react-lang";
import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { storyDoc } from "../../.storybook/utils/playground";
import { Button } from "../components/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/resizable";
import { cn } from "../lib/cn";
import { KitOpenUIRenderer } from "./kit-openui-renderer";
import { type OpenUIFixtureId, openUIFixtures } from "./openui.fixtures";

const EDITOR_PLACEHOLDER = 'root = Stack([hello], "column")\nhello = Text("Hello world", "h2")';

const meta = {
  title: "OpenUI/Renderer",
  component: KitOpenUIRenderer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Render LLM-generated UI (OpenUI Lang) with `@nxgp/component-lib` components only. The model streams a compact program; `KitOpenUIRenderer` maps every node onto kit primitives. See `docs/OPENUI.md`. For chat + OpenUI together, open **Messaging/Assistant/With OpenUI**.",
      },
    },
  },
} satisfies Meta<typeof KitOpenUIRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

function EventLog({
  lastAction,
  lastState,
  errors,
}: {
  lastAction: ActionEvent | null;
  lastState: Record<string, unknown> | null;
  errors: OpenUIError[];
}) {
  if (!lastAction && !lastState && errors.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      {lastAction ? (
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Action (sent to chat)</p>
          <pre className="max-h-40 overflow-auto rounded-md border border-border bg-muted p-3 text-xs text-muted-foreground">
            {JSON.stringify(lastAction, null, 2)}
          </pre>
        </div>
      ) : null}
      {lastState ? (
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Form state</p>
          <pre className="max-h-40 overflow-auto rounded-md border border-border bg-muted p-3 text-xs text-muted-foreground">
            {JSON.stringify(lastState, null, 2)}
          </pre>
        </div>
      ) : null}
      {errors.length > 0 ? (
        <div>
          <p className="mb-1 text-xs font-medium text-destructive">Parser errors</p>
          <pre className="max-h-32 overflow-auto rounded-md border border-destructive/40 bg-muted p-3 text-xs text-muted-foreground">
            {JSON.stringify(errors, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function OpenUIExample({ fixtureId, wide }: { fixtureId: OpenUIFixtureId; wide?: boolean }) {
  const [lastAction, setLastAction] = useState<ActionEvent | null>(null);
  const [lastState, setLastState] = useState<Record<string, unknown> | null>(null);
  const [errors, setErrors] = useState<OpenUIError[]>([]);
  const source = openUIFixtures[fixtureId].source;
  return (
    <div
      className={
        wide
          ? "mx-auto flex w-full max-w-4xl flex-col gap-4 p-4"
          : "mx-auto flex w-full max-w-xl flex-col gap-4 p-4"
      }
    >
      <KitOpenUIRenderer
        response={source}
        isStreaming={false}
        onAction={setLastAction}
        onStateUpdate={setLastState}
        onError={setErrors}
      />
      <EventLog lastAction={lastAction} lastState={lastState} errors={errors} />
    </div>
  );
}

const fixtureEntries = Object.entries(openUIFixtures) as [
  OpenUIFixtureId,
  (typeof openUIFixtures)[OpenUIFixtureId],
][];

/** Side-by-side playground: OpenUI Lang source vs rendered kit output. */
function MessageVsOutputPlayground() {
  const [fixtureId, setFixtureId] = useState<OpenUIFixtureId>("analytics");
  const [panel, setPanel] = useState<"split" | "message" | "output">("split");
  const [lastAction, setLastAction] = useState<ActionEvent | null>(null);
  const [lastState, setLastState] = useState<Record<string, unknown> | null>(null);
  const [errors, setErrors] = useState<OpenUIError[]>([]);
  const [streamed, setStreamed] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [draft, setDraft] = useState<string>(openUIFixtures.analytics.source);
  const isStreaming = streamed !== null;
  const response = streamed ?? draft;

  const stopStream = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const resetEvents = useCallback(() => {
    setLastAction(null);
    setLastState(null);
    setErrors([]);
  }, []);

  const startStream = useCallback(() => {
    stopStream();
    resetEvents();
    const full = draft;
    let cursor = 0;
    setStreamed("");
    timer.current = setInterval(() => {
      cursor = Math.min(full.length, cursor + Math.max(6, Math.round(full.length / 120)));
      setStreamed(full.slice(0, cursor));
      if (cursor >= full.length) {
        stopStream();
        setStreamed(null);
      }
    }, 40);
  }, [draft, stopStream, resetEvents]);

  useEffect(() => stopStream, [stopStream]);

  const selectFixture = (id: OpenUIFixtureId) => {
    stopStream();
    setStreamed(null);
    resetEvents();
    setFixtureId(id);
    setDraft(openUIFixtures[id].source);
  };

  const lineCount = useMemo(() => response.trimEnd().split("\n").length, [response]);

  return (
    <div className="flex h-[min(52rem,90vh)] flex-col gap-3 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Message vs output</h2>
          <p className="text-sm text-muted-foreground">
            Left = editable OpenUI Lang — type to render live. Right = kit output + actions/state.
            Pick a fixture to load a starting point, or replay it as a stream.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["split", "Split"],
              ["message", "Message only"],
              ["output", "Output only"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={panel === value ? "default" : "outline"}
              type="button"
              onClick={() => setPanel(value)}
            >
              {label}
            </Button>
          ))}
          <Button
            size="sm"
            variant="secondary"
            type="button"
            disabled={isStreaming}
            onClick={startStream}
          >
            {isStreaming ? "Streaming…" : "Replay stream"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {fixtureEntries.map(([id, fixture]) => (
          <Button
            key={id}
            size="sm"
            variant={fixtureId === id ? "secondary" : "outline"}
            type="button"
            onClick={() => selectFixture(id)}
          >
            {fixture.label}
          </Button>
        ))}
      </div>

      {panel === "split" ? (
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1 rounded-lg border border-border"
        >
          <ResizablePanel defaultSize={45} minSize={20} className="min-h-0">
            <section className="flex h-full min-h-0 flex-col bg-card">
              <header className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-sm font-medium text-foreground">OpenUI Lang · editable</span>
                <span
                  className={cn(
                    "text-xs",
                    errors.length > 0 ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {errors.length > 0
                    ? `${errors.length} error${errors.length === 1 ? "" : "s"}`
                    : `${lineCount} line${lineCount === 1 ? "" : "s"}`}
                </span>
              </header>
              <textarea
                value={response}
                onChange={(event) => setDraft(event.target.value)}
                readOnly={isStreaming}
                spellCheck={false}
                placeholder={EDITOR_PLACEHOLDER}
                aria-label="OpenUI Lang source"
                className="min-h-0 flex-1 resize-none bg-transparent p-3 font-mono text-xs leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus-visible:bg-muted/30"
              />
            </section>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={20} className="min-h-0">
            <section className="flex h-full min-h-0 flex-col bg-card">
              <header className="border-b border-border px-3 py-2">
                <span className="text-sm font-medium text-foreground">Rendered output</span>
                {isStreaming ? (
                  <span className="ml-2 text-xs text-muted-foreground">streaming…</span>
                ) : null}
              </header>
              <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
                <KitOpenUIRenderer
                  response={response}
                  isStreaming={isStreaming}
                  onAction={setLastAction}
                  onStateUpdate={setLastState}
                  onError={setErrors}
                />
                <EventLog lastAction={lastAction} lastState={lastState} errors={errors} />
              </div>
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="grid min-h-0 flex-1 gap-3">
          {panel === "message" ? (
            <section className="flex min-h-0 flex-col rounded-lg border border-border bg-card">
              <header className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="text-sm font-medium text-foreground">OpenUI Lang · editable</span>
                <span
                  className={cn(
                    "text-xs",
                    errors.length > 0 ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {errors.length > 0
                    ? `${errors.length} error${errors.length === 1 ? "" : "s"}`
                    : `${lineCount} line${lineCount === 1 ? "" : "s"}`}
                </span>
              </header>
              <textarea
                value={response}
                onChange={(event) => setDraft(event.target.value)}
                readOnly={isStreaming}
                spellCheck={false}
                placeholder={EDITOR_PLACEHOLDER}
                aria-label="OpenUI Lang source"
                className="min-h-0 flex-1 resize-none bg-transparent p-3 font-mono text-xs leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus-visible:bg-muted/30"
              />
            </section>
          ) : (
            <section className="flex min-h-0 flex-col rounded-lg border border-border bg-card">
              <header className="border-b border-border px-3 py-2">
                <span className="text-sm font-medium text-foreground">Rendered output</span>
              </header>
              <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
                <KitOpenUIRenderer
                  response={response}
                  isStreaming={isStreaming}
                  onAction={setLastAction}
                  onStateUpdate={setLastState}
                  onError={setErrors}
                />
                <EventLog lastAction={lastAction} lastState={lastState} errors={errors} />
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export const MessageVsOutput: Story = {
  ...storyDoc(
    "Live playground — edit the OpenUI Lang on the left and watch the kit output render in real time. Load a fixture as a starting point, replay it as a stream, and inspect actions/state/errors.",
  ),
  args: { response: openUIFixtures.analytics.source },
  parameters: { layout: "fullscreen" },
  render: () => <MessageVsOutputPlayground />,
};

export const Analytics: Story = {
  ...storyDoc("KPI Metrics row + area Chart + DataTable — dashboard-style agent response."),
  args: { response: openUIFixtures.analytics.source },
  render: () => <OpenUIExample fixtureId="analytics" wide />,
};

export const RestaurantListing: Story = {
  ...storyDoc("Result cards with Avatar, badges, and reserve actions."),
  args: { response: openUIFixtures.restaurants.source },
  render: () => <OpenUIExample fixtureId="restaurants" wide />,
};

export const ApprovalWorkflow: Story = {
  ...storyDoc("Stepper progress + spend Chart + line-item DataTable + approve/reject."),
  args: { response: openUIFixtures.approval.source },
  render: () => <OpenUIExample fixtureId="approval" wide />,
};

export const PlanComparison: Story = {
  ...storyDoc("Tabbed pricing with Metric cards per plan."),
  args: { response: openUIFixtures.plans.source },
  render: () => <OpenUIExample fixtureId="plans" wide />,
};

export const BookingForm: Story = {
  ...storyDoc("Interactive Form with mixed field types; watch form state in the log."),
  args: { response: openUIFixtures.booking.source },
  render: () => <OpenUIExample fixtureId="booking" />,
};
