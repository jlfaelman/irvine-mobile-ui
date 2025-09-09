import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import {
    Select,
    SelectBackdrop,
    SelectContent,
    SelectInput,
    SelectItem,
    SelectPortal,
    SelectTrigger
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
import { Platform, ScrollView } from 'react-native';
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
            setLocation(null);
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
            await addHistory(job, true);
            clearFields();
        };
        showAlert('Success','Saved to queue','success');
    };

    const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <Box className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>
            {children}
        </Box>
    );

    const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <VStack className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            {children}
        </VStack>
    );

    return (
        <Box className="flex-1 bg-gray-100">
            {/* Header */}
            <Box className="bg-white px-6 pt-12 pb-4">
                <HStack className="justify-between items-center">
                    <Text className="text-2xl font-bold text-gray-900">Add Reading</Text>
                    <Pressable 
                        onPress={() => {
                            if (router.canGoBack?.()) {
                                router.back();
                            } else {
                                router.push('/dashboard');
                            }
                        }}
                        className="w-8 h-8 items-center justify-center"
                    >
                        <MaterialIcons name="close" size={24} color="#6b7280" />
                    </Pressable>
                </HStack>
            </Box>

            <Box className="flex-1 px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Basic Information */}
                    <FormSection title="Basic Information">
                        <FormField label="Timestamp">
                            {Platform.OS === 'web' ? (
                                <input
                                    type="datetime-local"
                                    className="border border-gray-300 p-3 rounded-lg w-full bg-white"
                                    value={formatForDateTimeLocalInput(timestamp)}
                                    onChange={(e) => setTimestamp(new Date(e.target.value))}
                                />
                            ) : (
                                <>
                                    <Pressable 
                                        onPress={() => setShowDatePicker(true)} 
                                        className="border border-gray-300 p-4 rounded-lg bg-white"
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            elevation: 2,
                                        }}
                                    >
                                        <HStack className="items-center justify-between">
                                            <VStack>
                                                <Text className="text-sm text-gray-500">Selected Time</Text>
                                                <Text className="text-base font-medium text-gray-900">
                                                    {timestamp.toLocaleDateString()} at {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </VStack>
                                            <MaterialIcons name="schedule" size={20} color="#6b7280" />
                                        </HStack>
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
                        </FormField>

                        <FormField label="Contaminant Type">
                            <Select onValueChange={(v) => setContaminant(v)}>
                                <SelectTrigger 
                                    className="border border-gray-300 p-4 rounded-lg bg-white"
                                    style={{
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 2,
                                        elevation: 2,
                                    }}
                                >
                                    <SelectInput 
                                        placeholder="Select contaminant type" 
                                        className="text-base" 
                                    />
                                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#6b7280" />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        {c?.length ? (
                                            c?.map(contaminant => (
                                                <SelectItem 
                                                    key={contaminant?.id} 
                                                    label={contaminant?.name} 
                                                    value={contaminant?.name} 
                                                />
                                            ))
                                        ) : (
                                            <SelectItem label="No contaminants found" value="none" isDisabled />
                                        )}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </FormField>
                    </FormSection>

                    {/* Reading Details */}
                    <FormSection title="Reading Details">
                        <FormField label="Value">
                            <Box 
                                className="flex-row items-center justify-between border border-gray-300 p-4 rounded-lg bg-white"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            >
                                <Pressable 
                                    onPress={() => setValue((prev) => (parseFloat(prev || '0') - 0.1).toFixed(2))}
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{ backgroundColor: '#f3f4f6' }}
                                >
                                    <MaterialIcons name="remove" size={20} color="#6b7280" />
                                </Pressable>
                                <Input className="w-32 text-center border-0">
                                    <InputField
                                        keyboardType="numeric"
                                        value={value}
                                        onChangeText={setValue}
                                        placeholder="0.00"
                                        className="text-center text-lg font-semibold"
                                    />
                                </Input>
                                <Pressable 
                                    onPress={() => setValue((prev) => (parseFloat(prev || '0') + 0.1).toFixed(2))}
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{ backgroundColor: '#f3f4f6' }}
                                >
                                    <MaterialIcons name="add" size={20} color="#6b7280" />
                                </Pressable>
                            </Box>
                        </FormField>

                        <FormField label="GPS Location">
                            <Box 
                                className="flex-row items-center justify-between p-4 rounded-lg bg-white"
                                style={{
                                    backgroundColor: useGPS ? '#f0f9ff' : '#f8fafc',
                                    borderWidth: 1,
                                    borderColor: useGPS ? '#3b82f6' : '#e5e7eb',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            >
                                <HStack className="items-center">
                                    <Box 
                                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                        style={{ backgroundColor: useGPS ? '#3b82f6' : '#6b7280' }}
                                    >
                                        <MaterialIcons name="gps-fixed" size={20} color="white" />
                                    </Box>
                                    <VStack>
                                        <Text className="text-base font-medium text-gray-900">Use GPS</Text>
                                        <Text className="text-sm text-gray-500">
                                            {useGPS ? 'Location tracking enabled' : 'Location tracking disabled'}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Switch 
                                    isChecked={useGPS} 
                                    onToggle={() => setUseGPS(!useGPS)} 
                                />
                            </Box>
                        </FormField>
                    </FormSection>

                    {/* Additional Information */}
                    <FormSection title="Additional Information">
                        <FormField label="Notes (Optional)">
                            <Input 
                                className="h-24 border border-gray-300 rounded-lg bg-white"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            >
                                <InputField
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Add any comments or observations (e.g. cloudy sample, need filter cleaning)"
                                    value={notes}
                                    onChangeText={setNotes}
                                    className="p-4"
                                />
                            </Input>
                        </FormField>
                    </FormSection>

                    {/* Save Button */}
                    <Pressable
                        onPress={handleSave}
                        disabled={!isFormComplete}
                        className={`py-4 rounded-lg items-center mb-8 ${
                            isFormComplete 
                                ? 'bg-blue-600' 
                                : 'bg-gray-300'
                        }`}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isFormComplete ? 0.2 : 0.1,
                            shadowRadius: 4,
                            elevation: isFormComplete ? 4 : 2,
                        }}
                    >
                        <HStack className="items-center">
                            <MaterialIcons 
                                name="save" 
                                size={20} 
                                color={isFormComplete ? "white" : "#9ca3af"} 
                            />
                            <Text className={`ml-2 font-semibold ${
                                isFormComplete ? 'text-white' : 'text-gray-500'
                            }`}>
                                Save Reading
                            </Text>
                        </HStack>
                    </Pressable>
                </ScrollView>
            </Box>
        </Box>
    );
}

