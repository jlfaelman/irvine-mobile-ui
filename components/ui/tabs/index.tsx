import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';

type TabsProps = {
    tabs: string[];
    selected: string;
    onChange: (tab: string) => void;
};

export const Tabs = ({ tabs, selected, onChange }: TabsProps) => {
    return (
        <HStack className="mb-4 border-b border-gray-200">
            {tabs.map((tab) => {
                const isActive = selected === tab;
                return (
                    <Pressable
                        key={tab}
                        onPress={() => onChange(tab)}
                        className={`px-4 py-2 border-b-2 ${isActive ? 'border-blue-600' : 'border-transparent'
                            }`}
                    >
                        <Text className={`text-sm ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </Pressable>
                );
            })}
        </HStack>
    );
};
