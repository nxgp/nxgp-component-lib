import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/alert/alert";
import { Badge } from "../../components/badge/badge";
import { Button } from "../../components/button/button";
import { Input } from "../../components/input/input";
import { Label } from "../../components/label/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/popover/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table/table";
import { cn } from "../../lib/cn";

const CHART_SERIES = [
  { label: "1", cssVar: "--app-chart-1", height: 90 },
  { label: "2", cssVar: "--app-chart-2", height: 75 },
  { label: "3", cssVar: "--app-chart-3", height: 60 },
  { label: "4", cssVar: "--app-chart-4", height: 50 },
  { label: "5", cssVar: "--app-chart-5", height: 40 },
] as const;

const TABLE_ROWS = [
  { name: "Danilo Sousa", email: "danilo@example.com", status: "Active" },
  { name: "Zahra Ambessa", email: "zahra@example.com", status: "Admin" },
];

type PreviewSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

function PreviewSection({ id, title, children, className }: PreviewSectionProps) {
  return (
    <section id={id} className="scroll-mt-6 space-y-3">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <div className={cn("rounded-lg border border-border bg-card p-4", className)}>{children}</div>
    </section>
  );
}

/**
 * Curated component catalog for live theme preview.
 */
export function ThemePlaygroundPreview() {
  return (
    <div className="space-y-10">
      <PreviewSection id="button" title="Button">
        <div className="flex flex-wrap gap-3">
          <Button type="button">Primary</Button>
          <Button type="button" variant="secondary">
            Secondary
          </Button>
          <Button type="button" variant="outline">
            Outline
          </Button>
          <Button type="button" variant="destructive">
            Destructive
          </Button>
        </div>
      </PreviewSection>

      <PreviewSection id="input" title="Input">
        <div className="max-w-sm space-y-2">
          <Label htmlFor="pg-email">Email</Label>
          <Input id="pg-email" placeholder="you@company.com" />
        </div>
      </PreviewSection>

      <PreviewSection id="badge" title="Badge">
        <div className="flex flex-wrap gap-3">
          <Badge size="sm">Default</Badge>
          <Badge size="sm" variant="secondary">
            Secondary
          </Badge>
          <Badge size="sm" variant="outline">
            Outline
          </Badge>
        </div>
      </PreviewSection>

      <PreviewSection id="sign-in" title="Sign in">
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pg-password">Password</Label>
            <Input id="pg-password" type="password" placeholder="••••••••" />
          </div>
          <Button type="button" className="w-full">
            Sign in
          </Button>
        </div>
      </PreviewSection>

      <PreviewSection id="table" title="Table">
        <Table aria-label="Team members" inset>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TABLE_ROWS.map((row) => (
              <TableRow key={row.email}>
                <TableCell>{row.name}</TableCell>
                <TableCell className="text-muted-foreground">{row.email}</TableCell>
                <TableCell>
                  <Badge
                    size="sm"
                    variant="secondary"
                    className="px-1 py-px text-xs font-medium leading-none"
                  >
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PreviewSection>

      <PreviewSection id="alert" title="Alert">
        <Alert>
          <AlertTitle>System update</AlertTitle>
          <AlertDescription>A new version is available. Review the changelog.</AlertDescription>
        </Alert>
      </PreviewSection>

      <PreviewSection id="popover" title="Popover">
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              Open popover
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <p className="text-sm font-medium text-popover-foreground">Status</p>
            <p className="mt-1 text-xs text-muted-foreground">Popover surface and text tokens.</p>
          </PopoverContent>
        </Popover>
      </PreviewSection>

      <PreviewSection id="charts" title="Charts">
        <div className="flex h-28 items-end gap-2">
          {CHART_SERIES.map((series) => (
            <div key={series.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t"
                style={{
                  height: series.height,
                  backgroundColor: `var(${series.cssVar})`,
                }}
              />
              <span className="text-xs text-muted-foreground">{series.label}</span>
            </div>
          ))}
        </div>
      </PreviewSection>
    </div>
  );
}
