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
  
  
  // Ensure toast is properly initialized
  if (!toast || typeof toast.show !== 'function') {
    console.warn('Toast not properly initialized');
    return (title: string, message?: string, status: 'info' | 'success' | 'error' = 'info') => {
      console.log(`Alert: ${title} - ${message || ''} (${status})`);
    };
  }

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
      try {
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
                  <Pressable onPress={() => {
                    try {
                      if (toast) {
                        // Try different possible methods
                        if (typeof toast.close === 'function') {
                          toast.close(id);
                        } else if (typeof toast.dismiss === 'function') {
                          toast.dismiss(id);
                        } else if (typeof toast.hide === 'function') {
                          toast.hide(id);
                        } else {
                          console.warn('No valid toast close method found');
                        }
                      } else {
                        console.warn('Toast not available');
                      }
                    } catch (error) {
                      console.warn('Error closing toast:', error);
                    }
                  }}>
                    <MaterialIcons name="close" size={16} color="#6b7280" />
                  </Pressable>
                </HStack>
              </ToastTitle>
              {message && <ToastDescription>{message}</ToastDescription>}
            </Toast>
          ),
        });
      } catch (error) {
        console.warn('Error showing alert:', error);
        // Fallback to console log if toast fails
        console.log(`Alert: ${title} - ${message || ''}`);
      }
    }
  );
}
