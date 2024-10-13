
import { Checkbox } from "~/shared/ui/checkbox";
import { FilterAccordion, FilterAccordionProps } from "./accordion";

interface FilterAccordionCheckboxProps<T> extends FilterAccordionProps<T> {
  checked: (value: T) => boolean;
}

export const FilterAccordionCheckbox = <T,>({
  checked,
  render,
  ...props
}: FilterAccordionCheckboxProps<T>) => {
  return (
    <FilterAccordion<T>
      render={(el) => (
        <>
          <Checkbox checked={checked(el)} />
          {render(el)}
        </>
      )}
      {...props}
    />
  );
};
