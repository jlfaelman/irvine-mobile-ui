// @/components/ui/show-alert.ts
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from '@/components/ui/toast';
import { MaterialIcons } from '@expo/vector-icons';

export default function useShowAlert() {
  const toast = useToast();

  const getIconByStatus = (status: 'info' | 'success' | 'error') => {
    const map = {
      success: { name: 'check-circle', color: '#22c55e' }, 
      error: { name: 'error', color: '#ef4444' },           
      info: { name: 'info', color: '#3b82f6' },          
    };
    return map[status] ?? map.info;
  };

  return (
    (title: string, message?: string, status: 'info' | 'success' | 'error' = 'info') => {
      const icon = getIconByStatus(status);

      toast.show({
        placement: 'top right',
        render: ({ id }) => (
          <Toast nativeID={id} action={status} variant="outline">
            <ToastTitle>
              <HStack space="sm" className="items-center justify-between w-full">
                <HStack space="sm" className="items-center">
                  <MaterialIcons name={icon.name as any} size={18} color={icon.color} />
                  <Text className="text-base font-medium">{title}</Text>
                </HStack>
                <Pressable onPress={() => toast.close(id)}>
                  <MaterialIcons name="close" size={16} color="#6b7280" />
                </Pressable>
              </HStack>
            </ToastTitle>
            {message && <ToastDescription>{message}</ToastDescription>}
          </Toast>
        ),
      });
    }
  );
}
