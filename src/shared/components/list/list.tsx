import { ArrowDown, ArrowUp } from "lucide-react";
import { FC, ReactNode, useCallback, useState } from "react";
import { Card } from "~/shared/ui/card";
import { Checkbox } from "~/shared/ui/checkbox";
import { cn } from "~/shared/utils/cn";

export interface Col<T extends { isFavorite: boolean; id: number }> {
  width: number; //px
  title: string;
  value: string;
  render: FC<{ item: T }>;
  sort: (items: T[], direction: "asc" | "desc") => T[];
}

interface ListProps<T extends { isFavorite: boolean; id: number }> {
  list: T[];
  cols: Col<T>[];
  onFavorite: (item: T, status: boolean) => void;
  defaultSort: string;
}

export const List = <T extends { isFavorite: boolean; id: number }>({
  list,
  cols,
  onFavorite,
  defaultSort
}: ListProps<T>) => {
  const [globalSelect, setGloalSelect] = useState(false);
  const [sort, setSort] = useState<string>(defaultSort);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const toggleSort = (colValue: string) => {
    if (sort === colValue) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSort(colValue);
      setSortDirection("asc");
    }
  };

  const sortItems = useCallback(
    (items: T[]) => {
      if (!sort) return items;

      const col = cols.find((c) => c.value === sort);
      if (!col?.sort) return items;

      return col.sort(items, sortDirection);
    },
    [cols, sort, sortDirection],
  );

  const favoriteItems = sortItems(list.filter((item) => item.isFavorite));
  const nonFavoriteItems = sortItems(list.filter((item) => !item.isFavorite));

  const [selected, setSelected] = useState(new Set());

  const onSelectConstructor = (item: T) => {
    return (status: boolean) => {
      setSelected((prevIds) => {
        const newIds = new Set(prevIds);
        if (status === false && newIds.has(item.id)) {
          newIds.delete(item.id);
        } else if (status === true) {
          newIds.add(item.id);
        }
        return newIds;
      });
    };
  };

  const onFavoriteItemConstructor = (item: T) => {
    return (status: boolean) => {
      onFavorite(item, status);
    };
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex h-[40px] items-center px-[16px]">
        <div
          className="ml-[4px] cursor-pointer"
          onClick={() => setGloalSelect(!globalSelect)}
        >
          <Checkbox checked={globalSelect} />
        </div>
        <div className="ml-[80px] flex select-none items-center gap-[12px]">
          {cols.map((col, index) => (
            <div
              key={index}
              onClick={() => toggleSort(col.value)}
              style={{ width: `${col.width}px` }}
            >
              <p
                className={cn(
                  "m-[-10px] inline-flex w-auto cursor-pointer items-center gap-[8px] p-[10px] text-[#3C4858]",
                  sort !== col.value && "opacity-[50%]",
                )}
              >
                <strong> {col.title.toUpperCase()} </strong>
                {sort === col.value && sortDirection === "asc" ? (
                  <ArrowDown size={20} />
                ) : (
                  <ArrowUp size={20} />
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        {favoriteItems.map((item) => (
          <Item
            onFavorite={onFavoriteItemConstructor(item)}
            onSelected={onSelectConstructor(item)}
            key={item.id}
            isFavorite={item.isFavorite}
            isSelected={selected.has(item.id) || globalSelect}
          >
            {cols.map((col, index) => (
              <div key={index} className="" style={{ width: `${col.width}px` }}>
                {col.render({ item: item })}
              </div>
            ))}
          </Item>
        ))}
        {nonFavoriteItems.map((item) => (
          <Item
            onSelected={onSelectConstructor(item)}
            onFavorite={onFavoriteItemConstructor(item)}
            key={item.id}
            isFavorite={item.isFavorite}
            isSelected={selected.has(item.id) || globalSelect}
          >
            {cols.map((col, index) => (
              <div key={index} className="" style={{ width: `${col.width}px` }}>
                {col.render({ item: item })}
              </div>
            ))}
          </Item>
        ))}
      </div>
    </div>
  );
};

const Item: FC<{
  isFavorite: boolean;
  isSelected: boolean;
  onFavorite: (status: boolean) => void;
  onSelected: (status: boolean) => void;
  children?: ReactNode;
}> = ({ isFavorite, isSelected, onFavorite, onSelected, children }) => {
  return (
    <Card className="flex items-center gap-[24px] bg-[#F9FAFC]">
      <div
        className="ml-[4px] cursor-pointer flex items-center"
        onClick={() => onSelected(!isSelected)}
      >
        <Checkbox checked={isSelected} />
        {/* {isSelected ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#1F2D3D"
            viewBox="0 0 16 16"
          >
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#D3DCE6"
            viewBox="0 0 16 16"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
          </svg>
        )} */}
      </div>

      <div className="cursor-pointer" onClick={() => onFavorite(!isFavorite)}>
        {isFavorite ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#1F2D3D"
            viewBox="0 0 16 16"
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#D3DCE6"
            viewBox="0 0 16 16"
          >
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
          </svg>
        )}
      </div>
      <div className="ml-[8px] flex items-center gap-[12px]">{children}</div>
    </Card>
  );
};
