import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function LoadingScreen() {
  return (
    <Center className="flex-1 bg-white">
      <VStack className="items-center space-y-4">
        <Spinner className="w-8 h-8" />
        <Text className="text-lg font-semibold text-gray-700">
        </Text>
      </VStack>
    </Center>
  );
}
