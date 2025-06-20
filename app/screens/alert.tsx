// @/components/ui/show-alert.ts
import { HStack } from '@/components/ui/hstack';
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
              <HStack space="sm" alignItems="center">
                <MaterialIcons name={icon.name} size={18} color={icon.color} />
                {title}
              </HStack>
            </ToastTitle>
            {message && <ToastDescription>{message}</ToastDescription>}
          </Toast>
        ),
      });
    }
  );
}
