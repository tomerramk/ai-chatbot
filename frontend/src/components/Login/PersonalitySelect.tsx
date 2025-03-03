import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import SelectItem from "@/components/Login/SelectItem";
import useWebSocketStore from "@stores/useWebSocketStore";

const PersonalitySelect = () => {
  const personality = useWebSocketStore((state) => state.personality);
  const setPersonality = useWebSocketStore((state) => state.setPersonality);

  return (
    <div className="grid">
      <label className="mb-1 font-medium text-teal-600 dark:text-teal-400">
        Chatbot Personality
      </label>
      <Select.Root value={personality} onValueChange={setPersonality}>
        <Select.Trigger className="inline-flex items-center justify-between p-2 border-[1.5px] bg-teal-50 dark:bg-gray-700 border-teal-300 dark:border-teal-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
          <Select.Value placeholder="Select a personality" />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="overflow-hidden bg-white dark:bg-gray-700 rounded-lg shadow-md border border-teal-200 dark:border-teal-600"
            position="popper"
            sideOffset={5}
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white dark:bg-gray-700 text-teal-600 cursor-default">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-1">
              <Select.Group>
                <Select.Label className="px-6 py-1 text-xs text-teal-700 dark:text-teal-400 font-semibold">
                  Personality Types
                </Select.Label>
                <SelectItem value="default">Helpful Assistant</SelectItem>
                <SelectItem value="funny">Funny Assistant</SelectItem>
                <SelectItem value="formal">Formal Assistant</SelectItem>
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-6 cursor-default">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
        Select how you want the AI chatbot to respond to your messages
      </p>
    </div>
  );
};

export default PersonalitySelect;
