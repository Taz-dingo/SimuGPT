import React, { useMemo, useState } from "react";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import example from "@/data/example.json";
import Button from "@/components/common/Button";
import { useEventBusContext } from "@/components/EventBusContext";

export default function Example() {
  const [showFull, setShowFull] = useState(false);
  const list = useMemo(() => {
    if (showFull) {
      return example;
    } else {
      return example.slice(0, 15);
    }
  }, [showFull]);
  const { publish } = useEventBusContext();

  return (
    <>
      <div className="mt-20 mb-4 text-4xl">
        <MdOutlineTipsAndUpdates />
      </div>
      <ul className="flex flex-wrap justify-center gap-3.5">
        {list.map((item) => {
          return (
            <li key={item.act}>
              <Button onClick={() => publish("createNewChat", item.prompt)}>
                {item.act}
              </Button>
            </li>
          );
        })}
      </ul>
      {!showFull && (
        <>
          <p className="p-2">...</p>
          <div className="flex items-center w-full space-x-2">
            <hr className="flex-1 border-t border-dotted border-gray-200 dark:border-gray-600" />
            <Button
              onClick={() => {
                setShowFull(true);
              }}
            >
              显示全部
            </Button>
            <hr className="flex-1 border-t border-dotted border-gray-200 dark:border-gray-600" />
          </div>
        </>
      )}
    </>
  );
}
