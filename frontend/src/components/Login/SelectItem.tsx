import { CheckIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

type SelectItemProps = {
  children: React.ReactNode;
  value: string;
};

const SelectItem: React.FC<SelectItemProps> = ({ children, value }) => {
  return (
    <Select.Item
      value={value}
      className="text-base text-gray-800 dark:text-teal-400 rounded flex items-center h-8 px-6 relative select-none data-[highlighted]:bg-teal-100 dark:data-[highlighted]:bg-teal-400 data-[highlighted]:text-teal-700 dark:data-[highlighted]:text-teal-900 data-[highlighted]:outline-none cursor-pointer"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-1 inline-flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

export default SelectItem;
