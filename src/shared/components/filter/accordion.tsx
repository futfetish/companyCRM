import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/shared/ui/accordion";
import { cn } from "~/shared/utils/cn";

export interface FilterAccordionProps<T> {
  list: T[];
  toggle: (el: T) => void;
  title: string;
  render: (el: T) => ReactNode;
  count: (el: T) => number;
}

export const FilterAccordion = <T,>({
  list,
  toggle,
  title,
  render,
  count,
}: FilterAccordionProps<T>) => {
  return (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-[10px]">
            {list.map((el, index) => (
              <div
                key={index}
                className={cn(
                  "flex cursor-pointer items-center justify-between",
                )}
                onClick={() => toggle(el)}
              >
                <div className="flex select-none items-center gap-[16px]">
                  {render(el)}
                </div>
                <div className="select-none font-bold">{count(el)}</div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
