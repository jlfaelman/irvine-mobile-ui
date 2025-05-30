import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Select, SelectBackdrop, SelectContent, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';

export default function AddReadingScreen() {
    const [timestamp, setTimestamp] = useState(new Date());
    const [sensorType, setSensorType] = useState('');
    const [value, setValue] = useState('');
    const [useGPS, setUseGPS] = useState(false);
    const [notes, setNotes] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();
    const isFormComplete = sensorType && value;

    const handleSave = () => {
        if (!isFormComplete) return;

        // Save locally (e.g., AsyncStorage or SQLite)
        Alert.alert('Saved locally');
        // navigation.goBack();
    };

    return (
        <Box className="flex-1 bg-white px-6 pt-10">
            <HStack className="justify-between place-items-center">
                <Text className="text-xl font-semibold mb-4">Add Reading</Text>
                <Pressable onPress={() => { router.back(); }}>Back</Pressable>
            </HStack>
            <VStack space="lg">
                {/* Timestamp */}
                <Pressable onPress={() => setShowDatePicker(true)} className="border p-3 rounded bg-gray-50">
                    <Text className="text-sm text-gray-500">Timestamp</Text>
                    <Text className="text-base">{timestamp.toLocaleString()}</Text>
                </Pressable>

                {showDatePicker && (
                    <DateTimePicker
                        value={timestamp}
                        mode="datetime"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setTimestamp(selectedDate);
                        }}
                    />
                )}

                {/* Sensor Type */}
                <Select onValueChange={(v) => setSensorType(v)}>
                    <SelectTrigger className="border p-3 rounded bg-gray-50">
                        <SelectInput placeholder="Select Sensor Type" className="text-base" />
                        <SelectIcon as={MaterialIcons} name="keyboard-arrow-down" />
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                            <SelectItem label="Chlorine" value="chlorine" />
                            <SelectItem label="Turbidity" value="turbidity" />
                            <SelectItem label="pH" value="ph" />
                        </SelectContent>
                    </SelectPortal>
                </Select>

                {/* Value Input */}
                <View className="flex-row items-center justify-between border p-3 rounded bg-gray-50">
                    <Pressable onPress={() => setValue((prev) => (parseFloat(prev) - 0.1).toFixed(2))}>
                        <MaterialIcons name="remove" size={24} />
                    </Pressable>
                    <Input className="w-24 text-center">
                        <InputField
                            keyboardType="numeric"
                            value={value}
                            onChangeText={setValue}
                            placeholder="0.00"
                        />
                    </Input>
                    <Pressable onPress={() => setValue((prev) => (parseFloat(prev || '0') + 0.1).toFixed(2))}>
                        <MaterialIcons name="add" size={24} />
                    </Pressable>
                </View>

                {/* GPS Toggle */}
                <View className="flex-row items-center justify-between">
                    <Text className="text-base">Use GPS</Text>
                    <Switch isChecked={useGPS} onToggle={() => setUseGPS(!useGPS)} />
                </View>

                {/* Notes */}
                <Input className="h-24">
                    <InputField
                        multiline
                        numberOfLines={4}
                        placeholder="Comments (e.g. cloudy sample, need filter cleaning)"
                        value={notes}
                        onChangeText={setNotes}
                    />
                </Input>
            </VStack>

            {/* Save Button */}
            <Pressable
                onPress={handleSave}
                disabled={!isFormComplete}
                className={`mt-8 py-4 rounded-md items-center ${isFormComplete ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
                <Text className="text-white font-semibold">Save Locally</Text>
            </Pressable>
        </Box>
    );
}
