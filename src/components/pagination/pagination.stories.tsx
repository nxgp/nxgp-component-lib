import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { defineComponentStories, textArg } from "../../../.storybook/utils/arg-types";
import { userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPageSelect,
  PaginationPrevious,
  PaginationRowsPerPage,
  PaginationSelectors,
  PaginationToolbar,
  PaginationToolbarCenter,
  PaginationToolbarEnd,
  PaginationToolbarStart,
} from "./pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  subcomponents: {
    PaginationToolbar,
    PaginationToolbarStart,
    PaginationToolbarCenter,
    PaginationToolbarEnd,
    PaginationSelectors,
    PaginationRowsPerPage,
    PaginationPageSelect,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
  },
  ...defineComponentStories(
    "Navigation landmark for paginated content with page links, prev/next controls, and optional page and rows-per-page selectors.",
    {
      label: textArg({
        description: "Accessible label for the pagination landmark.",
        defaultValue: "pagination",
      }),
    },
  ),
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { label: "pagination" },
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("link", { name: /go to next page/i }));
  },
});

export const WithSelectors: Story = {
  ...storyDoc("Example with selectors."),
  render: function WithSelectorsStory() {
    const [page, setPage] = useState(2);
    const [pageSize, setPageSize] = useState(10);
    const pageCount = 12;

    return (
      <PaginationToolbar>
        <PaginationToolbarStart>
          <PaginationRowsPerPage value={pageSize} onValueChange={setPageSize} />
        </PaginationToolbarStart>
        <PaginationToolbarCenter>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((current) => Math.max(1, current - 1));
                  }}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === 1}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === 2}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(2);
                  }}
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === pageCount}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(pageCount);
                  }}
                >
                  {pageCount}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setPage((current) => Math.min(pageCount, current + 1));
                  }}
                  aria-disabled={page >= pageCount}
                  className={page >= pageCount ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </PaginationToolbarCenter>
        <PaginationToolbarEnd>
          <PaginationPageSelect page={page} pageCount={pageCount} onPageChange={setPage} />
        </PaginationToolbarEnd>
      </PaginationToolbar>
    );
  },
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-col gap-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <PaginationSelectors>
        <PaginationRowsPerPage value={20} options={[10, 20, 50]} />
        <PaginationPageSelect page={3} pageCount={8} />
      </PaginationSelectors>
    </div>
  ),
};

export const WithEllipsis: Story = {
  ...storyDoc("Collapsed middle segments for long paths."),
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">8</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            9
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">20</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
