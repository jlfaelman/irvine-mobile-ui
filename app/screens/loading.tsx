import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type LoadingScreenProps = {
  message?: string;
};

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <Center className="flex-1 bg-white">
      <VStack className="items-center space-y-4">
        <Spinner className="w-8 h-8" />
        {message && (
          <Text className="text-sm font-semibold text-gray-700">
            {message}
          </Text>
        )}
      </VStack>
    </Center>
  );
}
