import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectIcon,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Location } from '@/src/interface/dashboard';
import { addHistory } from '@/src/middleware/history';
import { createJob } from '@/src/middleware/job';
import STATUS from '@/src/utils/status';
import { formatForDateTimeLocalInput } from '@/src/utils/timestamp';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import useShowAlert from './screens/alert';


export default function AddReadingScreen() {
    const [timestamp, setTimestamp] = useState(new Date());
    const [location, setLocation] = useState<Location | null>(null);
    const [c, setContaminants] = useState<Array<any>>([]);
    const [contaminant, setContaminant] = useState('');
    const [value, setValue] = useState('');
    const [useGPS, setUseGPS] = useState(false);
    const [notes, setNotes] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();
    const isFormComplete = contaminant && value;
    const { parameters, contaminants, from } = useLocalSearchParams();
    const showAlert = useShowAlert();
    useEffect(() => {
        const raw = Array.isArray(parameters) ? parameters[0] : parameters;
        if (typeof contaminants === "string") setContaminants(JSON.parse(contaminants));
        else setContaminants(c);
        try {
            const parsed = JSON.parse(raw);
            setLocation(parsed);
        } catch (e) {
            setLocation({});
        }
    }, []);
    const clearFields = () => {
        setTimestamp(new Date());
        setContaminant('');
        setValue('');
        setUseGPS(false);
        setNotes('');
    };


    const handleSave = async () => {
        if (!isFormComplete) return;

        const job = {
            id: uuidv4(),
            timestamp: timestamp.toISOString(),
            contaminant: contaminant,
            value: parseFloat(value),
            useGPS: useGPS,
            notes: notes.trim(),
            location: location?.id,
            status: STATUS.PENDING_SYNC
        };


        if (await createJob(job)) {
            await addHistory(job);
            clearFields();
        };
        showAlert('Success','Saved to queue','success');
    };

    return (
        <Box className="flex-1 bg-white px-6 pt-10">
            <HStack className="justify-between place-items-center">
                <Text className="text-xl font-semibold mb-4">Add Reading</Text>
                <Pressable onPress={() => {
                    if (router.canGoBack?.()) {
                        router.back();
                    } else {
                        router.push('/dashboard');
                    }
                }} className="flex-row items-center gap-2">
                    <MaterialIcons name="chevron-left" size={20} color="#3b82f6" />
                    <Text className="text-blue-600">Back</Text>
                </Pressable>
            </HStack>

            <VStack space="3xl">
                {/* Timestamp */}
                {Platform.OS === 'web' ? (
                    <View>
                        <Text className="text-sm text-gray-500 mb-1">Timestamp</Text>
                        <input
                            type="datetime-local"
                            className="border p-2 rounded w-full"
                            value={formatForDateTimeLocalInput(timestamp)}
                            onChange={(e) => {
                                setTimestamp(new Date(e.target.value));
                            }}
                        />
                    </View>
                ) : (
                    <>
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
                    </>
                )}

                {/* Sensor Type */}
                <Select onValueChange={(v) => setContaminant(v)}>
                    <Text className="text-sm text-gray-500 mb-1">Contaminant</Text>
                    <SelectTrigger className="border p-3 rounded bg-white">
                        <SelectInput placeholder="Select Sensor Type" className="text-base" />
                        <SelectIcon as={MaterialIcons} name="keyboard-arrow-down" />
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                            {c?.length ? (
                                c?.map(contaminant => (
                                    <SelectItem key={contaminant?.id} label={contaminant?.name} value={contaminant?.name} />
                                ))
                            ) : (
                                <SelectItem label="No contaminants found" value="none" isDisabled />
                            )}
                        </SelectContent>
                    </SelectPortal>
                </Select>

                {/* Value Input */}
                <View>
                    <Text className="text-sm text-gray-500 mb-1">Value</Text>
                    <View className="flex-row items-center justify-between border p-3 rounded bg-white">
                        <Pressable onPress={() => setValue((prev) => (parseFloat(prev || '0') - 0.1).toFixed(2))}>
                            <MaterialIcons name="remove" size={24} />
                        </Pressable>
                        <Input className="w-24 text-center border-0">
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
                </View>

                {/* GPS Toggle */}
                {Platform.OS === 'web' ? (
                    <View className="flex-row items-center justify-between">
                        <Text className="text-base">Use GPS</Text>
                        <input
                            type="checkbox"
                            checked={useGPS}
                            onChange={(e) => setUseGPS(e.target.checked)}
                            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                        />
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between">
                        <Text className="text-base">Use GPS</Text>
                        <Switch isChecked={useGPS} onToggle={() => setUseGPS(!useGPS)} />
                    </View>
                )}

                {/* Notes */}
                <View>
                    <Text className="text-sm text-gray-500 mb-1">Notes</Text>
                    <Input className="h-24">
                        <InputField
                            multiline
                            numberOfLines={4}
                            placeholder="Comments (e.g. cloudy sample, need filter cleaning)"
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </Input>
                </View>
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

