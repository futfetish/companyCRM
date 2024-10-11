import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/shared/ui/accordion";
import { Checkbox } from "~/shared/ui/checkbox";

interface FilterAccordionProps<T> {
    list: T[];
    toggle: (value: T) => void;
    checked: (value: T) => boolean;
    title : string
    render : (value: T) => string
    count: (value: T) => number
  }
  
  const FilterAccordion = <T,>({
    list,
    toggle,
    checked,
    title,
    render,
    count
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
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => toggle(el)}
                >
                  <div className="flex items-center gap-[16px]">
                    <Checkbox checked={checked(el)} />
                    {render(el)}
                  </div>
                  <div className="font-bold">
                    {
                     count(el)
                    }
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };
  